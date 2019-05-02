import React, {Component} from 'react';
import AppBarCustom from "../components/AppBarCustom";
import socketIOClient from "socket.io-client";
import Utils from '../utils/index';
import TypeSelector from '../components/TypeSelector';
import BetAmountField from '../components/BetAmountField';
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper';
import Games from '../components/Games'
import CircularProgress from '@material-ui/core/CircularProgress';
import {Typography} from '@material-ui/core';
import Reveal from '../components/Reveal'
import swal from 'sweetalert';
import GamesClosed from '../components/GamesClosed'


//const socket = socketIOClient('http://localhost:4001');
const styles = {
    Paper: {padding:20, marginTop: 10, marginBottom:10, marginLeft:10},
    GridCon: { height:'52vh', width: '100%'},
    imgStyle:{display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            width:160,
            height:160
}
};

/*
* TRXED:
    (base58) TDUxqD6iKDLU4f9B2hBVZdCogHPSuqvKew
    (hex) 41268907202a231d119288fb1b316b52093449249a

* */

const SECRET_HASH = "0xbce57ec951304d8c5b3d33595eafc715bfea643cc9281a7936f8ff37bf952bea"
const FOUNDATION_ADDRESS = 'TLYw2bgCDqHrMFVAcv6GnYMXPwfwcbhxLs';

// const socket = socketIOClient("http://192.168.0.138:4001");
// const dimStyle = {
//     width: '100%',
//     pointerEvents: 'none',
//     filter: 'brightness(50%)',
//     transition: '0.3s'
// };
// const normStyle = {
//     width: '100%',
//     transition: '0.3s'
// }
const contractAddress = "TXaztL5PnXieEzWWsmBWFpRnFJA7FQ74kc";//'TUNhBUhK5VjrnLs3mvJsA3YhT7cjF1hjCf'TFPEK3yFiMafKGefye8Huq2z7YvEtCWwVB;
let rpsContract
let valueMap = new Map();
let dealerHash;
let revealGame;
let heightOpenGames;
class Index extends Component{

    constructor(props) {
        super(props);
        
        valueMap.set("rock", 10);
        valueMap.set("paper", 20);
        valueMap.set("scissors",30);
        

        this.state= {
                betAmount:0,
                betChoice: "rock",
                contractValue:0,
                trxBalance:0,
                tronwebaddress:'',
                tronWeb: {
                installed: false,
                loggedIn: false,
                allGames : [],
                showGames: false,
                playerValue: 'rock',
                letsReveal:false,
                closedGames:[],
                hasGame:false,
                disabledDiv: false,
                overflow: 'hidden',
                height: 0,
                padding: 0,
                transform: 'scaleY(0)',
                cgOpenText: '+',
                ogOpenText: '+',
                overflowOpenGames: 'hidden',
                transformOpenGames: 'scaleY(0)',
                heightOpen: 0,
                paddingOpen: 0,
            }
                
        };
        this.letsPlay = this.letsPlay.bind(this);
        this.gamesGrid = this.gamesGrid.bind(this)
        this.AddGamesAndGrid = this.AddGamesAndGrid.bind(this);
        //this.revealFunc = this.revealFunc.bind(this);
    }

