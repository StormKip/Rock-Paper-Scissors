import TronWeb from 'tronweb'

const fullNode = 'https://api.shasta.io';
const solidityNode = 'https://api.shashta.io';
const eventServer = 'https://api.shasta.io/';
const privateKey = '0bed40c9021ded4ac8ab1e42b36aa203df2fa0738b6da6afe6efdee5f57978be';

const tronWeb = new TronWeb(
    fullNode,
    solidityNode,
    eventServer,
    privateKey
);