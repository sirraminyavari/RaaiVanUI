import React, { createContext, useReducer, useState } from 'react';
import { stepperReducer } from './stepper.reducer';

export const StepperContext = createContext();

const initialInfo = {
  firstName: '',
  lastName: '',
  avatar: undefined,
  teamName: '',
  step: 0,
  members: '',
  field: '',
  templates: [],
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