    async componentDidMount() {
        //TRONLINK TRX
        //-------------------------------------------------------------------------------------------------------------

        let TRX_BAL = 0;
        
        this.setState({loading:true})
        await new Promise(resolve => {
            const tronWebState = {
                installed: !!window.tronWeb,
                loggedIn: window.tronWeb && window.tronWeb.ready
            };

            if(tronWebState.installed) {
                this.setState({
                    tronWeb:
                    tronWebState
                });

                return resolve();
            }

            let tries = 0;

            const timer = setInterval(() => {
                if(tries >= 10) {
                    const TRONGRID_API = "https://api.shasta.trongrid.io";

                    window.tronWeb =  TronWeb(
                        TRONGRID_API,
                        TRONGRID_API,
                        TRONGRID_API
                    );

                    this.setState({
                        tronWeb: {
                            installed: false,
                            loggedIn: false
                        }
                    });

                    clearInterval(timer);
                    return resolve();
                }

                tronWebState.installed = !!window.tronWeb;
                tronWebState.loggedIn = window.tronWeb && window.tronWeb.ready;

                if(!tronWebState.installed)
                    return tries++;

                this.setState({
                    tronWeb: tronWebState
                });

                resolve();
            }, 100);
        });

        if(!this.state.tronWeb.loggedIn) {
            // Set default address (foundation address) used for contract calls
            // Directly overwrites the address object as TronLink disabled the
            // function call
            window.tronWeb.defaultAddress = {
                hex: window.tronWeb.address.toHex(FOUNDATION_ADDRESS),
                base58: FOUNDATION_ADDRESS
            };

            window.tronWeb.on('addressChanged', async() => {
                const tmp_tronwebaddress = Utils.tronWeb.address.fromHex(((await Utils.tronWeb.trx.getAccount()).address).toString())
                await this.setState({tronwebaddress : tmp_tronwebaddress});

               //console.log("tmp_tronwebaddress", tmp_tronwebaddress);
                TRX_BAL =await Utils.tronWeb.trx.getBalance(tmp_tronwebaddress);
                await this.setState({trxBalance: TRX_BAL});
                if(this.state.tronWeb.loggedIn)
                    return;

                this.setState({
                    tronWeb: {
                        installed: true,
                        loggedIn: true
                    }
                });
            });
        }

        await Utils.setTronWeb(window.tronWeb, contractAddress);
        const tmp_tronwebaddress = Utils.tronWeb.address.fromHex(((await Utils.tronWeb.trx.getAccount()).address).toString())
        await this.setState({tronwebaddress : tmp_tronwebaddress});

        console.log("tmp_tronwebaddress", tmp_tronwebaddress);
//  --------------------------------------------------------------------------------------------------------------------
        TRX_BAL =await Utils.tronWeb.trx.getBalance(this.state.tronwebaddress);
        await this.setState({trxBalance: TRX_BAL/1000000});
        console.log(TRX_BAL);

        let CONTRACT_BAL = await tronWeb.trx.getBalance("TRkUGYSyKp2NUsHGZUvSEWTc63Atbv8i7G");
        await this.setState({contractValue: CONTRACT_BAL});
        console.log(CONTRACT_BAL);
        
        console.log(dealerHash)


        await this.AddGamesAndGrid();
        this.checkIfReveal()
        this.startEventListener(tmp_tronwebaddress)
        
        // this.startCloseListener();
        


    };


    async AddGamesAndGrid(){
        let hexNum = await Utils.contract.maxgame().call();
        let decimalNum = Utils.tronWeb.toDecimal(hexNum);
        console.log(decimalNum)
        let tempGames = [];
        if (decimalNum>0){
        for(let i= 0; i<decimalNum;i++){
            tempGames.push(await Utils.contract.games(i+1).call()) ;
            console.log(await Utils.contract.games(i+1).call()) 
        }
        

        this.setState({allGames: tempGames})
       if(this.state.allGames.length == 0){
            this.setState({showGames: false})
        } else {
            for(let i = 0; i<this.state.allGames.length;i++){
                let name =''
                let final = ''
                let betValue = tronWeb.toDecimal(this.state.allGames[i].dealerValue)
                await tronWeb.trx.getAccount(this.state.allGames[i].dealer).then(res => {
                    let result = res.account_name;
                    if (result === undefined) {
                        console.log("undefined");
                        final = tronWeb.address.fromHex(res.address);
                    } else{
                        console.log("found Name");
                        final = tronWeb.toAscii(res.account_name)
                    }
                }).then(()=>{
                    this.state.allGames[i].dealerName = final 
                    this.state.allGames[i].dealerValue = betValue / 1000000
                    this.state.allGames[i].gameID = i+1  
                    
                      
                })
            }
            let closedGames=[];
            let openGames = [];
            for(let i=0; i<tempGames.length;i++){
                if(tempGames[i].closed){
                    closedGames.push(tempGames[i])
                } else{
                    openGames.push(tempGames[i])
                }
            }
            if(closedGames.length > 9){
                closedGames = closedGames.splice(-9)
            }
            this.setState({allGames:openGames, closedGames: closedGames})
            
                let gameAmount = openGames.length;
                let modularAmount;
                let rowAmount;
                let gridSpace;    
                if(gameAmount>4){
                    modularAmount = gameAmount % 4;
                    rowAmount = ((gameAmount - modularAmount) / 4) +1
                    gridSpace = rowAmount - 1    
                }else{
                    rowAmount = 1;
                }

                if(rowAmount>1){
                    heightOpenGames = (rowAmount * 268.8) + 40 + (gridSpace * 20);
                }else{
                    heightOpenGames = 308.8
                }
             this.setState({showGames: true}) 
        }
        

        }
        console.log( this.state.allGames);


        console.log(this.state.closedGames)
    };

