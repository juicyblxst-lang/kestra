// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

library Netting {
    error NettingSumMustBeZero(int256 sum);

    function verifySum(int256[] calldata amounts) internal pure returns (bool) {
        int256 sum;
        for (uint256 i; i < amounts.length; ++i) {
            sum += amounts[i];
        }
        if (sum != 0) revert NettingSumMustBeZero(sum);
        return true;
    }
}
