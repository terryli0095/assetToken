const axios = require("axios");
const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/Pd3j9YfH7kWLXAS7Sayq"));
const Tx = require('ethereumjs-tx');

var gasLimit = 30000
const reigistryAddress = "0xe42f36007320ceef19b59bdf0e3d740d71c8e82e"

const registryABI = [{"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_rate","type":"uint256"}],"name":"setRate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_certifier","type":"bytes32"},{"name":"_certificateNumber","type":"bytes32"},{"name":"_caratWeight","type":"uint256"}],"name":"register","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"exists","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_caratWeight","type":"uint256"}],"name":"getCost","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"EtherUsdRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_caratWeight","type":"uint256"}],"name":"usdPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"diamondsInfo","outputs":[{"name":"certificateNumber","type":"bytes32"},{"name":"agency","type":"bytes32"},{"name":"caratWeight","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"removeFaultyToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_certifiers","type":"bytes32[]"},{"name":"_certificateNumbers","type":"bytes32[]"},{"name":"_caratWeights","type":"uint256[]"}],"name":"registerDiamonds","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[{"name":"_initialRate","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"tokenID","type":"uint256"},{"indexed":false,"name":"certifier","type":"bytes32"},{"indexed":false,"name":"certificateNumber","type":"bytes32"},{"indexed":false,"name":"caratWeight","type":"uint256"},{"indexed":false,"name":"registrant","type":"address"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"DiamondRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"tokenID","type":"uint256"},{"indexed":false,"name":"remover","type":"address"},{"indexed":false,"name":"removedFrom","type":"address"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"DiamondRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"payed","type":"uint256"},{"indexed":false,"name":"cost","type":"uint256"}],"name":"yep","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_approved","type":"address"},{"indexed":false,"name":"_tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_operator","type":"address"},{"indexed":false,"name":"_approved","type":"bool"}],"name":"ApprovalForAll","type":"event"}]

const registryInstance = web3.eth.contract(registryABI).at(reigistryAddress)

const PrivateKey ="97BAD0E89B4F26456B6880C650475954BF6A0A1B01690CE63637507D7CAF9165"
const owner = "0x670c7f3fb5c61b68438624e8f00077f782fff9d8"


async function update(){
    [err, result]  = await to( axios.get(
        "https://api.etherscan.io/api?module=stats&action=ethprice&apikey=YourApiKeyToken"
     ))
     if (err){
       console.log(err.message);
     }
     else{
       var newRate = result["data"]["result"]["ethusd"]*100;
     }
     let url = "https://ethgasstation.info/json/ethgasAPI.json";
     [err, gas] = await to(axios.get(url));
     let gasPrice = gas.data.safeLow*100000000;
     var callData = registryInstance.setRate.getData(newRate);
     console.log(callData);
     signTransaction(callData, PrivateKey, gasPrice, gasLimit, reigistryAddress, function(err,hash){
       console.log(hash)
       console.log(err)
     });
}




// 
function to(promise) {
   return promise.then(data => {
      return [null, data];
   })
   .catch(err => [err]);
}





function signTransaction(_callData,_privateKey,_gasPrice,_gasLimit,_to, callback){
  var privateKey = new Buffer(_privateKey, 'hex')
  var nonce = web3.eth.getTransactionCount(owner, 'pending');
  console.log('nonce: ' + nonce);
  var nonceHex = web3.toHex(nonce);
  var rawTx = {
    nonce: nonceHex,
    gasPrice: _gasPrice,
    gasLimit: _gasLimit ,
    to: _to,
    data: _callData
  }
  var tx = new Tx(rawTx);
  tx.sign(privateKey);
  var serializedTx = tx.serialize();
  web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), callback);
}

setInterval(update, 3600000*12)
