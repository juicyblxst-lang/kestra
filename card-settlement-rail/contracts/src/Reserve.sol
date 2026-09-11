// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract Reserve {
    mapping(address => uint256) public reserves;
    address public immutable operator;

    error OnlyOperator();
    error ZeroAddress();
    error ZeroAmount();
    error InsufficientReserve();
    error TransferFailed();

    event ReserveDeposited(address indexed account, uint256 amount);
    event ReserveReleased(address indexed account, address indexed recipient, uint256 amount);
    event ReserveSlashed(address indexed account, address indexed recipient, uint256 amount, bytes32 indexed reason);

    constructor(address operator_) {
        operator = operator_ == address(0) ? msg.sender : operator_;
    }

    modifier onlyOperator() {
        if (msg.sender != operator) revert OnlyOperator();
        _;
    }

    function depositReserve(address account) external payable {
        if (account == address(0)) revert ZeroAddress();
        if (msg.value == 0) revert ZeroAmount();
        reserves[account] += msg.value;
        emit ReserveDeposited(account, msg.value);
    }

    function releaseReserve(address account, uint256 amount) external onlyOperator {
        _debit(account, amount);
        (bool ok,) = payable(account).call{value: amount}("");
        if (!ok) revert TransferFailed();
        emit ReserveReleased(account, account, amount);
    }

    function slashReserve(address account, address payable recipient, uint256 amount, bytes32 reason) external onlyOperator {
        if (recipient == address(0)) revert ZeroAddress();
        _debit(account, amount);
        (bool ok,) = recipient.call{value: amount}("");
        if (!ok) revert TransferFailed();
        emit ReserveSlashed(account, recipient, amount, reason);
    }

    function _debit(address account, uint256 amount) internal {
        if (account == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();
        if (reserves[account] < amount) revert InsufficientReserve();
        reserves[account] -= amount;
    }

    receive() external payable {
        if (msg.value == 0) revert ZeroAmount();
        reserves[msg.sender] += msg.value;
        emit ReserveDeposited(msg.sender, msg.value);
    }
}
