import styled from 'styled-components';

export const StyledMenu = styled.nav`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: ${({ theme }) => theme.primaryLight};
  height: 125%;
  width: 16%;
  text-align: left;
  padding: 1.4rem;
  position: absolute;
  top: 1;
  left: 0;
  bottom: 0;
  transition: transform 0.3s ease-in-out;
  z-index: 2;

  @media (max-width: ${({ theme }) => theme.mobile}) {
    width: 100%;
    height: 100vh;
    transform: ${({ open }) => open ? 'translateX(0)' : 'translateX(-100%)'};
  }

  a {
    font-size: 1.2vw;
    text-transform: uppercase;
    padding: 2rem 0;
    font-weight: bold;
    letter-spacing: 0.2rem;
    color: ${({ theme }) => theme.primaryDark};
    text-decoration: none;
    transition: color 0.3s linear;

    @media (max-width: ${({ theme }) => theme.mobile}) {
      font-size: 1rem;
      text-align: center;
    }

    &:hover {
      color: ${({ theme }) => theme.primaryHover};
    }
  }
`;
