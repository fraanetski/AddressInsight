import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Card from '@mui/material/Card';
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
import Typography from '@mui/material/Typography';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import DiamondIcon from '@mui/icons-material/Diamond';
import EggIcon from '@mui/icons-material/Egg';

class Main extends React.Component {
    constructor(props){
      super(props);
      this.handleClick = this.handleClick.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.getRSS3 = this.getRSS3.bind(this);
      this.parseRSS3 = this.parseRSS3.bind(this);
      this.parseRSS3Addresses = this.parseRSS3Addresses.bind(this);
      this.parseRSS3Transactions = this.parseRSS3Transactions.bind(this);
      this.state = {
        loading: false,
        value: '',
        dataReceived: false,
        notes: [],
        other_addresses: [],
        transactions: [],
      }
    }

    async getRSS3() {
        var address = this.state.value;
        return fetch(`https://pregod.rss3.dev/v0.4.0/account:${address}@ethereum/notes?`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            this.setState({loading: false, dataReceived: true});
            this.parseRSS3(data);
        })
    }

    // json schema: 
    // {
    //     list: [
    //         {
    //             title: "Name",
    //             attachments: [
    //                 {
    //                     address: "image address"
    //                 }
    //             ],
    //             metadata: {
    //                 token_symbol: "ETH"
    //             }
    //         }
    //     ]
    // }
    parseRSS3(data) {
        var list = data.list;
        var notes = [];
        for (var i = 0; i < list.length; i++) {
            var note = list[i];
            var title = note.title;
            var attachments = note.attachments;
            var metadata = note.metadata;
            var token_symbol = metadata.token_symbol;
            if (attachments) var address = attachments.address;
            notes.push({
                title: title,
                token_symbol: token_symbol,
                address: address
            });
        }
        this.setState({notes: notes});
        console.log(notes);
        this.parseRSS3Addresses(notes);
        this.parseRSS3Transactions(notes);
    }

    parseRSS3Addresses(notes) {
        var notes = notes;
        var other_addresses = [];
        for (var i = 0; i < notes.length; i++) {
            var note = notes[i];
            var title = note.title;
            var token_symbol = note.token_symbol;
            var address = note.address;
            if(title) {
            other_addresses.push(
                <div className="note">
                    <div className="title">
                        <Box display="flex" alignItems="center">
                            <Box mr={1}>
                                <EggIcon />
                            </Box>
                            <Box>
                                {title}
                                &nbsp;
                                ({token_symbol})
                            </Box>
                        </Box>
                    </div>
                </div>
            );
            }
        }
        this.setState({other_addresses: other_addresses});
    }

    parseRSS3Transactions(notes) {
        var notes = notes;
        var transactions = [];
        for (var i = 0; i < notes.length; i++) {
            var note = notes[i];
            var title = note.title;
            var token_symbol = note.token_symbol;
            var address = note.address;
            if(title == undefined) {
            transactions.push(
                <div className="note">
                    <div className="title">
                        <Box display="flex" alignItems="center">
                            <Box mr={1}>
                                <EggIcon />
                            </Box>
                            <Box>
                                {token_symbol}:
                                &nbsp;
                                address1 
                                &nbsp;
                                -
                                &nbsp;
                                address2
                            </Box>
                        </Box>
                    </div>
                </div>
            );
            }
        }
        this.setState({transactions: transactions});
    }
    
    handleClick() {
      this.setState({loading: true});
    }

    handleChange(event) {    
      this.setState({value: event.target.value});  
    }
    
    handleSubmit(event) {
      // alert('An address was submitted: ' + this.state.value);
      this.getRSS3();
      event.preventDefault();
    }
    
    render() {


        if (this.state.dataReceived) {
            return (

                <div className="App">
                <form onSubmit={this.handleSubmit}>
                <Box
                  sx={{
                      display: 'inline-block',
                      width: '100%',
                      position: 'relative',
                      alignItems: 'center',
                      justifyContent: 'center',
      
                  }}
                >
                    <Container maxWidth='lg'>
                        <br/>
                  <TextField fullWidth label="Enter an address" id="fullWidth" 
                  value={this.state.value}
                  onChange={this.handleChange}
                  size="small"
                  sx={{
                      width: '80vw',
                      maxWidth: 700
                  }}/>
      
                  <LoadingButton
                      size="large"
                      type="submit"
                      value="Submit"
                      onClick={this.handleClick}
                      loading={this.state.loading}
                      loadingPosition="center"
                      variant="contained"
                      sx={{
                          boxShadow: 'none'
                      }}>
                      <ArrowRightIcon />
                  </LoadingButton>
                  </Container>
      
                  <br/>
      
                </Box>
                </form>

                <Card sx={{
                    padding: 3,
                    margin: 3
                }}>
                    <Typography color="primary" variant="h5">
                        Domains
                    </Typography>
                    {(this.state.other_addresses.length > 0)
                    ? this.state.other_addresses
                    : 
                    <Typography>None found!
                    </Typography>
                    }
                </Card>


                <Card sx={{
                    padding: 3,
                    margin: 3
                }}>
                    <Typography color="primary" variant="h5">
                        Transactions
                    </Typography>
                    {(this.state.transactions.length > 0)
                    ? this.state.transactions
                    : 
                    <Typography>None found!
                    </Typography>
                    }
                </Card>


                <br/>
                <br/>
                <br/>
            </div>
            )
        }

      return (
        <div className="App">
          <form onSubmit={this.handleSubmit}>
          <Box
            sx={{
                display: 'flex',
                width: '100%',
                height: '95.5vh',
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'center',

            }}
          >
              <Container maxWidth='lg'>
            <TextField fullWidth label="Enter an address" id="fullWidth" 
            value={this.state.value}
            onChange={this.handleChange}
            size="small"
            sx={{
                width: '80vw',
                maxWidth: 600
            }}/>

            <LoadingButton
                size="large"
                type="submit"
                value="Submit"
                onClick={this.handleClick}
                loading={this.state.loading}
                loadingPosition="center"
                variant="contained"
                sx={{
                    boxShadow: 'none'
                }}>
                <ArrowRightIcon />
            </LoadingButton>
            </Container>

            <br/>

          </Box>
          </form>


        </div>
      );
    }
}

export default Main;