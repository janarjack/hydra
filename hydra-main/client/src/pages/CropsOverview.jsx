import React, { Component } from 'react'
import styled from 'styled-components'
import api from '../api'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
const serverImages = process.env.REACT_APP_SERVER_IMAGES

let Wrapper = styled.div.attrs({
    className: 'form-group px-0',
})`
    margin-top: 16px;
    width: 90%;
    height: 100%;
    @media (max-width: 700px) {
        margin-left: 5%;
        margin-right: 5%;
        margin-top: 20px;
    }
    @media (max-width: 428px) {
        margin-left: 5%;
        margin-right: 5%;
    }
`

const Title = styled.h1.attrs({
    className: 'h2',
})`
    margin: 5px;
    font-family: 'Mukta-Bold';
    margin-bottom: 20px;
    @media (max-width: 700px) {
        margin-bottom: 0px;
    }
`

const TitleSmall = styled.h1.attrs({
    className: 'h4',
})`
    font-family: 'Mukta-Bold';
    margin: 5px;
    margin-left: 0px;
`

const Plot = styled.div.attrs({
})`
    color: #909090;
    font-size: 90%;
    text-transform: uppercase;
    font-size: 12px;
    @media (max-width: 700px) {
        width: 77px;
    }
`

const Progress = styled.div.attrs({
})`
    width: 75px;
    height: 75px;
    float: right;
    padding-right: 10px;

    @media (max-width: 570px) {
        width: 70px;
        height: 70px;
    }
`

class ViewCrop extends Component {
    viewCrop = event => {
        event.preventDefault()

        window.location.href = `/crop-details/${this.props.id}`
    }

    render() {
        return <div><input className="crop-list-btn" type="button" value="VIEW CROP" onClick={this.viewCrop} /></div>
    }
}

class CropsOverview extends Component {
    constructor(props) {
        super(props)
        this.state = {
            crops: [],
            columns: [],
            isLoading: false,
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

    viewCrop = event => {
        event.preventDefault()

        window.location.href = `/crop-details/${this.props.id}`
    }

    render() {
        return (
            <div>
                <Wrapper className={'container-fluid ' && this.props.logo !== 'hide' ? 'crop-list-margin' : 'crop-list-margin-no'}>
                    {this.props.logo !== 'hide' ? <Title>Crops Growth</Title> : <TitleSmall>Crops Growth</TitleSmall>}
                    <div className="row container-fluid px-0 gx-0">
                        {
                            this.state.crops.map(
                                crop =>
                                    <div className="col-md-3 col-xs-12" key={'crop' + crop._id}>
                                        <div className={'cropListCard cropListCardBg' + crop.plot}>
                                            <div>
                                                <div className="viewCropImgDiv">
                                                    <img src={serverImages + crop.details[0].photo} className="viewCropImg" alt="plant" />
                                                </div>
                                            </div>
                                            <div className="cropListCardValDiv">
                                                <table className="cropListCardValTbl">
                                                    <tbody>
                                                        <tr className="cropListCardValTr">
                                                            <td className="cropListCardValTd">
                                                                <div>
                                                                    <b>{crop.plant}</b>
                                                                    <Plot>Plot&nbsp;{crop.plot}</Plot>
                                                                    <Plot>{crop.department}</Plot>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <Progress>
                                                                    <CircularProgressbar
                                                                        value={crop.percent}
                                                                        text={`${crop.percent}%`}
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
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <ViewCrop id={crop._id}></ViewCrop>
                                            </div>
                                        </div>
                                    </div>
                            )
                        }
                    </div>
                </Wrapper>
            </div>
        )
    }
}

export default CropsOverview
