import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import './../css/index.css'
import {Badge, Button, ButtonGroup, Col, Row} from 'reactstrap';


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

        let roulette = JSON.parse(this.readTextFile("/Roulette-Ethereum/build/contracts/Roulette.json"));
        const MyContract = web3.eth.contract(roulette["abi"]);
        this.state.ContractInstance = MyContract.at("0xd1a9d9ac8D7212aa83C22b0d74AC07d9B971339f")

        window.a = this.state
    }

    readTextFile(file) {
        let rawFile = new XMLHttpRequest();
        let allText = null;
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status == 0) {
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
                <h1><Badge color="success">Roulette with Ethereum</Badge></h1>
                <div className="block">
                    <b>Total ether bet:</b> &nbsp;
                    <span>{this.state.totalBet} ether</span>
                </div>

                <div className="block">
                    <b>Minimum bet:</b> &nbsp;
                    <span>{this.state.minimumBet} ether</span>
                </div>

                <hr/>
                <Roulette/>
            </div>

        )
    }
}

class Roulette extends React.Component {
    constructor(props) {
        super(props);

        this.state = {cSelected: []};

        this.onCheckboxBtnClick = this.onCheckboxBtnClick.bind(this);
    }

    onCheckboxBtnClick(selected) {

        const index = this.state.cSelected.indexOf(selected);
        if (index < 0) {
            this.state.cSelected.push(selected);
        } else {
            this.state.cSelected.splice(index, 1);
        }
        this.setState({cSelected: [...this.state.cSelected]});

        this.app.voteNumber(selected);
    }


    render() {
        var rows1 = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
        var rows2 = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
        var rows3 = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];

        var printRow1 = [];
        var printRow2 = [];
        var printRow3 = [];
        for (var i = 1; i <= 36; i++) {
            var color = "danger";

            if (i % 2 == 0) {
                color = "success";
            } else {
                color = "danger";
            }


            if (rows1.includes(i)) {
                printRow1.push(
                    <Col xs="1">
                        <Button color={color} onClick={() => this.onCheckboxBtnClick(i)}
                                active={this.state.cSelected.includes({i})}>{i}</Button>
                    </Col>
                );
            }

            if (rows2.includes(i)) {
                printRow2.push(
                    <Col xs="1">
                        <Button color={color} onClick={() => this.onCheckboxBtnClick(i)}
                                active={this.state.cSelected.includes({i})}>{i}</Button>
                    </Col>
                );
            }

            if (rows3.includes(i)) {
                printRow3.push(
                    <Col xs="1">
                        <Button color={color} onClick={() => this.onCheckboxBtnClick(i)}
                                active={this.state.cSelected.includes({i})}>{i}</Button>
                    </Col>
                );
            }
        }

        return (
            <div>
                <Row>
                    <Col>
                        <Row>
                            <Col xs="1">
                                <Button color="success" size="lg" block style={{width: "100%"}}>0</Button>
                            </Col>
                            <Col xs="10">
                                <Row>
                                    <ButtonGroup>
                                        {printRow1}
                                    </ButtonGroup>
                                </Row>
                                <Row>
                                    <ButtonGroup>
                                        {printRow2}
                                    </ButtonGroup>
                                </Row>
                                <Row>
                                    <ButtonGroup>
                                        {printRow3}
                                    </ButtonGroup>
                                </Row>

                            </Col>
                            <Col xs="1">
                                <Row><Button color="success" style={{width: "100%"}}>2 TO 1</Button></Row>
                                <Row><Button color="success" style={{width: "100%"}}>2 TO 1</Button></Row>
                                <Row><Button color="success" style={{width: "100%"}}>2 TO 1</Button></Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="1"></Col>
                            <Col xs="3">
                                <Button color="success" size="lg" block style={{width: "100%"}}>1st 12</Button>
                            </Col>
                            <Col xs="3">
                                <Button color="success" size="lg" block style={{width: "100%"}}>2nd 12</Button>
                            </Col>
                            <Col xs="3">
                                <Button color="success" size="lg" block style={{width: "100%"}}>3rd 12</Button>
                            </Col>
                            <Col xs="1"></Col>
                        </Row>
                        <Row>
                            <Col xs="1"></Col>
                            <Col xs="2"><Button color="success" size="lg" block style={{width: "100%"}}>1 TO
                                18</Button></Col>
                            <Col xs="2"><Button color="success" size="lg" block
                                                style={{width: "100%"}}>EVEN</Button></Col>
                            <Col xs="2"><Button color="success" size="lg" block
                                                style={{width: "100%"}}>ODD</Button></Col>
                            <Col xs="2"><Button color="success" size="lg" block style={{width: "100%"}}>19 TO
                                36</Button></Col>
                            <Col xs="1"></Col>
                        </Row>
                    </Col>
                </Row>
                <p>Selected: {JSON.stringify(this.state.cSelected)}</p>
            </div>
        )
    }
}

ReactDOM.render(
    <App/>,
    document.querySelector('#root')
)
