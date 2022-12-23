import React, { Component } from 'react';
import api from '../api';
import styled from 'styled-components';
import MediaQuery from 'react-responsive';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const Wrapper = styled.div.attrs({
    className: 'form-group',
})`
    margin-top: 24px;
    margin-left: 50px;
    margin-bottom: 18px;
    @media (max-width: 700px) {
        width: 100%;
        margin-top: 24px;
        margin-bottom: 18px;
        margin-left: 2%;
        margin-right: 3%;
    }
`

const Title = styled.h1.attrs({
    className: 'h2',
})`
    margin: 5px;
    margin-bottom: 4px;
    font-size: 24px;
    font-family: 'Mukta-Bold';
`

// const InputText = styled.input.attrs({
//     className: 'form-control',
//     required: "required",
// })`
//     margin: 5px;
// `

const Label = styled.label`
    width: 55%;
    background-color: #cce4eb;
    margin-top: 10px;
    margin-left: 5px;
    margin-right: 5px;
    border-radius: 20px;
    text-align: center;
`

const Button = styled.button.attrs({
    className: `btn-hover`,
})`
    margin-left: 5px;
    margin-right: 14px;
    background-color: #92de8b;
    border-radius: 25px;
    color: #fff;
    font-weight: bold;
    text-transform: uppercase;
    border: none;
    padding: 6px 22px;
    letter-spacing: 0.1rem;
    media (max-width: 700px) {
        magrin-top: 20px;
        width: 98%;
    }
    @media (max-width: 428px) {
        width: 47%;
        height: 45px;
        margin-top: 20px;
    }
`

const CancelButton = styled.div.attrs({
    className: `cancelBtn`,
})`
    text-transform: uppercase;
    letter-spacing: 0.1rem;
    media (max-width: 700px) {
        magrin-top: 20px;
    }
    @media (max-width: 428px) {
        height: 45px !important;
        background-color: lightgrey !important;
        border-radius: 25px;
        width: 46% !important;
        align-text: center;
        padding-top: 5px;
        margin-top: 20px;
    }
`

const CancelLink = styled.a.attrs({
})`
    width: 98% !important;
`


const DropDown = styled.select.attrs({
    className: 'form-control dropDown',
    required: "required",
})`
    margin: 5px;
`

const DropDownOption = styled.option.attrs({
})`
    margin: 5px;
    padding: 0px 2px;
`

const DropDownOptionDefault = styled.option.attrs({
})`
    margin: 5px;
    opacity: 0.5;
    padding: 0px 2px;
`

