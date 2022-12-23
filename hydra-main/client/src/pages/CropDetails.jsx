import React, { Component,useState } from 'react'
import styled from 'styled-components'
import api from '../api'
import MediaQuery from 'react-responsive'

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
const clientUrl = process.env.REACT_APP_CLIENT_URL
const serverImages = process.env.REACT_APP_SERVER_IMAGES

const Wrapper = styled.div.attrs({
    className: 'form-group px-0',
})`
    margin-top: 24x;
    margin-bottom: 30px;
    width: 100%;

    @media (max-width: 700px) {
        margin-left: 0rem;
        margin-right: 0rem;
        margin-top: 0rem;
        width: 100%;
    }
`

const Plot = styled.div.attrs({
})`
    color: grey;
    padding-bottom: 2px;
    cursor: pointer;
`

const HarvestDate = styled.div.attrs({
})`
    color: grey;
    font-size: 14px;
    @media (max-width: 428px) {
      margin-left: 20px;
    }
`

const Background = styled.div.attrs({
    className: 'col-md-5 col-xs-12 gx-0',
})`
    background-color: #F3DBC7;
`

const Details = styled.div.attrs({
    className: 'col-md-7 col-xs-12',
})`
    text-align: left;
    padding-left: 5%;
    padding-top: 10px;

    @media (max-width: 428px) {
        margin: 5px;
    }
`

const Image = styled.div.attrs({
})`
    margin-top: 50px;
    @media (max-width: 428px) {
        margin-top: 0px;
    }
`

const Progress = styled.div.attrs({
})`
    width: 75px;
    height: 75px;
    margin-right: 20px;
    @media (max-width: 700px) {
        margin: 5px;
        margin-right: 10px;
    }
`

const Growth = styled.div.attrs({
})`
    text-align: left;
    background-color: white;
    width: 90%;
    padding-top: 7%;
    margin-left: 5%;
    padding-left: 10%;
    border-radius: 4%;
    white-space: nowrap;
`

const BackgroundMobile = styled.div.attrs({
    className: 'col-md-5 col-xs-12 px-0 py-0 gx-0',
})`
    background-color: #F3DBC7;
    height: 500px;
    width: 100%;
`

const GrowthMobile = styled.div.attrs({
})`
    text-align: left;
    background-color: white;
    width: 100%;
    border-radius: 20px;
    white-space: nowrap;
`

const ProgressCard = styled.div.attrs({
    className: 'flex-container',
})`
    box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.25);
    border-bottom-right-radius: 5px;
    margin-right: 5%;
    padding-right: 5px;
`

const SensorContainer = styled.div.attrs({
    className: 'flex-container',
})`
    margin-right: 12px;
    margin-bottom: 20px;
    padding-right: 5px;
    @media (max-width: 700px) {
        margin-right: 0px;
        margin: 5px;
        padding-right: 0px;
    }
    @media (max-width: 428px) {
        margin-right: 0px;
        margin: 5px;
        padding-right: 0px;
    }
`

const Day = styled.div.attrs({
})`
    font-size: 14px;
    padding-bottom: 20px;
    text-transform: capitalize;
    @media (max-width: 428px) {
        margin-left: 20px;
      }
`

const Sensor = styled.div.attrs({
    className: 'col-md-5 col-xs-1',
})`
    background-color: #e3eff3;
    border-radius: 5%;
    height: 65px;
    margin-right: 15px;
    margin-top: 10px;

    @media (max-width: 700px) {
        width: 80%;
        margin-left: 5%;
        margin-right: 15%;
        padding: 0;
    }

    @media (max-width: 428px) {
        width: 80%;
        margin-left: 5%;
        margin-right: 15%;
    }
`

const Icon = styled.div.attrs({
    className: 'flex-child icon',
})`
    margin-top: 15px;
    margin-right: 30px;

    @media (max-width: 700px) {
        margin-right: 10px;
    }

    @media (max-width: 428px) {
        margin-right: 5px;
    }
`

const WarningIcon = styled.div.attrs({
})`
    float: right;
    padding-right: 20px;
`

const SensorLabel = styled.div.attrs({
})`
    font-size: 10px;
    margin-right: 30px;
    white-space: nowrap;
`

const SensorVal = styled.div.attrs({
})`
    font-size: 14px;
    font-weight: bold;
`

const Arrow = styled.a.attrs({
})`
    color: white !important;
    text-decoration: none;
    font-size: 14px;
`

