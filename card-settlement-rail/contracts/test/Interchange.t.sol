// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Interchange} from "../src/Interchange.sol";

contract InterchangeTest {
    function testRecordInterchange() public {
        Interchange interchange = new Interchange(address(this));
        bytes32 id = interchange.recordInterchange(address(0x1001), address(0x1002), 1000);
        require(id != bytes32(0));
    }

    function testRecordRejectsZeroAmount() public {
        Interchange interchange = new Interchange(address(this));
        (bool ok,) = address(interchange).call(
            abi.encodeCall(interchange.recordInterchange, (address(0x1001), address(0x1002), 0))
        );
        require(!ok);
    }
}