    WaitingOpponent(){
        return (
            <div style={{ transition: 'all .2s ease-in-out'}}>
               <Typography component="h2" variant="headline" gutterBottom className={'TextStyle'}>
                            Waiting for Opponent
                        </Typography>
                        {this.loadingGrid()}
                        
            </div>
          )
    }
    
    checkIfReveal(){
        let tempArray = []
        for(let i = 0; i<this.state.allGames.length;i++){
            if(this.state.allGames[i].dealer == tronWeb.address.toHex(this.state.tronwebaddress)){
                tempArray.push(this.state.allGames[i])
            }
        }
        
        if(tempArray.length > 0){
            for(let i = 0; i<tempArray.length;i++){
                if(!tempArray[i].closed){
                    revealGame = tempArray[i]
                } 
            }

            console.log(revealGame)
            if (revealGame != null){
                this.setState({hasGame:true})
            }
            if(Utils.tronWeb.address.fromHex(revealGame.playerChoice) !== 0){
                this.setState({letsReveal:true})
            }
            


        }else{
            this.setState({hasGame:false})
        }
    }


     loadingGrid(){
            return (
                <div style = {{width: '100px', margin: '0px auto', marginTop: 25}}>
                  <CircularProgress color="secondary" style={{width:100, height:100}}/>
                </div>
              );
    }

     PlayerBet = async (dataFromPop, gameId, amount) =>{
        this.setState({playerValue:dataFromPop});
        console.log(dataFromPop);
        console.log(amount);
        console.log(gameId);
        let playerChoice =  valueMap.get(this.state.playerValue);
        console.log(playerChoice)
        // Utils.contract["JoinGame"]().watch(function(err, res) {
        //     console.log("error " + err);
        //     console.log('eventResult:',res);
        //   });
        
       let tx =  await Utils.contract.joinGame(gameId, playerChoice).send({
            shouldPollResponse:false,
            callValue:amount * 1000000
        })

        // let currentValue = await Utils.contract.maxgame().call()
        // let tronAddress; 
        // await Utils.trx.getAccount().then(res => {
        //     tronAddress = tronWeb.address.fromHex(res.address);
        // })
        // socket.emit("JoinRoom", gameId,tronAddress)
        // console.log(tx)
        await Utils.tronWeb.getEventByTransactionID(tx).then(res =>{
            console.log(res)
        });
    }
 
   startEventListener(address){
       console.log(address)
        
        Utils.contract.JoinGame().watch((err, {result}) =>{
    
        if(err){return console.log("Failed to bind the event : ", err);}
        if(result){
                console.log(result)
        }else{
            console.log(result)
        }
        })
    
        }

    startCloseListener(){
        Utils.contract.CloseGame().watch((err, {result}) =>{
    
        if(err){return console.log("Failed to bind the event : ", err);}
   
        if(result){
                console.log(result)
                if(result.result == 101 && tronWeb.address.toHex(this.state.tronwebaddress) == result.dealer){
                    swal({
                        title: "Successful",
                        text: "You have Won!",
                        icon: "success",
                        button: "Aww yiss!",
                      });
                }else if(result.result == 102 && tronWeb.address.toHex(this.state.tronwebaddress) == result.dealer){
                    swal({
                        title: "Nooooo",
                        text: "You have lost!",
                        icon: "error",
                        button: "Aww no!",
                      })
                }
                
        }else{
        }
        })
    
        }
    startRevealListener(){
        Utils.contract.Reveal().watch((err, {result}) =>{
    
        if(err){return console.log("Failed to bind the event : ", err);}
        if(result){
                console.log(result)
                swal({
                    title: "Successful",
                    text: "You have revealed, wait to see who won!",
                    icon: "success",
                    button: "Aww yiss!",
                  });
                  this.startCloseListener()
        }else{
        }
        })
    
        }        

