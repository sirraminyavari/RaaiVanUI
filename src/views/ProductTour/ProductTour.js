import Tour from 'reactour';
import React, { Suspense } from 'react';
import './ProductTour.css';
import { steps } from './steps';
import { useDispatch, useSelector } from 'react-redux';
import { toggleActivation } from 'store/reducers/onboardingReducer';

const ProductTour = () => {
  const { active, fromStep } = useSelector((state) => state.onboarding);
  const dispatch = useDispatch();

  return (
    <Suspense fallback={React.Fragment}>
      <Tour
        maskClassName="mask"
        className="helper"
        steps={steps}
        isOpen={active}
        rounded={5}
        startAt={fromStep}
        showNumber={false}
        showButtons={false}
        showNavigation={false}
        showCloseButton={true}
        closeWithMask={false}
        onRequestClose={() => {
          dispatch(toggleActivation());
          window.location.href = window.location.href;
        }}
      />
    </Suspense>
  );
};

export default ProductTour;
