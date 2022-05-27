import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import SendIcon from '@mui/icons-material/Send';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import './App.css';
import Style from './Style';
import { MailRounded } from '@mui/icons-material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Container from '@mui/material/Container';

class Main extends React.Component {
    constructor(props){
      super(props);
      this.handleClick = this.handleClick.bind(this);
      this.state = {
        loading: false
      }
    }
    
    handleClick() {
      this.setState({loading: true});
    }
    
    render() {
      return (
        <div className="App">
          <Box
            sx={{
                display: 'flex',
                width: '100%',
                display: 'inline-block',
            }}
          >
            <TextField fullWidth label="Enter an address" id="fullWidth" sx={{
                width: 500
            }}/>


          <LoadingButton
            size="small"
            onClick={this.handleClick}
            loading={this.state.loading}
            loadingPosition="center"
            variant="contained"
          >
            <ArrowRightIcon />
          </LoadingButton>
          </Box>


        </div>
      );
    }
}

export default Main;