    gamesGrid(){
        return (<div>
            <div  style={{    border: '2px solid white',borderRadius: 5, marginTop: 10, width:'100%'}}>
        <div style={{    border: '2px solid grey',borderRadius: 5, width:'20px', float:'right', marginTop:2,marginRight:5,height:29}} onClick = {()=>{
            if(this.state.allGames.length == 0){
                swal({
                    title: "Error",
                    text: "No open games available, try creating new game",
                    icon: "error",
                    button: "Aww no!",
                  });
            }else{
                
                

                if(this.state.overflowOpen == 'hidden'){
                    this.setState({overflowOpen:'auto', transformOpen: 'scaleY(1)', ogOpenText: '-',heightOpen:heightOpenGames,paddingOpen:20})
                } else{
                    this.setState({overflowOpen:'hidden', transformOpen: 'scaleY(0)', ogOpenText: '+',heightOpen:0,paddingOpen:0})
                }
            }
        }}>
            <Typography component="h2" variant="headline" gutterBottom className={'TextStyle'} style={{overflow:'unset',color:'white'}}>
                          {this.state.ogOpenText == null ? '+' : this.state.ogOpenText}
                        </Typography>
        </div>
        <Typography component="h2" variant="headline" gutterBottom className={'TextStyle'} style={{overflow:'unset'}}>
                          Open Games
                        </Typography>
                        </div>
        <div className={"GameContainer"}  style={{transform:this.state.transformOpen,height:this.state.heightOpen,padding:this.state.paddingOpen}}>
        {
            this.state.allGames.map((game, index) => {
            return (<Games
            name={game.dealerName}
            betValue = {game.dealerValue}
            gameId = {game.gameID}
            callbackFromParent = {this.PlayerBet}
            />)
            }
          )
        }
        </div>
        <div  style={{    border: '2px solid white',borderRadius: 5, marginTop: 25, width:'100%'}}>
        <div style={{    border: '2px solid grey',borderRadius: 5, width:'20px', float:'right', marginTop:2,marginRight:5,height:29}} onClick = {()=>{
            if(this.state.closedGames.length == 0){
                swal({
                    title: "Error",
                    text: "No open games available, try creating new game",
                    icon: "error",
                    button: "Aww no!",
                  });
            }else{
                
                if(this.state.overflow == 'hidden'){
                    this.setState({overflow:'auto', transform: 'scaleY(1)', cgOpenText: '-',height:'1683px',padding:20})
                } else{
                    this.setState({overflow:'hidden', transform: 'scaleY(0)', cgOpenText: '+',height:0,padding:0})
                }
            }
        }}>
            <Typography component="h2" variant="headline" gutterBottom className={'TextStyle'} style={{overflow:'unset',color:'white'}}>
            {this.state.cgOpenText == null ? '+' : this.state.cgOpenText}
                        </Typography>
        </div>
        <Typography component="h2" variant="headline" gutterBottom className={'TextStyle'} style={{overflow:'unset'}}>
                          Closed Games
                        </Typography>
                        </div>
        <div className={"GameClosedContainer"} style={{transform:this.state.transform,height:this.state.height,padding:this.state.padding}}>
        {
            this.state.closedGames.map((game) => {
            return (<GamesClosed
            name={game.dealerName}
            betValue = {game.dealerValue}
            gameId = {game.gameID}
            game = {game}
            gameValue = {Utils.tronWeb.address.fromHex(game.gameValue)}
            callbackFromParent = {this.PlayerBet}
            />
          )
        })}
            
        </div>
        </div>)
    }

     revealFunc =async (game) =>{
        try {
            await Utils.contract.reveal(game.gameID,10,SECRET_HASH).send({
                shouldPollResponse:true
            }).then(res=>{
                console.log("Done", res)
            }).then(res=>{
                this.startRevealListener();
            })
        } catch (error) {
            console.log(error)
        }
    }

    revealGameGrid(game){
        return (
            <div className ={"RevealContainer"}>
            <Typography component="h2" variant="headline" gutterBottom className={'TextStyle'}>
                            Time To Reveal
                        </Typography>
                <Reveal
            name={game.dealerName}
            betValue = {game.dealerValue}
            gameId = {game.gameID}
            game = {game}
            onClickButton = {this.revealFunc}
            />
            </div>
        )
    }

