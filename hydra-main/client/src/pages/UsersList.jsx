import React, { Component } from 'react';
import api from '../api';
import './UsersList.css';
import styled from 'styled-components';
import MediaQuery from 'react-responsive';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchOutlined from '@mui/icons-material/SearchOutlined';

const Wrapper = styled.div.attrs({
    className: 'form-group',
})`
    position: block;
    margin-top: 24px;
    margin-bottom: 14px;
    margin-left: 50px;
    width: 90%;
    @media (max-width: 700px) {
        width: 90%;
        margin-top: 24px;
        margin-bottom: 20px;
        margin-left: 20px;
    }

    @media (max-width: 428px) {
        margin-left: 5%;
        margin-right: 5%;
    }

    @media (max-width: 375px) {
        margin-left: 5px;
        margin-right: 5px;
    }
`

const Title = styled.h1.attrs({
    className: 'h2',
})`
    position: relative;
    margin: 5px;
    margin-bottom: 14px;
    font-size: 24px;
    font-family: 'Mukta-Bold';
    @media (max-width: 428px) {
        margin-bottom: 14px;
    }
`

const Update = styled.div`
    color: #ef9b0f;
    cursor: pointer;
    display: inline-block;
    padding: 4px;
    margin-right: 4px;
`

const Delete = styled.div`
    color: #ff0000;
    cursor: pointer;
    display: inline-block;
    padding: 4px;
`

const Table = styled.table.attrs({
})`
    position: relative;
    width: 100%;
    padding: 5px;
    margin-bottom: 10px;
    border-bottom: 1px solid #B6D0E2 !important;
`

const TdWide = styled.td.attrs({
})`
    position: relative;
    padding-left: 10px;
    font-size: 14px;
    text-align: left;
    width: 50%;
`

const TdNarrow = styled.td.attrs({
})`
    position: relative;
    padding-left: 10px;
    font-size: 14px;
    text-align: left;
    width: 5%;
`

class UpdateUser extends Component {
    updateUser = event => {
        event.preventDefault()

        window.location.href = `/users/update/${this.props.id}`
    }

    render() {
        return <Tooltip title="Edit"><Update onClick={this.updateUser}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
        </svg></Update></Tooltip>
    }
}

class DeleteUser extends Component {
    deleteUser = event => {
        event.preventDefault()

        if (
            window.confirm(
                `Do you want to delete the user permanently?`,
            )
        ) {
            api.deleteUserById(this.props.id)
            setTimeout(() => { window.location.reload() }, 500)
        }
    }

    render() {
        return <Tooltip title="Delete"><Delete onClick={this.deleteUser}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
        </svg></Delete></Tooltip>
    }
}

class UsersList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
        }
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true })

        await api.getAllUsers().then(users => {
            this.setState({
                users: users.data.data,
            })
        })
    }

    searchUsers = async event => {
        event.preventDefault();
        let term = event.target.value
        if (term !== null && term !== '') {
            let payload = { term: term }
            await api.searchUsers(payload).then(users => {
                this.setState({
                    users: users.data.data,
                })
            })
        } else {
            await api.getAllUsers().then(users => {
                this.setState({
                    users: users.data.data,
                })
            })
        }
    }

    updateNotifSwitch = async event => {
        let notif = false
        if (event.target.checked)
            notif = true
        else
            notif = false

        const payload = { notif: notif }
        const id = event.target.id.toString()

        await api.updateNotifSwitch(id, payload)
        window.location.reload()
    }

    render() {
        return (
            <div>
                <div className="createButtonDiv">
                    <a href="/users/create">Create User</a>
                </div>
                <Wrapper>
                    <div className="row container-fluid px-0 gx-0">
                        <Title>All Users</Title>
                        <div className='col-md-6 col-xs-12 user-search'>
                            {/* <input type="text" className="form-control" placeholder="Search" id="search" onChange={this.searchUsers}></input> */}
                            <TextField
                                fullWidth
                                id="search" 
                                variant="outlined"
                                label="Search"
                                onChange={this.searchUsers}
                                InputProps={{
                                endAdornment: (
                                    <IconButton>
                                    <SearchOutlined />
                                    </IconButton>
                                ),
                                }}
                            />
                        </div>

                        <MediaQuery minWidth={700}>
                            <table className="container-fluid px-0 account">
                                <thead>
                                    <tr className="account">
                                        <th className="account">Name</th>
                                        <th className="account">Email</th>
                                        <th className="account">Role</th>
                                        <th className="account">Actions</th>
                                        <th className="account">Notifications</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.users.map(
                                            user =>
                                                <tr className="account" key={'user' + user._id}>
                                                    <td className="account">
                                                        {user.name}
                                                    </td>
                                                    <td className="account">
                                                        {user.email}
                                                    </td>
                                                    <td className="account">
                                                        {user.role == 'user' ? 'Farm Associate' : user.role }
                                                    </td>
                                                    <td className="account action">
                                                        <UpdateUser id={user._id} />
                                                        <DeleteUser id={user._id} />
                                                    </td>
                                                    <td className="account">
                                                    <Tooltip title={user.notif  == 'true' ? 'Click to Disable' : 'Click to Enable'}>
                                                        <label className="switch" onClick={this.updateNotifSwitch}>
                                                            {user.notif == 'true' && <input type="checkbox" id={user._id} checked />}
                                                            {user.notif != 'true' && <input type="checkbox" id={user._id} />}
                                                            <span className="slider round" ></span>
                                                        </label>
                                                    </Tooltip>   
                                                    </td>
                                                </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </MediaQuery>
                        <MediaQuery maxWidth={700}>
                            <br />
                            {
                                this.state.users.map(
                                    user =>
                                        <Table className="container-fluid account">
                                            <tbody>
                                                <tr>
                                                    <TdWide><b>{user.name}</b></TdWide>
                                                    <TdNarrow>
                                                        <label className="switch" onClick={this.updateNotifSwitch}>
                                                            {user.notif == 'true' && <input type="checkbox" id={user._id} checked />}
                                                            {user.notif != 'true' && <input type="checkbox" id={user._id} />}
                                                            <span className="slider round" ></span>
                                                        </label>
                                                    </TdNarrow>
                                                    <TdNarrow><UpdateUser id={user._id} /></TdNarrow>
                                                    <TdNarrow><DeleteUser id={user._id} /></TdNarrow>
                                                </tr>
                                                <tr>
                                                    <TdWide>Email: {user.email}</TdWide>
                                                </tr>
                                                <tr>
                                                    <TdWide>Role: {user.role == 'user' ? 'Farm Associate' : user.role }</TdWide>
                                                </tr>
                                            </tbody>
                                        </Table>
                                )
                            }
                        </MediaQuery>
                    </div>
                </Wrapper>
            </div>
        )
    }
}

export default UsersList
