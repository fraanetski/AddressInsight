import * as React from 'react';
import {Link} from 'react-router-dom'
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
import Logo from './addrlogo1.png';
import Style from './Style';
import Main  from './Main';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';
import LightModeIcon from '@mui/icons-material/LightMode';
import Container from '@mui/material/Container';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import Collapse from '@mui/material/Collapse';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import RSS3 from './rss3.png';


const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function MyApp() {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        borderRadius: 0,
      }}
    >
      <Container maxWidth='md'>
        <Box sx={{
            display: 'flex',
        }}>
          <IconButton sx={{ 
            marginLeft: 0,
            marginRight: 'auto',
            ml: 5,
            }} onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <LightModeIcon /> : <NightlightRoundIcon />}
          </IconButton>

          <Box sx={{
            alignItems: 'center',
            marginRight: '38%',
          }}>
            <br/>
            <a href="/" style={{all: 'unset'}}>
            <img src={Logo} height='50'/>
            </a>
          </Box>

          <IconButton sx={{
            marginRight: 'auto',
            marginLeft: 0,
            mr: 5,
          }}>
            <AccountBalanceWalletIcon />
          </IconButton>
          </Box>


        <Box sx={{
                  display: 'flex',
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: 0,
                  padding: 0,
        }}>


        <Main/>
        

        <Box sx={{
            position: 'absolute',
            bottom: 0,
          }}>
            <a target="_blank" href="https://twitter.com/whateverthisiscalled" style={{all: "unset"}}>
                <TwitterIcon />
                &nbsp;
            </a>
            <a target="_blank" href="https://github.com/fraanetski/ethshanghai" style={{all: "unset"}}>
                <GitHubIcon />
            </a>
            <br/>
        </Box>
          <br/>

      </Box>
      </Container>
    </Box>
  );
}

export default function ToggleColorMode() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = React.useState(prefersDarkMode ? 'dark' : 'light');

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: '#aa3eff',
          },
          secondary: {
            main: '#ff2f00',
          },
          mode,
        },
        typography: {
          fontFamily: ['Ubuntu']
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <MyApp />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

