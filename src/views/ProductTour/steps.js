import TourBox from './TourBox';
import { stepsText } from './_messages';

export const steps = [
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
      selector: '[data-tut="reactour__second"]',
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
  ];