// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Truenza {
    mapping(string => string) public productHashes;
    mapping(string => uint256) public reportCount;

    event ProductRegistered(string productId, string hash, uint256 timestamp);
    event ProductReported(string productId, uint256 timestamp);

    function registerProduct(string memory productId, string memory hash) public {
        require(bytes(productHashes[productId]).length == 0, "Product already registered");
        productHashes[productId] = hash;
        emit ProductRegistered(productId, hash, block.timestamp);
    }

    function reportProduct(string memory productId) public {
        reportCount[productId]++;
        emit ProductReported(productId, block.timestamp);
    }

    function getHash(string memory productId) public view returns (string memory) {
        return productHashes[productId];
    }

    function getReportCount(string memory productId) public view returns (uint256) {
        return reportCount[productId];
    }
}
