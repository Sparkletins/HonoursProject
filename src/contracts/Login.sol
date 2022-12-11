// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Login {

    uint public UniCount;

    mapping(address => string) UniNames;
    mapping(address => bool) Universities;
    mapping(address => bool) validator;

    constructor() {
        validator[msg.sender] = true;
        UniCount = 0;
    }

    function checkLogin(address ch) public view returns (bool) {
        return Universities[ch];
    }

    function checkValidator(address ch) public view returns (bool) {
        return validator[ch];
    }

    function addUni(string memory name, address newUni) public {
        if (validator[msg.sender]) {
            UniCount++;
            Universities[newUni] = true;
            UniNames[newUni] = name;
        }
    }

    function getName(address uadd) public view returns (string memory) {
        return UniNames[uadd];
    }

    /*ECHIDNA TESTS*/

    // function compareStrings(string memory a, string memory b) public pure returns (bool) {
    //     return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    // }

    // function echidna_check_validator() public view returns (bool) {
    //     return checkValidator(msg.sender);
    // }

    // function echidna_check_add_login() public returns (bool) {
    //     addUni("Stellenbosch University", msg.sender);
    //     return checkLogin(msg.sender);
    // }

    // function echidna_check_name() public returns (bool) {
    //     addUni("Stellenbosch University", msg.sender);
    //     return compareStrings(UniNames[msg.sender], "Stellenbosch University");
    // }


}