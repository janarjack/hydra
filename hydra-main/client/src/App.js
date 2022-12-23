import './App.css';

import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './global';
import { theme } from './theme';
  import { Burger, Menu } from './components';
import LogoInner from './components/LogoInner'
import Logout from './components/Logout'
import CookieService from './api/CookieService';
import {
  UsersList, UsersInsert, UsersUpdate,
  PlantsInsert, PlantsList, PlantsUpdate,
  CropSettingStep1, CropSettingStep2, CropSettingStep3,
  CropsList, CropDetails, CropGrowth, CropCamera,
  Login, ForgotPassword, ResetPassword, Dashboard
} from './pages'

function App() {
  const [open, setOpen] = useState(false);
  const validSession = CookieService.checkSession();

  return (
    <div className="container-fluid px-0">
      {
        validSession === false &&
        <div>
          <Router>
            <Switch>
              <Route path="/" exact component={Login} />
              <Route path="/dashboard" exact component={Dashboard} />
              <Route path="/users/list" exact component={Login} />
              <Route path="/users/create" exact component={Login} />
              <Route path="/users/update/:id" exact component={Login} />
              <Route path="/plants/create" exact component={Login} />
              <Route path="/plants/list" exact component={Login} />
              <Route path="/plants/update/:id" exact component={PlantsUpdate} />
              <Route path="/crop/setting" exact component={Login} />
              <Route path="/crops/list" exact component={Login} />
              <Route path="/crop-details/:id" exact component={Login} />
              <Route path="/crop-camera" exact component={Login} />
              <Route path="/forgot-password" exact component={ForgotPassword} />
              <Route path="/password-reset/:id/:token" exact component={ResetPassword} />
            </Switch>
          </Router>
        </div>
      }
      {
        validSession === true &&
        <ThemeProvider theme={theme}>
        <GlobalStyles />
        {
          window.location.pathname.includes("/crop-details") || window.location.pathname.includes("/crop-camera") || window.location.pathname.includes("/crop-growth") || window.location.pathname.includes("/crop-setting/select-plant") || window.location.pathname.includes("/crop-setting/select-plot/") || window.location.pathname.includes("/crop-setting/select-date/") ? (
            <div>
              <Burger open={open} setOpen={setOpen} />
              <Menu open={open} setOpen={setOpen} />
            </div>
          ) : (
            <div>
              <Burger open={open} setOpen={setOpen} />
              <Menu open={open} setOpen={setOpen} />
            </div>
          )
        }

        <div className='hydr-main-content'>
          <div className='hydr-top-bar'>
            <LogoInner />
            <Logout />
          </div>
          <div className='main-section'>
            <Router>
              <Switch>
                <Route path="/" exact component={Dashboard} />
                <Route path="/dashboard" exact component={Dashboard} />
                <Route path="/users/list" exact component={UsersList} />
                <Route path="/users/create" exact component={UsersInsert} />
                <Route path="/users/update/:id" exact component={UsersUpdate} />
                <Route path="/plants/create" exact component={PlantsInsert} />
                <Route path="/plants/list" exact component={PlantsList} />
                <Route path="/plants/update/:id" exact component={PlantsUpdate} />
                <Route path="/crop-setting/select-plant" exact component={CropSettingStep1} />
                <Route path="/crop-setting/select-plot/:id" exact component={CropSettingStep2} />
                <Route path="/crop-setting/select-date/:plant/:plot" exact component={CropSettingStep3} />
                <Route path="/crops/list" exact component={CropsList} />
                <Route path="/crop-details/:id" exact component={CropDetails} />
                <Route path="/crop-growth/:id" exact component={CropGrowth} />
                <Route path="/crop-camera/:plot" exact component={CropCamera} />
              </Switch>
            </Router>
          </div>
          
        </div>
        
        </ThemeProvider>
      }
    </div>
  );
}

export default App;
