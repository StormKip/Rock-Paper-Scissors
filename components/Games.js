import React, {Component} from 'react';
import {Paper,Button, Typography} from '@material-ui/core';
import TrxIcon from './TrxIcon'
import PlayPopover from './PlayPopover';

class Games extends Component{

    constructor(props) {
        super(props);
        this.state= {
            betValue:'',
            style:{
               
            },

        }

    }
    callbackFromGames = (value) =>{
   
        this.props.callbackFromParent(value, this.props.gameId, this.props.betValue)
    }
    // style={this.state.style}
    // onMouseEnter={this.mouseEnter}
    // onMouseLeave={this.mouseLeave}
    // onClick={this.mouseClick }
    // disabled={this.state.button} 
    render(){

        return(
          <div class= 'GameDiv'>
          <div>
          <Typography variant="caption" gutterBottom style={{color:'white', width:'50%'}}>
            <div style= {{width:'20%',float: 'left'}}>
            <TrxIcon/>
            </div><label style={{padding:5}}>{this.props.betValue}</label>
            <label style={{padding:5, float:'right'}}>{this.props.gameId}</label>
        </Typography>
        <div>
            <Typography component="h2" variant="headline" gutterBottom style={{
                color:'#bb7272', 
                textAlign: 'center', 
                width:'100%',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
                }}>
            {this.props.name}
        </Typography>
        </div>
            
          </div>
           
        <div>
          <img class = 'imageCenter' src={"../static/images/reveal2.png"} style={{}}/>
          <div style={{ padding: 15, textAlign: 'center'}}>
             <PlayPopover  callbackFromGamesParent = {this.callbackFromGames}/>
            </div>
          
            </div>
            
          </div>)}
}
export default Games;


