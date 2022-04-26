import React, { useContext } from 'react';
import { StepperContext } from './context/stepper.context';
import DashedLine from './dashed.line';
import './stepper.progress.css';

const stepList = [
  {
    id: 1,
    title: 'تیم',
  },
  {
    id: 2,
    title: 'تیم شناسی',
  },
  {
    id: 3,
    title: 'قالب ها',
  },
  {
    id: 4,
    title: 'شروع',
  },
];

const StepperProgress = () => {
  const { info } = useContext(StepperContext);

  const steps = stepList.map((x) => (
    <div key={x.id}>
      <div
        className={[
          'dots',
          x.id < info.step && 'dot-after',
          x.id > info.step && 'dot-before',
          x.id === info.step && 'dot-focused',
        ].join(' ')}
      ></div>
    </div>
  ));

  const titles = stepList.map((x) => (
    <div key={x.id}>
      <div
        className={[
          'titles',
          x.id % 2 === 0 && 'up',
          x.id % 2 !== 0 && 'down',
          info.step === x.id && 'title-focused',
          info.step !== x.id && 'title-out',
        ].join(' ')}
      >
        {x.title}
      </div>
    </div>
  ));

  return (
    <div className="steps">
      <div className="steps-container">
        <DashedLine width="300px" fill="20px" />

        <div className="dots-container">{steps}</div>

        <div className="dots-container">{titles}</div>
      </div>
    </div>
  );
};
export default StepperProgress;
