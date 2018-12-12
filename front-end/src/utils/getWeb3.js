import Web3 from 'web3';

const provider = 'https://kovan.infura.io/v3/1edf94718018482aa7055218e84486d7';

let getWeb3 = new Promise(function(resolve, reject) {
  window.addEventListener('load', function() {
    let results;
    let web3 = window.web3;

    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);

        results = {
            web3: web3
        };

        console.log('Detect metamask or provider');

        resolve(results);
    } else {
        const provider = new Web3.providers.HttpProvider(provider);

        web3 = new Web3(provider);

        results = {
            web3: web3
        };

        console.log('No web3 instance injected, using Local web3.');

        resolve(results);
    }})
})

export default getWeb3;