    noGameActive(){
        return (
            <div className ={"RevealContainer"}>
            <Typography component="h2" variant="headline" gutterBottom className={'TextStyle'}>
                            Time To Reveal
                        </Typography>
               
            </div>
        )
    }

 

    betAmountOnChange = event => {
        console.log(event.target.value);
        let value = event.target.value;
        this.setState({betAmount: value })
    };

    typeSelectorChange = (value) => {
        console.log(value)
        this.setState({betChoice: value});
    }

    async letsPlay(){
        
        try {
            this.setState({showGames: false}) ;
            let value = valueMap.get(this.state.betChoice)
            console.log(await Utils.contract.maxgame().call());
            dealerHash = await Utils.contract.getProof(this.state.tronwebaddress,value, SECRET_HASH).call()
            console.log(dealerHash)
            let dealerHashObj = new String(dealerHashObj)
           await Utils.contract.createGame(dealerHash, this.state.betAmount * 1000000).send({
                shouldPollResponse:true,
                callValue:this.state.betAmount * 1000000
            }).then(res=>{
                console.log("Successfull")
                
              // console.log( Utils.contract.maxgame().call());
                this.AddGamesAndGrid()

            })
        } catch (error) {
            console.log(error)
        }
     }
    render(){
        const { response } = this.state;

        return(
            <AppBarCustom contractValue = {this.state.contractValue}>

                <style jsx global>{`
                html {
                    overflow-y: scroll;
                  }
      body{
        background-image: url('../static/images/back.jpeg');
     overflow: 
      }
      .MuiRadio-root-95 {
    color: rgb(255, 255, 255);
}
.MuiTypography-body2-45 {
    color: rgba(255, 255, 255, 0.87);
    font-size: 0.875rem;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0.01071em;
}

.TextStyle{
    font-family: serif;
    color: rgb(187, 114, 114);
    text-align: center;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    user-select:none;
}

.MainDiv{
    border: 2px solid grey;
    border-radius: 9px;
     display:flex;
}
.imageCenter{ 
    display: block;
    margin-left: auto;
    margin-right: auto;
    width:120px; 
    height:120px;
}

 .GameDiv {
    border: 2px solid white;
    border-radius: 9px;
    margin-top: 15px;
    padding: 5px;
    width: 200px;
    margin: 0 auto;
 }
 .GameClosedContainer{
    display: grid;
    grid-gap: 20px;
    grid-template-columns: auto auto auto;
    padding: 10px;
    transition: all 1s ease-in-out;
    transform-origin: left top;
    transform: scaleY(0);
    overflow: hidden;
    height: 0;
    padding: 0;
    transform: scaleY(0);
 }
 .GameContainer{
    display: grid;
    grid-gap: 20px;
    grid-template-columns: auto auto auto auto;
    padding: 10px;
    transition: all 1s ease-in-out;
    transform-origin: left top;
    transform: scaleY(0);
    overflow: hidden;
    height: 0;
    padding: 0;    
    transform: scaleY(0);
 }

 .RevealContainer{
    display: inline-block;
    margin: 0px auto;
    width: 100%;
    transition: all .2s ease-in-out;
 }

    `}</style>

                <div style={{height:'calc(100vh - 78px)',  paddingTop: '3.89%', width:'71%', margin: '0 auto'}}>
                    <div style={{width:120, margin: '0px auto'}}><img src= "../static/images/rpsLogo.png" style={{width:240}}/></div>
                    <div className={"MainDiv"}>
                        <div style={{width:"50%", borderRight: '0.2em solid white', padding:"0.5em"}}>
                        <TypeSelector  onSelectButton = {this.typeSelectorChange}/>
                        <BetAmountField onChange = {this.betAmountOnChange}/>
                        <Button variant="contained" color="default" style={{marginTop:15, marginLeft:15}} onClick={this.letsPlay}>
                            Play!
                        </Button>
                        </div>
                        <div style = {{width:'49%'}}>
                        {this.state.hasGame && this.state.letsReveal ? this.revealGameGrid(revealGame) :
                        this.state.hasGame ? this.WaitingOpponent() :
                        this.noGameActive()
                        }
                       
                        
                        </div>
                        
                    </div>
                              {this.state.showGames ? this.gamesGrid() : this.loadingGrid()}  
                </div>

            </AppBarCustom>


        )
    }
}


export default Index;

