// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

library SignatureChecker {
    bytes4 internal constant ERC1271_MAGICVALUE = 0x1626ba7e;
    bytes32 internal constant DOMAIN_TYPEHASH = keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");
    uint256 internal constant SECP256K1N_HALF = 0x7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0;

    error InvalidSignatureLength();
    error InvalidSignature();

    function domainSeparator(string memory name, string memory version, address verifyingContract)
        internal
        view
        returns (bytes32)
    {
        return keccak256(abi.encode(
            DOMAIN_TYPEHASH,
            keccak256(bytes(name)),
            keccak256(bytes(version)),
            block.chainid,
            verifyingContract
        ));
    }

    function toTypedDataHash(bytes32 separator, bytes32 structHash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19\x01", separator, structHash));
    }

    function recover(bytes32 digest, bytes calldata signature) internal pure returns (address signer) {
        if (signature.length != 65) revert InvalidSignatureLength();
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := calldataload(signature.offset)
            s := calldataload(add(signature.offset, 32))
            v := byte(0, calldataload(add(signature.offset, 64)))
        }
        if (v < 27) v += 27;
        if (v != 27 && v != 28) revert InvalidSignature();
        if (uint256(s) == 0 || uint256(s) > SECP256K1N_HALF) revert InvalidSignature();
        signer = ecrecover(digest, v, r, s);
        if (signer == address(0)) revert InvalidSignature();
    }

    function isValidSignatureNow(address signer, bytes32 digest, bytes calldata signature) internal view returns (bool) {
        if (signer.code.length == 0) {
            if (signature.length != 65) return false;
            (address recovered, bool valid) = _recoverNoRevert(digest, signature);
            return valid && recovered == signer;
        }
        (bool ok, bytes memory result) = signer.staticcall(
            abi.encodeWithSelector(ERC1271_MAGICVALUE, digest, signature)
        );
        return ok && result.length >= 4 && bytes4(result) == ERC1271_MAGICVALUE;
    }

    function _recoverNoRevert(bytes32 digest, bytes calldata signature) private pure returns (address signer, bool valid) {
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := calldataload(signature.offset)
            s := calldataload(add(signature.offset, 32))
            v := byte(0, calldataload(add(signature.offset, 64)))
        }
        if (v < 27) v += 27;
        if (v != 27 && v != 28) return (address(0), false);
        if (uint256(s) == 0 || uint256(s) > SECP256K1N_HALF) return (address(0), false);
        signer = ecrecover(digest, v, r, s);
        return (signer, signer != address(0));
    }
}
