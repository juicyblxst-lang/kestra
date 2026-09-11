// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract Chargeback {
    enum Status { None, Filed, Represented, Resolved }

    struct CaseData {
        address merchant;
        address cardholder;
        uint256 amount;
        bytes32 reason;
        bytes32 evidenceHash;
        bool merchantLiable;
        Status status;
        uint64 filedAt;
        uint64 resolvedAt;
    }

    address public immutable operator;
    mapping(bytes32 => CaseData) public cases;

    error OnlyOperator();
    error InvalidCase();
    error InvalidStatus();
    error ZeroAddress();
    error ZeroAmount();

    event ChargebackFiled(bytes32 indexed chargebackId, address indexed merchant, address indexed cardholder, uint256 amount, bytes32 reason, bytes32 evidenceHash);
    event ChargebackRepresented(bytes32 indexed chargebackId, bytes32 evidenceHash);
    event ChargebackResolved(bytes32 indexed chargebackId, bool merchantLiable, bytes32 resolutionHash);

    constructor(address operator_) {
        operator = operator_ == address(0) ? msg.sender : operator_;
    }

    modifier onlyOperator() {
        if (msg.sender != operator) revert OnlyOperator();
        _;
    }

    function fileChargeback(
        bytes32 chargebackId,
        address merchant,
        address cardholder,
        uint256 amount,
        bytes32 reason,
        bytes32 evidenceHash
    ) external onlyOperator {
        if (chargebackId == bytes32(0) || cases[chargebackId].status != Status.None) revert InvalidCase();
        if (merchant == address(0) || cardholder == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();

        cases[chargebackId] = CaseData({
            merchant: merchant,
            cardholder: cardholder,
            amount: amount,
            reason: reason,
            evidenceHash: evidenceHash,
            merchantLiable: false,
            status: Status.Filed,
            filedAt: uint64(block.timestamp),
            resolvedAt: 0
        });
        emit ChargebackFiled(chargebackId, merchant, cardholder, amount, reason, evidenceHash);
    }

    function representChargeback(bytes32 chargebackId, bytes32 evidenceHash) external onlyOperator {
        CaseData storage chargeback = cases[chargebackId];
        if (chargeback.status != Status.Filed) revert InvalidStatus();
        chargeback.evidenceHash = evidenceHash;
        chargeback.status = Status.Represented;
        emit ChargebackRepresented(chargebackId, evidenceHash);
    }

    function resolveChargeback(bytes32 chargebackId, bool merchantLiable, bytes32 resolutionHash) external onlyOperator {
        CaseData storage chargeback = cases[chargebackId];
        if (chargeback.status != Status.Filed && chargeback.status != Status.Represented) revert InvalidStatus();
        chargeback.merchantLiable = merchantLiable;
        chargeback.status = Status.Resolved;
        chargeback.resolvedAt = uint64(block.timestamp);
        emit ChargebackResolved(chargebackId, merchantLiable, resolutionHash);
    }
}
