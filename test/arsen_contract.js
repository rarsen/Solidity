const ArsenContract = artifacts.require("ArsenContract");

contract("ArsenContract", function (accounts) {
  const owner = accounts[0];
  const recipient1 = accounts[1];
  const recipient2 = accounts[2];
  const recipient3 = accounts[3];
  const initialSupply = "1000000000000000000000000"; 
  let tokenInstance;

  beforeEach(async function () {
    tokenInstance = await ArsenContract.new(initialSupply, { from: owner });
  });

  it("should set correct initial supply and token details", async function () {
    const name = await tokenInstance.name();
    const symbol = await tokenInstance.symbol();
    const totalSupply = await tokenInstance.totalSupply();
    const ownerBalance = await tokenInstance.balanceOf(owner);
    
    assert.equal(name, "Arsen Token", "Name is not correct");
    assert.equal(symbol, "ARS", "Symbol is not correct");
    assert.equal(totalSupply.toString(), initialSupply, "Total supply is not correct");
    assert.equal(ownerBalance.toString(), initialSupply, "Owner balance is not correct");
  });

  it("should transfer tokens between accounts", async function () {
    const amount = "1000000000000000000000"; 
    
    const initialOwnerBalance = await tokenInstance.balanceOf(owner);
    
    await tokenInstance.transfer(recipient1, amount, { from: owner });
    
    const ownerBalanceAfter = await tokenInstance.balanceOf(owner);
    const recipient1Balance = await tokenInstance.balanceOf(recipient1);
    
    assert.equal(
      ownerBalanceAfter.toString(), 
      initialOwnerBalance.sub(web3.utils.toBN(amount)).toString(), 
      "Owner balance should decrease"
    );
    assert.equal(recipient1Balance.toString(), amount, "Recipient balance should increase");
    
    
    await tokenInstance.transfer(recipient2, "500000000000000000000", { from: recipient1 });
    
    const recipient1BalanceAfter = await tokenInstance.balanceOf(recipient1);
    const recipient2Balance = await tokenInstance.balanceOf(recipient2);
    
    assert.equal(recipient1BalanceAfter.toString(), "500000000000000000000", "Recipient1 balance incorrect");
    assert.equal(recipient2Balance.toString(), "500000000000000000000", "Recipient2 balance incorrect");
  });

  it("should allow minting new tokens by owner", async function () {
    const mintAmount = "5000000000000000000000"; 
    const initialSupply = await tokenInstance.totalSupply();
    
    await tokenInstance.mint(recipient3, mintAmount, { from: owner });
    
    const totalSupplyAfterMint = await tokenInstance.totalSupply();
    const recipient3Balance = await tokenInstance.balanceOf(recipient3);
    
    assert.equal(
      totalSupplyAfterMint.toString(), 
      initialSupply.add(web3.utils.toBN(mintAmount)).toString(), 
      "Total supply should increase"
    );
    assert.equal(recipient3Balance.toString(), mintAmount, "Recipient balance should match minted amount");
  });

  it("should allow burning tokens", async function () {
    const burnAmount = "1000000000000000000000"; 
    const initialOwnerBalance = await tokenInstance.balanceOf(owner);
    const initialTotalSupply = await tokenInstance.totalSupply();
    
    await tokenInstance.burn(burnAmount, { from: owner });
    
    const ownerBalanceAfterBurn = await tokenInstance.balanceOf(owner);
    const totalSupplyAfterBurn = await tokenInstance.totalSupply();
    
    assert.equal(
      ownerBalanceAfterBurn.toString(), 
      initialOwnerBalance.sub(web3.utils.toBN(burnAmount)).toString(), 
      "Owner balance should decrease"
    );
    assert.equal(
      totalSupplyAfterBurn.toString(), 
      initialTotalSupply.sub(web3.utils.toBN(burnAmount)).toString(), 
      "Total supply should decrease"
    );
  });
});
