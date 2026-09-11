// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Settlement} from "../src/Settlement.sol";

contract SettlementTest {
    function testSettleAcceptsBalancedNetting() public {
        Settlement settlement = new Settlement(address(this));
        address[] memory counterparties = new address[](2);
        counterparties[0] = address(0x1001);
        counterparties[1] = address(0x1002);
        int256[] memory amounts = new int256[](2);
        amounts[0] = 100;
        amounts[1] = -100;
        require(settlement.settle(keccak256("root"), counterparties, amounts));
    }

    function testSettleRejectsMismatchedArrays() public {
        Settlement settlement = new Settlement(address(this));
        address[] memory counterparties = new address[](1);
        int256[] memory amounts = new int256[](2);
        (bool ok,) = address(settlement).call(
            abi.encodeCall(settlement.settle, (keccak256("root"), counterparties, amounts))
        );
        require(!ok);
    }

    function testOnlyOperator() public {
        Settlement settlement = new Settlement(address(this));
        SettlementCaller caller = new SettlementCaller();
        address[] memory counterparties = new address[](2);
        int256[] memory amounts = new int256[](2);
        amounts[0] = 1;
        amounts[1] = -1;
        (bool ok,) = address(caller).call(
            abi.encodeCall(SettlementCaller.callSettle, (settlement, keccak256("root"), counterparties, amounts))
        );
        require(!ok);
    }
}

contract SettlementCaller {
    function callSettle(Settlement settlement, bytes32 root, address[] calldata counterparties, int256[] calldata amounts) external {
        settlement.settle(root, counterparties, amounts);
    }
}
