// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

interface ISettlement {
    event SettlementCompleted(bytes32 indexed nettingRoot, address[] counterparties, int256[] amounts, uint256 timestamp);
    function settle(bytes32 nettingRoot, address[] calldata counterparties, int256[] calldata amounts) external returns (bool);
}
