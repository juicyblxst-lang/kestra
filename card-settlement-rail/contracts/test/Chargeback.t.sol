// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Chargeback} from "../src/Chargeback.sol";

contract ChargebackTest {
    function testFullChargebackLifecycle() public {
        Chargeback chargeback = new Chargeback(address(this));
        bytes32 id = keccak256("cb-1");
        chargeback.fileChargeback(id, address(0x1001), address(0x1002), 500, keccak256("fraud"), keccak256("initial"));
        (, , , , , bool merchantLiable, Chargeback.Status status, ,) = chargeback.cases(id);
        require(!merchantLiable && status == Chargeback.Status.Filed);

        chargeback.representChargeback(id, keccak256("representment"));
        chargeback.resolveChargeback(id, true, keccak256("resolution"));
        (, , , , , merchantLiable, status, ,) = chargeback.cases(id);
        require(merchantLiable && status == Chargeback.Status.Resolved);
    }

    function testCannotFileSameCaseTwice() public {
        Chargeback chargeback = new Chargeback(address(this));
        bytes32 id = keccak256("cb-2");
        chargeback.fileChargeback(id, address(0x1001), address(0x1002), 500, bytes32(0), bytes32(0));
        (bool ok,) = address(chargeback).call(
            abi.encodeCall(chargeback.fileChargeback, (id, address(0x1001), address(0x1002), 500, bytes32(0), bytes32(0)))
        );
        require(!ok);
    }
}
