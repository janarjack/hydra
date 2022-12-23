import React, { Component } from 'react'
import api from '../api'
import './CropSetting.css'
import styled from 'styled-components'
import DatePicker from 'sassy-datepicker';
import MediaQuery from 'react-responsive'
const clientUrl = process.env.REACT_APP_CLIENT_URL

const Wrapper = styled.div.attrs({
    className: 'form-group',
})`
    margin-left: 50px;
    margin-top: 70px;
    @media (max-width: 700px) {
        margin-top: 20px;
        margin-left: 1%;
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

const Title = styled.h1.attrs({
    className: 'h2',
})`
    margin: 5px;
    margin-bottom: 30px;
`

const ProgressImage = styled.div.attrs({
})`
    margin-top: 50px;
    @media (max-width: 760px) {
        margin-top: 0px;
    }
`

const Plot = styled.div.attrs({
})`
    color: grey;
    cursor: pointer;
`

const Image = styled.div.attrs({
})`
    margin-bottom: 20px;
    width: 300px;
    @media (max-width: 700px) {
        width: 100%;
        padding-top: 5%;
    }
`

const Label = styled.label`
    margin: 5px;
`

const Button = styled.button.attrs({
    className: `btn`,
})`
    margin-top: 30px;
    margin-right: 10px;
    margin-left: 50px;
    background-color: #92de8b;
    border-radius: 25px;
    width: 50%;
    color: white;
    font-weight: bold;
    @media (max-width: 700px) {
        width: 36%;
    }
`

const CancelButton = styled.div.attrs({
    className: `btn`,
})`
    margin-top: 30px;
    background-color: #d5d3d3;
    border-radius: 25px;
    width: 50%;
    color: white;
    font-weight: bold;
    @media (max-width: 700px) {
        width: 36%;
    }
`

class CropSetting extends Component {
    constructor(props) {
        super(props)

        this.currentDate = new Date();
        this.state = {
            plants: [],
            plant: this.props.match.params.plant,
            plot: this.props.match.params.plot,
            commence: this.currentDate.toString(),
            waterlevel: 1,
            status: 'active',
            department: '',
        }

        this.plantName = this.props.match.params.plant;
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true })

        await api.getAllPlants().then(plants => {
            this.setState({
                plants: plants.data.data
            })
        })
    }

    handleChangeSelectDepartment = async event => {
        const department = event.target.value
        this.setState({ department })
    }

    handleChangeInputPlot = async event => {
        const plot = event.target.value
        this.setState({ plot })
    }

    handleChangeInputCommence = async date => {
        const commence = date.toString()
        this.setState({ commence })
    }

    cropSetting = async event => {
        event.preventDefault()
        const { plant, plot, commence, waterlevel, status, department } = this.state
        const payload = { plant, plot, commence, waterlevel, status, department }

        if(department !== null && department !== '') {
          if (plant !== null && plant !== '' &&
              plot !== null && plot !== '' &&
              commence !== null && commence !== '') {
              await api.insertCrop(payload).then(async res => {
                  this.setState({
                      plant: '',
                      plot: '',
                      commence: '',
                      department: '',
                  })
                  await window.alert(`Crop Setting saved successfully`)
                  setTimeout(() => { window.location.href = `/dashboard` }, 500)
              })
          } else {
              window.alert(`Please select a Date`)
          }
        }
        else {
          window.alert(`Please select a Department`)
        }

    }


    goBack = event => {
        event.preventDefault()
	window.history.back()
    }

    render() {
        return (
            <div>
                <Wrapper className="formObj py-0">
                    <form className="row gx-0 g-custom">
                        <MediaQuery minWidth={700}>
                            <div className="row container-fluid">
                                <div className="col-md-8">
                                    <Title>Crop Setting</Title>
                                </div>
                                <div className="col-md-4"></div>
                            </div>
                        </MediaQuery>

                        <div className="row container-fluid">
                            <div className="col-md-8 col-xs-12">
                                <MediaQuery minWidth={700}>
                                  <Label><b>Department:</b></Label>
                                  <select name="department" id="department" class="form-control" onChange={this.handleChangeSelectDepartment}>
                                    <option value="" disabled selected hidden>Select</option>
                                    <option value="PSD">PSD</option>
                                    <option value="FMD">FMD</option>
                                    <option value="MQSD,MHRCCD,COMD,RBOD">MQSD,MHRCCD,COMD,RBOD</option>
                                    <option value="COSD">COSD</option>
                                  </select>
                                  <br />
                                  <Label>3. Commencement Date</Label>
                                </MediaQuery>
                                <MediaQuery maxWidth={700}>
                                      <Plot onClick={this.goBack}><h2>&#8592;</h2></Plot>
                                      {/*<ProgressImage>
                                          <img className="progressBarImg" style={{"width":"110%"}} src={clientUrl + 'step-3.png'} alt="plant" />
                                      </ProgressImage>
                                      <div>
                                          <StepText>Step 3</StepText>
                                      </div>*/}
                                      <div className="stepper-wrapper">
                                        <div className="stepper-item completed">
                                          <div className="step-counter">&#10003;</div>
                                          <div className="step-name">Step 1</div>
                                        </div>
                                        <div className="stepper-item completed">
                                          <div className="step-counter">&#10003;</div>
                                          <div className="step-name">Step 2</div>
                                        </div>
                                        <div className="stepper-item active">
                                          <div className="step-counter">&#9900;</div>
                                          <div className="step-name">Step 3</div>
                                        </div>
                                      </div>

                                    <Label><b>Department:</b></Label>
                                    <select name="department" id="department" class="form-control" onChange={this.handleChangeSelectDepartment}>
                                      <option value="" disabled selected hidden>Select</option>
                                      <option value="PSD">PSD</option>
                                      <option value="FMD">FMD</option>
                                      <option value="MQSD,MHRCCD,COMD,RBOD">MQSD,MHRCCD,COMD,RBOD</option>
                                      <option value="COSD">COSD</option>
                                    </select>
                                    <br />
                                    <Label><b>Commencement Date</b></Label>
                                </MediaQuery>
                                <DatePicker className="gx-0" onChange={this.handleChangeInputCommence} />
                            </div>
                            <div className="col-md-2"></div>
                        </div>

                        <div className="row container-fluid">
                            <div className="col-md-6 flex-container">
                                <Button onClick={this.cropSetting}>Add Crop</Button>
                                <CancelButton><a href={'/crop-setting/select-plant'}>Cancel</a></CancelButton>
                            </div>
                            <div className="col-md-6"></div>
                        </div>
                    </form>
                </Wrapper>
            </div>
        )
    }
}

export default CropSetting
