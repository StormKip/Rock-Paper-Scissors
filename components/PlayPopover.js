import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import RootRef from '@material-ui/core/RootRef';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import TypeSelector from './TypeSelector';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  // scrollContainer: {
  //   height: 400,
  //   overflow: 'auto',
  //   marginBottom: theme.spacing.unit * 3,
  // },
  scroll: {
    position: 'relative',
    width: '230%',
    backgroundColor: theme.palette.background.paper,
    height: '230%',
  },
  legend: {
    marginTop: theme.spacing.unit * 2,
    maxWidth: 300,
  },
  paper: {
    maxWidth: 400,
    overflow: 'auto',
    backgroundColor: '#a2a2a2'
  },
  select: {
    width: 200,
  },
  popper: {
    zIndex: 1,
    '&[x-placement*="bottom"] $arrow': {
      top: 0,
      left: 0,
      marginTop: '-0.9em',
      width: '3em',
      height: '1em',
      '&::before': {
        borderWidth: '0 1em 1em 1em',
        borderColor: `transparent transparent ${theme.palette.common.white} transparent`,
      },
    },
    '&[x-placement*="top"] $arrow': {
      bottom: 0,
      left: 0,
      marginBottom: '-0.9em',
      width: '3em',
      height: '1em',
      '&::before': {
        borderWidth: '1em 1em 0 1em',
        borderColor: `${theme.palette.common.white} transparent transparent transparent`,
      },
    },
    '&[x-placement*="right"] $arrow': {
      left: 0,
      marginLeft: '-0.9em',
      height: '3em',
      width: '1em',
      '&::before': {
        borderWidth: '1em 1em 1em 0',
        borderColor: `transparent ${theme.palette.common.white} transparent transparent`,
      },
    },
    '&[x-placement*="left"] $arrow': {
      right: 0,
      marginRight: '-0.9em',
      height: '3em',
      width: '1em',
      '&::before': {
        borderWidth: '1em 0 1em 1em',
        borderColor: `transparent transparent transparent ${theme.palette.common.white}`,
      },
    },
  },
  arrow: {
    position: 'absolute',
    fontSize: 7,
    width: '3em',
    height: '3em',
    '&::before': {
      content: '""',
      margin: 'auto',
      display: 'block',
      width: 0,
      height: 0,
      borderStyle: 'solid',
    },
  },
});

class AnchorPlayground extends React.Component {
  state = {
    arrow: false,
    arrowRef: null,
    disablePortal: false,
    flip: true,
    open: false,
    placement: 'bottom',
    preventOverflow: 'scrollParent',
    betChoice: 'rock'
  };

  handleChange = key => (event, value) => {
    this.setState({
      [key]: value,
    });
  };

  handleChangeTarget = key => event => {
    this.setState({
      [key]: event.target.value,
    });
  };

  handleClickButton = () => {
    this.setState(state => ({
      open: !state.open,
      betChoice: 'rock'
    }));
  };

  handlePlayClickButton = () => {
    this.props.callbackFromGamesParent(this.state.betChoice);

    this.setState(state => ({
      open: !state.open,
      betChoice: 'rock'
    }));
  };

  handleArrowRef = node => {
    this.setState({
      arrowRef: node,
    });
  };


  letsPlay = (value) =>{
    console.log(value)
    this.props.letsPlay(value)
  }

  centerScroll = ref => {
    if (!ref) {
      return;
    }

    const container = ref.parentElement;
    container.scrollTop = ref.clientHeight / 4;
    container.scrollLeft = ref.clientWidth / 4;
  };
  typeSelectorChange = (value) => {
    console.log(value)
    this.setState({betChoice: value});
}

  render() {
    const { classes } = this.props;
    const { open, placement, disablePortal, flip, preventOverflow, arrow, arrowRef } = this.state;

    const code = `
\`\`\`jsx
<Popper
  placement="${placement}"
  disablePortal={${disablePortal}}
  modifiers={{
    flip: {
      enabled: ${flip},
    },
    preventOverflow: {
      enabled: ${preventOverflow !== 'disabled'},
      boundariesElement: '${preventOverflow === 'disabled' ? 'scrollParent' : preventOverflow}',
    },
    arrow: {
      enabled: ${arrow},
      element: arrowRef,
    },
  }}
>
\`\`\`
`;
    const id = open ? 'scroll-playground' : null;

    return (
      <div className={classes.root}>
        <div className={classes.scrollContainer}>
              <div>
                <Button
                  buttonRef={node => {
                    this.anchorEl = node;
                  }}
                  variant="contained" color="secondary"
                  onClick={this.handleClickButton}
                  aria-describedby={id}
                >
                  Play
                </Button>
                {/* <Typography className={classes.legend}>
                  Scroll around this container to experiment with flip and preventOverflow
                  modifiers.
                </Typography> */}
                <Popper
                  id={id}
                  open={open}
                  anchorEl={this.anchorEl}
                  placement={placement}
                  disablePortal={disablePortal}
                  className={classes.popper}
                  modifiers={{
                    flip: {
                      enabled: flip,
                    },
                    arrow: {
                      enabled: arrow,
                      element: arrowRef,
                    },
                    preventOverflow: {
                      enabled: preventOverflow !== 'disabled',
                      boundariesElement:
                        preventOverflow === 'disabled' ? 'scrollParent' : preventOverflow,
                    },
                  }}
                >
                  {arrow ? <span className={classes.arrow} ref={this.handleArrowRef} /> : null}
                  <Paper className={classes.paper}>
                    <DialogTitle>{"Select Your Bet"}</DialogTitle>
                    <DialogContent>
                      <TypeSelector   onSelectButton = {this.typeSelectorChange}  style={{color:'white'}}/>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={this.handleClickButton} color="secondary">
                        Reverse
                      </Button>
                      <Button onClick={this.handlePlayClickButton} color="secondary">
                        Play !
                      </Button>
                    </DialogActions>
                  </Paper>
                </Popper>
              </div>
         
        </div>
      </div>
    );
  }
}

AnchorPlayground.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AnchorPlayground);