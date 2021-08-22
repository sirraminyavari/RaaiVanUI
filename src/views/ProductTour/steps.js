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
  },
  {
    selector: '[data-tut="categories_and_templates"]',
    content: ({ goTo }) => (
      <TourBox goTo={goTo} current={1} total={4} guidance={stepsText[0]} />
    ),
    style: {
      backgroundColor: 'white',
      color: '#424242',
      borderRadius: '25px',
    },
    position: 'left',
  },
  {
    selector: '[data-tut="advanced_search_results"]',
    content: ({ goTo }) => (
      <TourBox goTo={goTo} current={2} total={4} guidance={stepsText[1]} />
    ),
    style: {
      backgroundColor: 'white',
      color: '#424242',
      borderRadius: '25px',
    },
    position: 'top',
  },
  {
    selector: '[data-tut="new_doc_menu"]',
    content: ({ goTo }) => (
      <TourBox goTo={goTo} current={3} total={4} guidance={stepsText[2]} />
    ),
    style: {
      backgroundColor: 'white',
      color: '#424242',
      borderRadius: '25px',
    },
    highlightedSelectors: ['#list'],
    mutationObservables: ['#list'],
    resizeObservables: ['#list'],
    position: 'right',
  },
  {
    selector: '[data-tut="main-search-box"]',
    content: ({ goTo }) => (
      <TourBox goTo={goTo} current={4} total={4} guidance={stepsText[3]} />
    ),
    style: {
      backgroundColor: 'white',
      color: '#424242',
      borderRadius: '25px',
    },
    position: 'bottom',
  },
];