const Button = styled.button.attrs({
    className: 'btn btn-hover',
})`
    background-color: #92de8b;
    border-radius: 25px;
    width: 50%;
    color: white;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 0.1rem;
    @media (max-width: 700px) {
        width: 100%;
    }
`

const ButtonMobile = styled.button.attrs({
    className: 'btn px-0',
})`
    background-color: #92de8b;
    border-radius: 50%;
    height: 50px;
    width: 50px;
    color: white;
    font-weight: bold;
    margin-left: 43%;
`

const growthCard = {
    width: "1200px"
}

class CropDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.match.params.id,
            crops: [],
            harvestDate: '',
            remainingDays: '',
            percent: '',
        }
    }

    componentDidMount = async () => {
		localStorage.removeItem("plantID");
		localStorage.setItem('plantID', this.state.id);
        const { id } = this.state

        await api.getCropById(id).then(
            crops => {
                let harvestDate = new Date(crops.data.data[0].commence)
                let daysToHarvest = crops.data.data[0].details[0].daystoharvest
                harvestDate.setDate(harvestDate.getDate() + (parseInt(daysToHarvest) - 1))
                console.log('harvestDate: ' + harvestDate)
                let remainingDays = ((harvestDate - new Date()) / (1000 * 3600 * 24)) + 1

                let percent = 0
                if (remainingDays <= 0) {
                    percent = 100
                } else {
                    percent = (parseInt(daysToHarvest) - parseInt(remainingDays)) / parseInt(daysToHarvest) * 100
                }

                console.log(crops.data.data)

                const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                harvestDate = harvestDate.getDate() + " " + months[harvestDate.getMonth()] + " " + harvestDate.getFullYear()

                this.setState({
                    crops: crops.data.data,
                    harvestDate: harvestDate,
                    remainingDays: Math.round(remainingDays),
                    percent: Math.round(percent),
                })
            }
        )
    }

    goBack() {
        window.location.href = `/crops/list`
    }

    viewCameraFeed(event) {
	let plot = event.target.id;
	if(plot) {
	    console.log(plot)
	} else {
	   plot = event.currentTarget.id
	    console.log(plot)
	}
	const iD=window.location.pathname.split('/crop-details/')[1];
	window.location.href = `/crop-camera/${plot}`
    }

    render() {
        return (
            <div>
                <MediaQuery minWidth={700}>
                    {
                        this.state.crops.map(
                            crop =>
                                <Wrapper className="container-fluid px-0" key={'details' + crop._id}>
                                    <div className="row container-fluid growthCard">
                                        <Background>
                                            <Image>
                                                <img className="viewCropImg" src={serverImages + crop.details[0].photo} alt="plant" />
                                            </Image>
                                            <Growth className="flex-container">
                                                <br />
                                                <Progress>
                                                    <CircularProgressbar
                                                        className="crop-growth-card-margin"
                                                        value={this.state.percent}
                                                        text={`${this.state.percent}%`}
                                                        strokeWidth="12"
                                                        styles={{
                                                            path: {
                                                                // Path color
                                                                stroke: `#92DE8B`
                                                            },
                                                            trail: {
                                                                // Trail color
                                                                stroke: '#DCDCDC',
                                                            }
                                                        }}
                                                    />
                                                </Progress>
                                                <br />
                                                <div>
                                                    <div className="crop-growth-btn crop-growth-card-margin"><Arrow href={`/crop-growth/${crop._id}?name=${crop.plant}&plot=${crop.plot}`}>PLANT GROWTH STAGE</Arrow></div>
                                                    <HarvestDate>Expected Harvest:&nbsp;{this.state.harvestDate}</HarvestDate>
                                                    <Day>{this.state.remainingDays} days to harvest</Day>
                                                </div>
                                            </Growth>
                                            <br />
                                        </Background>
                                        <Details>
                                            <Plot onClick={this.goBack}><h2>&#8592;</h2></Plot>
                                            <div>
                                                {
                                                  (crop.ph < crop.details[0].phmin || crop.ph > crop.details[0].phmax || crop.ec < crop.details[0].ecmin || crop.ec > crop.details[0].ecmax || crop.lux < crop.details[0].luxmin || crop.lux > crop.details[0].luxmax || crop.waterlevel === 0) &&
                                                  <WarningIcon>
                                                      <img src={clientUrl + 'exclamation-mark.png'} alt="warning-icon" />
                                                  </WarningIcon>
                                                }
                                                <h2>{crop.plant}</h2>
                                            </div>
                                            <Plot>
                                                <h6>PLOT&nbsp;{crop.plot}</h6>
                                            </Plot>
                                            <Plot>
                                                <h6>{crop.department}</h6>
                                            </Plot>
                                            <div>
                                                <h5>PLANT OVERVIEW</h5>
                                            </div>
                                            <div className="row container-fluid">
                                                <Sensor className={(crop.ph < crop.details[0].phmin || crop.ph > crop.details[0].phmax) && 'warning-bg'}>
                                                    <div className="flex-container">
                                                        <Icon>
                                                            <img src={clientUrl + 'icon-test-tube.png'} alt="sensor-icon" />
                                                        </Icon>
                                                        <Icon>
                                                            <SensorLabel>PH SENSOR</SensorLabel>
                                                            <SensorVal>{crop.ph}</SensorVal>
                                                        </Icon>
                                                    </div>
                                                </Sensor>
                                                <Sensor className={(crop.ec < crop.details[0].ecmin || crop.ec > crop.details[0].ecmax) && 'warning-bg'}>
                                                    <div className="flex-container">
                                                        <Icon>
                                                            <img src={clientUrl + 'icon-sprinkler.png'} alt="sensor-icon" />
                                                        </Icon>
                                                        <Icon>
                                                            <SensorLabel>EC SENSOR</SensorLabel>
                                                            <SensorVal>{crop.ec}</SensorVal>
                                                        </Icon>
                                                    </div>
                                                </Sensor>
                                            </div>
                                            <div className="row container-fluid">
                                                <Sensor className={(crop.lux < crop.details[0].luxmin || crop.lux > crop.details[0].luxmax) && 'warning-bg'}>
                                                    <div className="flex-container">
                                                        <Icon>
                                                            <img src={clientUrl + 'icon-bulb.png'} alt="sensor-icon" />
                                                        </Icon>
                                                        <Icon>
                                                            <SensorLabel>LUX SENSOR</SensorLabel>
                                                            <SensorVal>{crop.lux}</SensorVal>
                                                        </Icon>
                                                    </div>
                                                </Sensor>
                                                <Sensor className={crop.waterlevel === 0 && 'warning-bg'}>
                                                    <div className="flex-container">
                                                        <Icon>
                                                            <img src={clientUrl + 'icon-water-drop.png'} alt="sensor-icon" />
                                                        </Icon>
                                                        <Icon>
                                                            <SensorLabel>WATER LEVEL</SensorLabel>
                                                            <SensorVal>{crop.waterlevel}</SensorVal>
                                                        </Icon>
                                                    </div>
                                                </Sensor>
                                            </div>
                                            <br />
                                            <br />
                                            <br />
                                            <div className="row container-fluid">
                                                <div className="col-md-12">
                                                    <Button id={crop.plot} onClick={this.viewCameraFeed}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-camera" viewBox="0 0 16 16">
                                                            <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
                                                            <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
                                                        </svg>
                                                        &nbsp;&nbsp;
                                                        LIVE FEED
                                                    </Button>
                                                </div>
                                            </div>
                                        </Details>
                                    </div>
                                </Wrapper>

                        )
                    }
                </MediaQuery>
                <MediaQuery maxWidth={700}>
                    {
                        this.state.crops.map(
                            crop =>
                                <Wrapper className="container-fluid px-0" key={'details' + crop._id}>
                                    <div className="row container-fluid px-0 gx-0">
                                        <BackgroundMobile>
                                            <Plot onClick={this.goBack}><h2>&nbsp;&nbsp;&#8592;</h2></Plot>
                                            <Image>
                                                <img className="viewCropImg" src={serverImages + crop.details[0].photo} alt="plant" />
                                            </Image>
                                            <GrowthMobile>
                                                <Details>
                                                    <div>
                                                        {
                                                          (crop.ph < crop.details[0].phmin || crop.ph > crop.details[0].phmax || crop.ec < crop.details[0].ecmin || crop.ec > crop.details[0].ecmax || crop.lux < crop.details[0].luxmin || crop.lux > crop.details[0].luxmax || crop.waterlevel === 0) &&
                                                          <WarningIcon>
                                                              <img src={clientUrl + 'exclamation-mark.png'} alt="warning-icon" />
                                                          </WarningIcon>
                                                        }
                                                        <h2>{crop.plant}</h2>
                                                    </div>
                                                    <Plot>
                                                        <h6>PLOT&nbsp;{crop.plot}</h6>
                                                    </Plot>
                                                    <Plot>
                                                        <h6>{crop.department}</h6>
                                                    </Plot>
                                                    <div>
                                                        <h6>PLANT OVERVIEW</h6>
                                                    </div>
                                                    <ProgressCard>
                                                        <Progress>
                                                            <CircularProgressbar
                                                                className="crop-growth-card-margin"
                                                                value={this.state.percent}
                                                                text={`${this.state.percent}%`}
                                                                strokeWidth="12"
                                                                styles={{
                                                                    path: {
                                                                        // Path color
                                                                        stroke: `#92DE8B`
                                                                    },
                                                                    trail: {
                                                                        // Trail color
                                                                        stroke: '#DCDCDC',
                                                                    }
                                                                }}
                                                            />
                                                        </Progress>
                                                        <br />
                                                        <div>
                                                            <div className="crop-growth-btn crop-growth-card-margin"><h6><Arrow href={`/crop-growth/${crop._id}?name=${crop.plant}&plot=${crop.plot}`}>PLANT GROWTH STAGE</Arrow></h6></div>
                                                            <HarvestDate>Expected Harvest:&nbsp;{this.state.harvestDate}</HarvestDate>
                                                            <Day>{this.state.remainingDays} days to harvest</Day>
                                                        </div>
                                                    </ProgressCard>
                                                    <SensorContainer>
                                                        <div className="row container-fluid px-0 flex-container-outer">
                                                            <Sensor className={(crop.ph < crop.details[0].phmin || crop.ph > crop.details[0].phmax) && 'warning-bg'}>
                                                                <div className="flex-container">
                                                                    <Icon>
                                                                        <img src={clientUrl + 'icon-test-tube.png'} alt="sensor-icon" />
                                                                    </Icon>
                                                                    <Icon>
                                                                        <SensorLabel>PH SENSOR</SensorLabel>
                                                                        <SensorVal>{crop.ph}</SensorVal>
                                                                    </Icon>
                                                                </div>
                                                            </Sensor>
                                                            <Sensor className={(crop.ec < crop.details[0].ecmin || crop.ec > crop.details[0].ecmax) && 'warning-bg'}>
                                                                <div className="flex-container">
                                                                    <Icon>
                                                                        <img src={clientUrl + 'icon-sprinkler.png'} alt="sensor-icon" />
                                                                    </Icon>
                                                                    <Icon>
                                                                        <SensorLabel>EC SENSOR</SensorLabel>
                                                                        <SensorVal>{crop.ec}</SensorVal>
                                                                    </Icon>
                                                                </div>
                                                            </Sensor>
                                                        </div>
                                                        <div className="row container-fluid px-0 flex-container-inner">
                                                            <Sensor className={(crop.lux < crop.details[0].luxmin || crop.lux > crop.details[0].luxmax) && 'warning-bg'}>
                                                                <div className="flex-container">
                                                                    <Icon>
                                                                        <img src={clientUrl + 'icon-bulb.png'} alt="sensor-icon" />
                                                                    </Icon>
                                                                    <Icon>
                                                                        <SensorLabel>LUX SENSOR</SensorLabel>
                                                                        <SensorVal>{crop.lux}</SensorVal>
                                                                    </Icon>
                                                                </div>
                                                            </Sensor>
                                                            <Sensor className={crop.waterlevel === 0 && 'warning-bg'}>
                                                                <div className="flex-container">
                                                                    <Icon>
                                                                        <img src={clientUrl + 'icon-water-drop.png'} alt="sensor-icon" />
                                                                    </Icon>
                                                                    <Icon>
                                                                        <SensorLabel>WATER LEVEL</SensorLabel>
                                                                        <SensorVal>{crop.waterlevel}</SensorVal>
                                                                    </Icon>
                                                                </div>
                                                            </Sensor>
                                                        </div>
                                                    </SensorContainer>
                                                    <div className="row container-fluid">
                                                        <div className="col-md-12">
                                                            <ButtonMobile id={crop.plot} onClick={this.viewCameraFeed}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-camera" viewBox="0 0 16 16">
                                                                    <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
                                                                    <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
                                                                </svg>
                                                            </ButtonMobile>
                                                        </div>
                                                    </div>
                                                </Details>
                                            </GrowthMobile>
                                            <br />
                                        </BackgroundMobile>
                                    </div>
                                </Wrapper>

                        )
                    }
                </MediaQuery>
            </div>
        )
    }
}

export default CropDetails
