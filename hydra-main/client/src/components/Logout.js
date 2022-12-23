import React from 'react';
import styled from 'styled-components';
import MediaQuery from 'react-responsive'
import CookieService from '../api/CookieService';
const clientUrl = process.env.REACT_APP_CLIENT_URL

const ImageDiv = styled.div.attrs({
})`
    position: absolute;
    width: 36px;
    height: 36px;
    top: 2%;
    right: 4%;
    transform: scaleX(-1);
    cursor: pointer;
`

const Logout = () => {
  return (
    <div>
      <MediaQuery minWidth={700}>
        <button className="logout-btn" onClick={CookieService.logoutUser}>Log out</button>
      </MediaQuery>
      <MediaQuery maxWidth={700}>
        <ImageDiv>
          <img onClick={CookieService.logoutUser} src={clientUrl + 'logout.svg'} alt="logout" />
        </ImageDiv>
      </MediaQuery>
    </div>
  )
}

export default Logout;
