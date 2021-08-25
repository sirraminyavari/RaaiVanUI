import React, { createContext, useReducer, useState } from 'react';
import { stepperReducer } from './stepper.reducer';

export const StepperContext = createContext();
const avatr = window.RVGlobal?.CurrentUser?.ProfileImageURL;
const initialInfo = {
  firstName: '',
  lastName: '',
  avatar: avatr,
  teamName: '',
  applicationId: undefined,
  iconURL: undefined,
  step: 0,
  members: '',
  field: { value: '' },
  templates: [],
  templatePreview: undefined,
  activatedTemplates: [],
  loading: false,
  openTuor: false,
};

const StepperContextProvider = ({ children }) => {
  const [info, dispatch] = useReducer(stepperReducer, initialInfo);

  return (
    <StepperContext.Provider value={{ info, dispatch }}>
      {children}
    </StepperContext.Provider>
  );
};
export default StepperContextProvider;
