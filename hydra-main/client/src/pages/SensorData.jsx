import React, { Component } from 'react'
import styled from 'styled-components'
import api from '../api'
import './SensorData.css'

let Wrapper = styled.div.attrs({
})`
    width: 90%;
    margin-right: 2rem;
    margin-left: 1rem;

    @media (max-width: 760px) {
        margin-left: 0px;
        margin-top: 300px;
        width: 84%;
        margin-bottom: 5rem;
    }

    @media (max-width: 375px) {
        margin-top: 340px;
        margin-bottom: 25px;
    }
`

const Title = styled.h1.attrs({
    className: 'h4',
})`
    font-family: 'Mukta-Bold';
    margin: 5px 5px 14px;
`

const Plot = styled.div.attrs({
})`
    color: #939595;
    font-size: 14px;
    text-transform: capitalize;
`

const Table = styled.table.attrs({
    className: 'dashboard',
})`
    width: 180px !important;
    margin-bottom: 10px;
    border-bottom: 1px solid #B6D0E2 !important;
    @media (max-width: 700px) {
        width: 100% !important;
    }
`

const Td = styled.td.attrs({
})`
    font-size: 12px;
    width: 50%;
    text-align: center;
    @media (max-width: 700px) {
        width: 200px !important;
    }
`

class SensorData extends Component {
    constructor(props) {
        super(props)
        this.state = {
            crops: [],
        }
    }

    componentDidMount = async () => {
        await api.getAllCrops().then(crops => {
            console.log(crops.data.data)
            this.setState({
                crops: crops.data.data,
            })
        })
    }

    render() {
        return (
            <div>
                <Wrapper className="container-fluid">
                    <Title>Sensor Data</Title>
                    <div className="row container-fluid px-0">
                        {
                            this.state.crops.map(
                                (crop, index) => (
                                    <div className="col-md-6" key={'dashboard' + crop._id}>
                                        <Table>
                                            <tbody>
                                                <tr className={'tableline' + index}>
                                                    <td>
                                                        <Plot><b>&nbsp;&nbsp;Plot&nbsp;{crop.plot}</b></Plot>
                                                    </td>
                                                    <td>
                                                        <Plot>&nbsp;</Plot>
                                                    </td>
                                                </tr>
                                                <tr className={'tableline' + index}>
                                                    <Td>
                                                        pH
                                                    </Td>
                                                    <Td>
                                                        {crop.ph}
                                                    </Td>
                                                </tr>
                                                <tr className={'tableline' + index}>
                                                    <Td>
                                                        EC
                                                    </Td>
                                                    <Td>
                                                        {crop.ec}
                                                    </Td>
                                                </tr>
                                                <tr className={'tableline' + index}>
                                                    <Td>
                                                        DLI
                                                    </Td>
                                                    <Td>
                                                        {crop.lux}
                                                    </Td>
                                                </tr>
                                                <tr className={'tableline' + index}>
                                                    <Td>
                                                        Water
                                                    </Td>
                                                    <Td>
                                                        {crop.waterlevel}
                                                    </Td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </div>
                                )

                            )
                        }
                    </div>
                </Wrapper>
            </div>
        )
    }
}

export default SensorData
