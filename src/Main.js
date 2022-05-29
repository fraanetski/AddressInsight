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
import Units from 'ethereumjs-units'
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-bottts-sprites';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SocialDistanceIcon from '@mui/icons-material/SocialDistance';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

class Main extends React.Component {
    constructor(props){
      super(props);
      this.handleClick = this.handleClick.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.getRSS3 = this.getRSS3.bind(this);
      this.getKNN3 = this.getKNN3.bind(this);
      this.getKNN3Social = this.getKNN3Social.bind(this);
      this.parseRSS3 = this.parseRSS3.bind(this);
      this.parseKNN3 = this.parseKNN3.bind(this);
      this.parseRSS3NFTs = this.parseRSS3NFTs.bind(this);
      this.parseRSS3Transactions = this.parseRSS3Transactions.bind(this);
      this.parseKNN3Social = this.parseKNN3Social.bind(this);
      this.analyze = this.analyze.bind(this);
      this.state = {
        loading: false,
        value: '',
        dataReceived: false,
        notes: [],
        other_addresses: [],
        transactions: [],
        balance: 0,
        expanded: false,
        eventNames: [],
        socialNames: [],
        transIn: 0,
        transOut: 0,
        transTotal: 0,
        nfts: 0,
        events: 0,
        friends: 0,
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

    parseRSS3(data) {
        var list = data.list;
        var notes = [];
        var tags = [];
        for (var i = 0; i < list.length; i++) {
            var note = list[i];
            var title = note.title;
            var date = note.date_created;
            var attachments = note.attachments;
            var metadata = note.metadata;
            var token_symbol = metadata.token_symbol;
            var from = metadata.from;
            var to = metadata.to;
            var amount = metadata.amount;
            // parse the tags
            if (tags != undefined) {
                var tags = note.tags;
                var tag_list = [];
                for (var j = 0; j < tags.length; j++) {
                    var tag = tags[j];
                    tag_list.push(tag.name);
                }
            }
            if (attachments) var address = attachments[0].address;
            notes.push({
                title: title,
                token_symbol: token_symbol,
                date: date,
                address: address,
                from: from, 
                to: to,
                amount: amount,
                tags: tags,
            });
        }
        this.setState({notes: notes});
        console.log(notes);
        this.parseRSS3NFTs(notes);
        this.parseRSS3Transactions(notes);
    }

    parseRSS3NFTs(notes) {
        var notes = notes;
        var other_addresses = [];
        var nftCount = 0;
        for (var i = 0; i < notes.length; i++) {
            var note = notes[i];
            var title = note.title;
            var token_symbol = note.token_symbol;
            var from = note.from;
            var address = note.address;
            var tag_list = note.tags;
            if(title) {
                if(tag_list.length < 2){
                    nftCount++;
                    other_addresses.push(
                        <div className="note">
                            <div className="title">
                                <Box display="flex" alignItems="center">
                                    <Box padding={1} sx={{
                                        width: '100%',
                                        alignItems: 'center',
                                    }}>
                                        <FingerprintIcon />
                                        <div style={{fontWeight:"bold"}}>
                                        {title}
                                        </div>
                                        ({token_symbol})
                                    </Box>
                                </Box>
                            </div>
                        </div>
                    );
                }
            }
        }
        this.setState({nfts: nftCount});
        this.setState({other_addresses: other_addresses});
    }

    parseRSS3Transactions(notes) {
        var notes = notes;
        var address = this.state.value;
        var ins = [];
        var out = [];
        var transactions = [];
        for (var i = 0; i < notes.length; i++) {
            var note = notes[i];
            var title = note.title;
            var token_symbol = note.token_symbol;
            var url = note.address;
            var date = note.date;
            var from = note.from;
            var to = note.to;
            var amount = note.amount;
            if (title == undefined) {
                if (from.toUpperCase() == address.toUpperCase()) {
                    out++;

                    transactions.push(
                        <div className="note">
                            <div className="title">
                                <Box display="flex" alignItems="center">
                                    <Box padding={1} sx={{
                                        width: '100%',
                                        alignItems: 'center',
                                    }}>
                                        <DiamondIcon />
                                        <div style={{fontWeight:"bold"}}>
                                        {Units.convert(amount, 'wei', 'eth')} {token_symbol}
                                        </div>
                                        from &nbsp;
                                        {from} 
                                        <br/>
                                        to
                                        &nbsp;
                                        {to}
                                        <br/>
                                        on
                                        <br/>
                                        {date}
                                    </Box>
                                </Box>
                            </div>
                        </div>
                    );
                } else {
                    ins++;

                    transactions.push(
                        <div className="note">
                            <div className="title">
                                <Box display="flex" alignItems="center">
                                    <Box padding={1} sx={{
                                        width: '100%',
                                        alignItems: 'center',
                                    }}>
                                        <DiamondIcon />
                                        <div style={{fontWeight:"bold"}}>
                                        {Units.convert(amount, 'wei', 'eth')} {token_symbol}
                                        </div>
                                        from &nbsp;
                                        {from} 
                                        <br/>
                                        to
                                        &nbsp;
                                        {to}
                                        <br/>
                                        on
                                        <br/>
                                        {date}
                                    </Box>
                                </Box>
                            </div>
                        </div>
                    );
                }
            }
        }
        this.setState({transIn: ins, transOut: out, transTotal: ins + out});
        this.setState({transactions: transactions});
    }

    async getKNN3() {
        const data = JSON.stringify({
            query: `query POAPEventsQuery($addressVar: String){
                addrs(where: { address: $addressVar }) {
                    attendEvents {
                        id
                        name
                    }
                }
            }`,
            variables: `{
                "addressVar": "${this.state.value}"
            }`,
        });

        const response = await fetch(
            'https://mw.graphql.knn3.xyz/',
            {
                method: 'post',
                body: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length,
                },
            }
        );

        const json = await response.json();
        console.log(json);
        var events = json.data.addrs[0].attendEvents;
        this.parseKNN3(events);
    }

    async getKNN3Social() {
        const data = JSON.stringify({
            query: `query SocialQuery($addressVar: String){
              addrs(where: { address: $addressVar }) {
                address
                addrsFollow {
                  addressmaterial iconsma
                }
              }
            }`,
            variables: `{
                "addressVar": "${this.state.value}"
            }`,
        });

        const response = await fetch(
            'https://mw.graphql.knn3.xyz/',
            {
                method: 'post',
                body: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length,
                },
            }
        );

        const json = await response.json();
        var social = json.data.addrs[0].addrsFollow;
        console.log(social);
        this.parseKNN3Social(social);
    }

