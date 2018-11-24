/*
* Copyright (c) 2018, Phuwanai Thummavet (serial-coder). All rights reserved.
* Github: https://github.com/serial-coder
* Contact us: mr[dot]thummavet[at]gmail[dot]com
*/

pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Owned {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
}

/* 
    Thai Baht Stable Coin developed for running on RootStock (RSK) 
    smart contract platform and also Ethereum platform
*/
contract BahtCoin is Owned {
    using SafeMath for uint256;

    string public constant name = "RSK-Thai-Baht";
    string public constant symbol = "RTHB";
    uint8 public constant decimals = 18;

    uint256 private _totalSupply;
    mapping(address => uint256) private balances;

    struct RTHBContract {
        address owner; // A user who invokes issue()
        uint256 RBTC;  // RSK BTC
        uint256 RTHB;  // RSK Thai Baht
        uint256 rate;  // Current rate at a contract issue time

        // Threshold value which allows the public to take over 
        // this contract in order to take away the collateralized RBTC. 
        // This will happen if RBTC price on a specific RTHB contract 
        // is less than or equal to this threshold variable.
        uint256 dropThreshold;
        address takeoverAddr;  // A user who invokes publicTakeover()

        // This variable would be set to true if there is an invocation 
        // either on claim() or publicTakeover() against this contract
        bool invalidContract;
    }

    RTHBContract[] private contracts;

    uint256 public collateralRate; 
    uint256 public thresholdRate;
    uint256 public currentRate;

    constructor(
        uint256 _collateralRate, 
        uint256 _thresholdRate, 
        uint256 _currentRate
        ) public {

        collateralRate = _collateralRate;
        thresholdRate = _thresholdRate;
        currentRate = _currentRate;
    }

    function setCollateralRate(uint256 _collateralRate) public onlyOwner {
        collateralRate = _collateralRate;
    }

    function setThresholdRate(uint256 _thresholdRate) public onlyOwner {
        thresholdRate = _thresholdRate;
    }
    
    function setCurrentRate(uint256 _currentRate) public onlyOwner {
        currentRate = _currentRate;
    }

    /*
        A user issues RTHB contract which collateralizes 
        the input RBTC for minting RTHB
    */
    function issue() public payable {
        uint256 RBTC = msg.value;
        require(RBTC != 0);

        uint256 RTHB = RBTC.mul(100).mul(currentRate).div(collateralRate);
        uint256 dropThreshold = RBTC.mul(100).mul(currentRate).div(thresholdRate);

        RTHBContract memory newContract = RTHBContract({
            owner: msg.sender,
            RBTC: RBTC,
            RTHB: RTHB,
            rate: currentRate,
            dropThreshold: dropThreshold,
            takeoverAddr: address(0),
            invalidContract: false
        });

        contracts.push(newContract);

        balances[msg.sender] = balances[msg.sender].add(RTHB);
        _totalSupply = _totalSupply.add(RTHB);
    }

    /*
        An owner claims back the collateralized RBTC 
        on his/her RTHB contract
    */
    function claim(uint256 contractIndex) public payable {
        require(contractIndex < contractLength());
        RTHBContract storage targetContract = contracts[contractIndex];
        require(targetContract.owner == msg.sender);
        require(!targetContract.invalidContract);

        // Burn RTHB
        balances[msg.sender] = balances[msg.sender].sub(targetContract.RTHB);
        _totalSupply = _totalSupply.sub(targetContract.RTHB);

        // Mark the target contract to be invalid
        targetContract.invalidContract = true;

        // Transfer RBTC back to its owner
        msg.sender.transfer(targetContract.RBTC);
    }

    /*
        In case RBTC price on a specific RTHB contract is less than 
        or equal to the pre-determined "dropThreshold" variable,
        that contract is open for the public to take over.

        To take over the contract, an invoker has to spend 
        his/her own RTHB to take away the taken over contract's 
        collateralized RBTC.
    */
    function publicTakeover(uint256 _contractIndex) public payable {
        require(_contractIndex < contractLength());
        RTHBContract storage targetContract = contracts[_contractIndex];
        require(targetContract.owner != msg.sender);
        require(!targetContract.invalidContract);
        require(balances[msg.sender] >= targetContract.RTHB);
        require(targetContract.RBTC.mul(currentRate) <= targetContract.dropThreshold);

        // Burn RTHB
        balances[msg.sender] = balances[msg.sender].sub(targetContract.RTHB);
        _totalSupply = _totalSupply.sub(targetContract.RTHB);

        // Set the takeover address
        targetContract.takeoverAddr = msg.sender;

        // Mark the target contract to be invalid
        targetContract.invalidContract = true;

        // Transfer RBTC to the invoker
        msg.sender.transfer(targetContract.RBTC);
    }

    function balanceOf(address tokenOwner) 
    public view 
    returns (uint256 balance) {
        return balances[tokenOwner];
    }

    function contractLength() public view returns (uint256) {
        return contracts.length;
    }

    function getContractInfo(uint256 _contractIndex)
    public view 
    returns (
        address owner,
        uint256 RBTC,
        uint256 RTHB,
        uint256 rate,
        uint256 dropThreshold,
        address takeoverAddr,
        bool invalidContract
    ) {
        return (
            contracts[_contractIndex].owner,
            contracts[_contractIndex].RBTC,
            contracts[_contractIndex].RTHB,
            contracts[_contractIndex].rate,
            contracts[_contractIndex].dropThreshold,
            contracts[_contractIndex].takeoverAddr,
            contracts[_contractIndex].invalidContract
        );
    }

    function convertToRTHB(uint256 _RBTC) 
    public view 
    returns (uint256 _RTHB) {
        return _RBTC.mul(100).mul(currentRate).div(collateralRate);
    }
}