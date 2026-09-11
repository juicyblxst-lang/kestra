// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Netting} from "../src/Netting.sol";

contract NettingTest {
    function testVerifySumZero() public pure {
        int256[] memory amounts = new int256[](3);
        amounts[0] = 100;
        amounts[1] = -40;
        amounts[2] = -60;
        require(Netting.verifySum(amounts));
    }

    function testFuzzVerifySum(int256 amount) public pure {
        int256[] memory amounts = new int256[](2);
        amounts[0] = amount;
        amounts[1] = -amount;
        require(Netting.verifySum(amounts));
    }

    function testVerifySumRejectsNonZero() public {
        int256[] memory amounts = new int256[](2);
        amounts[0] = 1;
        amounts[1] = 2;
        (bool ok,) = address(new NettingCaller()).call(abi.encodeCall(NettingCaller.verify, (amounts)));
        require(!ok);
    }
}

contract NettingCaller {
    function verify(int256[] calldata amounts) external pure returns (bool) {
        return Netting.verifySum(amounts);
    }
}
