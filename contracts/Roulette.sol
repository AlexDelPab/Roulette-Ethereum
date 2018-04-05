pragma solidity 0.4.20;

contract Roulette {
	address public owner;
	uint256 public minimumBet;
	uint256 public totalBet;
	address[] public players;
    uint80 constant None = uint80(0);

    struct Player {
        Bet[] bets;
	}

    struct Bet {
        uint256 [] numberSelected;
        uint256 amountBet;
        uint256 factor;
    }

	// The address of the player and => the user info
	mapping(address => Player) private playerInfo;

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
        Bet bet;
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
		Player[100] memory winners; // We have to create a temporary in memory array with fixed size
		uint256 count = 0; // This is the count for the array of winners
		for(uint256 i = 0; i < players.length; i++){
			address playerAddress = players[i];
			for (uint256 j = 0;j < playerInfo[playerAddress].bets.length; j++){
//            	Bet[] actualBets = playerInfo[playerAddress].bets;
//				Bet[] newBets = checkNumberOfWinner(actualBets, numberWinner);
				checkNumberOfWinner(playerInfo[playerAddress].bets, numberWinner);
//              playerInfo[playerAddress].bets = newBets;

                winners[count] = playerInfo[playerAddress];
                count++;
			}
		}

		players.length = 0; // Delete all the players array
        calculatePrizes(winners);
	}

	function checkNumberOfWinner(Bet [] bets, uint256 numberWinner) private{
//        Bet [] wonBets = new Bet[](15);
		for (uint256 i = 0;i < bets.length; i++){
			if (contains(bets[i].numberSelected == true)){
                delete bets[i];
            }
		}

//        return wonBets;
	}

    function calculatePrizes(address[100] winners){
        for (uint256 i = 0; i < winners.length; i++){
            if (winners[i] != address(0)){
                for (uint256 j = 0; j < winners[i].bets; j++){
                    if (winners[i].bets[j] != None){
                        uint256 bigWin = winners[i].bets[j].amountBet * winners[i].bets[j].factor;
                        winners[i].transfer(bigWin);
                    }
                }
            }
        }
//        uint256 winnerEtherAmount = totalBet / winners.length; // How much each winner gets
//        for(uint256 j = 0; j < count; j++){
//            if(winners[j] != address(0)) // Check that the address in this fixed array is not empty
//                winners[j].transfer(winnerEtherAmount);
//        }
    }

    function contains(uint256[] selectedNumbers, uint256 num) {
        for (uint256 i = 0; i < selectedNumbers.length; i++){
            if (selectedNumbers[i] == num){
                return true;
            }
        }

        return false;
    }
}
