pragma solidity 0.4.20;

contract Roulette {
	address public owner;


	function Roulette() public {
		owner = msg.sender;
	}

	function kill() public {
		if(msg.sender == owner) selfdestruct(owner);
	}
}
