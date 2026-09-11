SHELL := /bin/sh
CHAIN ?= base-sepolia

.PHONY: build test deploy verify
build:
	forge build

test:
	forge test

deploy:
	@if [ "$${MOCK_MODE:-true}" = "true" ]; then \
		forge script script/Deploy.s.sol --rpc-url "$${BASE_SEPOLIA_RPC_URL:-https://base-sepolia.g.alchemy.com/v2/test-placeholder-key-12345678901234567890}" --dry-run; \
	else \
		forge script script/Deploy.s.sol --rpc-url "$${BASE_SEPOLIA_RPC_URL}" --broadcast; \
	fi

verify:
	forge script script/Verify.s.sol
