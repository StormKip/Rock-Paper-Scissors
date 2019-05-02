import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const styles = theme => ({
    root: {
        display: 'flex',
    },
    formControl: {
        margin: theme.spacing.unit * 3,
    },
    group: {
        margin: `${theme.spacing.unit}px 0`,
    },
});

class RadioButtonsGroup extends React.Component {
    state = {
        value: 'rock',
    };

    handleChange = event => {
        this.setState({ value: event.target.value });
        this.props.onSelectButton(event.target.value);
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <FormControl component="fieldset" className={classes.formControl}>
                    <FormLabel component="legend" style={{color: "white"}}>Select Pick</FormLabel>
                    <RadioGroup
                        aria-label="Select Pick"
                        name="pick1"
                        className={classes.group}
                        value={this.state.value}
                        onChange={this.handleChange}

                    >
                        <FormControlLabel
                            value="rock"
                            control={<Radio/>}
                            label="Rock"
                        />
                        <FormControlLabel
                            value="paper"
                            control={<Radio />}
                            label="Paper"
                        />
                        <FormControlLabel
                            value="scissors"
                            control={<Radio />}
                            label="Scissors"
                        />

                    </RadioGroup>

                </FormControl>
                <img src={`../static/images/${this.state.value}1.png`} style={{width:150, height:150, marginTop:35, marginLeft:20, float:"right"}}/>
            </div>
        );
    }
}

RadioButtonsGroup.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RadioButtonsGroup);