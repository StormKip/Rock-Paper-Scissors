const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();
app.use(index);
const server = http.createServer(app);
const io = socketIo(server);
const contractAdd = 'TRkUGYSyKp2NUsHGZUvSEWTc63Atbv8i7G';
const TronWeb = require("tronweb") ;
const Utils = {
    tronWeb: false,
    contract: false,

    async setTronWeb(tronWeb, contractAddress) {
        console.log('contractAddress', contractAddress)
        this.tronWeb = tronWeb;
        this.contract = await tronWeb.contract().at(contractAddress)
    },

};
/*  TRXED:
    (base58) TRkUGYSyKp2NUsHGZUvSEWTc63Atbv8i7G
    (hex) 41ad195969012e704db0485e5e69683773af86b7a9
*/


const TRONGRID_API = "https://api.shasta.trongrid.io";


//  function getNum(){
//     io.sockets.emit('FromAPI', 'Preparing')
//     return Utils.contract.generateRandNum().send({
//         shouldPollResponse: true,
//         callValue:0
//     })
// }

  async function start(){
      availJoin = false
     const HttpProvider = TronWeb.providers.HttpProvider;
     const fullNode = new HttpProvider(TRONGRID_API); // Full node http endpoint
     const solidityNode = new HttpProvider(TRONGRID_API); // Solidity node http endpoint
     const eventServer = new HttpProvider(TRONGRID_API); // Contract events http endpoint
     const privateKey = '0bed40c9021ded4ac8ab1e42b36aa203df2fa0738b6da6afe6efdee5f57978be';
     const tronWeb = new TronWeb(
         fullNode,
         solidityNode,
         eventServer,
         privateKey
     );

   
      io.on("connection", socket => {
          socket.emit("FromAPI", "HelloWorld")

          socket.on("connectToRoom", (roomID) =>{
            socket.join("room-"+roomID);

            io.sockets.in("room-"+roomID).emit("connected", "You are in room" +roomID)
          })

          socket.on("JoinGame", (gameId, playerAddress) =>{
                game = await Utils.contract.games(gameId).call();
                await tronWeb.trx.getAccount(game.dealer).then(res => {
                    dealerAddress = tronWeb.address.fromHex(res.address);
                })
                socket.join("room-"+dealerAddress)
                io.sockets.in("room-"+dealerAddress).emit('TimeToReveal', playerAddress);
          })
      })

}






start();
server.listen(process.env.PORT || 4001);
