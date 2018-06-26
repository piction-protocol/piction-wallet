<template>
  <div align="left" class="receipt">
    <b-card :title="productName">
      <hr>
      <div>구매 ID : {{receipt.order_id}}</div>
      <div>참여이더 : {{receipt.etherAmount / Math.pow(10, 18)}} ETH</div>
      <div>지급토큰 : {{receipt.amount / Math.pow(10, 18)}} PXL</div>
      <b-alert align="center" class="state" show :variant="stateLabelColor">{{stateLabelName}}</b-alert>
    </b-card>
  </div>
</template>

<script>
  import Web3 from 'web3'
  import abi from './../assets/abi/Product.json';
  import moment from 'moment'

  export default {
    name: 'Receipt',
    props: ['receipt', 'criterionTime'],
    components: {},
    data() {
      return {
        contract: null,
        productName: null,
        stateLabelName: null,
        stateLabelColor: null,
        lockup: null
      }
    },
    methods: {
      setProductName() {
        this.contract.methods.name().call((err, name) => {
          this.productName = name;
        });
      },
      setState() {
        this.contract.methods.lockup().call((err, lockup) => {
          this.lockup = lockup;
          if (this.receipt.refund) {
            this.stateLabelName = '환불';
            this.stateLabelColor = 'danger';
          } else if (this.receipt.release) {
            this.stateLabelName = '지급완료';
            this.stateLabelColor = 'primary';
          } else {
            if (this.criterionTime == 0) {
              this.stateLabelName = `대기 (상장 ${lockup}일 후 지급)`;
              this.stateLabelColor = 'warning';
            } else {
              let unlockTime = Number(this.criterionTime)
                + Number(lockup * 24 * 60 * 60 * 1000);
              this.stateLabelName = moment(unlockTime).format('YYYY년 MM월 DD일 지급예정')
              this.stateLabelColor = 'dark';
            }
          }
        });
      }
    },
    created() {
      web3 = new Web3(web3.currentProvider);
      this.contract = new web3.eth.Contract(abi, this.receipt.product);
      this.setProductName();
      this.setState()
    },
  }
</script>

<style>
  .receipt {
    margin-bottom: 10px;
  }
  .state {
    margin-top: 14px;
    margin-bottom: 0px;
  }
</style>
