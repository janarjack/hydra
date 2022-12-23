import React, { Component } from 'react'
import api from '../api'
import './CropSetting.css'
import styled from 'styled-components'
import MediaQuery from 'react-responsive'
const clientUrl = process.env.REACT_APP_CLIENT_URL
const serverImages = process.env.REACT_APP_SERVER_IMAGES

const Wrapper = styled.div.attrs({
    className: 'form-group',
})`
    margin-left: 50px;
    margin-top: 70px;
    @media (max-width: 700px) {
        width: 100%;
        margin-top: 0rem;
        margin-left: 0;
        margin-right: 0;
        margin-bottom: 50px;
    }
`

const StepText = styled.h6.attrs({
    className: 'h6',
})`
    margin-left: 15px;
`

const Title = styled.h1.attrs({
    className: 'h2',
})`
    margin-bottom: 30px;
`

const TitleMobile = styled.h1.attrs({
    className: 'h2',
})`
    margin-left: 5%;
    margin-top: 5%;
`

const HarvestLabel = styled.label`
    color: grey;
    margin-left: 5%;
    font-size: 12px;
`

const Plot = styled.div.attrs({
})`
    color: grey;
    cursor: pointer;
`

const ProgressImage = styled.div.attrs({
})`
    margin-top: 50px;
    @media (max-width: 760px) {
        margin-top: 0px;
    }
`

const Image = styled.div.attrs({
})`
    margin-bottom: 20px;
    width: 300px;
    @media (max-width: 700px) {
        width: 100%;
        padding-top: 5%;
        background-color: #C2D7BD;
    }
`

const Details = styled.div.attrs({
})`
    @media (max-width: 700px) {
        width: 100%;
        background-color: white;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        border-bottom-style: none;
    }
`

const Label = styled.label`
    margin: 5px;
    @media (max-width: 700px) {
        margin-left: 5%;
        margin-top: 5%;
        margin-bottom: 2%;
    }
`

const PlotLabel1 = styled.label`
    margin: 5px;
    margin-bottom: 10px;
    border-radius: 10px;
    background-color: #CCE4EB;
    width: 200px;

    @media (max-width: 700px) {
        width: 44%;
        margin-left: 4%;
        margin-right: 0;
    }
`

const PlotLabel2 = styled.label`
    margin: 5px;
    margin-bottom: 10px;
    border-radius: 10px;
    background-color: #F3DBC7;
    width: 200px;

    @media (max-width: 700px) {
        width: 44%;
        margin-left: 4%;
        margin-right: 0;
    }
`
const PlotLabel3 = styled.label`
    margin: 5px;
    margin-bottom: 30px;
    border-radius: 10px;
    background-color: #F0E2E3;
    width: 200px;

    @media (max-width: 700px) {
        width: 44%;
        margin-left: 4%;
        margin-right: 0;
    }
`
const PlotLabel4 = styled.label`
    margin: 5px;
    margin-bottom: 30px;
    border-radius: 10px;
    background-color: #C2D7BD;
    width: 200px;

    @media (max-width: 700px) {
        width: 44%;
        margin-left: 4%;
        margin-right: 0;
    }
`

const Button = styled.button.attrs({
    className: `btn`,
})`
    margin-top: 30px;
    margin-right: 10px;
    background-color: #92de8b;
    border-radius: 25px;
    width: 25%;
    color: white;
    font-weight: bold;
    @media (max-width: 700px) {
        width: 70%;
        margin-left: 15%;
    }
`

const CancelButton = styled.div.attrs({
    className: `cancelBtn`,
})`
    margin-top: 30px;
`

class CropSetting extends Component {
    constructor(props) {
        super(props)

        this.state = {
            crops: [],
            plants: [],
            plant: this.props.match.params.id,
            plot: '',
            commence: '',
            waterlevel: 1,
            status: 'active',
            plot1: false,
            plot2: false,
            plot3: false,
            plot4: false
        }
    }

    componentDidMount = async () => {
        let plot1 = false
        let plot2 = false
        let plot3 = false
        let plot4 = false

        await api.getAllCrops().then(crops => {
            const cropsList = crops.data.data

            cropsList.forEach(function (crop) {
                if (crop.plot == 1)
                    plot1 = true
                if (crop.plot == 2)
                    plot2 = true
                if (crop.plot == 3)
                    plot3 = true
                if (crop.plot == 4)
                    plot4 = true
            })

            this.setState({
                crops: crops.data.data,
                plot1: plot1,
                plot2: plot2,
                plot3: plot3,
                plot4: plot4
            })
        })

        await api.getAllPlants().then(plants => {
            this.setState({
                plants: plants.data.data
            })
        })
    }

