import React, { Component } from 'react';
// import styled, { ThemeProvider } from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import api from '../api';
import CookieService from '../api/CookieService';
import Logo from '../components/Logo';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export const LoginStyles = createGlobalStyle`
  body {
    background-image: url("../login-bg.jpg");
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    @media (max-width: 700px) {
        height: 100vh;
    }
  }
  `

const theme = createTheme();

class Login extends Component {

    constructor(props) {
        super(props)

        this.state = {
            validSession: false,
            email: '',
            password: '',
        }
    }

    handleChangeInputEmail = async event => {
        const email = event.target.value
        this.setState({ email })
    }

    handleChangeInputPassword = async event => {
        const password = event.target.value
        this.setState({ password })
    }

    userLogin = async () => {
        const { email, password } = this.state
        const payload = { email, password }

        if (email === '' || password === '') {
            window.alert(`Please provide credentials`)
        } else {
            await api.userLogin(payload).then(
                user => {
                    if (user.data.success === true) {
                        //window.alert(`Login successful`)
                        this.setState({
                            email: '',
                            password: '',
                        })
                        CookieService.loginUser(user.data.data);
                        this.props.history.push('/dashboard');
                        window.location.reload()
                    } else {
                        window.alert("Invalid User")
                    }
                }).catch(
                    err => {
                        window.alert(`Invalid Credentials`);
                        console.log(err.code);
                        console.log(err.message);
                        console.log(err.stack);
                    }
                    
                );
        }
    }

    render() {
        const { email, password } = this.state
        return (
            <ThemeProvider theme={theme}>
                <Container component="main" className='login-screen' maxWidth="xs">
                <LoginStyles />
                <Box
                    sx={{
                    marginTop: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    }}
                >
                    {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                    </Avatar> */}
                    <Typography component="h1" variant="h5">
                    Sign In
                    </Typography>
                    <Typography component="h6" variant="h6" sx={{mt: 2, mb:2}}>
                    Please fill in your account credentials.
                    </Typography>
                    <Box>
                    <TextField
                        margin="normal"
                        fullWidth
                        required
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={this.handleChangeInputEmail}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        required
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={this.handleChangeInputPassword}
                    />
                    <Grid container>
                        <Grid item xs align="right">
                        <Link href="/forgot-password" variant="body2">
                            Forgot Password
                        </Link>
                        </Grid>
                    </Grid>
                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2, mb: 2 }}
                        onClick={this.userLogin}
                        className="btn-submit"
                        disabled = {email.length < 1 || password.length < 1}
                    >
                        Sign In
                    </Button>
                    <Logo/>
                    </Box>
                </Box>
                </Container>
            </ThemeProvider>
        )
    }
}

export default Login
