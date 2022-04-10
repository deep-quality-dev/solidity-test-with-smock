// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

interface IMyERC20 is IERC20 {
    function mintUpTo(address to, uint256 amount) external returns (uint256);

    function addUp(uint256 a, uint256 b) external pure returns (uint256);
}
