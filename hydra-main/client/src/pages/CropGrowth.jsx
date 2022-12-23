import React, { Component } from 'react'
import styled from 'styled-components'
import api from '../api'
import './CropGrowth.css'
import { CircularProgressbar, CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import CookieService from '../api/CookieService';


const clientUrl = process.env.REACT_APP_CLIENT_URL;

const Wrapper = styled.div.attrs({
    className: 'form-group px-0',
})`
    margin-left: 70px;
    margin-top: 100px;
    margin-bottom: 50px;
    width: 100%;

    @media (max-width: 700px) {
        margin-left: 0rem;
        margin-right: 0rem;
        margin-top: 0rem;
        width: 167%;
    }

    @media (max-width: 428px) {
        margin-top: 0rem;
        width: 142%;
    }
`

const Plot = styled.div.attrs({
})`
    color: white;
    cursor: pointer;
    position: absolute;
    margin-left: 20px;
`

const HarvestDate = styled.div.attrs({
})`
    color: white;
    font-size: 14px;
    margin-bottom: 30px;
    margin-top: 30px;

    @media (max-width: 700px) {
        margin-top: 25px;
    }
`

const Background = styled.div.attrs({
    className: "col-md-12 col-xs-12 px-0 gx-0",
})`
    background-color: #92de8b;
    text-align: center;
    width: 100%;

    @media (max-width: 700px) {
        position: relative;
        width: 100%;
    }
`

const Progress = styled.div.attrs({
})`
    position: relative;
    width: 40%;
    height: 180px;
    margin-top: 30px;
    margin-left: 30%;
`

const SemiProgress = styled.div.attrs({
})`
    position: absolute;
	width:52%;
    height: 180px;
    margin-left: -23%;
	stroke-dasharray: 144.885px, 285.885px !import;

    @media (max-width: 428px) {
        margin-left: -23%;
        margin-top: 7%;
        width: 50%;
    }
`

const Stages = styled.div.attrs({
})`
    font-size: 16px;
    position: relative;
    margin-left: 36%;
`

const Growth = styled.div.attrs({
})`
    position: relative;
    width: 100%;
    text-align: left;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    background-color: white;
`

const Day = styled.div.attrs({
})`
    position: absolute;
    margin-top: 115px;
    margin-left: 150px;
    font-size: 14px;
    color: white;

    @media (max-width: 700px) {
        margin-top: 150px;
        margin-left: 220px;
        font-size: 12px;
    }

    @media (max-width: 428px) {
        margin-top: 130px;
        margin-left: 43%;
    }
`

const Button = styled.button.attrs({
    className: 'btn',
})`
    background-color: #92de8b;
    border-radius: 25px;
    position: relative;
    margin-left: 30%;
    width: 50%;
    color: white;
    font-weight: bold;
    @media (max-width: 700px) {
        width: 50%;
    }
    @media (max-width: 428px) {
        width: 70%;
        margin-left: 18%;
    }
`

class BackIcon extends Component {
    goBack = event => {
        event.preventDefault()
        window.location.href = `/crop-details/${this.props.id}`
    }

    render() {
        return <Plot onClick={this.goBack}><h2>&#8592;</h2></Plot>
    }
}

function getQueryParams() {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);
  
    const urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);

    return urlParams
}

class CropDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.match.params.id,
            crops: [],
            harvestDate: '',
            remainingDays: '',
            progressedDays: '',
            percent: '',
            showPdf: false,
            wc: 0,
            waterLevel: 0,
            lux: 0,
            nc: 0,
            fileName: ''
        }
        this.generatePDF = this.generatePDF.bind(this);
    }

    componentDidMount = async () => {
        const { id } = this.state

        await api.getCropById(id).then(
            crops => {
                let harvestDate = new Date(crops.data.data[0].commence)
                let daysToHarvest = crops.data.data[0].details[0].daystoharvest
                harvestDate.setDate(harvestDate.getDate() + (parseInt(daysToHarvest) - 1))
                console.log(harvestDate)
                let remainingDays = ((harvestDate - new Date()) / (1000 * 3600 * 24)) + 1
                let progressedDays = parseInt(daysToHarvest) - parseInt(remainingDays)

                let percent = 0
                if (remainingDays < 0) {
                    percent = 100
                } else {
                    percent = progressedDays / parseInt(daysToHarvest) * 100
                }

                console.log(Math.round(percent))

                const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                harvestDate = harvestDate.getDate() + " " + months[harvestDate.getMonth()] + " " + harvestDate.getFullYear()

                this.setState({
                    crops: crops.data.data,
                    harvestDate: harvestDate,
                    remainingDays: Math.round(remainingDays),
                    progressedDays: Math.round(progressedDays),
                    percent: Math.round(percent),
                })
            }
        )
    }

    goBack = (id) => {
        window.location.href = `/crop-details/${id}`
    }

    harvestCrop = async () => {
        const { id } = this.state

        await api.harvestCrop(id).then(res => {
            window.alert(`Crop updated as Harvested`)
            this.generatePDF();
        })
    }

    generatePDF = async () => {
        const data = getQueryParams();
        const email = CookieService.getEmailFromSession();
        const x = new Date();
        const date = `${x.getDate()}_${x.getMonth()+1}_${x.getFullYear()}`;
        this.setState({ fileName: data.name + '_' + 'Plot_' + data.plot + '_' + date })
        await api.generatePdf(this.state.id, email, this.state.fileName).then(res => {
            const url = res.data;
            const a = document.getElementById('pdf');
            a.href = url;
            a.click();
            window.location.href = `/dashboard`
        }, err => {
            if (err.response.status === 404) {
                window.alert(`No data to generate label`)
            }
            window.location.href = `/dashboard`
        })

    }


    render() {
        const departmentCode = CookieService.getDepartmentCodeFromSession();
        const role = CookieService.getRoleFromSession();
        return (
            <div>
                {
                    this.state.crops.map(
                        crop =>
                            <Wrapper className="container-fluid px-0" key={'details' + crop._id}>
                                <div className="row container-fluid px-0 gx-0">
                                    <Background>
                                        <BackIcon id={crop._id} />
                                        <Day>Days<br />to Harvest</Day>
                                        <Progress>
                                            <CircularProgressbarWithChildren
                                                value={this.state.percent}
                                                text={`${this.state.remainingDays}`}
                                                strokeWidth="9"
                                                styles={{
                                                    text: {
                                                        fill: '#a9e9e0',
                                                    },
                                                    path: {
                                                        // Path color
                                                        stroke: 'white',

                                                    },
                                                    trail: {
                                                        // Trail color
                                                        stroke: '#DCDCDC',
                                                    }
                                                }}
                                            />
                                        </Progress>
                                        <HarvestDate>Expected Harvest Date:&nbsp;{this.state.harvestDate}</HarvestDate>
                                        <Growth>
                                            <br />
                                            <div><h5>&nbsp;&nbsp;<b>Growth Stages</b></h5></div>
                                            <div className="flex-container">
                                                <div>
                                                    <SemiProgress>
                                                        <div className='half-width'></div>
                                                        <CircularProgressbarWithChildren
                                                            value={parseInt(this.state.percent)/2 >= 66.666 ? 66.666 : parseInt(this.state.percent)/2}
                                                            strokeWidth="9"
                                                            styles={buildStyles({
                                                              pathColor: "#00ff8c",
                                                              trailColor: "#eee",
                                                              strokeLinecap: "butt"
                                                            })}
                                                        >
                                                          <CircularProgressbarWithChildren
                                                              value={parseInt(this.state.percent)/2 >= 33.333 ? 33.333 : parseInt(this.state.percent)/2}
                                                              strokeWidth="9"
                                                              styles={buildStyles({
                                                                pathColor: "#ff8200",
                                                                trailColor: "transparent",
                                                                strokeLinecap: "butt"
                                                              })}
                                                          >
                                                          <CircularProgressbar
                                                              value={parseInt(this.state.percent)/2 >= 16.666 ? 16.666 : parseInt(this.state.percent)/2}
                                                              strokeWidth="9"
                                                              styles={buildStyles({
                                                                pathColor: "#ffc700",
                                                                trailColor: "transparent",
                                                                strokeLinecap: "butt"
                                                              })}
                                                          />
                                                        </CircularProgressbarWithChildren>
                                                      </CircularProgressbarWithChildren>
                                                    </SemiProgress>
                                                </div>
                                                <Stages>
                                                    <br />
                                                    {
                                                      (this.state.progressedDays >= 0) &&
                                                      <div>Day 0 -&nbsp;{crop.details[0].daystogerminate}:&nbsp;Germination</div>
                                                    }
                                                    <br />
                                                    <br />
                                                    <br />
                                                    {
                                                      (this.state.progressedDays > crop.details[0].daystogerminate) &&
                                                      <div>Day {parseInt(crop.details[0].daystogerminate) + 1} -&nbsp;{parseInt(crop.details[0].daystogerminate) + parseInt(crop.details[0].daystogrow)}:&nbsp;Fruit Growing</div>
                                                    }
                                                    <br />
                                                    <br />
                                                    <br />
                                                    {
                                                      (this.state.progressedDays == crop.details[0].daystoharvest) &&
                                                      <div>Day&nbsp;{crop.details[0].daystoharvest}:&nbsp;HARVEST</div>
                                                    }
                                                </Stages>
                                            </div>
                                            <br />
                                            <br />
                                            {(role === 'admin' || departmentCode === crop.department) &&
                                                <div className="row container-fluid">
                                                    <div className="col-md-12">
                                                        <Button onClick={this.harvestCrop}>
                                                            HARVEST NOW
                                                        </Button>
                                                    <a href={this.state.filePath} id="pdf" download={this.state.fileName}></a>
                                                    </div>
                                                </div>
                                            }
                                            {false &&
                                                <div className="row container-fluid" >
                                                    <div className="col-md-12">
                                                        <Button onClick={this.generatePDF} disabled={crop.status !== 'harvested'}>
                                                            Generate Label
                                                        </Button>
                                                    </div>
                                                </div>
                                            }   
                                        </Growth>
                                    </Background>
                                </div>
                            </Wrapper>

                    )
                }
            </div>
        )
    }
}

export default CropDetails
