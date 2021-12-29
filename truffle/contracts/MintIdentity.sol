pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MintIdentity {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct  Identity  {
        bytes32 identity;
        string firstname;
        string lastname;
        string organization;
        string slogan;
        string aka;
        string description;
        string url;
        string bio;
        uint create;
        uint lastupdated;
        bool valid;
        uint validdate;
        uint validationscore;
    }

    constructor() {

    }
    /*function mint(uint16 year, uint8 month, uint8 day, uint8 color, string memory title) internal {
        uint256 tokenId = id(year, month, day);

        id_to_date[tokenId] = Metadata(year, month, day, color, title);
        _safeMint(msg.sender, tokenId);
    }
    */

    function createIdentity(
        string memory first,
        string memory last,
        string memory aka,
        string memory org,
        string memory slogan,
        string memory description,
        string memory url,
        string memory bio) private view returns(bytes32) {
        return keccak256(abi.encodePacked(first, last, aka, org, slogan, description, url, bio, block.timestamp));
    }
    function minIdentity(
        string memory first,
        string memory last,
        string memory aka,
        string memory org,
        string memory slogan,
        string memory description,
        string memory url,
        string memory bio) internal {
            uint256 tokenId =  _tokenIds.current();
            bytes32 identity = createIdentity(first, last, aka, org, slogan, description, url, bio);
            Identity memory ident = Identity(identity,first, last, aka, org, slogan, description,
                url, bio, block.timestamp, block.timestamp, false, 0, 0);
            _tokenIds.increment();

    }

}
