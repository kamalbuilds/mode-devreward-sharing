pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract SFTFrenToken is ERC20, ERC20Burnable {
    address public NFTAddress;
    uint256 public NFTId;
    address public NFTOwner;
    address public ContractDeployer;
    uint256 public RoyaltyPercentage;

    constructor(
        address _NFTAddress, 
        uint256 _NFTId, 
        address _NFTOwner, 
        uint256 _royaltyPercentage, 
        uint256 _supply, 
        string memory _tokenName, 
        string memory _tokenTicker
    ) ERC20(_tokenName, _tokenTicker) {
        NFTAddress = _NFTAddress;
        NFTId = _NFTId;
        NFTOwner = _NFTOwner;
        RoyaltyPercentage = _royaltyPercentage;
        ContractDeployer = msg.sender;
        _mint(_NFTOwner, _supply);
    }

    function transfer(address to, uint256 amount) override public returns (bool) {
        uint256 royaltyFee = (amount * RoyaltyPercentage) / 100;
        uint256 afterRoyaltyFee = amount - royaltyFee;
        address owner = _msgSender();

        _transfer(owner, NFTOwner, royaltyFee);
        _transfer(owner, to, afterRoyaltyFee);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);

        uint256 royaltyFee = (amount * RoyaltyPercentage) / 100;
        uint256 afterRoyaltyFee = amount - royaltyFee;

        _transfer(from, NFTOwner, royaltyFee);
        _transfer(from, to, afterRoyaltyFee);
        return true;
    }

    function burn(uint256 amount) public virtual override {
        _burn(_msgSender(), amount);
    }

    function updateNFTOwner(address _newOwner) public {
        require(msg.sender == ContractDeployer, "Only contract deployer can call this function");
        NFTOwner = _newOwner;
    }
}
