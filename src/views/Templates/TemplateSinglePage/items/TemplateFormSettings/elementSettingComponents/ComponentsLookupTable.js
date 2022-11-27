import TextTypeMainSetting from './simpleText/TextTypeMainSetting';
import TextTypeSideBoxSetting from './simpleText/TextTypeSideBoxSetting';
import DateTypeMainSetting from './DateElement/DateTypeMainSetting';
import DateTypeSideBoxSetting from './DateElement/DateTypeSideBoxSetting';
import NumericalTypeMainSetting from './NumericalElement/NumericalTypeMainSetting';
import NumericalTypeSideBoxSetting from './NumericalElement/NumericalTypeSideBoxSetting';
import SingleSelectMainSetting from './SingleSelectElement/SingleSelectMainSetting';
import BinaryTypeMainSetting from './BinaryTypeElement/BinaryTypeMainSetting';
import BinaryTypeSideBoxSetting from './BinaryTypeElement/BinaryTypeSideBoxSetting';
import RatingTypeMainSetting from './NumericalElement/RatingTypeMainSetting';
import RatingTypeSideBoxSetting from './NumericalElement/RatingTypeSideBoxSetting';
import FileTypeSideBoxSetting from './FileTypeElement/FileTypeSideBoxSetting';
import UserTypeMainSetting from './UserTypeElement/UserTypeMainSetting';
import UserTypeSideBoxSetting from './UserTypeElement/UserTypeSideBoxSetting';
import ItemTypeMainSetting from './ItemTypeElement/ItemTypeMainSetting';
import ItemTypeSideBoxSetting from './ItemTypeElement/ItemTypeSideBoxSetting';
import SeparatorTypeMainSetting from './SeparatorTypeElement/SeparatorTypeMainSetting';
import SeparatorTypeSideBoxSetting from './SeparatorTypeElement/SeparatorTypeSideboxSetting';
import SelectSideBoxSetting from './sharedItems/SelectSideBoxSetting';
import MultiSelectMainSetting from './MultiSelectElement/MultiSelectMainSetting';
import MultiLevelMainSetting from './MultiLevelElement/MultiLevelMainSetting';
import MultiLevelSideBoxSetting from './MultiLevelElement/MultiLevelSideBoxSetting';
import TableMainSetting from './TableElement/TableMainSetting';
import TableSideBoxSetting from './TableElement/TableSideBoxSetting';

const componentsArray = [
  {
    key: 'Text',
    value: (props) => {
      return {
        main: TextTypeMainSetting({ ...props }),
        sideBox: TextTypeSideBoxSetting({ ...props }),
      };
    },
  },
  {
    key: 'Date',
    value: (props) => {
      return {
        main: DateTypeMainSetting(props),
        sideBox: DateTypeSideBoxSetting(props),
      };
    },
  },
  {
    key: 'Numeric',
    value: (props) => {
      const { current } = props;
      return current?.data?.Info?.PatternName === 'rating'
        ? {
            main: RatingTypeMainSetting(props),
            sideBox: RatingTypeSideBoxSetting(props),
          }
        : {
            main: NumericalTypeMainSetting(props),
            sideBox: NumericalTypeSideBoxSetting(props),
          };
    },
  },
  {
    key: 'Select',
    value: (props) => {
      return {
        main: SingleSelectMainSetting(props),
        sideBox: SelectSideBoxSetting(props),
      };
    },
  },
  {
    key: 'Checkbox',
    value: (props) => {
      return {
        main: MultiSelectMainSetting(props),
        sideBox: SelectSideBoxSetting(props),
      };
    },
  },
  {
    key: 'Binary',
    value: (props) => {
      return {
        main: BinaryTypeMainSetting(props),
        sideBox: BinaryTypeSideBoxSetting(props),
      };
    },
  },
  {
    key: 'File',
    value: (props) => {
      return {
        main: <div></div>,
        sideBox: FileTypeSideBoxSetting(props),
      };
    },
  },
  {
    key: 'User',
    value: (props) => {
      return {
        main: UserTypeMainSetting({ ...props }),
        sideBox: UserTypeSideBoxSetting({ ...props }),
      };
    },
  },
  {
    key: 'Node',
    value: (props) => {
      return {
        main: ItemTypeMainSetting({ ...props }),
        sideBox: ItemTypeSideBoxSetting({ ...props }),
      };
    },
  },
  {
    key: 'Separator',
    value: (props) => {
      return {
        main: SeparatorTypeMainSetting({ ...props }),
        sideBox: SeparatorTypeSideBoxSetting({ ...props }),
      };
    },
  },
  {
    key: 'MultiLevel',
    value: (props) => {
      return {
        // main: <div>content</div>,
        main: MultiLevelMainSetting(props),
        sideBox: MultiLevelSideBoxSetting({ ...props }),
      };
    },
  },
  {
    key: 'Form',
    value: (props) => {
      return {
        // main: <div>content</div>,
        main: TableMainSetting(props),
        sideBox: TableSideBoxSetting({ ...props }),
      };
    },
  },
];

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
  console.log({ key, sideBox });
  return sideBox;
};
