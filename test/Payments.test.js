const { expect } = require("chai");
const { Wallet } = require("ethers");
const { ethers } = require("hardhat");
const { extendConfig } = require("hardhat/config");

describe("Payments", function () {
  let acc1;
  let acc2;
  let payments;
  beforeEach(async function () {
    [acc1, acc2] = await ethers.getSigners();
    const Payments = await ethers.getContractFactory("Payments", acc1);
    payments = await Payments.deploy();
    await payments.deployed();
  });

  it("Should be deployed", async function () {
    expect(payments.address).to.be.properAddress;
  });

  it("Should have 0 eth balance", async function () {
    const balance = await payments.currentBalance();
    expect(balance).to.eq(0);
  });

  it("Should send funds", async function () {
    const tx = await payments.pay("hello from hardhat", { value: 100 });
    await tx.wait();
    const balance = await payments.currentBalance();
    expect(balance).to.eq(100);
  });

  it("Should send funds from another acc", async function () {
    const sum = 100;
    const msg = "hello from hardhat";
    const tx = await payments
      .connect(acc2)
      .pay("hello from hardhat", { value: sum });
    await expect(() => tx).to.changeEtherBalances(
      [acc2, payments],
      [-sum, sum]
    );
    await tx.wait();

    const newPayment = await payments.getPayment(acc2.address, 0);
    expect(newPayment.message).to.eq(msg);
    expect(newPayment.amount).to.eq(sum);
    expect(newPayment.from).to.eq(acc2.address);
  });
});
