// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

abstract contract Multicall {
    error MulticallFailed(uint256 index, bytes reason);

    function multicall(bytes[] calldata data) external payable returns (bytes[] memory results) {
        results = new bytes[](data.length);
        for (uint256 i; i < data.length; ++i) {
            (bool ok, bytes memory result) = address(this).delegatecall(data[i]);
            if (!ok) revert MulticallFailed(i, result);
            results[i] = result;
        }
    }
}
