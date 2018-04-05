pragma solidity 0.4.20;

contract Roulette {
	address public owner;
	uint256 public minimumBet;
	uint256 public totalBet;
	address[] public players;

    uint256 []win1 = new uint[]();

	struct Player {
        Bet[] bets;
	}

    struct Bet {
        uint256 [] numberSelected;
        uint256 amountBet;
        uint256 factor;
    }

	// The address of the player and => the user info
	mapping(address => Player) public playerInfo;

	function Casino(uint256 _minimumBet) public {
		owner = msg.sender;
		if(_minimumBet != 0 ) minimumBet = _minimumBet;
	}

    function() public payable {}

	function kill() public {
		if(msg.sender == owner) selfdestruct(owner);
	}

	function checkPlayerExists(address player) public constant returns(bool){
		for(uint256 i = 0; i < players.length; i++){
			if(players[i] == player) return true;
		}
		return false;
	}

	function bet(uint256 [] numberSelected, uint256 factor) public payable {
		require(!checkPlayerExists(msg.sender));
//		require(numberSelected >= 1 && numberSelected <= 10);
		//Nice to have: check values of array content
		require(msg.value >= minimumBet);
        Bet bet = new Bet();
        bet.amountBet = msg.value;
        bet.numberSelected = numberSelected;
        bet.factor = factor;
		playerInfo[msg.sender].bets.push(bet);
		players.push(msg.sender);
		totalBet += msg.value;
	}

	// Generates a number between 0 and 36 that will be the winner
	function generateNumberWinner() public {
		uint256 numberGenerated = block.number % 36;
		distributePrizes(numberGenerated);
	}

	// Sends the corresponding ether to each winner depending on the total bets
	function distributePrizes(uint256 numberWinner) public {
		address[100] memory winners; // We have to create a temporary in memory array with fixed size
		uint256 count = 0; // This is the count for the array of winners
		for(uint256 i = 0; i < players.length; i++){
			address playerAddress = players[i];
            bool x = checkNumberOfWinner(playerInfo[playerAddress].numberSelected);

			if (x){
				winners[count] = playerAddress;
                count++;
			}

			delete playerInfo[playerAddress]; // Delete all the players
		}
		players.length = 0; // Delete all the players array
        calculatePrizes(winners);

	}

	function checkNumberOfWinner(uint256 [][] numberSelected) private returns(bool){

	}

    function calculatePrizes(address[] winners){
        for (uint256 i = 0; i < winners.length(); i++){
            if (winners[i] != address(0)){

            }
        }
//        uint256 winnerEtherAmount = totalBet / winners.length; // How much each winner gets
//        for(uint256 j = 0; j < count; j++){
//            if(winners[j] != address(0)) // Check that the address in this fixed array is not empty
//                winners[j].transfer(winnerEtherAmount);
//        }
    }
}
