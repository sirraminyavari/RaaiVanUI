import TourBox from './TourBox';

const {
  RVGlobal,
  Base64,
  RVDic: {
    X: {
      ProductTours: { Intro },
    },
  },
} = window;

export const steps = [
  {
    content: ({ goTo }) => (
      <TourBox goTo={goTo} current={0} total={4} guidance={Intro.Step1} />
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
      <TourBox goTo={goTo} current={1} total={4} guidance={Intro.Step1} />
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
      <TourBox goTo={goTo} current={2} total={4} guidance={Intro.Step2} />
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
      <TourBox goTo={goTo} current={3} total={4} guidance={Intro.Step3} />
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
      <TourBox
        goTo={goTo}
        current={4}
        total={4}
        guidance={Intro.Step4.replace(
          '[RaaiVan]',
          Base64.decode(RVGlobal.SystemName)
        )}
      />
    ),
    style: {
      backgroundColor: 'white',
      color: '#424242',
      borderRadius: '25px',
    },
    position: 'bottom',
  },
];
