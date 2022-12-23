import React, { Component } from 'react'
import styled from 'styled-components'
import { createGlobalStyle } from 'styled-components';
import api from '../api'
import Logo from '../components/Logo'

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

const Wrapper = styled.div.attrs({
    className: 'form-group',
})`
    margin-top: 2%;
    @media (max-width: 700px) {
        margin-top: -16%;
    }
`

const Title = styled.h1.attrs({
    className: 'h1',
})`
    color: black;
    text-align: center;
`

const SubTitle = styled.h1.attrs({
    className: 'h5',
})`
    color: black;
    text-align: center;
`

const InputText = styled.input.attrs({
    className: 'form-control',
    required: "required",
})`
    position: relative;
    margin: 5px;
    width: 80%;
    margin-left: 10%;
    @media (max-width: 700px) {
        width: 100%;
        margin-left: 0;
        margin: 0;
    }
`

const Anchor = styled.a.attrs({
})`
    position: relative;
    float: right;
    margin-right: 12%;
    color: black !important;
`

const Button = styled.input.attrs({
    className: 'form-control',
    type: 'button',
    value: 'RESET PASSWORD',
})`
    margin: 5px;
    background-color: #92DE8B;
    font-weight: bold;
    border-radius: 25px;
    width: 50%;
    position: relative;
    margin-left: 25%;
`

class ResetPassword extends Component {

    constructor(props) {
        super(props)

        this.state = {
            validSession: false,
            validToken: false,
            id: this.props.match.params.id,
            token: this.props.match.params.token,
            password: '',
        }
    }

    componentDidMount = async () => {
        const { id, token } = this.state
        const payload = { id, token }
        await api.validateToken(id, token, payload).then(
            this.setState({
                validToken: true,
            })
        ).catch(
            err => {
                window.alert(`Something went wrong`);
                console.log(err.code);
                console.log(err.message);
                console.log(err.stack);
            }
        );
    }

    handleChangeInputPassword = async event => {
        const password = event.target.value
        this.setState({ password })
    }

    resetPassword = async () => {
        const { id, password } = this.state
        const payload = { password }

        if (password === '') {
            window.alert(`Please provide a new Password`)
        } else {
            await api.resetPassword(id, payload).then(
                window.alert(`Password reset successful`)

            ).catch(
                err => {
                    window.alert(`Invalid Password`);
                    console.log(err.code);
                    console.log(err.message);
                    console.log(err.stack);
                }
            );
        }
    }

    render() {
        const { password, validToken } = this.state
        return (
            <div>
                {validToken &&
                    <div>
                        <Logo />
                        <Wrapper className="formObj">
                            <LoginStyles />
                            <form className="row g-2">

                                <div className="col-md-4"></div>
                                <div className="col-md-4">
                                    <Title>Reset Password</Title>
                                </div>
                                <div className="col-md-4"></div>

                                <div className="col-md-2"></div>
                                <div className="col-md-8">
                                    <SubTitle>Please set a new Password.</SubTitle>
                                </div>
                                <div className="col-md-2"></div>

                                <div className="col-md-4"></div>
                                <div className="col-md-4">
                                    <InputText
                                        type="password"
                                        value={password}
                                        onChange={this.handleChangeInputPassword}
                                        placeholder="Password"
                                    />
                                </div>
                                <div className="col-md-4"></div>

                                <div className="col-md-4"></div>
                                <div className="col-md-4">
                                    <Anchor href="/">Back to Login</Anchor>
                                </div>
                                <div className="col-md-4"></div>

                                <div className="col-md-4"></div>
                                <div className="col-md-4">
                                    <Button onClick={this.resetPassword} />
                                </div>
                                <div className="col-md-4"></div>

                            </form>
                        </Wrapper>
                    </div>
                }
                {!validToken &&
                    <div>
                        Invalid or Expired link, please use Forgot Password feature.
                    </div>
                }
            </div>
        )
    }
}

export default ResetPassword
