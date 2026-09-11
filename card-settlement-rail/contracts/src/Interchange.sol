// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract Interchange {
    address public immutable operator;

    error OnlyOperator();
    error ZeroAddress();
    error ZeroAmount();

    event InterchangeRecorded(
        bytes32 indexed interchangeId,
        address indexed acquirer,
        address indexed issuer,
        uint256 amount,
        uint256 timestamp
    );

    constructor(address operator_) {
        operator = operator_ == address(0) ? msg.sender : operator_;
    }

    modifier onlyOperator() {
        if (msg.sender != operator) revert OnlyOperator();
        _;
    }

    function recordInterchange(address acquirer, address issuer, uint256 amount)
        external
        onlyOperator
        returns (bytes32 interchangeId)
    {
        if (acquirer == address(0) || issuer == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();

        interchangeId = keccak256(abi.encode(acquirer, issuer, amount, block.chainid, block.timestamp, address(this)));
        emit InterchangeRecorded(interchangeId, acquirer, issuer, amount, block.timestamp);
    }
}
