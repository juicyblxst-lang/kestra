// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Netting} from "./Netting.sol";

contract Settlement {
    address public immutable operator;

    error OnlyOperator();
    error LengthMismatch();
    error InvalidNetting();
    error ZeroNettingRoot();

    event SettlementCompleted(
        bytes32 indexed nettingRoot,
        address[] counterparties,
        int256[] amounts,
        uint256 timestamp
    );

    constructor(address operator_) {
        operator = operator_ == address(0) ? msg.sender : operator_;
    }

    modifier onlyOperator() {
        if (msg.sender != operator) revert OnlyOperator();
        _;
    }

    function settle(
        bytes32 nettingRoot,
        address[] calldata counterparties,
        int256[] calldata amounts
    ) external onlyOperator returns (bool) {
        if (nettingRoot == bytes32(0)) revert ZeroNettingRoot();
        if (counterparties.length != amounts.length) revert LengthMismatch();
        if (!Netting.verifySum(amounts)) revert InvalidNetting();

        emit SettlementCompleted(nettingRoot, counterparties, amounts, block.timestamp);
        return true;
    }
}
