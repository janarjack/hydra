import React, { Component } from 'react';
import styled from 'styled-components';
import api from '../api';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';


let Wrapper = styled.div.attrs({
})`
    width: 200px;
    overflow-y:auto;
    max-height: 280px;
    margin-right: 2rem;
    margin-bottom: 2rem;

    @media (max-width: 700px) {
        width: 100%;
        margin-left: 5%;
        margin-right: 5%;
        margin-top: 30px;
        margin-bottom: 50px;
        max-height: 100%;
    }
`

let PlantNotif = styled.div.attrs({
})`
    box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.25);
    border-radius: 6px;
    width: 180px;
    height: 70px;
    margin-bottom: 20px;
    font-size: 14px;
    @media (max-width: 700px) {
        width: 95%;
    }
`

let CropNotif = styled.div.attrs({
})`
    box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.25);
    border-radius: 6px;
    width: 180px;
    height: 130px;
    margin-bottom: 20px;
    font-size: 14px;
    @media (max-width: 700px) {
        width: 95%;
    }
`

const Plot = styled.div.attrs({
})`
    font-size: 14px;
    color: grey;
`

const NoPlot = styled.div.attrs({
})`
    font-size: 14px;
    color: grey;
    overflow: hidden;
`

const Button = styled.button.attrs({
    className: 'btn',
})`
    background-color: #ff91a4;
    border-radius: 25px;
    width: 80%;
    height: 25%;
    color: white;
    font-weight: bold;
    margin-top: 5px;
    margin-left: 10%;
    line-height: 20px;
`

const GreenButton = styled.button.attrs({
    className: 'btn',
})`
    background-color: #92de8b;
    border-radius: 25px;
    width: 80%;
    height: 25%;
    color: white;
    font-weight: bold;
    margin-top: 5px;
    margin-left: 10%;
    line-height: 20px;
`

const Title = styled.h1.attrs({
    className: 'h4',
})`
    margin-top: 45px;
    margin-bottom: 30px;

    @media (max-width: 700px) {
        margin-left: 5%;
    }
`

const Paragraph = styled.p.attrs({
})`
    font-size: 12px;
    padding-right: 15px;
`

class ViewButton extends Component {
    viewCrop = event => {
        event.preventDefault()

        window.location.href = `/crop-details/${this.props.id}`
    }

    render() {
        return <Button onClick={this.viewCrop}>VIEW CROP</Button>
    }
}

class ReadyButton extends Component {
    viewCrop = event => {
        event.preventDefault()

        window.location.href = `/crop-details/${this.props.id}`
    }

    render() {
        return <GreenButton onClick={this.viewCrop}>VIEW CROP</GreenButton>
    }
}

class Notification extends Component {
    constructor(props) {
        super(props)
        this.state = {
            notifs: [],
        }
    }

    componentDidMount = async () => {
        await api.getAllNotifs().then(notifs => {
            console.log(notifs.data.data)
            this.setState({
                notifs: notifs.data.data,
            })
        })
    }

    clearNotifications() {
        api.clearActiveNotifs().then(
            console.log("Notifications Cleared")
        )
        window.location.reload()
    }

    render() {
        return (
            <div>
                <Title>Notifications &nbsp;&nbsp;
                    <Tooltip title="Clear">
                        <IconButton>
                            <DeleteIcon style={{ color: "red", fontSize: 18 }} onClick={this.clearNotifications} />
                        </IconButton>
                    </Tooltip>
                </Title>
                <Wrapper className="container-fluid">
                    {this.state.notifs.length <= 0 &&
                        <NoPlot>Currently there are no new Notifications to display.</NoPlot>
                    }
                    {
                        this.state.notifs.map(
                            notif =>
                                <div className="row container-fluid px-0" key={'notif' + notif._id}>
                                    <div className="col-md-12 px-0">
                                        {notif.type === 'plantadded' &&
                                            <PlantNotif>
                                                <b>{notif.message}</b>
                                                <Paragraph>"{notif.plant}" added on {notif.createdAt.split("T")[0]} at {notif.createdAt.split("T")[1].split(":")[0]}:{notif.createdAt.split("T")[1].split(":")[1]}</Paragraph>
                                            </PlantNotif>
                                        }
                                        {notif.type === 'plantupdated' &&
                                            <PlantNotif>
                                                <b>{notif.message}</b>
                                                <Paragraph>"{notif.plant}" updated on {notif.createdAt.split("T")[0]} at {notif.createdAt.split("T")[1].split(":")[0]}:{notif.createdAt.split("T")[1].split(":")[1]}</Paragraph>
                                            </PlantNotif>
                                        }
                                        {notif.type === 'sensorwarning' &&
                                            <CropNotif>
                                                <b>{notif.plant}</b>
                                                <Plot>Plot&nbsp;{notif.plot}<br/>{notif.description}</Plot>
                                                <ViewButton id={notif.key} />
                                            </CropNotif>
                                        }
                                        {notif.type === 'readytoharvest' &&
                                            <CropNotif>
                                                <b>{notif.plant}</b>
                                                <Plot>Plot&nbsp;{notif.plot}<br/>{notif.description}</Plot>
                                                <ReadyButton id={notif.key} />
                                            </CropNotif>
                                        }
                                    </div>
                                </div>
                        )
                    }
                </Wrapper>
            </div>
        )
    }
}

export default Notification
