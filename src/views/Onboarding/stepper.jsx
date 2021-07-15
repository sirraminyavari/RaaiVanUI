import React, { useState } from 'react';
import MainContent from './main.content';
import SideBar from './sidebar/side.bar';
import StepperContextProvider from './context/stepper.context';

const Stepper = (props) => {
  return (
    <StepperContextProvider>
      <div className="root">
        <SideBar></SideBar>
        <MainContent></MainContent>
      </div>
    </StepperContextProvider>
  );
};
export default Stepper;
