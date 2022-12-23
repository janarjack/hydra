import React, { Component } from 'react'
import styled from 'styled-components'
import api from '../api'
import './PlantsList.css'
import MediaQuery from 'react-responsive'
import { Tooltip } from '@mui/material'

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

const MainTitle = styled.h1.attrs({
    className: 'h2',
})`
    position: relative;
    margin-bottom: 20px;
    margin-top: 10px;
    margin-left: 0px;
    font-size: 24px;
    font-family: 'Mukta-Bold';
    @media (max-width: 760px) {
        margin-top: 5px;
    }
`

const Title = styled.h1.attrs({
    className: 'h4',
})`
    margin: 5px 5px 14px;
    margin-left: 0px;
    font-family: 'Mukta-SemiBold';
    @media (max-width: 760px) {
        margin-left: 0px;
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
    width: 100%;
    padding: 5px;
    margin-bottom: 10px;
    border-bottom: 1px solid #B6D0E2 !important;
`

const TdWide = styled.td.attrs({
})`
    padding-left: 10px;
    font-size: 14px;
    text-align: left;
    width: 84%;
`

const TdNarrow = styled.td.attrs({
})`
    padding-left: 10px;
    font-size: 14px;
    text-align: left;
    width: 8%;
`

class UpdatePlant extends Component {
    updatePlant = event => {
        event.preventDefault()

        window.location.href = `/plants/update/${this.props.id}`
    }

    render() {
        return  <Tooltip title="Edit"><Update onClick={this.updatePlant}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
        </svg></Update></Tooltip>
    }
}

class DeletePlant extends Component {
    deletePlant = event => {
        event.preventDefault()

        if (
            window.confirm(
                `Do you want to delete the plant permanently?`,
            )
        ) {
            api.deletePlantById(this.props.id)
            setTimeout(() => { window.location.reload() }, 500)
        }
    }

    render() {
        return <Tooltip title="Delete"><Delete onClick={this.deletePlant}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
        </svg>
        </Delete></Tooltip>
    }
}

class PlantsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            plants: [],
        }
    }

    componentDidMount = async () => {
        await api.getAllPlants().then(plants => {
            console.log(plants.data.data)
            this.setState({
                plants: plants.data.data,
            })
        })
    }

    render() {
        return (
            <div>
                {this.props.logo !== 'hide' &&
                    <div className="createButtonDiv">
                        <a href="/plants/create">Create</a>
                    </div>
                }
                <Wrapper className={'container-fluid ' && this.props.logo !== 'hide' ? 'plant-list-margin' : 'plant-list-margin-no'}>
                    {this.props.logo !== 'hide' && <MainTitle>All Plants</MainTitle>}
                    {this.props.logo === 'hide' && <Title>Hydroponics Growth Chart</Title>}
                    <div className="row container-fluid px-0 ">
                        <MediaQuery minWidth={700}>
                            <table className={'container-fluid px-0 ' && this.props.logo === 'hide' ? 'dashboard' : 'fullpage'}>
                                <thead>
                                    <tr className={this.props.logo === 'hide' ? 'dashboard' : 'fullpage'}>
                                        <th className={this.props.logo === 'hide' ? 'dashboard' : 'fullpage'}>Crops</th>
                                        <th className={this.props.logo === 'hide' ? 'dashboard' : 'fullpage'}>pH</th>
                                        <th className={this.props.logo === 'hide' ? 'dashboard' : 'fullpage'}>EC</th>
                                        <th className={this.props.logo === 'hide' ? 'dashboard' : 'fullpage'}>Optimum DLI</th>
                                        <th className={this.props.logo === 'hide' ? 'dashboard' : 'fullpage'}>Harvest (Days)</th>
                                        {this.props.logo !== 'hide' &&
                                            <th className={this.props.logo === 'hide' ? 'dashboard' : 'fullpage'}>Action</th>
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.plants.map(
                                            plant =>
                                                <tr className={this.props.logo === 'hide' ? 'dashboard' : 'fullpage'} key={'row' + plant._id}>
                                                    <td className={this.props.logo === 'hide' ? 'dashboard' : 'fullpage'}>
                                                        {plant.name}
                                                    </td>
                                                    <td className={this.props.logo === 'hide' ? 'dashboard' : 'fullpage'}>
                                                        {plant.phmin}&nbsp;to&nbsp;{plant.phmax}
                                                    </td>
                                                    <td className={this.props.logo === 'hide' ? 'dashboard' : 'fullpage'}>
                                                        {plant.ecmin}&nbsp;to&nbsp;{plant.ecmax}
                                                    </td>
                                                    <td className={this.props.logo === 'hide' ? 'dashboard' : 'fullpage'}>
                                                        {plant.luxmin}&nbsp;to&nbsp;{plant.luxmax}
                                                    </td>
                                                    <td className={this.props.logo === 'hide' ? 'dashboard' : 'fullpage'}>
                                                        {plant.daystoharvest}
                                                    </td>
                                                    {this.props.logo !== 'hide' &&
                                                        <td className="account action">
                                                            <div>
                                                                <UpdatePlant id={plant._id} />
                                                                <DeletePlant id={plant._id} />
                                                            </div>
                                                        </td>
                                                    }
                                                </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </MediaQuery>

                        <MediaQuery maxWidth={760}>
                            {
                                this.state.plants.map(
                                    plant =>
                                        <Table className="container-fluid px-0 account" key={'row' + plant._id}>
                                            <tbody>
                                                <tr>
                                                    <TdWide>
                                                        <b>{plant.name}</b>
                                                    </TdWide>
                                                    {this.props.logo !== 'hide' &&
                                                        <TdNarrow><UpdatePlant id={plant._id} /></TdNarrow>
                                                    }
                                                    {this.props.logo !== 'hide' &&
                                                        <TdNarrow><DeletePlant id={plant._id} /></TdNarrow>
                                                    }
                                                </tr>
                                                <tr>
                                                    <TdWide>
                                                        pH: {plant.phmin}&nbsp;to&nbsp;{plant.phmax}
                                                    </TdWide>
                                                </tr>
                                                <tr>
                                                    <TdWide>
                                                        EC: {plant.ecmin}&nbsp;to&nbsp;{plant.ecmax}
                                                    </TdWide>
                                                </tr>
                                                <tr>
                                                    <TdWide>
                                                        Optimum DLI: {plant.luxmin}&nbsp;to&nbsp;{plant.luxmax}
                                                    </TdWide>
                                                </tr>
                                                <tr>
                                                    <TdWide>
                                                        Days to Harvest: {plant.daystoharvest}
                                                    </TdWide>
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

export default PlantsList
