<template>
    <b-container class="bv-example-row mt-5">
        <b-row>
            <b-col>
                <casino-component/>
                <hello-metamask/>
            </b-col>
        </b-row>
    </b-container>
</template>
<script>
    import HelloMetamask from '@/components/hello-metamask'
    import CasinoComponent from '@/components/casino-component'

    export default {
        name: 'casino-dapp',
        beforeCreate() {
            console.log('registerWeb3 Action dispatched from casino-dapp.vue')
            this.$store.dispatch('registerWeb3')
        },
        components: {
            'hello-metamask': HelloMetamask,
            'casino-component': CasinoComponent
        }
    }
</script>
<style scoped>
</style>
