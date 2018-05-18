import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import './../css/index.css'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lastWinner: 0,
            numberOfBets: 0,
            minimumBet: 0,
            totalBet: 0,
        }

        if (typeof web3 != 'undefined') {
            console.log("Using web3 detected from external source like Metamask")
            this.web3 = new Web3(web3.currentProvider)
        } else {
            console.log("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
            this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
        }

        let casino = JSON.parse(this.readTextFile("/casino-ethereum/build/contracts/Casino.json"));
        const MyContract = web3.eth.contract(casino["abi"]);
        this.state.ContractInstance = MyContract.at("0xd1a9d9ac8D7212aa83C22b0d74AC07d9B971339f")

        window.a = this.state
    }

    readTextFile(file) {
        let rawFile = new XMLHttpRequest();
        let allText = null;
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function ()
        {
            if(rawFile.readyState === 4)
            {
                if(rawFile.status === 200 || rawFile.status == 0)
                {
                    allText = rawFile.responseText;
                }
            }
        }
        rawFile.send(null);
        return allText;
    }

    componentDidMount() {
        this.updateState()

        setInterval(this.updateState.bind(this), 7e3)
    }

    updateState() {
        this.state.ContractInstance.minimumBet((err, result) => {
            console.log(parseFloat(web3.fromWei(result, 'ether')));
            if (result != null) {
                this.setState({
                    minimumBet: parseFloat(web3.fromWei(result, 'ether'))
                })
            }
        })
        this.state.ContractInstance.totalBet((err, result) => {
            if (result != null) {
                this.setState({
                    totalBet: parseFloat(web3.fromWei(result, 'ether'))
                })
            }
        })
        this.state.ContractInstance.numberOfBets((err, result) => {
            if (result != null) {
                this.setState({
                    numberOfBets: parseInt(result)
                })
            }
        })
    }

    voteNumber(number) {
        let bet = this.refs['ether-bet'].value

        if (!bet) bet = 0.1

        if (parseFloat(bet) < this.state.minimumBet) {
            alert('You must bet more than the minimum')
        } else {
            this.state.ContractInstance.bet(number, {
                gas: 300000,
                from: web3.eth.accounts[0],
                value: web3.toWei(bet, 'ether')
            }, (err, result) => {



            })
        }
    }

    render() {
        return (
            <div className="main-container">
                <h1>Bet for your best number and win huge amounts of Ether</h1>

                <div className="block">
                    <b>Number of bets:</b> &nbsp;
                    <span>{this.state.numberOfBets}</span>
                </div>

                <div className="block">
                    <b>Last number winner:</b> &nbsp;
                    <span>{this.state.lastWinner}</span>
                </div>

                <div className="block">
                    <b>Total ether bet:</b> &nbsp;
                    <span>{this.state.totalBet} ether</span>
                </div>

                <div className="block">
                    <b>Minimum bet:</b> &nbsp;
                    <span>{this.state.minimumBet} ether</span>
                </div>

                <hr/>

                <h2>Vote for the next number</h2>

                <label>
                    <b>How much Ether do you want to bet? <input className="bet-input" ref="ether-bet" type="number" placeholder={this.state.minimumBet}/></b> ether
                    <br/>
                </label>

                <ul>
                    <li onClick={() => {this.voteNumber(3)}}>3</li>
                    <li onClick={() => {this.voteNumber(6)}}>6</li>
                    <li onClick={() => {this.voteNumber(9)}}>9</li>
                    <li onClick={() => {this.voteNumber(12)}}>12</li>
                    <li onClick={() => {this.voteNumber(15)}}>15</li>
                    <li onClick={() => {this.voteNumber(18)}}>18</li>
                    <li onClick={() => {this.voteNumber(21)}}>21</li>
                    <li onClick={() => {this.voteNumber(24)}}>24</li>
                    <li onClick={() => {this.voteNumber(27)}}>27</li>
                    <li onClick={() => {this.voteNumber(30)}}>30</li>
                    <li onClick={() => {this.voteNumber(33)}}>33</li>
                    <li onClick={() => {this.voteNumber(36)}}>36</li>
                </ul>
                <ul>
                    <li onClick={() => {this.voteNumber(2)}}>2</li>
                    <li onClick={() => {this.voteNumber(5)}}>5</li>
                    <li onClick={() => {this.voteNumber(8)}}>8</li>
                    <li onClick={() => {this.voteNumber(11)}}>11</li>
                    <li onClick={() => {this.voteNumber(14)}}>14</li>
                    <li onClick={() => {this.voteNumber(17)}}>17</li>
                    <li onClick={() => {this.voteNumber(20)}}>20</li>
                    <li onClick={() => {this.voteNumber(23)}}>23</li>
                    <li onClick={() => {this.voteNumber(26)}}>26</li>
                    <li onClick={() => {this.voteNumber(29)}}>29</li>
                    <li onClick={() => {this.voteNumber(32)}}>32</li>
                    <li onClick={() => {this.voteNumber(35)}}>35</li>
                </ul>
                <ul>
                    <li onClick={() => {this.voteNumber(1)}}>1</li>
                    <li onClick={() => {this.voteNumber(4)}}>4</li>
                    <li onClick={() => {this.voteNumber(7)}}>7</li>
                    <li onClick={() => {this.voteNumber(10)}}>10</li>
                    <li onClick={() => {this.voteNumber(13)}}>13</li>
                    <li onClick={() => {this.voteNumber(16)}}>16</li>
                    <li onClick={() => {this.voteNumber(19)}}>19</li>
                    <li onClick={() => {this.voteNumber(22)}}>22</li>
                    <li onClick={() => {this.voteNumber(25)}}>25</li>
                    <li onClick={() => {this.voteNumber(28)}}>28</li>
                    <li onClick={() => {this.voteNumber(31)}}>31</li>
                    <li onClick={() => {this.voteNumber(34)}}>34</li>
                </ul>
            </div>
        )
    }
}

ReactDOM.render(
    <App/>,
    document.querySelector('#root')
)
