import TextTypeMainSetting from './simpleText/TextTypeMainSetting';
import TextTypeSideBoxSetting from './simpleText/TextTypeSideBoxSetting';
import DateTypeMainSetting from './DateElement/DateTypeMainSetting';
import DateTypeSideBoxSetting from './DateElement/DateTypeSideBoxSetting';

const componentsArray = [
  {
    key: 'Text',
    value: (props) => {
      return TextTypeTemplate(props);
    },
  },
  {
    key: 'Date',
    value: (props) => {
      return DateTypeTemplate(props);
    },
  },
];

const TextTypeTemplate = (props) => {
  return {
    main: TextTypeMainSetting({ ...props }),
    sideBox: TextTypeSideBoxSetting({ ...props }),
  };
};

const DateTypeTemplate = (props) => {
  return {
    main: DateTypeMainSetting(props),
    sideBox: DateTypeSideBoxSetting(props),
  };
};

export const getDraggableElementSetting = (props) => {
  const key = props?.current?.data?.Type;
  const { main } =
    componentsArray?.find((x) => x?.key === key)?.value(props) || {};
  return main;
};

export const getSideFormElementSetting = (props) => {
  const key = props?.current?.data?.Type;
  const { sideBox } =
    componentsArray?.find((x) => x?.key === key)?.value(props) || {};
  return sideBox;
};
