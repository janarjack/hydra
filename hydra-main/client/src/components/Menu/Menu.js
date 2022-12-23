import React from 'react';
import { bool } from 'prop-types';
import { StyledMenu } from './Menu.styled';
import CookieService from '../../api/CookieService'

const Menu = ({ open }) => {

  const role = CookieService.getRoleFromSession()

  return (
    <StyledMenu open={open}>
      <a href="/dashboard">
        Dashboard
      </a>
      {
        (role === 'admin') && <a href="/users/list">
          Account Management
        </a>
      }
      {
        (role === 'admin') && <a href="/crop-setting/select-plant">
          Crop Settings
        </a>
      }
      <a href="/crops/list">
        View Crop
      </a>
      {
        (role === 'admin') && <a href="/plants/list">
          Plant Database
        </a>
      }
    </StyledMenu>
  )
}
Menu.propTypes = {
  open: bool.isRequired,
}

export default Menu;
