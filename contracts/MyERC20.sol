// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IMyERC20.sol";

import "hardhat/console.sol";

contract MyERC20 is ERC20, Ownable, IMyERC20 {
    constructor() ERC20("MyERC20", "MYE") {
        this;
    }

    function mintUpTo(address to, uint256 amount)
        external
        override
        onlyOwner
        returns (uint256)
    {
        uint256 currentBalance = balanceOf(to);
        console.log("currentBalance", currentBalance);

        if (currentBalance >= amount) return 0;

        uint256 mintBalance = amount - currentBalance;
        _mint(to, mintBalance);
        console.log("_mint", mintBalance);

        return mintBalance;
    }

    function addUp(uint256 a, uint256 b)
        external
        pure
        override
        returns (uint256)
    {
        return a + b;
    }
}
