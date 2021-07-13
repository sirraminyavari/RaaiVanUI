import Tour from 'reactour';
import React, { useEffect, useState, Suspense, useContext } from 'react';
import './ProductTour.css';
import { StepperContext } from 'views/Onboarding/context/stepper.context';
import { steps } from './steps'

const ProductTour = () => {
  // const [isTourOpen, setIsTourOpen] = useState(false);

  const { info, dispatch } = useContext(StepperContext);

  const setIsTourOpen = () => {
    dispatch({ type: 'TOGGLE_TOUR' });
  };

  return (
    <Suspense fallback={React.Fragment}>
      <Tour
        maskClassName="mask"
        className="helper"
        steps={steps}
        isOpen={info.openTour}
        rounded={5}
        showNumber={false}
        showButtons={false}
        showNavigation={false}
        showCloseButton={true}
        onRequestClose={() => setIsTourOpen(false)}
      />
    </Suspense>
  );
};

export default ProductTour;
