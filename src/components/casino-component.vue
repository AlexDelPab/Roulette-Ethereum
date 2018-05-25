<template>
    <b-container class="bv-example-row">
        <b-row>
            <b-col>
                <h1>
                    <b-badge variant="success">Welcome to the new World of Roulette</b-badge>
                </h1>
            </b-col>
        </b-row>
        <b-row class="mb-3">
            <b-col>
                Amount to bet: <input v-model="amount" placeholder="0 Ether">
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-button v-if="n % 2 == 0" variant="success" v-on:click="clickNumber" v-for="n in 36">
                    {{n}}
                </b-button>
                <b-button v-else variant="danger" v-on:click="clickNumber">
                    {{n}}
                </b-button>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    export default {
        name: 'casino',
        data() {
            return {
                amount: null,
                pending: false,
                winEvent: null
            }
        },
        methods: {
            clickNumber(event) {
                console.log('BETTING ON NUMBER, AMOUNT', event.target.innerHTML, this.amount)
                this.winEvent = null
                this.pending = true
                this.$store.state.contractInstance().bet(event.target.innerHTML, {
                    gas: 300000,
                    value: this.$store.state.web3.web3Instance().toWei(this.amount, 'ether'),
                    from: this.$store.state.web3.coinbase
                }, (err, result) => {
                    if (err) {
                        console.log(err)
                        this.pending = false
                    } else {
                        let Won = this.$store.state.contractInstance().Won()
                        Won.watch((err, result) => {
                            if (err) {
                                console.log('could not get event Won()')
                            } else {
                                this.winEvent = result.args
                                this.winEvent._amount = parseInt(result.args._amount, 10)
                                this.pending = false
                            }
                        })
                    }
                })
            },
        },
        mounted() {
            console.log('dispatching getContractInstance')
            this.$store.dispatch('getContractInstance')
        }
    }
</script>
