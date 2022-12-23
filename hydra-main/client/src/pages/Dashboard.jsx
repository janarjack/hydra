import React, { Component } from 'react'
import styled from 'styled-components'
import CropsOverview from './CropsOverview'
import PlantsList from './PlantsList'
import SensorData from './SensorData'
import Notification from './Notification'
import MediaQuery from 'react-responsive'

let Wrapper = styled.div.attrs({
})`
    margin-top: 20px;
    @media (max-width: 700px) {
        margin-top: 90px;
    }
`

const GrowthTable = styled.div.attrs({
})`
    width: 60%;
    height: 300px;

    @media (max-width: 700px) {
        width: 82%;
    }
`

const SensorTables = styled.div.attrs({
})`
    width: 40%;

    @media (max-width: 700px) {
        width: 100%;
    }
`

const Title = styled.h1.attrs({
    className: 'h2',
})`
    margin-left: 62px;
    font-family: 'Mukta-Bold';
    @media (max-width: 700px) {
        margin-top: 10px;
	    margin-left: 5%;
        position: relative;
    }
`

class Dashboard extends Component {

    constructor(props) {
        super(props)

        this.state = {
            email: '',
            password: '',
        }
        this.dashboard = this.dashboard.bind(this);
    }

    dashboard() {
        this.props.dashboard.push('/dashboard');
    }

    render() {
        return (
            <Wrapper>
                <Title>Overview</Title>
                <div className="flex-container-outer px-0">
                    <CropsOverview logo="hide" />
                    <MediaQuery minWidth={700}>
                        <Notification />
                    </MediaQuery>
                </div>
                <MediaQuery minWidth={700}>
                    <div className="container-fluid">
                        <div className="flex-container-inner px-0">
                            <GrowthTable>
                                <PlantsList logo="hide" />
                            </GrowthTable>
                            <SensorTables>
                                <SensorData />
                            </SensorTables>
                        </div>
                    </div>
                </MediaQuery>
            </Wrapper>
        )
    }
}

export default Dashboard
