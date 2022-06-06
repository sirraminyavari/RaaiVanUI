import Tour from 'reactour';
import React, { Suspense } from 'react';
import './ProductTour.css';
import { steps } from './steps';
import { useDispatch, useSelector } from 'react-redux';
import { selectOnboarding } from 'store/slice/onboarding/selectors';
import { useOnboardingSlice } from 'store/slice/onboarding';

const ProductTour = () => {
  const { active, fromStep } = useSelector(selectOnboarding);
  const dispatch = useDispatch();

  const {
    actions: { toggleActivation },
  } = useOnboardingSlice();

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
          // eslint-disable-next-line no-self-assign
          window.location.href = window.location.href;
        }}
      />
    </Suspense>
  );
};

export default ProductTour;
