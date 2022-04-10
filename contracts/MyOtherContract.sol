// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./MyERC20.sol";

contract MyOtherContract {
    MyERC20 private myERC20;

    uint256 public totalAmount;

    constructor(MyERC20 myERC20_) {
        myERC20 = myERC20_;
    }

    function myOtherFunction(address to, uint256 amount) external {
        // do stuff

        uint256 returnAmount = myERC20.mintUpTo(to, amount);

        uint256 totalSupply = myERC20.totalSupply();
        console.log("totalSupply", totalSupply);
        console.log("The returned amount was", returnAmount);
        console.log("The passed amount was", amount);

        // do more stuff
        totalAmount += amount;
        console.log("totalAmount", totalAmount);
    }
}
