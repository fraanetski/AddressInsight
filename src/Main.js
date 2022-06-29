import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import './App.css';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import DiamondIcon from '@mui/icons-material/Diamond';
import Units from 'ethereumjs-units'
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SocialDistanceIcon from '@mui/icons-material/SocialDistance';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import MuseumIcon from '@mui/icons-material/Museum';
import FestivalIcon from '@mui/icons-material/Festival';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import GrainIcon from '@mui/icons-material/Grain';

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
      this.setTransactionCount = this.setTransactionCount.bind(this);
      this.setEventCount = this.setEventCount.bind(this);
      this.setNFTCount = this.setNFTCount.bind(this);
      this.setFriendCount = this.setFriendCount.bind(this);
      this.updatePage = this.updatePage.bind(this);
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
        badges: [],
        trustVal: [],
        flag: false,
      }
    }

    async getRSS3() {
        const endpoint = 'https://pregod.rss3.dev/v0.4.0/account:' + this.state.value + '@ethereum/notes?';
        await fetch(endpoint, {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            this.parseRSS3(data);
        })
        .catch(error => {
            console.log(error);
        });

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
            if (tags !== undefined) {
                tags = note.tags;
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
        var other_addresses = [];
        var nftCount = 0;
        for (var i = 0; i < notes.length; i++) {
            var note = notes[i];
            var title = note.title;
            var token_symbol = note.token_symbol;
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
        this.setState({other_addresses: other_addresses});
        this.setNFTCount(nftCount);
    }

    parseRSS3Transactions(notes) {
        var address = this.state.value;
        var ins = [];
        var out = [];
        var transactions = [];
        for (var i = 0; i < notes.length; i++) {
            var note = notes[i];
            var title = note.title;
            var token_symbol = note.token_symbol;
            var date = note.date;
            var from = note.from;
            var to = note.to;
            var amount = note.amount;
            if (title === undefined) {
                if (from.toUpperCase() === address.toUpperCase()) {
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
                                        {Units.convert(amount, 'wei', 'eth').substring(0,6)} {token_symbol}
                                        </div>
                                        to
                                        &nbsp;
                                        {to}
                                        <br/>
                                        on {date.substring(0,10)}
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
                                        {Units.convert(amount, 'wei', 'eth').substring(0,6)} {token_symbol}
                                        </div>
                                        from &nbsp;
                                        {from} 
                                        <br/>
                                        on {date.substring(0,10)}
                                    </Box>
                                </Box>
                            </div>
                        </div>
                    );
                }
            }
        }
        this.setState({transactions: transactions});
        this.setTransactionCount(ins, out);
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
        var events;
        if (json.data.addrs[0]) {
            events = json.data.addrs[0].attendEvents;
        } else {
            events = [];
        }
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
        var social;
        if (json.data) {
            social = json.data.addrs[0].addrsFollow;
        } else {
            social = [];
        }
        console.log(social);
        this.parseKNN3Social(social);
    }

    parseKNN3(events) {
        var eventNames = [];
        for (var i = 0; i < events.length; i++) {
            eventNames.push(
                <div>
                    <Box display="flex" alignItems="center">
                        <Box padding={1} sx={{
                            width: '100%',
                            minWidth: '10',
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
        this.setEventCount(events.length);
    }

    parseKNN3Social(social) {
        var socialNames = [];
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
        this.setFriendCount(social.length);
    }

    analyze() {
        /// calculate trust score
        // variables: transOut/transIn, nftCount, eventCount, friendCount
        var transOut = this.state.transOut;
        var transIn = this.state.transIn;
        var transTotal = transOut + transIn;
        var nftCount = this.state.nfts;
        var eventCount = this.state.events;
        var friendCount = this.state.friends;
        var trustScore = 0;
        var trustVal = [];
        
        if (transOut.constructor === Array) transOut = transOut.length;

        trustScore = transOut + nftCount + eventCount + (2*friendCount);
        trustScore = trustScore / 5;

        console.log(trustScore);

        if (trustScore <= 1 && trustScore >= 0) {
            trustVal.push(
                <div>
                    <Box display="flex" alignItems="center">
                        <Box padding={1} sx={{
                            width: '100%',
                            alignItems: 'center',
                        }}>
                            <Typography variant="h6" sx={{
                                fontWeight: 'bold'
                            }}>
                                Trust Score:
                            </Typography>
                            <Typography variant="h6" style={{fontWeight:"bold", color: "red"}}>
                            Very Low
                            </Typography>
                        </Box>
                    </Box>
                </div>
            );
        } else if (trustScore <= 2 && trustScore > 1) {
            trustVal.push(
                <div>
                    <Box display="flex" alignItems="center">
                        <Box padding={1} sx={{
                            width: '100%',
                            alignItems: 'center',
                        }}>
                            <Typography variant="h6" sx={{
                                fontWeight: 'bold'
                            }}>
                                Trust Score:
                            </Typography> 
                            <Typography variant="h6" style={{fontWeight:"bold", color: "red"}}>
                            Low
                            </Typography>
                        </Box>
                    </Box>
                </div>
            );
        } else if (trustScore <= 4 && trustScore > 2) {
            trustVal.push(
                <div>
                    <Box display="flex" alignItems="center">
                        <Box padding={1} sx={{
                            width: '100%',
                            alignItems: 'center',
                        }}>
                            <Typography variant="h6" sx={{
                                fontWeight: 'bold'
                            }}>
                                Trust Score:
                            </Typography>
                            <Typography variant="h6" style={{fontWeight:"bold", color:"orange"}}>
                            Medium
                            </Typography>
                        </Box>
                    </Box>
                </div>
            );
        } else if (trustScore > 4) {
            if (nftCount === 0 && eventCount === 0 && friendCount === 0) {
                trustVal.push(
                    <div>
                    <Box display="flex" alignItems="center">
                        <Box padding={1} sx={{
                            width: '100%',
                            alignItems: 'center',
                        }}>
                            <Typography variant="h6" sx={{
                                fontWeight: 'bold'
                            }}>
                                Trust Score:
                            </Typography>
                            <Typography variant="h6" style={{fontWeight:"bold", color:"orange"}}>
                            Medium
                            </Typography>
                        </Box>
                    </Box>
                </div>
                )
            } else {
                trustVal.push(
                    <div>
                        <Box display="flex" alignItems="center">
                            <Box padding={1} sx={{
                                width: '100%',
                                alignItems: 'center',
                            }}>
                                <Typography variant="h6" sx={{
                                    fontWeight: 'bold'
                                }}>
                                    Trust Score:
                                </Typography>
                                <Typography variant="h6" style={{fontWeight:"bold", color:"green"}}>
                                High
                                </Typography>
                            </Box>
                        </Box>
                    </div>
                );
            }
        } else if (trustScore === undefined) {
            trustVal.push(
                <div>
                    <Box display="flex" alignItems="center">
                        <Box padding={1} sx={{
                            width: '100%',
                            alignItems: 'center',
                        }}>
                            <Typography variant="h6" sx={{
                                fontWeight: 'bold'
                            }}>
                                Trust Score:
                            </Typography>
                            <Typography variant="h6" style={{fontWeight:"bold", color:"red"}}>
                                Loading...
                            </Typography>
                        </Box>
                    </Box>
                </div>
            );
        }

        /// see what badges this address qualifies for
        // if they have a lot of transactions, they are a trader
        // if they have a lot of events, they are a creator
        // if they have a lot of friends, they are a socialite
        // if they have a lot of nfts, they are a collector
        // if they have none, they are a lurker
        var badges = [];
        if (transTotal >= 15 && transIn >= 5) {
            badges.push(
                <div>
                    <Box display="flex" alignItems="center">
                        <Box padding={1} sx={{
                            width: '100%',
                            alignItems: 'center',
                        }}>
                            <CurrencyExchangeIcon />
                            <div style={{fontWeight:"bold"}}>
                            Trader
                            </div>
                        </Box>
                    </Box>
                </div>
            );
        }
        if (transOut >= 10) {
            badges.push(
                <div>
                    <Box display="flex" alignItems="center">
                        <Box padding={1} sx={{
                            width: '100%',
                            alignItems: 'center',
                        }}>
                            <GrainIcon />
                            <div style={{fontWeight:"bold"}}>
                            Web3 User
                            </div>
                        </Box>
                    </Box>
                </div>
            );
        }
        if (nftCount >= 2) {
            badges.push(
                <div>
                    <Box display="flex" alignItems="center">
                        <Box padding={1} sx={{
                            width: '100%',
                            alignItems: 'center',
                        }}>
                            <MuseumIcon />
                            <div style={{fontWeight:"bold"}}>
                            Collector
                            </div>
                        </Box>
                    </Box>
                </div>
            );
        }
        if (eventCount >= 3) {
            badges.push(
                <div>
                    <Box display="flex" alignItems="center">
                        <Box padding={1} sx={{
                            width: '100%',
                            alignItems: 'center',
                        }}>
                            <FestivalIcon />
                            <div style={{fontWeight:"bold"}}>
                            Attendee
                            </div>
                        </Box>
                    </Box>
                </div>
            );
        }
        if (friendCount >= 3) {
            badges.push(
                <div>
                    <Box display="flex" alignItems="center">
                        <Box padding={1} sx={{
                            width: '100%',
                            alignItems: 'center',
                        }}>
                            <ConnectWithoutContactIcon />
                            <div style={{fontWeight:"bold"}}>
                            Socialite
                            </div>
                        </Box>
                    </Box>
                </div>
            );
        }
        if (badges.length === 0) {
            badges.push(
                <div>
                    <Box display="flex" alignItems="center">
                        <Box padding={1} sx={{
                            width: '100%',
                            alignItems: 'center',
                        }}>
                            <QuestionMarkIcon />
                            <div style={{fontWeight:"bold"}}>
                            Lurker
                            </div>
                        </Box>
                    </Box>
                </div>
            );
        }   

        this.setState({badges: badges});
        this.setState({trustVal: trustVal});
    }

    setTransactionCount(ins, out) {
        this.setState({transIn: ins});
        this.setState({transOut: out});
        this.setState({transTotal: ins + out});
    }

    setNFTCount(count) {
        this.setState({nfts: count});
    }

    setEventCount(count) {
        this.setState({events: count});
    }

    setFriendCount(count) {
        this.setState({friends: count});
        this.analyze();
    }
    
    handleClick() {
      this.setState({loading: true});
      this.handleSubmit();
    }

    handleChange(event) {    
      this.setState({value: event.target.value});  
    }
    
    handleSubmit(event) {
      // alert('An address was submitted: ' + this.state.value);
      if (this.state.value.length === 42) {

        this.getRSS3();
        this.getKNN3();
        this.getKNN3Social();
        this.analyze();
        this.updatePage();
        var RSSInterval = setInterval(this.getRSS3, 1000);
        var analyzeInterval = setInterval(this.analyze, 1000);
        event.preventDefault();
        setTimeout(() => {
            clearInterval(RSSInterval);
            clearInterval(analyzeInterval);
        }, 10000);
      } else {
        this.setState({loading: false});
        alert('Please enter a valid address');
      }
    }

    updatePage(){
        setTimeout(() => {
            this.setState({loading: false, dataReceived: true});
        }, 1000);
    }
    
    render() {

        if (this.state.dataReceived) {

            const avatar = `https://avatars.dicebear.com/api/bottts/${this.state.value}.svg`;

            return (

                <div className="App">
                <form onSubmit={this.handleSubmit}>
                 <Box sx={{
                      display: 'flex',
                      width: '100%',
                      position: 'relative',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mt: 3
                  }}
                >

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
                </Box>
                </form>


                <Card sx={{
                    pt: 3,
                    pb: 3,
                    mt: 3,
                    mb: 3,
                }}>
                    <img src={avatar} alt="avatar" height='70' />
                    <br/>
                    <br/>
                    {this.state.value}
                    <br/>
                    {/* Balance: {Units.convert(this.state.balance, 'wei', 'eth')} ETH
                    <br/>
                    In: {this.state.transIn}
                    &nbsp;
                    Out: {this.state.transOut} */}
                </Card>

                <Card sx={{
                    pt: 3,
                    pb: 3,
                    mt: 3,
                    mb: 3,
                }}>
                    <Typography color="primary" variant="h5" sx={{
                        fontWeight: 'bold'
                    }}>
                        Account Analysis
                    </Typography>
                    <br/>
                    {this.state.trustVal}
                    <br/>
                    <Typography variant="h6" sx={{
                                fontWeight: 'bold'
                            }}>
                                Badges:
                    </Typography>
                    {this.state.badges}

                </Card>

                <Card sx={{
                    pt: 3,
                    pb: 3,
                    mt: 3,
                    mb: 3,
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
                    pt: 3,
                    pb: 3,
                    mt: 3,
                    mb: 3,
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
                    pt: 3,
                    pb: 3,
                    mt: 3,
                    mb: 3,
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
                    pt: 3,
                    pb: 3,
                    mt: 3,
                    mb: 3,
                }}>
                    <Typography color="primary" variant="h5" sx={{
                        fontWeight: 'bold'
                    }}>
                        Recent Transactions
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

          </Box>
          </form>


        </div>
      );
    }
}

export default Main;