    parseKNN3(events) {
        var events = events;
        var eventNames = [];
        this.setState({events: events.length});
        for (var i = 0; i < events.length; i++) {
            eventNames.push(
                <div>
                    <Box display="flex" alignItems="center">
                        <Box padding={1} sx={{
                            width: '100%',
                            alignItems: 'center',
                        }}>
                            <EmojiEventsIcon />
                            <div style={{fontWeight:"bold"}}>
                            {events[i].name}
                            </div>
                        </Box>
                    </Box>
                </div>
            );
        }

        this.setState({eventNames: eventNames});
    }

    parseKNN3Social(social) {
        var social = social;
        var socialNames = [];
        this.setState({friends: social.length});
        for (var i = 0; i < social.length; i++) {
            socialNames.push(
                <div>
                    <Box display="flex" alignItems="center">
                        <Box padding={1} sx={{
                            width: '100%',
                            alignItems: 'center',
                        }}>
                            <SocialDistanceIcon />
                            <div style={{fontWeight:"bold"}}>
                            {social[i].address}
                            </div>
                        </Box>
                    </Box>
                </div>
            );
        }

        this.setState({socialNames: socialNames});
    }

    async analyze() {
        // use the variables to calculate a trust score for this address
        // then see what badges they qualify for
        // call the function that will create something to render for this, or do it in render()
        
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
      this.getKNN3();
      this.getKNN3Social();
      this.analyze();
      event.preventDefault();
    }
    
    render() {

        if (this.state.dataReceived) {

            const avatar = `https://avatars.dicebear.com/api/bottts/${this.state.value}.svg`;

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
      
                </Box>
                </form>

                <Card sx={{
                    padding: 3,
                    margin: 3
                }}>
                    <img src={avatar} height='70' />
                    <br/>
                    <br/>
                    {this.state.value}
                    <br/>
                    <br/>
                    {/* Balance: {Units.convert(this.state.balance, 'wei', 'eth')} ETH
                    <br/>
                    In: {this.state.transIn}
                    &nbsp;
                    Out: {this.state.transOut} */}
                </Card>

                <Card sx={{
                    padding: 3,
                    margin: 3
                }}>
                    <Typography color="primary" variant="h5" sx={{
                        fontWeight: 'bold'
                    }}>
                        Account Analysis
                    </Typography>
                    <br/>


                </Card>

                <Card sx={{
                    padding: 3,
                    margin: 3
                }}>
                    <Typography color="primary" variant="h5" sx={{
                        fontWeight: 'bold'
                    }}>
                        Social Connections
                    </Typography>
                    <br/>

                    {(this.state.socialNames.length > 0)
                    ? this.state.socialNames
                    : 
                    <Typography>None!
                    </Typography>
                    }
                </Card>


                <Card sx={{
                    padding: 3,
                    margin: 3
                }}>
                    <Typography color="primary" variant="h5" sx={{
                        fontWeight: 'bold'
                    }}>
                        NFTs
                    </Typography>
                    <br/>

                    {(this.state.other_addresses.length > 0)
                    ? this.state.other_addresses
                    : 
                    <Typography>None!
                    </Typography>
                    }

                </Card>


                <Card sx={{
                    padding: 3,
                    margin: 3
                }}>
                    <Typography color="primary" variant="h5" sx={{
                        fontWeight: 'bold'
                    }}>
                        Events
                    </Typography>
                    <br/>

                    {(this.state.eventNames.length > 0)
                    ? this.state.eventNames
                    : 
                    <Typography>None!
                    </Typography>
                    }
                </Card>


                <Card sx={{
                    padding: 3,
                    margin: 3
                }}>
                    <Typography color="primary" variant="h5" sx={{
                        fontWeight: 'bold'
                    }}>
                        Transactions
                    </Typography>
                    <br/>
                    {(this.state.transactions.length > 0)
                    ? this.state.transactions
                    : 
                    <Typography>None!
                    </Typography>
                    }
                </Card>

                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
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
                height: '92vh',
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
          </Box>
          </form>


        </div>
      );
    }
}

export default Main;