import chai, { expect } from "chai";
import { FakeContract, MockContract, smock } from "@defi-wonderland/smock";
import { BigNumber } from "@ethersproject/bignumber";

import {
  ERC20,
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

  let myOtherContractFactory: MyOtherContract__factory,
    myERC20Factory: MyERC20__factory;

  beforeEach("init setup", async function () {
    [owner, userA] = await ethers.getSigners();

    myOtherContractFactory = (await ethers.getContractFactory(
      "MyOtherContract"
    )) as MyOtherContract__factory;

    myERC20Factory = (await ethers.getContractFactory(
      "MyERC20"
    )) as MyERC20__factory;
  });

  it("Should mock the mintUpTo function", async function () {
    const to = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
    const amount = 300;
    const fakeERC20Address = await ethers.Wallet.createRandom().getAddress();

    // fake contract with returns
    const myERC20Fake = (await smock.fake("IMyERC20", {
      address: fakeERC20Address,
    })) as FakeContract<MyERC20>;
    myERC20Fake.mintUpTo.whenCalledWith(to, amount).returns(amount);
    myERC20Fake.balanceOf.whenCalledWith(to).returns(0);
    myERC20Fake.totalSupply.returns(amount);

    const myOtherContractFake = (await myOtherContractFactory.deploy(
      fakeERC20Address
    )) as MyOtherContract;

    await myOtherContractFake.myOtherFunction(to, amount);
    expect((await myERC20Fake.totalSupply()).toString()).to.be.equal(
      amount.toString()
    );
    expect(myERC20Fake.mintUpTo).to.have.been.calledWith(to, amount);

    expect(myERC20Fake.mintUpTo).to.have.been.calledOnce;
    expect(myERC20Fake.mintUpTo).to.have.been.callCount(1);
    expect(myERC20Fake.mintUpTo).to.have.been.calledBefore(
      myERC20Fake.totalSupply
    );
  });
});
