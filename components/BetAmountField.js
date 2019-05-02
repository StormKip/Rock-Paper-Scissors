import React from 'react';
import PropTypes from 'prop-types';
import { withStyles} from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';

import blueGrey from '@material-ui/core/colors/blueGrey';


const styles = theme => ({
    container: {
        display: 'contents',
        flexWrap: 'wrap',
        width:300,
        float:'left',
    },
    margin: {
        margin: theme.spacing.unit,
    },
    cssLabel: {
        color:'white',
        '&$cssFocused': {
            color: 'grey',
        },
    },
    cssFocused: {},
    cssUnderline: {
        '&:after': {
            borderBottomColor: 'grey',
        },
    },
    cssOutlinedInput: {
        '&$cssFocused $notchedOutline': {
            fontColor: 'white',
            borderColor: 'grey',
        },
    },
    notchedOutline: { borderColor: 'white'},
    betAmount: {
        borderColor: "rgb(255, 255, 255)"
    }

});
let value;
class BetAmountField extends React.Component {
    constructor(props){
        super(props)

    }




    render(){
        const { classes } = this.props;

        return (

            <div className={classes.container}>
                <style jsx global>{`
      .MuiOutlinedInput-root-199 .MuiOutlinedInput-notchedOutline-206{
        border-color: white;

      }
.MuiInputBase-input-222 {
        color:white}
        fieldset{
            border-color: rgb(255, 255, 255);}
    `}</style>
                <TextField

                    className={`${classes.margin} "BetAmountBorder"`}
                    InputLabelProps={{
                        classes: {
                            root: classes.cssLabel,
                            focused: classes.cssFocused,
                        },
                    }}
                    {...this.props}
                    InputProps={{
                        classes: {
                            root: classes.cssOutlinedInput,
                            focused: classes.cssFocused,
                            notchedOutline: classes.notchedOutline,
                            betAmount: classes.betAmount
                        },
                    }}

                    label="Bet Amount"
                    variant="outlined"
                    id="Button-input"
                />
            </div>
        );
    }
}


BetAmountField.propTypes = {
    onChange: PropTypes.func.isRequired,

    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(BetAmountField);