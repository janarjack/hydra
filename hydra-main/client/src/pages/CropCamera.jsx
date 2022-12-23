import React, { Component,useState } from 'react'
import styled from 'styled-components'
import MediaQuery from 'react-responsive'
import JSMpeg from "@cycjimmy/jsmpeg-player";
import api from '../api'


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
	border-colour:#d6d6d6;
    border-radius: 10px;

    @media (max-width: 700px) {
        width: 112%;
        height: 90%;
        margin-left: 10%;
        margin-right: 0px;
        margin-bottom: 10px;
    }
`

const Wrapper = styled.div.attrs({
    className: 'form-group px-0',
})`
    margin-left: 30px;
    margin-top: 50px;
    margin-bottom: 20px;
    width: 100%;

    @media (max-width: 700px) {
        margin-left: 0rem;
        margin-right: 0rem;
        margin-top: 0rem;
        width: 100%;
    }
`

const Plant = styled.div.attrs({
})`
    font-weight: bold;
    font-size: 22px;
    @media (max-width: 428px) {
      margin-left: 20px;
    }
`

const HarvestDate = styled.div.attrs({
})`
    color: grey;
text-align: right;
    font-size: 14px;
    @media (max-width: 428px) {
      margin-left: 20px;
text-align: right;
    }
`

const Day = styled.div.attrs({
})`
    font-size: 18px;
text-align: right;
    padding-bottom: 20px;
    @media (max-width: 428px) {
        margin-left: 20px;
text-align: right;
      }
`

const Sensor = styled.div.attrs({
    className: 'col-md-12 col-xs-12',
})`
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

class CropCamera extends Component {
	
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
	    plot: this.props.match.params.plot,
            crops: [],
            harvestDate: '',
            remainingDays: '',
            percent: '',
	    plot: '',
        }
    }
	
	
	// Go back function
	 goBack() {
		 var id  = localStorage.getItem('plantID');
		 window.location.href = `/crop-details/${id}`
    }
	    componentDidMount = async () => {
        var id  = localStorage.getItem('plantID');

        await api.getCropById(id).then(
            crops => {
                let harvestDate = new Date(crops.data.data[0].commence)
                let daysToHarvest = crops.data.data[0].details[0].daystoharvest
                harvestDate.setDate(harvestDate.getDate() + (parseInt(daysToHarvest) - 1))
                console.log(harvestDate)
                let remainingDays = ((harvestDate - new Date()) / (1000 * 3600 * 24)) + 1

                let percent = 0
                if (remainingDays < 0) {
                    percent = 100
                } else {
                    percent = (parseInt(daysToHarvest) - parseInt(remainingDays)) / parseInt(daysToHarvest) * 100
                }

                console.log(Math.round(percent))

                const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                harvestDate = harvestDate.getDate() + " " + months[harvestDate.getMonth()] + " " + harvestDate.getFullYear()

                this.setState({
                    crops: crops.data.data,
		    plantName: crops.data.data[0].plant,
                    plot: crops.data.data[0].plot,
                    harvestDate: harvestDate,
                    remainingDays: Math.round(remainingDays),
                    percent: Math.round(percent),
                })
            }
        )

	const plot = this.state.plot;
	console.log(plot);
	let plotNumber = plot;
	if(plot==2) {
	    plotNumber=3;
	}
	if(plot==3){
	    plotNumber=2;
	}
	console.log(plotNumber);
	var videoUrl = `wss://dev.backend.gericke-psam.com.sg:543/api/stream/${plotNumber}`;
        console.log(videoUrl);
	var player = new JSMpeg.VideoElement("#video-canvas", videoUrl, {
            autoplay: true,
        });
        console.log(player);
    }
	

   /* componentDidMount = async () => {
        var videoUrl = `wss://dev.backend.gericke-psam.com.sg:543/api/stream`;
        var player = new JSMpeg.VideoElement("#video-canvas", videoUrl, {
            autoplay: true,
        });
        console.log(player);
    } */

    render() {
        return (
	    <Wrapper>
		<div id="body">
		
                    <MediaQuery minWidth={700}>
                        <div id="video-canvas" style={{ height: "70vh", width: "50vw" }}></div>
                    </MediaQuery>

                    <MediaQuery maxWidth={700}>
                        <div id="video-canvas" style={{ height: "75vh", width: "100vw"}}></div>
                    </MediaQuery>

		    <div style={{ backgroundColor: 'white', borderTopRightRadius: '24px',borderTopLeftRadius: '24px',width:'100%',paddingTop:'10px', zIndex: '30', marginTop: '-10px'}}>
			<div style={{ backgroundColor: 'white', borderTopRightRadius: '24px',borderTopLeftRadius: '24px',width:'100%',zIndex: '30' }}>
			    <p onClick={this.goBack}><h2 style={{marginLeft:'4%'}}>&#8592;</h2></p>
			    <div style={{display: 'flex',justifyContent: 'space-between'}}>
				<p style={{marginLeft:'4%',fontWeight: 'bold',fontSize:'22px'}}>{this.state.plantName}</p>
				<p style={{marginRight:'5%',color: 'grey',textAlign:'right',fontSize: '14px',marginTop: '0.5rem'}}>DAYS TO HARVEST&nbsp;</p>
			    </div>
			    <div style={{display: 'flex',justifyContent: 'space-between'}}>
				<p style={{marginLeft:'4%',color: 'grey',fontWeight: 'bold',fontSize:'12px',marginTop: '-1rem'}}>HYDROPONICS SYSTEM {this.state.plot}</p>
				<p style={{marginRight:'6%',color: 'black',textAlign:'right',fontSize: '18px',fontWeight:'900',marginTop: '-1.5rem'}}>{this.state.remainingDays}</p>
			    </div>
			</div>
		    </div>

		</div>
	    </Wrapper>
        )
    }
}

export default CropCamera
