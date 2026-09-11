// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

interface IInterchange {
    event InterchangeRecorded(bytes32 indexed interchangeId, address indexed acquirer, address indexed issuer, uint256 amount, uint256 timestamp);
    function recordInterchange(address acquirer, address issuer, uint256 amount) external returns (bytes32 interchangeId);
}
