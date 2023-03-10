// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/utils/Counters.sol";

contract StoreDocument {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _adminIds;
    Counters.Counter private _documentIds;
    address contractOwner = msg.sender;

    struct userDetails {
        uint256 id;
        string name;
        string email;
    }

    struct adminDetails {
        uint256 id;
        string name;
        address adminWalletAddress;
    }

    struct documents {
        uint256 id;
        string document_link;
    }

    mapping(uint256 => adminDetails) private idToAdmin;
    mapping(uint256 => userDetails) private idToUsers;
    mapping(uint256 => documents) private idToDocs;

    function addUser(
        string memory _name,
        string memory _email
    ) public {
        _tokenIds.increment();
      uint256 _id = _tokenIds.current();
        idToUsers[_id].name = _name;
        idToUsers[_id].id = _id;
        idToUsers[_id].email = _email;
    }

       function addShareSheet(string memory _document_link) public {
        uint totalItemCount = _adminIds.current();
        address tempAdmin;
        for (uint i = 0; i < totalItemCount; i++) {
          if (idToAdmin[i + 1].adminWalletAddress == msg.sender) {
            tempAdmin = msg.sender;
          }
        }
        require(tempAdmin == msg.sender || contractOwner == msg.sender,"Sorry you are not admin");
        _documentIds.increment();
        uint256 _id = _documentIds.current();
       idToDocs[_id].id = _id;
       idToDocs[_id].document_link = _document_link;
   }

   function addAdmin(string memory adminName, address _adminWalletAddress) public {
        uint totalItemCount = _adminIds.current();
        address tempAdmin;
        for (uint i = 0; i < totalItemCount; i++) {
          if (idToAdmin[i + 1].adminWalletAddress == msg.sender) {
            tempAdmin = msg.sender;
          }
        }
        require(tempAdmin == msg.sender || contractOwner == msg.sender,"Sorry you are not admin");
       _adminIds.increment();
       uint _id = _adminIds.current();
       idToAdmin[_id].id = _id;
       idToAdmin[_id].name = adminName;
       idToAdmin[_id].adminWalletAddress = _adminWalletAddress;
   }

      // fetch sharedsheet users
    function sharedsheetUsers() public view returns (documents[] memory) {
      uint totalItemCount = _tokenIds.current();
    //   uint totalDocumentCount = _documentIds.current();
      uint itemCount = 0;
    //   uint itemCnt = 0;
      uint currentIndex = 0;
    //   uint currentDocIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
          itemCount += 1;
      }
      documents[] memory items = new documents[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
          uint currentId = i + 1;
          documents storage currentItem = idToDocs[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
      }
      
      return items;
    }

       // fetch user
    function Users() public view returns (userDetails[] memory) {
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
          itemCount += 1;
      }
      userDetails[] memory items = new userDetails[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
          uint currentId = i + 1;
          userDetails storage currentItem = idToUsers[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
      }
      return items;
    }

        // fetch admin
    function admins() public view returns (adminDetails[] memory) {
      uint totalItemCount = _adminIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
          itemCount += 1;
      }
      adminDetails[] memory items = new adminDetails[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
          uint currentId = i + 1;
          adminDetails storage currentItem = idToAdmin[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
      }
      return items;
    }
}