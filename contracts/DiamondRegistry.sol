pragma solidity ^0.4.22;

import "./ERC721.sol";
import "./SafeMath.sol";
import "./AddressUtils.sol";


contract DiamondRegistry is ERC721 {
    using SafeMath for uint256;
    using AddressUtils for address;

  // Mapping from token ID to owner
  mapping (uint256 => address) internal tokenOwner;

  // Mapping from owner to number of owned token
  mapping (address => uint256) internal ownedTokensCount;

  mapping (uint256 => Diamond) public diamondsInfo;


  modifier onlyOwnerOf(uint256 _tokenId) {
    require(ownerOf(_tokenId) == msg.sender);
    _;
  }
  struct Diamond{
      bytes32 certificateNumber;
      bytes32 agency;
      uint caratSize;
  }


  event DiamondRegistered(bytes32 agency, bytes32 certificateNumber, uint caratSize, address registerer, uint timestamp);

  function ownerOf(uint256 _tokenId) public view returns (address) {
    address owner = tokenOwner[_tokenId];
    require(owner != address(0));
    return owner;
  }

  function exists(uint256 _tokenId) public view returns (bool) {
    address owner = tokenOwner[_tokenId];
    return owner != address(0);
  }

    function balanceOf(address _owner) public view returns (uint256) {
        require(_owner != address(0));
        return ownedTokensCount[_owner];
    }

    function register(bytes32 _agency,bytes32 _certificateNumber, uint _caratSize){
        uint tokenId = uint(keccak256(_agency,_certificateNumber,_caratSize));
        require(tokenOwner[tokenId] != address(0));

        Diamond memory newDiamond;
        newDiamond.agency =_agency;
        newDiamond.certificateNumber = _certificateNumber;
        newDiamond.caratSize =_caratSize;

        tokenOwner[tokenId] = msg.sender;
        diamondsInfo[tokenId] = newDiamond;

        DiamondRegistered(_agency,_certificateNumber,_caratSize, msg.sender, now);

    }

    function registerDiamonds(bytes32[] _agencys, bytes32[] _certificateNumbers, uint[] _caratSizes){
        require(_agencys.length == _caratSizes.length);
        require(_agencys.length == _certificateNumbers.length);
        for (uint i = 0; i < _agencys.length; i++){
            register(_agencys[i],_certificateNumbers[i],_caratSizes[i]);
        }
    }

    function approve(address _approved, uint256 _tokenId) external payable{

    }


}
