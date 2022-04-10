import { expect } from "chai";
import { BigNumber } from "@ethersproject/bignumber";
import { MyERC20, MyOtherContract } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";

describe("MyOtherContract", function () {
  let owner: SignerWithAddress, userA: SignerWithAddress;

  let myERC20: MyERC20, myOtherContract: MyOtherContract;

  beforeEach("init setup", async function () {
    [owner, userA] = await ethers.getSigners();

    const myOtherContractFactory = await ethers.getContractFactory(
      "MyOtherContract"
    );
    const myERC20Factory = await ethers.getContractFactory("MyERC20");
    myERC20 = (await myERC20Factory.deploy()) as MyERC20;
    myOtherContract = (await myOtherContractFactory.deploy(
      myERC20.address
    )) as MyOtherContract;
  });

  it("Should mock the mintUp function", async function () {
    expect((await myERC20.totalSupply()).toString()).to.be.equal("0");

    const to = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
    const amount1 = 100;
    const amount2 = 300;

    await expect(myOtherContract.myOtherFunction(to, amount1)).to.be.reverted;

    await myERC20.transferOwnership(myOtherContract.address);
    await myOtherContract.myOtherFunction(to, amount2);
    expect((await myERC20.totalSupply()).toString()).to.be.equal("300");
  });

  it("Should sign a transaction", async function () {
    const amount = 200;
    await myERC20.connect(owner).mintUpTo(userA.address, amount);
    expect(await myERC20.balanceOf(userA.address)).to.be.equal(amount);

    await expect(myERC20.connect(userA).mintUpTo(userA.address, amount)).to.be
      .reverted;
  });

  it("Should make a return", async function () {
    expect(await myERC20.addUp(200, 300)).to.be.equal(500);
  });

  it("Should make a revert", async function () {
    await expect(myERC20.addUp(100, 200)).to.be.not.reverted;
  });
});
