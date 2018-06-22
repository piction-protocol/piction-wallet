<template>
  <div id="app">
    <h1>Piction Wallet</h1>
    <Receipt v-for="receipt in receiptList"
             :key="receipt.product"
             :receipt="receipt"
             :criterionTime="criterionTime"/>
    <b-alert v-if="receiptList.length == 0" show variant="primary">
      No data...
    </b-alert>
  </div>
</template>

<script>
  import Web3 from 'web3'
  import abi from './assets/abi/TokenDistributor.json';
  import Receipt from './components/Receipt'

  export default {
    name: 'App',
    components: {Receipt},
    data() {
      return {
        contract: null,
        account: null,
        criterionTime: null,
        receiptList: []
      }
    },
    methods: {
      getBuyerReceipt() {
        this.contract.methods.getBuyerReceipt(this.$root.account).call((err, result) => {

          const FIELD_PRODUCT = 0;
          const FIELD_AMOUNT = 1;
          const FIELD_ETHERAMOUNT = 2;
          const FIELD_RELEASE = 3;
          const FIELD_REFUND = 4;

          result[0].forEach((obj, index) => {
            this.receiptList.push({
              product: result[FIELD_PRODUCT][index],
              amount: result[FIELD_AMOUNT][index],
              etherAmount: result[FIELD_ETHERAMOUNT][index],
              release: result[FIELD_RELEASE][index],
              refund: result[FIELD_REFUND][index]
            });
          })
        });
      },
      setCriterionTime() {
        this.contract.methods.criterionTime().call((err, _criterionTime) => {
          this.criterionTime = _criterionTime;
        });
      }
    },
    created() {
      web3 = new Web3(web3.currentProvider);
      this.contract = new web3.eth.Contract(abi, this.$root.address);
      this.setCriterionTime()
      this.getBuyerReceipt()
    },
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin: 60px auto;
    max-width: 720px !important;
  }
</style>
