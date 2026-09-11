// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract Finality {
    struct Attestation {
        address attestor;
        uint64 timestamp;
    }

    mapping(bytes32 => Attestation) public finalityProof;
    mapping(bytes32 => bool) public attested;

    error ZeroSettlementId();
    error AlreadyAttested();

    event FinalityAttested(bytes32 indexed settlementId, address indexed attestor, uint256 timestamp);

    function attestFinality(bytes32 settlementId) external {
        if (settlementId == bytes32(0)) revert ZeroSettlementId();
        if (attested[settlementId]) revert AlreadyAttested();
        attested[settlementId] = true;
        finalityProof[settlementId] = Attestation({attestor: msg.sender, timestamp: uint64(block.timestamp)});
        emit FinalityAttested(settlementId, msg.sender, block.timestamp);
    }
}
