pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import './SFTFrenToken.sol';

contract FractionalizeSNFT is IERC721Receiver {
    mapping(address => DepositFolder) AccessDeposits;
    mapping(address => mapping (uint256 => uint256)) NftIndex;

    struct DepositFolder {
        DepositInfo[] Deposit;
    }

    struct DepositInfo {
        address owner;
        address nftContractAddress;
        uint256 nftId;
        uint256 depositTimestamp; //deposited time
        address fractionContractAddress; 
        uint256 supply;
        bool hasFractionalized; //has deposited nft been fractionalized
    }

    function approvetokens(uint256 amount, address token) public {
        FractionToken FTOKEN = FractionToken(token);
        FTOKEN.approve(address(this), amount);
    }
    
    function depositNft(uint256 _nftId) public {
        ERC721 NFT = ERC721(0xBBd707815a7F7eb6897C7686274AFabd7B579Ff6);
        NFT.safeTransferFrom(msg.sender, address(this), _nftId);

        DepositInfo memory newDeposit;
        newDeposit.owner = msg.sender;
        newDeposit.nftContractAddress = 0xBBd707815a7F7eb6897C7686274AFabd7B579Ff6;
        newDeposit.nftId = _nftId;
        newDeposit.depositTimestamp = block.timestamp;
        newDeposit.hasFractionalized = false;

        NftIndex[0xBBd707815a7F7eb6897C7686274AFabd7B579Ff6][_nftId] = AccessDeposits[msg.sender].Deposit.length;
        AccessDeposits[msg.sender].Deposit.push(newDeposit);
    }


    function createFraction(
        uint256 _nftId,
        uint256 _royaltyPercentage,
        uint256 _supply,
        string memory _tokenName,
        string memory _tokenTicker
    ) public {
        uint256 index = NftIndex[0xBBd707815a7F7eb6897C7686274AFabd7B579Ff6][_nftId];
        require(AccessDeposits[msg.sender].Deposit[index].owner == msg.sender, "Only the owner of this NFT can access it");

        AccessDeposits[msg.sender].Deposit[index].hasFractionalized = true;

        SFTFrenToken sftFrenToken = new SFTFrenToken(
            0xBBd707815a7F7eb6897C7686274AFabd7B579Ff6,
            _nftId,
            msg.sender,
            _royaltyPercentage,
            _supply,
            _tokenName,
            _tokenTicker
        );

        AccessDeposits[msg.sender].Deposit[index].fractionContractAddress = address(sftFrenToken);
    }

    function distributeFractions(
        address _fractionContract,
        address[] calldata recipients,
        uint256[] calldata percentages
    ) external {
        require(recipients.length == percentages.length, "Recipients and percentages length mismatch");

        ERC20 fraction = ERC20(_fractionContract);
        uint256 totalSupply = fraction.totalSupply();
        uint256 totalPercent = 0;

        for (uint256 i = 0; i < percentages.length; i++) {
            totalPercent += percentages[i];
        }
        require(totalPercent == 100, "Total percentages must equal 100");

        for (uint256 i = 0; i < recipients.length; i++) {
            uint256 amount = (totalSupply * percentages[i]) / 100;
            fraction.transferFrom(msg.sender, recipients[i], amount);
        }
    }

    function withdrawNftWithSupply(address _fractionContract) public {
        SFTFrenToken fraction = SFTFrenToken(_fractionContract);

        require(fraction.ContractDeployer() == address(this), "Only fraction tokens created by this fractionalize contract can be accepted");
        require(fraction.balanceOf(msg.sender) == fraction.totalSupply());

        address NFTAddress = fraction.NFTAddress();
        uint256 NFTId = fraction.NFTId();

        fraction.transferFrom(msg.sender, address(this), fraction.totalSupply());
        fraction.burn(fraction.totalSupply());

        ERC721 NFT = ERC721(NFTAddress);
        NFT.safeTransferFrom(address(this), msg.sender, NFTId);

        uint256 index = NftIndex[NFTAddress][NFTId];
        delete AccessDeposits[msg.sender].Deposit[index];
    }

    function onERC721Received(
        address,
        address from,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {        
        return IERC721Receiver.onERC721Received.selector;
    }
}