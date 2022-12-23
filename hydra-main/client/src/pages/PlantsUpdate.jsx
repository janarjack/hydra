import React, { Component } from 'react';
import api from '../api';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
const serverImages = process.env.REACT_APP_SERVER_IMAGES

const Wrapper = styled.div.attrs({
    className: 'form-group',
})`
    margin-top: 24px;
    margin-left: 50px;
    margin-bottom: 18px;
    @media (max-width: 700px) {
        width: 100%;
        margin-top: 24px;
        margin-bottom: 18px;
        margin-left: 2%;
        margin-right: 3%;
    }
`

const Title = styled.h1.attrs({
    className: 'h2',
})`
    margin: 5px;
    margin-bottom: 4px;
    font-size: 24px;
    font-family: 'Mukta-Bold';
`

const Label = styled.label`
    margin: 10px;
`

const InputText = styled.input.attrs({
    className: 'form-control',
    required: "required",
})`
    margin: 5px;
    @media (max-width: 700px) {
        margin-bottom: 25px;
    }
`

const Image = styled.div.attrs({
})`
    margin-bottom: 20px;
    width: 300px;
    height: 160px;
    @media (max-width: 700px) {
        width: 100%;
    }
`
const Button = styled.button.attrs({
    className: `btn-hover`,
})`
    margin-top: 30px;
    margin-left: 5px;
    margin-right: 14px;
    background-color: #92de8b;
    border-radius: 25px;
    color: #fff;
    font-weight: bold;
    text-transform: uppercase;
    border: none;
    padding: 6px 22px;
    letter-spacing: 0.1rem;
    media (max-width: 700px) {
        magrin-top: 20px;
        width: 98%;
    }
    @media (max-width: 428px) {
        width: 47%;
        height: 45px;
        margin-top: 20px;
    }
`
const CancelButton = styled.div.attrs({
    className: `cancelBtn`,
})`
    margin-top: 30px;
    text-transform: uppercase;
    letter-spacing: 0.1rem;
    media (max-width: 700px) {
        magrin-top: 20px;
    }
    @media (max-width: 428px) {
        height: 45px !important;
        background-color: lightgrey !important;
        border-radius: 25px;
        width: 46% !important;
        align-text: center;
        padding-top: 5px;
        margin-top: 20px;
    }
`

