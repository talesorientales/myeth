import { expect } from "chai";
import { ethers } from "hardhat";
import { ContentMarketplace } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("ContentMarketplace", function () {
  let contentMarketplace: ContentMarketplace;
  let owner: HardhatEthersSigner, addr1: HardhatEthersSigner;

  beforeEach(async function () {
    // Получаем аккаунты
    [owner, addr1] = await ethers.getSigners();

    // Разворачиваем контракт
    const factory = await ethers.getContractFactory("ContentMarketplace");
    contentMarketplace = await factory.deploy();
    await contentMarketplace.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await contentMarketplace.owner()).to.equal(owner.address);
    });
  });

  describe("Adding content", function () {
    it("Should allow the owner to add content", async function () {
      await contentMarketplace.addContent(ethers.parseEther("1"), "https://content1");
      const content = await contentMarketplace.contents(0);

      expect(content.price).to.equal(ethers.parseEther("1"));
      expect(content.uri).to.equal("https://content1");
    });

    it("Should fail if non-owner tries to add content", async function () {
      await expect(
        contentMarketplace.connect(addr1).addContent(ethers.parseEther("1"), "https://content1"),
      ).to.be.revertedWith("Not the owner");
    });
  });

  describe("Buying content", function () {
    beforeEach(async function () {
      await contentMarketplace.addContent(ethers.parseEther("1"), "https://content1");
    });

    it("Should allow a user to buy content", async function () {
      await contentMarketplace.connect(addr1).buyContent(0, { value: ethers.parseEther("1") });
      const hasAccess = await contentMarketplace.hasAccess(addr1.address, 0);
      expect(hasAccess).to.equal(true);
    });

    it("Should fail if payment is incorrect", async function () {
      await expect(
        contentMarketplace.connect(addr1).buyContent(0, { value: ethers.parseEther("0.5") }),
      ).to.be.revertedWith("Incorrect payment amount");
    });

    it("Should fail if user already has access", async function () {
      await contentMarketplace.connect(addr1).buyContent(0, { value: ethers.parseEther("1") });
      await expect(
        contentMarketplace.connect(addr1).buyContent(0, { value: ethers.parseEther("1") }),
      ).to.be.revertedWith("Access already granted");
    });
  });

  describe("Getting content", function () {
    beforeEach(async function () {
      await contentMarketplace.addContent(ethers.parseEther("1"), "https://content1");
    });

    it("Should allow user with access to get content", async function () {
      await contentMarketplace.connect(addr1).buyContent(0, { value: ethers.parseEther("1") });
      const uri = await contentMarketplace.connect(addr1).getContent(0);
      expect(uri).to.equal("https://content1");
    });

    it("Should fail if user does not have access", async function () {
      await expect(contentMarketplace.connect(addr1).getContent(0)).to.be.revertedWith("Access denied");
    });
  });

  describe("Updating content", function () {
    beforeEach(async function () {
      await contentMarketplace.addContent(ethers.parseEther("1"), "https://content1");
    });

    it("Should allow owner to update price", async function () {
      await contentMarketplace.updatePrice(0, ethers.parseEther("2"));
      const content = await contentMarketplace.contents(0);
      expect(content.price).to.equal(ethers.parseEther("2"));
    });

    it("Should allow owner to update URI", async function () {
      await contentMarketplace.updateContentURI(0, "https://newcontent");
      const content = await contentMarketplace.contents(0);
      expect(content.uri).to.equal("https://newcontent");
    });

    it("Should fail if non-owner tries to update", async function () {
      await expect(contentMarketplace.connect(addr1).updatePrice(0, ethers.parseEther("2"))).to.be.revertedWith(
        "Not the owner",
      );
    });
  });

  describe("Withdraw funds", function () {
    beforeEach(async function () {
      await contentMarketplace.addContent(ethers.parseEther("1"), "https://content1");
      await contentMarketplace.connect(addr1).buyContent(0, { value: ethers.parseEther("1") });
    });

    it("Should allow owner to withdraw funds", async function () {
      const initialBalance = await ethers.provider.getBalance(owner.address);

      const tx = await contentMarketplace.withdraw();
      const receipt = await tx.wait();
      const gasUsed = receipt ? receipt.gasUsed * receipt.gasPrice : 0;

      const finalBalance = await ethers.provider.getBalance(owner.address);
      expect(finalBalance).to.equal(initialBalance + ethers.parseEther("1") - BigInt(gasUsed || 0));
    });

    it("Should fail if non-owner tries to withdraw", async function () {
      await expect(contentMarketplace.connect(addr1).withdraw()).to.be.revertedWith("Not the owner");
    });
  });
});
