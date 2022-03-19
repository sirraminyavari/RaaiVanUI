import TextTypeMainSetting from './simpleText/TextTypeMainSetting';
import TextTypeSideBoxSetting from './simpleText/TextTypeSideBoxSetting';

const componentsArray = [
  {
    key: 'short text',
    value: (props) => {
      return {
        main: TextTypeMainSetting({ ...props }),
        sideBox: TextTypeSideBoxSetting({ ...props }),
      };
    },
  },
  {
    key: 'paragraph',
    value: (props) => {
      return {
        main: TextTypeMainSetting({ ...props }),
        sideBox: TextTypeSideBoxSetting({ ...props }),
      };
    },
  },
];

export const getDraggableElementSetting = ({ key, props }) => {
  const { main } =
    componentsArray?.find((x) => x?.key === key)?.value(props) || null;
  return main;
};

export const getSideFormElementSetting = ({ key, props }) => {
  const { sideBox } =
    componentsArray?.find((x) => x?.key === key)?.value(props) || null;
  return sideBox;
};
