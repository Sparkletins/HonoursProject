// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

contract Degrees{

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

  mapping(uint => Deg) degrees;
  mapping(uint => Student) public student;
  mapping(uint => bool) _studentExists;

  constructor() public {
    degreeCount = 0;
  }


  function addStudent(uint id, string memory sName) public {
    student[id] = Student(sName, new uint[](7));
    student[id].degrees[0] = 0;
    _studentExists[id] = true;
  }

  function addDegree(uint id, string memory quali, string memory uni, string memory img) public {
    student[id].degrees[student[id].degrees[0] + 1] = degreeCount;
    degrees[degreeCount] = Deg(quali, uni, img);
    student[id].degrees[0]++;
    degreeCount++;
  }

  function getDegreeImage(uint num) public view returns (string memory) {
    return degrees[num].image;
  }

  function search(uint id) public view returns (uint [] memory) {
    return student[id].degrees;
  }

  function searchCount(uint id) public view returns (uint) {
    return student[id].degrees[0];
  }

  function Count() public view returns (uint) {
    return degreeCount;
  }

  function studentName(uint id) public view returns (string memory) {
    return student[id].Student;
  }

  function compareStrings(string memory a, string memory b) public pure returns (bool) {
    return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
  }

  function echidna_check_add_student() public returns (bool) {
    addStudent(8, "Jason Smith");
    return(_studentExists[8]);
  }

  function echidna_check_student_name() public returns (bool) {
    addStudent(8, "Jason Smith");
    return compareStrings("Jason Smith", studentName(8));
  }

  function echidna_check_no_degree() public returns (bool) {
    addStudent(9, "Jason Smith");
    return(searchCount(9) == 0);
  }

}