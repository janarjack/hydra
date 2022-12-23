import React from 'react';
import styled from 'styled-components';
const clientUrl = process.env.REACT_APP_CLIENT_URL

// const StyledLogo = styled.div.attrs({
// })`
//   text-align: center;
//   position: absolute;
//   top: 2%;
  
//   height: 50px;
//   width: 50px;

//   @media only screen
//     and (device-width : 375px)
//     and (device-height : 812px)
//     and (-webkit-device-pixel-ratio : 3) {
//       flex-direction: row;
//       width: 2rem;
//       height: 2rem;
     
//     }

//     @media (max-width: 700px) {
//       left: 5%;
//       top: 1%;
//       right: 8.6rem;
//     }
// `

const Image = styled.img.attrs({
})`
  width: 10rem;
  height: 3rem;
`

const LogoInner = () => {
  return (
    <>
      <Image src={clientUrl + 'logo-tagline.png'} alt="logo-tagline" />
    </>
  )
}

export default LogoInner;
