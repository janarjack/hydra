import React, { Component } from 'react'
import styled from 'styled-components'
import api from '../api'
import MediaQuery from 'react-responsive'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
const serverImages = process.env.REACT_APP_SERVER_IMAGES

let Wrapper = styled.div.attrs({
    className: 'form-group px-0',
})`
    margin-top: 18px;
    margin-bottom: 20px;
    margin-left: 50px;
    width: 90%;
    height: 100%;
    @media (max-width: 768px) {
        width: 90%;
        margin-left: 5%;
        margin-top: 24px;
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
    @media only screen
    and (device-width : 375px)
    and (device-height : 812px)
    and (-webkit-device-pixel-ratio : 3) {
        margin-bottom: 0px;
    }
`

const TitleSmall = styled.h1.attrs({
    className: 'h4',
})`
    font-family: 'Mukta-Bold';
    margin: 5px;
    
`

const CropCard = styled.div.attrs({
})`
    position: relative;
    border-radius: 16px;
    box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.25);
    width: 100%;
    margin-top: 20px;
    margin-bottom: 10px;
`

const ImageDiv = styled.div.attrs({
})`
    position: relative;
    width: 100%;
    margin-left: 5%;
`

const Image = styled.img.attrs({
})`
    position: relative;
    margin-left: 5%;
    width: 87px;
    height: 87px;
`

const Details = styled.div.attrs({
})`
    margin-left: 0;
    margin-top: 0;
    margin-bottom: 16%;
`

const Table = styled.table.attrs({
})`
    width: 100%;
`

const TdWide = styled.td.attrs({
})`
    width: 64%;
`

const TdNarrow = styled.td.attrs({
})`
    width: 36%;
`

const Plot = styled.div.attrs({
})`
    color: #909090;
    text-transform: uppercase;
    font-size: 12px;
`

const PlotMobile = styled.div.attrs({
})`
    color: #909090;
    position: relative;
    margin-left: 84%;
    padding-top: 5px;
`

const DepartmentMobile = styled.div.attrs({
})`
    color: #909090;
    position: relative;
    margin-left: 36%;
    padding-top: 5px;
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
        margin-left: 30px;
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

class CropsList extends Component {
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

    goToCropDetails = event => {
        event.preventDefault()
        const id = event.currentTarget.id
        window.location.href = `/crop-details/${id}`
    }

    render() {
        return (
            <div>
                <Wrapper>
                    <MediaQuery minWidth={768}>
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
                    </MediaQuery>
                    <MediaQuery maxWidth={768}>
                        <Title>Select a Crop</Title>
                        <div className="row container-fluid px-0 gx-0">
                            {
                                this.state.crops.map(
                                    crop =>
                                        <div className="col-md-3 col-xs-12" key={'crop' + crop._id}>
                                            <CropCard className={'cropListCardBg' + crop.plot} id={crop._id} onClick={this.goToCropDetails}>
                                                <PlotMobile>Plot {crop.plot}</PlotMobile>
                                                <Table>
                                                    <tr>
                                                        <TdNarrow>
                                                            <ImageDiv>
                                                                <Image src={serverImages + crop.details[0].photo} alt="plant" />
                                                            </ImageDiv>
                                                        </TdNarrow>
                                                        <TdWide>
                                                            <Details>
                                                                <div><b>{crop.plant}</b></div>
                                                                <Plot>Harvest in  {crop.remainingDays} days</Plot>
                                                            </Details>
                                                        </TdWide>
                                                    </tr>
                                                </Table>
                                                <DepartmentMobile>{crop.department}</DepartmentMobile>
                                            </CropCard>
                                        </div>
                                )
                            }
                        </div>
                    </MediaQuery>
                </Wrapper>
            </div>
        )
    }
}

export default CropsList
