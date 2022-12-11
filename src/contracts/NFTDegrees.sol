// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;
import "../../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTDegrees is ERC721 {

  uint public degreeCount = 0;

  struct Deg {
    string Qualification;
    string University;
    string image;
  }

  struct Student {
    string Student;
    uint [] degrees;
  }

  mapping(string => bool) _degreeExists;
  mapping(uint => Deg) degrees;
  mapping(uint => Student) public student;
  mapping(uint => bool) _studentExists;

  constructor() ERC721("Degrees", "DEGREES") {
    degreeCount = 0;
  }

  function mint(string memory degreehash, uint id) private {
    require(!_degreeExists[degreehash]);
    _mint(msg.sender, id);
    _degreeExists[degreehash] = true; 
  }

  function transfer(uint id, address toAdd) external {
    transferFrom(owner(id), toAdd, id);
  }

  function owner(uint256 id) public view returns (address) {
    return ownerOf(id);
  }

  function addStudent(uint id, string memory sName) external {
    student[id] = Student(sName, new uint[](7));
    student[id].degrees[0] = 0;
    _studentExists[id] = true;
  }

  function addDegree(uint id, string memory quali, string memory uni, string memory img) external {
    require(_studentExists[id]);
    student[id].degrees[student[id].degrees[0] + 1] = degreeCount;
    degrees[degreeCount] = Deg(quali, uni, img);
    student[id].degrees[0]++;
    mint(img, degreeCount);
    degreeCount++;
  }

  function getDegreeImage(uint num) external view returns (string memory) {
    return degrees[num].image;
  }

  function search(uint id) external view returns (uint [] memory) {
    require(_studentExists[id]);
    return student[id].degrees;
  }

  function searchCount(uint id) external view returns (uint) {
    require(_studentExists[id]);
    return student[id].degrees[0];
  }

  function studentExists(uint id) external view returns (bool) {
    return _studentExists[id];
  }

  function Count() external view returns (uint) {
    return degreeCount;
  }

  function studentName(uint id) external view returns (string memory) {
    require(_studentExists[id]);
    return student[id].Student;
  }

}