    handleChangeInputPlot = async event => {
        const plot = event.target.value
	let url = ''

        if ((plot == 1 && this.state.plot1 == true) ||
            (plot == 2 && this.state.plot2 == true) ||
            (plot == 3 && this.state.plot3 == true) ||
            (plot == 4 && this.state.plot4 == true)
        ) {
            window.alert('Plot ' + plot + ' is already occupied')
	    url = `/crop-setting/select-plot/${this.state.plant}`
	    const encoded = encodeURI(url);
            window.location.href = encoded
        } else {
            this.setState({ plot })
        }
    }

    handleChangeInputCommence = async date => {
        const commence = date.toString()
        this.setState({ commence })
    }

    cropSettingStep2 = async () => {
        const { plant, plot } = this.state
        this.state = {
            plant: plant,
            plot: plot,
        }

        if ((plot == 1 && this.state.plot1 == true) ||
            (plot == 2 && this.state.plot2 == true) ||
            (plot == 3 && this.state.plot3 == true) ||
            (plot == 4 && this.state.plot4 == true)
        ) {
            window.alert('Plot ' + plot + ' is already occupied')
            window.location.reload()
        }

        if (plant !== null && plant !== '' && plot !== null && plot !== '')
            this.props.history.push(`/crop-setting/select-date/${this.state.plant}/${this.state.plot}`)
        else
            window.alert('Please select a Plot')
    }

    goBack() {
        window.location.href = `/crop-setting/select-plant`
    }

