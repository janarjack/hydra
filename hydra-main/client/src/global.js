import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
  }
  *, *::after, *::before {
    box-sizing: border-box;
  }
  body {
    margin-left: 15%;
    height: 100%;
    width: 85%;
    overflow: inherit;
    background: ${({ theme }) => theme.primaryDark};
    /**color: ${({ theme }) => theme.primaryLight};**/
    display: flex;
    font-family: Arial;
    min-height: -webkit-fill-available;
    min-width: -webkit-fill-available;
    text-rendering: optimizeLegibility;
  }
  @media (max-width: 700px) {
    body {
      height: 100%;
      width: 100%;
      margin-left: 0;
      margin-right: 0;
    }
  }
  @media (max-width: 428px) {
    body {
      height: 100%;
      width: 100%;
      margin-left: 0;
      margin-right: 0;
      min-width: 100%;
    }
  }
  `