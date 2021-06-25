import Tour from 'reactour';
import { useEffect, useState } from 'react';
import './ProductTour.css';
import TourBox from './TourBox';
import { stepsText } from './_messages';

const ProductTour = () => {
  const [isTourOpen, setIsTourOpen] = useState(false);

  return (
    <Tour
      maskClassName="mask"
      className="helper"
      steps={steps}
      isOpen={isTourOpen}
      rounded={5}
      showNumber={false}
      showButtons={false}
      showNavigation={false}
      showCloseButton={true}
      onRequestClose={() => setIsTourOpen(false)}
    />
  );
};
const steps = [
  {
    content: ({ goTo }) => (
      <TourBox goTo={goTo} current={0} total={4} guidance={stepsText[0]} />
    ),
    style: {
      backgroundColor: 'white',
      color: '#424242',
      borderRadius: '25px',
    },
    position: 'bottom',
  },
  {
    selector: '[data-tut="reactour__first"]',
    content: ({ goTo }) => (
      <TourBox goTo={goTo} current={1} total={4} guidance={stepsText[0]} />
    ),
    style: {
      backgroundColor: 'white',
      color: '#424242',
      borderRadius: '25px',
    },
    position: 'bottom',
  },
  {
    selector: '.TC_DEFAULT',
    content: ({ goTo }) => (
      <TourBox goTo={goTo} current={2} total={4} guidance={stepsText[1]} />
    ),
    style: {
      backgroundColor: 'white',
      color: '#424242',
      borderRadius: '25px',
    },
    position: 'right',
  },
  {
    selector: '[data-tut="reactour__third"]',
    content: ({ goTo }) => (
      <TourBox goTo={goTo} current={3} total={4} guidance={stepsText[2]} />
    ),
    style: {
      backgroundColor: 'white',
      color: '#424242',
      borderRadius: '25px',
    },
    position: 'top',
  },
  {
    selector: '[data-tut="reactour__last"]',
    content: ({ goTo }) => (
      <TourBox goTo={goTo} current={4} total={4} guidance={stepsText[3]} />
    ),
    style: {
      backgroundColor: 'white',
      color: '#424242',
      borderRadius: '25px',
    },
    position: 'top',
  },
  // ...
];

export default ProductTour;
