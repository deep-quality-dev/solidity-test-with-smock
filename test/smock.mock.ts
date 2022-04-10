import chai, { expect } from "chai";
import { FakeContract, MockContract, smock } from "@defi-wonderland/smock";
import { BigNumber } from "@ethersproject/bignumber";

import {
  MyERC20,
  MyERC20__factory,
  MyOtherContract,
  MyOtherContract__factory,
} from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";

chai.use(smock.matchers);

describe("MyOtherContract", function () {
  let owner: SignerWithAddress, userA: SignerWithAddress;

  let myERC20: MockContract<MyERC20>,
    myOtherContract: MockContract<MyOtherContract>;

  beforeEach("init setup", async function () {
    [owner, userA] = await ethers.getSigners();

    const myOtherContractFactory = await smock.mock<MyOtherContract__factory>(
      "MyOtherContract"
    );
    const myERC20Factory = await smock.mock<MyERC20__factory>("MyERC20");
    myERC20 = (await myERC20Factory.deploy()) as MockContract<MyERC20>;
    myOtherContract = (await myOtherContractFactory.deploy(
      myERC20.address
    )) as MockContract<MyOtherContract>;
  });

  it("Should mock the mintUpTo function", async function () {
    const mockedMintAmount = 30;
    const to = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
    const amount1 = 100;
    const amount2 = 300;

    myERC20.mintUpTo.whenCalledWith(to, amount1).returns(mockedMintAmount);

    expect((await myERC20.totalSupply()).toString()).to.be.equal("0");
    await myOtherContract.myOtherFunction(to, amount1);

    // would be 100 if we called transferOwnership before
    expect((await myERC20.totalSupply()).toString()).to.be.equal("0");

    expect(myERC20.mintUpTo.atCall(0).getCallCount()).to.be.equal(1);
    expect(myERC20.mintUpTo.getCall(0).args[0]).to.be.equals(to);
    expect(
      (myERC20.mintUpTo.getCall(0).args[1] as BigNumber).toString()
    ).to.equal(amount1.toString());

    await myERC20.transferOwnership(myOtherContract.address);
    await myOtherContract.myOtherFunction(to, amount2);
    expect((await myERC20.totalSupply()).toString()).to.be.equal("300");
  });

  it("Should set internal storage for mocking", async function () {
    expect(await myERC20.name()).to.be.equal("MyERC20");
    await myERC20.setVariable("_name", "Hello world!");
    expect(await myERC20.name()).to.be.equal("Hello world!");
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

    myERC20.addUp.whenCalledWith(100, 200).returns(100);
    expect(await myERC20.addUp(100, 200)).to.be.equal(100);
    expect(await myERC20.addUp(100, 300)).to.be.not.equal(100);

    myERC20.addUp.returns(30);
    expect(await myERC20.addUp(200, 300)).to.be.equal(30);
  });

  it("Should make a revert", async function () {
    myERC20.addUp.whenCalledWith(100, 200).reverts("invalid parameters");
    await expect(myERC20.addUp(100, 200)).to.be.reverted;
  });
});