class PlantsUpdate extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
            name: '',
            phmin: '',
            phmax: '',
            ecmin: '',
            ecmax: '',
            luxmin: '',
            luxmax: '',
            daystogerminate: '',
            daystogrow: '',
            daystoharvest: 0,
            photo: '',
            imgSrc: ''
        }
        this.inputFileRef = React.createRef();
    }

    componentDidMount = async () => {
        const { id } = this.state
        const plant = await api.getPlantById(id)

        this.setState({
            name: plant.data.data.name,
            phmin: plant.data.data.phmin,
            phmax: plant.data.data.phmax,
            ecmin: plant.data.data.ecmin,
            ecmax: plant.data.data.ecmax,
            luxmin: plant.data.data.luxmin,
            luxmax: plant.data.data.luxmax,
            daystogerminate: plant.data.data.daystogerminate,
            daystogrow: plant.data.data.daystogrow,
            daystoharvest: plant.data.data.daystoharvest,
            photoUrl: plant.data.data.photo,
            imgSrc: serverImages + plant.data.data.photo
        })
    }

    handleChangeInputName = async event => {
        const name = event.target.value
        this.setState({ name })
    }

    handleChangeInputPhMin = async event => {
        const phmin = event.target.value
        this.setState({ phmin })
    }

    handleChangeInputPhMax = async event => {
        const phmax = event.target.value
        this.setState({ phmax })
    }

    handleChangeInputEcMin = async event => {
        const ecmin = event.target.value
        this.setState({ ecmin })
    }

    handleChangeInputEcMax = async event => {
        const ecmax = event.target.value
        this.setState({ ecmax })
    }

    handleChangeInputLuxMin = async event => {
        const luxmin = event.target.value
        this.setState({ luxmin })
    }
    handleChangeInputLuxMax = async event => {
        const luxmax = event.target.value
        this.setState({ luxmax })
    }

    handleChangeInputDaysToGerminate = async event => {
        const daystogerminate = event.target.value
        this.setState({ daystogerminate })
    }

    handleChangeInputDaysToGrow = async event => {
        const daystogrow = event.target.value
        this.setState({ daystogrow })
    }

    handleChangeInputPhoto = async event => {
        const photo = event.target.files[0];
        let imgSrc = URL.createObjectURL(event.target.files[0]);
        this.setState({ imgSrc })
        this.setState({ photo })
    }

    handleTiggerImageUpload = async event => {
        this.inputFileRef.current.click();
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const { id, name, phmin, phmax, ecmin, ecmax, luxmin, luxmax, daystogerminate, daystogrow, photo } = this.state

        let daystoharvest = 0
        if (daystogerminate > 0 && daystogrow > 0) {
            daystoharvest = parseInt(daystogerminate) + parseInt(daystogrow) + 1
        }

        const formData = new FormData();
        formData.append('id', id);
        formData.append('name', name);
        formData.append('phmin', phmin);
        formData.append('phmax', phmax);
        formData.append('ecmin', ecmin);
        formData.append('ecmax', ecmax);
        formData.append('luxmin', luxmin);
        formData.append('luxmax', luxmax);
        formData.append('daystogerminate', daystogerminate);
        formData.append('daystogrow', daystogrow);
        formData.append('daystoharvest', daystoharvest);
        formData.append('photo', photo);

        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        await api.updatePlantById(formData).then(
            res => {
                console.log(res);
                window.alert(`Plant updated successfully`)

                api.insertNotif(
                    {
                        type: 'plantupdated',
                        message: 'Plant database updated!',
                        plant: name,
                        status: 'active',
                    }
                ).then(
                    res => {
                        console.log(res)
                        window.location.href = `/plants/list`
                    }
                ).catch(err => {
                    console.log(err);
                });
            }
        ).catch(err => {
            alert("some error occurred")
            console.log(err);
        })
    }

    render() {
        const { name,
            phmin, phmax,
            ecmin, ecmax,
            luxmin, luxmax,
            daystogerminate, daystogrow,imgSrc } = this.state

        return (
            <div>
                <Wrapper className="formObj py-0">
                    <form className="row g-2" encType='multipart/form-data'>
                        <div className="row container-fluid">
                            <div className="col-md-6">
                                <Title>Update Plant</Title>
                            </div>
                            <div className="col-md-6"></div>
                        </div>
                        {/* <div className="row container-fluid">
                            <div className="col-md-1 col-xs-12">
                                <Image>
                                    <img className="viewCropImg" src={serverImages + this.state.photoUrl} alt="plant" />
                                </Image>
                            </div>
                            <div className="col-md-11"></div>
                        </div> */}
                        <div className="row container-fluid">
                            <div className="col-md-6">
                                <TextField
                                    type="text"
                                    margin="normal"
                                    fullWidth
                                    id="name"
                                    label="Name"
                                    name="name"
                                    autoFocus
                                    value={name}
                                    onChange={this.handleChangeInputName}
                                />
                            </div>
                        </div>
                        <div className="row container-fluid">
                            <div className="col-md-4">
                                <TextField
                                    type="text"
                                    margin="normal"
                                    fullWidth
                                    id="pH Minimum"
                                    label="pH Minimum"
                                    name="pH Minimum"
                                    value={phmin}
                                    onChange={this.handleChangeInputPhMin}
                                />
                            </div>
                            <div className="col-md-4">
                                <TextField
                                    type="text"
                                    margin="normal"
                                    fullWidth
                                    id="pH Maximum"
                                    label="pH Maximum"
                                    name="pH Maximum"
                                    value={phmax}
                                    onChange={this.handleChangeInputPhMax}
                                />
                            </div>
                            <div className="col-md-4 d-none d-md-block"></div>
                        </div>

                        <div className="row container-fluid">
                            <div className="col-md-4">
                                <TextField
                                    type="text"
                                    margin="normal"
                                    fullWidth
                                    id="EC Minimum"
                                    label="EC Minimum"
                                    name="EC Minimum"
                                    value={ecmin}
                                    onChange={this.handleChangeInputEcMin}
                                />
                            </div>
                            <div className="col-md-4">
                                <TextField
                                    type="text"
                                    margin="normal"
                                    fullWidth
                                    id="EC Maximum"
                                    label="EC Maximum"
                                    name="EC Maximum"
                                    value={ecmax}
                                    onChange={this.handleChangeInputEcMax}
                                />
                            </div>
                            <div className="col-md-4 d-none d-md-block"></div>
                        </div>

                        <div className="row container-fluid">
                            <div className="col-md-4">
                                <TextField
                                    type="text"
                                    margin="normal"
                                    fullWidth
                                    id="LUX Minimum"
                                    label="LUX Minimum"
                                    name="LUX Minimum"
                                    value={luxmin}
                                    onChange={this.handleChangeInputLuxMin}
                                />
                            </div>
                            <div className="col-md-4">
                                <TextField
                                    type="text"
                                    margin="normal"
                                    fullWidth
                                    id="LUX Maximum"
                                    label="LUX Maximum"
                                    name="LUX Maximum"
                                    value={luxmax}
                                    onChange={this.handleChangeInputLuxMax}
                                    placeholder={"LUX Maximum"}
                                />
                            </div>
                            <div className="col-md-4 d-none d-md-block"></div>
                        </div>

                        <div className="row container-fluid">
                            <div className="col-md-4">
                                <TextField
                                    type="text"
                                    margin="normal"
                                    fullWidth
                                    id="Days for Germination"
                                    label="Days for Germination"
                                    name="Days for Germination"
                                    value={daystogerminate}
                                    onChange={this.handleChangeInputDaysToGerminate}
                                />
                            </div>
                            <div className="col-md-4">
                                <TextField
                                    type="text"
                                    margin="normal"
                                    fullWidth
                                    id="Days for Growth"
                                    label="Days for Growth"
                                    name="Days for Growth"
                                    value={daystogrow}
                                    onChange={this.handleChangeInputDaysToGrow}
                                    placeholder={"Days for Growth"}
                                />
                            </div>
                            <div className="col-md-4 d-none d-md-block"></div>
                        </div>

                        <div className="row container-fluid">
                            <div className="col-md-4">
                                <div className='upload-photo' onClick={this.handleTiggerImageUpload}>
                                    <input type="file" accept=".png, .jpg, .jpeg" hidden="true" ref={this.inputFileRef} onChange={this.handleChangeInputPhoto}/>
                                   { imgSrc ? <div className='previewImg'>
                                        <img src={imgSrc}/>
                                        <p className='up-label'>Image Upload</p>
                                    </div> : <div className='upload-wrapper'>
                                        <p className='icon'>
                                            <AddPhotoAlternateIcon style={{ color: "#99c5d1", fontSize: 18 }}/>
                                        </p>
                                        <p className='up-label'>Image Upload</p>
                                    </div> } 
                                </div>
                            </div>
                            <div className="col-md-4 d-none d-md-block"></div>
                            <div className="col-md-4 d-none d-md-block"></div>
                        </div>

                        <div className="row container-fluid">
                            <div className="col-md-4 flex-container">
                                <Button onClick={this.handleSubmit}>Update</Button>
                                <CancelButton><a href={'/plants/list'}>Cancel</a></CancelButton>
                            </div>
                            <div className="col-md-8"></div>
                        </div>
                    </form>
                </Wrapper>
            </div>
        )
    }

}

export default PlantsUpdate