class UsersUpdate extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
            name: '',
            email: '',
            role: '',
            password: '',
            departmentList: [],
            departmentCode: ''
        }
        this.confirmPassword = '';
    }

    componentDidMount = async () => {
        const { id } = this.state
        const user = await api.getUserById(id)

        this.setState({
            name: user.data.data.name,
            email: user.data.data.email,
            role: user.data.data.role,
            password: user.data.data.password,
            departmentCode: user.data.data.departmentCode
        })
  
        api.getAllDepartments().then(res => {
            this.setState({
                departmentList: res.data.data
            })      
        })
    }

    handleChangeInputName = async event => {
        const name = event.target.value
        this.setState({ name })
    }

    handleChangeInputEmail = async event => {
        const email = event.target.value
        this.setState({ email })
    }

    handleChangeInputRole = async event => {
        const role = event.target.value
        this.setState({ role })
    }

    handleChangeInputPassword = async event => {
        const password = event.target.value
        this.setState({ password })
    }

    handleChangeConfirmPassword = async event => {
        this.confirmPassword = event.target.value
    }

    updateUser = async (event) => {
        debugger
        event.preventDefault()
        const { id, name, email, role, departmentCode, password } = this.state
        const payload = { name, email, role, departmentCode , password}
        if (this.confirmPassword != this.state.password) {
            window.alert(`Please make sure your passwords match`)
        }
        else {

                await api.updateUserById(id, payload).then(res => {
                    window.alert(`User updated successfully`)
                    this.setState({
                        name: '',
                        email: '',
                        role: '',
                        password: '',
                        departmentCode: '',
                        password: ''
                    })
                    this.confirmPassword = '';
                    window.location.href = `/users/list`
                })

        }
    }

    render() {
        let departmentList = [];
        if (this.state.departmentList.length) {
             departmentList = this.state.departmentList;
        }
        const { name, email, role, password } = this.state;
        return (
            <div>
                <Wrapper className="formObj py-0 update-user">
                    <form className="row g-2">
                        <div className="col-md-12">
                            <Title>Update User</Title>
                        </div>

                        <div className="col-md-4">
                            <TextField
                                type="text"
                                margin="normal"
                                fullWidth
                                id="name"
                                label="Full Name"
                                name="name"
                                autoFocus
                                value={name}
                                onChange={this.handleChangeInputName}
                            />
                        </div>
                        <div className="col-md-4">
                            <TextField
                                type="email"
                                margin="normal"
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                value={email}
                                onChange={this.handleChangeInputEmail}
                            />
                        </div>
                        <div className="col-md-4 d-none d-md-block"></div>
                        <div className="col-md-4">
                            <TextField
                                type="password"
                                margin="normal"
                                fullWidth
                                id="password"
                                label="Password"
                                name="password"
                                value={password}
                                onChange={this.handleChangeInputPassword}
                            />
                        </div>
                        <div className="col-md-4">
                            <TextField
                                type="password"
                                margin="normal"
                                fullWidth
                                id="cpassword"
                                label="Confirm Password"
                                name="cpassword"
                                onChange={this.handleChangeConfirmPassword}
                            />
                        </div>
                        <div className="col-md-4 d-none d-md-block"></div>

                        {this.state.role !== 'admin' ? <div className="col-md-4">
                            {/* <DropDown value={this.state.departmentCode} onChange={(e) => { this.setState({ departmentCode: e.target.value }) }}
                                className={`${this.state.departmentCode === '' ? "grey" : "active"}`}>
                                <DropDownOptionDefault disabled value="default">Select Department</DropDownOptionDefault>
                                {departmentList.map((e, key) => {
                                    return <DropDownOption key={key} value={e.departmentCode}>{e.departmentCode}
                                    </DropDownOption>;
                                })}
                            </DropDown> */}
                                <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Select Department</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={this.state.departmentCode}
                                    onChange={(e) => { this.setState({ departmentCode: e.target.value }) }}
                                    label="Select Department"
                                    >
                                    {departmentList.map((e, key) => {
                                        return <MenuItem key={key} value={e.departmentCode}>{e.departmentCode}
                                        </MenuItem>;
                                    })}
                                    </Select>
                                </FormControl>
                            </div> : <div className="col-md-4" style={{height:'61px'}}>&nbsp;</div>
                        }

                        <div className="col-md-4 d-none d-md-block"></div>

                        <div className='m-t-20'>
                            <div className="col-md-4 d-flex justify-content-md-start align-items-center toggle-btns">
                            <Label className={role == 'user' && 'active'}>
                                    <input required type="radio" name="role" value="user" className="card-input-element" onChange={this.handleChangeInputRole} checked={role === 'user' && 'true'} />
                                    <div className="card-input">
                                        Farm Associate
                                    </div>
                                </Label>
                                <Label className={role == 'admin' && 'active'}>
                                    <input required type="radio" name="role" value="admin" className="card-input-element" onChange={this.handleChangeInputRole} checked={role === 'admin' && 'true'} />
                                    <div className="card-input">
                                        Admin
                                    </div>
                                </Label>
                            </div>
                        </div>

                        <MediaQuery minWidth={768}>
                            <div className='col-md-4 d-flex justify-content-md-start align-items-center m-t-20'>
                                <Button onClick={this.updateUser}>Update User</Button>
                                <CancelButton><CancelLink href={'/users/list'}>Cancel</CancelLink></CancelButton>
                            </div>
                        </MediaQuery>
                        <MediaQuery maxWidth={768}>
                            <div className="col-md-2 col-xs-4 flex-container">
                                <Button onClick={this.updateUser}>Update User</Button>
                                <CancelButton><CancelLink href={'/users/list'}>Cancel</CancelLink></CancelButton>
                            </div>
                            <div className="col-md-8 col-xs-8"></div>
                        </MediaQuery>
                    </form>
                </Wrapper>
            </div>
        )
    }
}

export default UsersUpdate
