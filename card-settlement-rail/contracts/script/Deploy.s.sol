// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Settlement} from "../src/Settlement.sol";
import {Interchange} from "../src/Interchange.sol";
import {Chargeback} from "../src/Chargeback.sol";
import {Reserve} from "../src/Reserve.sol";
import {FX} from "../src/FX.sol";
import {Finality} from "../src/Finality.sol";

interface Vm {
    function envUint(string calldata name) external returns (uint256 value);
    function envAddress(string calldata name) external returns (address value);
    function envString(string calldata name) external returns (string memory value);
    function startBroadcast(uint256 privateKey) external;
    function stopBroadcast() external;
    function serializeAddress(string calldata objectKey, string calldata valueKey, address value) external returns (string memory json);
    function writeJson(string calldata json, string calldata path) external;
}

contract Deploy {
    Vm internal constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    event DeploymentWritten(string indexed chain, string path);

    function run() external {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        address operator = vm.envAddress("OPERATOR");
        address oracle = vm.envAddress("ORACLE");
        string memory chain = vm.envString("CHAIN");

        vm.startBroadcast(privateKey);
        Settlement settlement = new Settlement(operator);
        Interchange interchange = new Interchange(operator);
        Chargeback chargeback = new Chargeback(operator);
        Reserve reserve = new Reserve(operator);
        FX fx = new FX(oracle);
        Finality finality = new Finality();
        vm.stopBroadcast();

        string memory json = vm.serializeAddress("contracts", "Settlement", address(settlement));
        json = vm.serializeAddress("contracts", "Interchange", address(interchange));
        json = vm.serializeAddress("contracts", "Chargeback", address(chargeback));
        json = vm.serializeAddress("contracts", "Reserve", address(reserve));
        json = vm.serializeAddress("contracts", "FX", address(fx));
        json = vm.serializeAddress("contracts", "Finality", address(finality));
        vm.writeJson(json, string.concat("deployments/", chain, ".json"));
        emit DeploymentWritten(chain, string.concat("deployments/", chain, ".json"));
    }
}
