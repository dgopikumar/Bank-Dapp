//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Bank {
    address owner;
    bytes32[] public whitelistedSymbols;
    mapping(bytes32 => address) public whitelistedTokens;
    mapping(address => mapping(bytes32 => uint256)) public balances;

    constructor() {
        owner = msg.sender;
    }

    function AddWhitelistToken(bytes32 symbol, address tokenAddress) external {
        require(msg.sender == owner, "This function is not public!");

        whitelistedSymbols.push(symbol);
        whitelistedTokens[symbol] = tokenAddress;
    }

    function GetWhitelistedSymbols() external view returns(bytes32[] memory) {
        return whitelistedSymbols;
    }

    function GetWhitelistedTokenAddress(bytes32 symbol) external view returns(address) {
    return whitelistedTokens[symbol];
  }


    receive() external payable {
        balances[msg.sender]['ETH'] += msg.value;
    }

    function WithdrawEther(uint amount) external {
        require(balances[msg.sender]['ETH'] >= amount, 'Insufficient funds');

        balances[msg.sender]['ETH'] -= amount;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }

    function DepositTokens(uint256 amount, bytes32 symbol) external {
        balances[msg.sender][symbol] += amount;
        IERC20(whitelistedTokens[symbol]).transferFrom(msg.sender, address(this), amount);
    }

    function WithdrawTokens(uint256 amount, bytes32 symbol) external {
        require(balances[msg.sender][symbol] >= amount, 'Insufficient funds');

        balances[msg.sender][symbol] -= amount;
        IERC20(whitelistedTokens[symbol]).transfer(msg.sender, amount);
    }

    function GetTokenBalance(bytes32 symbol) external view returns(uint256) {
        return balances[msg.sender][symbol];
    }

     function GetBalance(bytes32 symbol) external view returns(string memory) {
        uint256 userBalance = IERC20(whitelistedTokens[symbol]).balanceOf(msg.sender);
        if(userBalance > 1) {
            return "1";
        }else {
            return "0";
        }
     }
}





