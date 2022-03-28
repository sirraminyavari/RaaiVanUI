import TextTypeMainSetting from './simpleText/TextTypeMainSetting';
import TextTypeSideBoxSetting from './simpleText/TextTypeSideBoxSetting';

const componentsArray = [
  {
    key: 'Text',
    value: (props) => {
      return TextTypeTemplate(props);
    },
  },
];

const TextTypeTemplate = (props) => {
  return {
    main: TextTypeMainSetting({ ...props }),
    sideBox: TextTypeSideBoxSetting({ ...props }),
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
