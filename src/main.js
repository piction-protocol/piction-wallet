// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import queryString from 'query-string'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false;
Vue.use(BootstrapVue);

const parsed = queryString.parse(location.search);

web3.eth.getAccounts((err, account) => {
  web3.version.getNetwork((err, netId) => {
    const networks = [null, 'mainnet', 'morden', 'ropsten'];
    Vue.mixin({
      data() {
        return {
          network: networks[parseInt(netId)],
        }
      },
      methods: {
        getEtherscanURL(path) {
          if (this.network == 'mainnet') {
            return `https://etherscan.io${path}`
          } else {
            return `https://${this.network}.etherscan.io${path}`
          }
        },
      },
    })

    new Vue({
      el: '#app',
      components: {App},
      data: {
        account: account[0],
        address: parsed.address
      },
      template: '<App/>',
      created() {
        web3.currentProvider.publicConfigStore.on('update', (provider) => {
          if (this.account.toLowerCase() != provider.selectedAddress.toLowerCase()) {
            window.location.reload()
          }
        });
      }
    })
  });
});
