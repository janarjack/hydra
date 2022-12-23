import React, { Component } from 'react'
import styled from 'styled-components'
import { createGlobalStyle } from 'styled-components';
import api from '../api';
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

class ForgotPassword extends Component {

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

    forgotPassword = async () => {
        const { email } = this.state
        const payload = { email }

        if (email === '') {
            window.alert(`Please provide email`)
        } else {
            await api.forgotPassword(payload).then(
                window.alert(`Reset link sent`)
            ).catch(
                err => {
                    window.alert(`Invalid Email ID`);
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
            // <div>
            //     <Logo />
            //     <Wrapper className="formObj">
            //         <LoginStyles />
            //         <form className="row g-2">

            //             <div className="col-md-4"></div>
            //             <div className="col-md-4">
            //                 <Title>Forgot Password</Title>
            //             </div>
            //             <div className="col-md-4"></div>

            //             <div className="col-md-2"></div>
            //             <div className="col-md-8">
            //                 <SubTitle>Please provide your Email ID.</SubTitle>
            //             </div>
            //             <div className="col-md-2"></div>

            //             <div className="col-md-4"></div>
            //             <div className="col-md-4">
            //                 <InputText
            //                     type="email"
            //                     value={email}
            //                     onChange={this.handleChangeInputEmail}
            //                     placeholder="Email"
            //                 />
            //             </div>
            //             <div className="col-md-4"></div>

            //             <div className="col-md-4"></div>
            //             <div className="col-md-4">
            //                 <Anchor href="/">Back to Login</Anchor>
            //             </div>
            //             <div className="col-md-4"></div>

            //             <div className="col-md-4"></div>
            //             <div className="col-md-4">
            //                 <Button onClick={this.forgotPassword} />
            //             </div>
            //             <div className="col-md-4"></div>

            //         </form>
            //     </Wrapper>


            // </div>
            <ThemeProvider theme={theme}>
                <Container component="main" className='forget-screen' maxWidth="xs">
                <LoginStyles />
                <Box
                    sx={{
                    marginTop: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                    Forgot Password
                    </Typography>
                    <Typography component="h6" variant="h6" sx={{mt: 2, mb:2}}>
                    Please provide your Email ID.
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
                    <Grid container>
                        <Grid item xs align="right">
                        <Link href="/" variant="body2">
                            Back to Login
                        </Link>
                        </Grid>
                    </Grid>
                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2, mb: 2 }}
                        onClick={this.forgotPassword}
                        className="btn-submit"
                        disabled = {email.length < 1}
                    >
                        Send Link
                    </Button>
                    <Logo/>
                    </Box>
                </Box>
                </Container>
            </ThemeProvider>
        )
    }
}

export default ForgotPassword
