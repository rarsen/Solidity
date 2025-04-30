// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract ArsenContract is ERC20, Ownable {
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);

    
    constructor(uint256 _amount) ERC20("Arsen Token", "ARS") Ownable() {
        _mint(msg.sender, _amount);
        emit TokensMinted(msg.sender, _amount);
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    function burnFrom(address from, uint256 amount) public onlyOwner {
        _burn(from, amount);
        emit TokensBurned(from, amount);
    }

    
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }
}


