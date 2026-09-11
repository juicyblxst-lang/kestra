// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract FX {
    uint256 public constant RATE_SCALE = 1e18;
    address public oracle;
    mapping(bytes32 => uint256) public rates;

    error OnlyOracle();
    error ZeroAddress();
    error InvalidRate();
    error RateNotSet();

    event OracleUpdated(address indexed previousOracle, address indexed newOracle);
    event RateSet(bytes32 indexed pair, uint256 rate);

    constructor(address oracle_) {
        oracle = oracle_ == address(0) ? msg.sender : oracle_;
    }

    modifier onlyOracle() {
        if (msg.sender != oracle) revert OnlyOracle();
        _;
    }

    function setOracle(address newOracle) external onlyOracle {
        if (newOracle == address(0)) revert ZeroAddress();
        emit OracleUpdated(oracle, newOracle);
        oracle = newOracle;
    }

    function setRate(bytes32 pair, uint256 rate) external onlyOracle {
        if (pair == bytes32(0) || rate == 0) revert InvalidRate();
        rates[pair] = rate;
        emit RateSet(pair, rate);
    }

    function convert(uint256 amount, bytes32 from, bytes32 to) external view returns (uint256) {
        if (from == to) return amount;
        bytes32 pair = keccak256(abi.encode(from, to));
        uint256 rate = rates[pair];
        if (rate == 0) revert RateNotSet();
        return (amount * rate) / RATE_SCALE;
    }
}
