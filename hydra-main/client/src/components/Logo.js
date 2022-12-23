import React from 'react';
import styled from 'styled-components';

const StyledLogo = styled.div.attrs({
})`
  display: flex;
  justify-content: center;
`

const clientUrl = process.env.REACT_APP_CLIENT_URL

const Logo = () => {
  return (
    <StyledLogo className="logo">
      <img src={clientUrl + 'logo-tagline.png'} alt="logo-tagline"/>
    </StyledLogo>
  )
}

export default Logo;