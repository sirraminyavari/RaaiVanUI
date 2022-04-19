import TextTypeMainSetting from './simpleText/TextTypeMainSetting';
import TextTypeSideBoxSetting from './simpleText/TextTypeSideBoxSetting';
import DateTypeMainSetting from './DateElement/DateTypeMainSetting';
import DateTypeSideBoxSetting from './DateElement/DateTypeSideBoxSetting';
import NumericalTypeMainSetting from './NumericalElement/NumericalTypeMainSetting';
import NumericalTypeSideBoxSetting from './NumericalElement/NumericalTypeSideBoxSetting';
import SingleSelectMainSetting from './SingleSelectElement/SingleSelectMainSetting';
import SingleSelectSideBoxSetting from './SingleSelectElement/SingleSelectSideBoxSetting';
import BinaryTypeMainSetting from './BinaryTypeElement/BinaryTypeMainSetting';
import BinaryTypeSideBoxSetting from './BinaryTypeElement/BinaryTypeSideBoxSetting';
import RatingTypeMainSetting from './NumericalElement/RatingTypeMainSetting';
import RatingTypeSideBoxSetting from './NumericalElement/RatingTypeSideBoxSetting';
import FileTypeSideBoxSetting from './FileTypeElement/FileTypeSideBoxSetting';

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
  {
    key: 'Numeric',
    value: (props) => {
      return NumericTypeTemplate(props);
    },
  },
  {
    key: 'Select',
    value: (props) => {
      return SingleSelectTypeTemplate(props);
    },
  },
  {
    key: 'Binary',
    value: (props) => {
      return BinarySelectTemplate(props);
    },
  },
  {
    key: 'File',
    value: (props) => {
      return FileTypeTemplate(props);
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

const FileTypeTemplate = (props) => {
  return {
    main: <div></div>,
    sideBox: FileTypeSideBoxSetting(props),
  };
};

const NumericTypeTemplate = (props) => {
  const { current } = props;
  return current?.data?.Info?.Pattern === 'rating'
    ? {
        main: RatingTypeMainSetting(props),
        sideBox: RatingTypeSideBoxSetting(props),
      }
    : {
        main: NumericalTypeMainSetting(props),
        sideBox: NumericalTypeSideBoxSetting(props),
      };
};

const SingleSelectTypeTemplate = (props) => {
  return {
    main: SingleSelectMainSetting(props),
    sideBox: SingleSelectSideBoxSetting(props),
  };
};

const BinarySelectTemplate = (props) => {
  return {
    main: BinaryTypeMainSetting(props),
    sideBox: BinaryTypeSideBoxSetting(props),
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