    render() {
        return (
            <div>
                <Wrapper className="formObj py-0">
                    <form className="row gx-0">
                        <MediaQuery minWidth={700}>
                            <div className="row container-fluid">
                                <div className="col-md-12">
                                    <Title>Crop Setting</Title>
                                </div>
                            </div>

                            {
                                this.state.plants.map(
                                    plant =>
                                        <div>
                                            {
                                                plant.name === this.state.plant &&
                                                <div className="row container-fluid px-0 gx-0">
                                                    <div className="col-md-1 col-xs-12">
                                                        <Image className="col-xs-12">
                                                            <img className="viewCropImg" src={serverImages + plant.photo} alt="plant" />
                                                        </Image>
                                                    </div>
                                                    <div className="col-md-11 col-xs-0"></div>
                                                </div>
                                            }
                                        </div>
                                )
                            }

                            <div className="row container-fluid">
                                <div className="col-md-8">
                                    <Label>2. Assign Plot</Label>
                                </div>
                                <div className="col-md-2"></div>
                            </div>
                            <div className="row container-fluid">
                                <div className="col-md-2">
                                    <PlotLabel2>
                                        <input type="radio" name="plot" value="2" className="card-input-element" onChange={this.handleChangeInputPlot} />
                                        <div className="panel panel-default card-input">
                                            <div className="panel-heading">Plot 2</div>
                                        </div>
                                    </PlotLabel2>
                                </div>
                                <div className="col-md-1"></div>
                                <div className="col-md-2">
                                    <PlotLabel1>
                                        <input type="radio" name="plot" value="1" className="card-input-element" onChange={this.handleChangeInputPlot} />
                                        <div className="panel panel-default card-input">
                                            <div className="panel-heading">Plot 1</div>
                                        </div>
                                    </PlotLabel1>
                                </div>
                                <div className="col-md-2"></div>
                            </div>
                            <div className="row container-fluid">
                                <div className="col-md-2">
                                    <PlotLabel3>
                                        <input type="radio" name="plot" value="3" className="card-input-element" onChange={this.handleChangeInputPlot} />
                                        <div className="panel panel-default card-input">
                                            <div className="panel-heading">Plot 3</div>
                                        </div>
                                    </PlotLabel3>
                                </div>
                                <div className="col-md-1"></div>
                                <div className="col-md-2">
                                    <PlotLabel4>
                                        <input type="radio" name="plot" value="4" className="card-input-element" onChange={this.handleChangeInputPlot} />
                                        <div className="panel panel-default card-input">
                                            <div className="panel-heading">Plot 4</div>
                                        </div>
                                    </PlotLabel4>
                                </div>
                                <div className="col-md-2"></div>
                            </div>
                            <div className="row container-fluid px-0 gx-0">
                                <div className="col-md-6 flex-container">
                                    <Button onClick={this.cropSettingStep2}>Next</Button>
                                    <CancelButton><a href={'/crop-setting/select-plant'}>Cancel</a></CancelButton>
                                </div>
                                <div className="col-md-6"></div>
                            </div>
                        </MediaQuery>

                        <MediaQuery maxWidth={700}>
                            {
                                this.state.plants.map(
                                    plant =>
                                        <div>
                                            {
                                                plant.name === this.state.plant &&
                                                <div className="row container-fluid px-0 gx-0">
                                                    <div className="col-md-12 col-xs-12">
                                                        <Image className="col-xs-12">
                                                            <Plot onClick={this.goBack}><h2>&nbsp;&nbsp;&#8592;</h2></Plot>
                                                            <div className="stepper-wrapper">
                                                              <div className="stepper-item completed">
                                                                <div className="step-counter">&#10003;</div>
                                                                <div className="step-name">Step 1</div>
                                                              </div>
                                                              <div className="stepper-item active">
                                                                <div className="step-counter">&#9900;</div>
                                                                <div className="step-name">Step 2</div>
                                                              </div>
                                                              <div className="stepper-item">
                                                                <div className="step-counter">&#9900;</div>
                                                                <div className="step-name">Step 3</div>
                                                              </div>
                                                            </div>
                                                            {/*<ProgressImage>
                                                                <img className="progressBarImg" style={{"marginLeft":"10px"}} src={clientUrl + 'step-2.png'} alt="plant" />
                                                            </ProgressImage>
                                                            <div>
                                                                <StepText>Step 2</StepText>
                                                            </div>*/}
                                                            <img className="viewCropImg" src={serverImages + plant.photo} alt="plant" />
                                                            <Details className="row container-fluid px-0 gx-0">
                                                                <TitleMobile>{plant.name}</TitleMobile>
                                                                <HarvestLabel>{'Harvest in ' + plant.daystoharvest + ' days'}</HarvestLabel>
                                                                <div className="col-xs-8">
                                                                    <Label><b>Assign Plot</b></Label>
                                                                </div>
                                                                <div className="row container-fluid gx-0">
                                                                    <div className="col-md-12 col-xs-12">
                                                                        <PlotLabel2>
                                                                            <input type="radio" name="plot" value="2" className="card-input-element" onChange={this.handleChangeInputPlot} />
                                                                            <div className="panel panel-default card-input">
                                                                                <div className="panel-heading">Plot 2</div>
                                                                            </div>
                                                                        </PlotLabel2>
                                                                        <PlotLabel1>
                                                                            <input type="radio" name="plot" value="1" className="card-input-element" onChange={this.handleChangeInputPlot} />
                                                                            <div className="panel panel-default card-input">
                                                                                <div className="panel-heading">Plot 1</div>
                                                                            </div>
                                                                        </PlotLabel1>
                                                                    </div>
                                                                </div>

                                                                <div className="row container-fluid gx-0">
                                                                    <div className="col-md-12 col-xs-12">
                                                                        <PlotLabel3>
                                                                            <input type="radio" name="plot" value="3" className="card-input-element" onChange={this.handleChangeInputPlot} />
                                                                            <div className="panel panel-default card-input">
                                                                                <div className="panel-heading">Plot 3</div>
                                                                            </div>
                                                                        </PlotLabel3>
                                                                        <PlotLabel4>
                                                                            <input type="radio" name="plot" value="4" className="card-input-element" onChange={this.handleChangeInputPlot} />
                                                                            <div className="panel panel-default card-input">
                                                                                <div className="panel-heading">Plot 4</div>
                                                                            </div>
                                                                        </PlotLabel4>
                                                                    </div>
                                                                </div>
                                                                <div className="row container-fluid">
                                                                    <div className="col-md-4 flex-container">
                                                                        <Button onClick={this.cropSettingStep2}>Next</Button>
                                                                    </div>
                                                                    <div className="col-md-8"></div>
                                                                </div>
                                                            </Details>
                                                        </Image>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                )
                            }
                        </MediaQuery>
                    </form>
                </Wrapper>
            </div>
        )
    }
}

export default CropSetting
