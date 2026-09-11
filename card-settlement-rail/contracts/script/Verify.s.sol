// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

interface Vm {
    function envAddress(string calldata name) external returns (address value);
    function envString(string calldata name) external returns (string memory value);
    function ffi(string[] calldata commandInput) external returns (bytes memory result);
}

contract Verify {
    Vm internal constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    function run() external {
        string memory chain = vm.envString("CHAIN");
        string memory apiKey = vm.envString("ETHERSCAN_API_KEY");
        _verify(vm.envAddress("SETTLEMENT_ADDRESS"), "src/Settlement.sol:Settlement", chain, apiKey);
        _verify(vm.envAddress("INTERCHANGE_ADDRESS"), "src/Interchange.sol:Interchange", chain, apiKey);
        _verify(vm.envAddress("CHARGEBACK_ADDRESS"), "src/Chargeback.sol:Chargeback", chain, apiKey);
        _verify(vm.envAddress("RESERVE_ADDRESS"), "src/Reserve.sol:Reserve", chain, apiKey);
        _verify(vm.envAddress("FX_ADDRESS"), "src/FX.sol:FX", chain, apiKey);
        _verify(vm.envAddress("FINALITY_ADDRESS"), "src/Finality.sol:Finality", chain, apiKey);
    }

    function _verify(address deployed, string memory contractPath, string memory chain, string memory apiKey) internal {
        string[] memory command = new string[](8);
        command[0] = "forge";
        command[1] = "verify-contract";
        command[2] = vmAddress(deployed);
        command[3] = contractPath;
        command[4] = "--chain";
        command[5] = chain;
        command[6] = "--etherscan-api-key";
        command[7] = apiKey;
        vm.ffi(command);
    }

    function vmAddress(address value) internal pure returns (string memory) {
        bytes20 data = bytes20(value);
        bytes16 symbols = "0123456789abcdef";
        bytes memory buffer = new bytes(42);
        buffer[0] = "0";
        buffer[1] = "x";
        for (uint256 i; i < 20; ++i) {
            buffer[2 + i * 2] = symbols[uint8(data[i]) >> 4];
            buffer[3 + i * 2] = symbols[uint8(data[i]) & 0x0f];
        }
        return string(buffer);
    }
}
