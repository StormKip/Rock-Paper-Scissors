import React, {Component} from 'react';
import {Paper,Button, Typography} from '@material-ui/core';
import TrxIcon from './TrxIcon'
class GamesClosed extends Component{

    constructor(props) {
        super(props);
        
        let rock = '../static/rock.png';
        let paper = '../static/paper.png';
        let scissors = '../static/scissors.png'
        this.state= {
            betValue:'',
            style:{
               
            },

        }
      

    }
    callbackFromGames = (value) =>{
   
        this.props.callbackFromParent(value, this.props.gameId, this.props.betValue)
    }
    // DEALERWIN  =  201;
    // PLAYERWIN = 102;
    // DRAW = 101;
checkChoice(value){
    if(value == 10){
        return '../static/images/rock1.png'
    } else if(value == 20){
        return  '../static/images/paper1.png'
    } else if(value == 30){
        return '../static/images/scissors1.png'
    }

}

    dealerResult(){
        let game = this.props.game;
        let result = game.result;
        let dealerChoice  = this.checkChoice(game.dealerChoice);
        let playerChoice = this.checkChoice(game.playerChoice);
        let loose = '../static/images/loose.png';
        let win = '../static/images/win.png';
        let draw = '../static/images/draw.png';
        let gameValue = this.props.gameValue;

        if(result == 201){
            return(<div>
                <div >
                <div style={{width:'100%'}}>
                 <Typography component="h2" variant="headline" gutterBottom className={'TextStyle'} style={{textAlign:'left'}}>
                    {game.dealerName}
                 </Typography>    
                </div>
                
         <img class = 'imageCenter' src={win} style={{width:'80px',height:'80px'}}/>
         </div>
                <div>
                  <Typography component="h2" variant="headline" gutterBottom className={'TextStyle'} style={{textAlign:'left', float:'left', width:71,marginTop:30}}>
                    Winner
                 </Typography>    
                  <img src={dealerChoice} style={{width: 60, height: 60,marginTop: 15,  marginLeft: 25}}/>
                  </div>
                  <img class = 'imageCenter' src={playerChoice} style={{width:'60px',height:'60px', marginTop:5}}/>  
                  
                  {/* <img class = 'imageCenter' src={playerChoice} style={{width:'60px',height:'60px', marginTop:15}}/> */}
                  
                  <div >
         <img class = 'imageCenter' src={loose} style={{width:'80px',height:'80px', marginTop:5}}/>
         <div style={{width:'100%'}}>
                 <Typography component="h2" variant="headline" gutterBottom className={'TextStyle'} style={{textAlign:'left'}}>
                    Player
                 </Typography>    
                </div>
         </div>
         <div style={{width:'100%'}}>
                 <Typography component="h2" variant="headline" gutterBottom className={'TextStyle'} style={{textAlign:'center', color:'azure'}}>
                    Bet = {gameValue/1000000}TRX
                 </Typography>    
                </div> 
                      
             </div>)
        } else if(result ==102){
            return(<div>
                <div >
                <div style={{width:'100%'}}>
                 <Typography component="h2" variant="headline" gutterBottom className={'TextStyle'} style={{textAlign:'left'}}>
                    {game.dealerName}
                 </Typography>    
                </div>
                
         <img class = 'imageCenter' src={loose} style={{width:'80px',height:'80px'}}/>
         </div>
                  <img class = 'imageCenter' src={dealerChoice} style={{width:'60px',height:'60px', marginTop:5}}/>  
                  <div>
                  <Typography component="h2" variant="headline" gutterBottom className={'TextStyle'} style={{textAlign:'left', float:'left', width:71,marginTop:30}}>
                    Winner
                 </Typography>    
                  <img src={playerChoice} style={{width: 60, height: 60,marginTop: 15,  marginLeft: 25}}/>
                  </div>
                  {/* <img class = 'imageCenter' src={playerChoice} style={{width:'60px',height:'60px', marginTop:15}}/> */}
                  
                  <div >
         <img class = 'imageCenter' src={win} style={{width:'80px',height:'80px', marginTop:5}}/>
         <div style={{width:'100%'}}>
                 <Typography component="h2" variant="headline" gutterBottom className={'TextStyle'} style={{textAlign:'left'}}>
                    Player
                 </Typography>    
                </div>
                
         </div>
         <div style={{width:'100%'}}>
                 <Typography component="h2" variant="headline" gutterBottom className={'TextStyle'} style={{textAlign:'center', color:'azure'}}>
                    Bet = {gameValue/1000000}TRX
                 </Typography>    
                </div>  
             </div>)
        }else if(result ==101){
            return(<div>
                <div >
                <div style={{width:'100%'}}>
                 <Typography component="h2" variant="headline" gutterBottom className={'TextStyle'} style={{textAlign:'left'}}>
                    {game.dealerName}
                 </Typography>    
                </div>
                
         <img class = 'imageCenter' src={draw} style={{width:'80px',height:'80px'}}/>
         </div>
                  <img class = 'imageCenter' src={dealerChoice} style={{width:'60px',height:'60px', marginTop:5}}/>  
                  <img class = 'imageCenter' src={playerChoice} style={{width:'60px',height:'60px', marginTop:15}}/>
                  
                  <div >
         <img class = 'imageCenter' src={draw} style={{width:'80px',height:'80px', marginTop:5}}/>
         <div style={{width:'100%'}}>
                 <Typography component="h2" variant="headline" gutterBottom className={'TextStyle'} style={{textAlign:'left'}}>
                    Player
                 </Typography>    
                </div>
                
         </div>
         <div style={{width:'100%'}}>
                 <Typography component="h2" variant="headline" gutterBottom className={'TextStyle'} style={{textAlign:'center', color:'azure'}}>
                    Bet = {gameValue/1000000}TRX
                 </Typography>    
                </div>
                  
             </div>)
        }
    }

    playerResult(){
        let game = this.props.game;
        let result = game.result;
        let dealerChoice ;

        if(game.dealerChoice == 10){
            dealerChoice = rock
        } else if(game.dealerChoice == 20){
            dealerChoice = paper
        } else if(game.dealerChoice == 30){
            dealerChoice = paper
        }

        if(result == 201){
            return(<div>
               <label>{game.dealerName}</label> <img class = 'imageCenter' src={win} style={{width:'80px',height:'80px'}}/>
                 <img class = 'imageCenter' src={dealerChoice} style={{width:'60px',height:'60px'}}/>  <label>Win</label>
            </div>)
        }
    
    }

    // style={this.state.style}
    // onMouseEnter={this.mouseEnter}
    // onMouseLeave={this.mouseLeave}
    // onClick={this.mouseClick }
    // disabled={this.state.button} 
    render(){

        return(
          <div class= 'GameDiv' style={{width:250}}>
          <div>
          <Typography variant="caption" gutterBottom style={{color:'white', width:'50%'}}>
            <div style= {{width:'20%',float: 'left'}}>
            <TrxIcon/>
            </div><label style={{padding:5}}>{this.props.betValue}</label>
            <label style={{padding:5, float:'right'}}>{this.props.gameId}</label>
        </Typography>
        <div>
            <Typography component="h2" variant="headline" gutterBottom className={'TextStyle'}>
           Game Over
        </Typography>
                {this.dealerResult()};
                
        </div>
            
          </div>
           
        {/* <div>
          <div style={{ padding: 15, textAlign: 'center'}}>
             
            </div>
          
            </div> */}
            
          </div>)}
}
export default GamesClosed;


