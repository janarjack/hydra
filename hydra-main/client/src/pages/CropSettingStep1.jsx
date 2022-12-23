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
    width: 100%;

    @media (max-width: 700px) {
        width: 106%;
        margin-top: 20px;
        margin-left: 2%;
        margin-right: 2%;
        margin-bottom: 50px;
    }
`
const StepText = styled.h6.attrs({
    className: 'h6',
})`
    margin-left: 5px;
    margin-bottom: 30px;
`

const Plot = styled.div.attrs({
})`
    color: grey;
    cursor: pointer;
`

const Title = styled.h1.attrs({
    className: 'h2',
})`
    margin: 5px;
    margin-bottom: 30px;
`

const Label = styled.label`
    margin: 5px;
`

const ProgressImage = styled.div.attrs({
})`
    margin-top: 50px;
    @media (max-width: 428px) {
        margin-top: 0px;
    }
`

const Image = styled.div.attrs({
})`
    margin-top: 50px;
    @media (max-width: 428px) {
        margin-top: 0px;
    }
`

const PlantContainer = styled.div.attrs({
})`
    margin-right: 30px;

    @media (max-width: 700px) {
        width: 36%;
        height: 30%;
        margin-bottom: 0px;
    }
`

const PlantLabel = styled.label`
    width: 100%;
    height: 120px;
    font-size: 14px;
    margin-top: 10px;
    margin-bottom: 30px;
    background-color: #CCE4EB;
    border-radius: 10px;

    @media (max-width: 700px) {
        width: 112%;
        height: 90%;
        margin-left: 10%;
        margin-right: 0px;
        margin-bottom: 10px;
    }
`

const Button = styled.button.attrs({
    className: `btn`,
})`
    margin-top: 30px;
    margin-right: 10px;
    background-color: #92de8b;
    border-radius: 25px;
    width: 36%;
    color: white;
    font-weight: bold;
    @media (max-width: 700px) {
        width: 70%;
        margin-left: 10%;
    }
`

class CropSettingStep1 extends Component {
    constructor(props) {
        super(props)

        this.state = {
            plants: [],
            plant: '',
        }
    }

    componentDidMount = async () => {
        await api.getAllPlants().then(plants => {
            this.setState({
                plants: plants.data.data
            })
        })
    }

    handleChangeInputPlant = async event => {
        const plant = event.target.value
        this.setState({ plant })
    }

    cropSettingStep1 = async () => {
        const { plant } = this.state
        this.state = {
            plant: plant,
        }

        if (plant !== null && plant !== '')
            this.props.history.push(`/crop-setting/select-plot/${this.state.plant}`)
        else
            window.alert('Please select a Plant')
    }

    goBack() {
        window.location.href = `/dashboard`
    }

    render() {
        return (
            <div>
                <Wrapper className="formObj py-0">
                    <form className="row gx-0">
                        <MediaQuery minWidth={760}>
                            <div className="row container-fluid">
                                <div className="col-md-8">
                                    <Title>Crop Setting</Title>
                                </div>
                                <div className="col-md-4"></div>
                            </div>
                            <div className="row container-fluid">
                                <div className="col-md-8">
                                    <Label>1. Select Crop Type</Label>
                                </div>
                                <div className="col-md-4"></div>
                            </div>
                            <div className="row container-fluid px-0">
                                {
                                    this.state.plants.map(
                                        plant =>
                                            <PlantContainer className="col-md-2 px-0" key={'pname' + plant._id}>
                                                <PlantLabel>
                                                    <input type="radio" name="plant" value={plant.name} className="card-input-element" onChange={this.handleChangeInputPlant} />
                                                    <div className="card-input">
                                                        <div className="panel-heading flex-container"><div className="imgCardDiv"><img alt="plant" className="imgCard" src={serverImages + plant.photo} /></div><div className="nameCard">{plant.name}</div></div>
                                                    </div>
                                                </PlantLabel>
                                            </PlantContainer>
                                    )
                                }
                            </div>
                        </MediaQuery>

                        <MediaQuery maxWidth={760}>
                            <div className="row container-fluid">
                                <Image>
                                  <Plot onClick={this.goBack}><h2>&#8592;</h2></Plot>
                                  {// <ProgressImage>
                                  //     <img className="progressBarImg" src={clientUrl + 'step-1.png'} alt="plant" />
                                  // </ProgressImage>
                                  // <div>
                                  //     <StepText>Step 1</StepText>
                                  // </div>
                                  }
                                  <div className="stepper-wrapper">
                                    <div className="stepper-item active">
                                      <div className="step-counter">&#9900;</div>
                                      <div className="step-name">Step 1</div>
                                    </div>
                                    <div className="stepper-item">
                                      <div className="step-counter">&#9900;</div>
                                      <div className="step-name">Step 2</div>
                                    </div>
                                    <div className="stepper-item">
                                      <div className="step-counter">&#9900;</div>
                                      <div className="step-name">Step 3</div>
                                    </div>
                                  </div>
                                </Image>
                                <div className="col-md-8">
                                    <Title>Select a Crop Type</Title>
                                </div>
                                <div className="col-md-4"></div>
                            </div>
                            <div className="row container-fluid px-0 gx-0 g-custom">
                                {
                                    this.state.plants.map(
                                        plant =>
                                            <PlantContainer className="col-md-2 col-xs-6 px-0 gx-0" key={'pname' + plant._id}>
                                                <PlantLabel>
                                                    <input type="radio" name="plant" value={plant.name} className="card-input-element" onChange={this.handleChangeInputPlant} />
                                                    <div className="card-input">
                                                        <div className="panel-heading">
                                                            <div className="imgCardDiv">
                                                                <img alt="plant" className="imgCard" src={serverImages + plant.photo} />
                                                                <div className="nameCard">{plant.name}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </PlantLabel>
                                            </PlantContainer>
                                    )
                                }
                            </div>
                        </MediaQuery>

                        <div className="row container-fluid">
                            <div className="col-md-4 flex-container">
                                <Button onClick={this.cropSettingStep1}>Next</Button>
                            </div>
                            <div className="col-md-8"></div>
                        </div>
                    </form>
                </Wrapper>
            </div>
        )
    }
}

export default CropSettingStep1
