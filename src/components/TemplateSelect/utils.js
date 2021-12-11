import { decodeBase64 } from 'helpers/helpers';
import AtSignIcon from 'components/Icons/AtSignIcon/AtSign';
import CalendarIcon from 'components/Icons/CalendarIcon/EmptyCalendarIcon';
import TextIcon from 'components/Icons/TextIcon';
import FilterIcon from 'components/Icons/FilterIconIo';
import TableIcon from 'components/Icons/TableIcon/TableIcon';
import ToggleIcon from 'components/Icons/ToggleIcon';
import RadioButtonIcon from 'components/Icons/RadioButtonIcon';
import CheckboxIcon from 'components/Icons/CheckBoxIconIo';
import FilesFormatIcon from 'components/Icons/FilesFormat/FilesFormatIcon';
import UserIcon from 'components/Icons/UserIconIo';
import { CV_DISTANT } from 'constant/CssVariables';
import * as Styled from './TemplateSelect.styles';

export const provideNodeTypesForTree = (data) => {
  const { AppID, NodeTypes } = data || {};

  //! Root id for tree (It is required according to documentation).
  const rootId = `templates-${AppID || 'templates-list'}`;

  const categories = NodeTypes?.filter((node) => !node?.ParentID);
  const children = NodeTypes?.filter((node) => node?.ParentID);

  //! Provide category ids.
  const parentIds = categories.map((node) => node?.NodeTypeID);

  //! Provide categories for tree.
  const templateCategories = categories?.reduce((acc, currentValue) => {
    const { NodeTypeID: id, TypeName: title } = currentValue;
    const childrenIds = NodeTypes.filter((node) => node?.ParentID === id).map(
      (node) => node?.NodeTypeID
    );

    const treeObj = {
      id,
      children: childrenIds,
      hasChildren: !!childrenIds.length,
      isCategory: true,
      isExpanded: false,
      isChildrenLoading: false,
      data: {
        title: decodeBase64(title),
        rawData: currentValue,
      },
    };

    return { ...acc, [id]: treeObj };
  }, {});

  //! Provide children for tree.
  const templateChildren = children?.reduce((acc, currentValue) => {
    const { NodeTypeID: id, TypeName: title } = currentValue;

    const treeObj = {
      id,
      children: [],
      hasChildren: false,
      isCategory: false,
      isExpanded: false,
      isChildrenLoading: false,
      data: {
        title: decodeBase64(title),
        rawData: currentValue,
      },
    };

    return { ...acc, [id]: treeObj };
  }, {});

  const templatesForTree = {
    rootId,
    items: {
      [rootId]: {
        id: rootId,
        children: parentIds,
        hasChildren: true,
        isCategory: true,
        isExpanded: true,
        isChildrenLoading: false,
        data: {
          title: 'Templates Tree',
        },
      },
      ...templateCategories,
      ...templateChildren,
    },
  };

  return templatesForTree;
};

export const getIcon = (type) => {
  switch (type) {
    case 'Date':
      return <CalendarIcon size={20} color={CV_DISTANT} />;

    case 'Text':
      return <TextIcon size={20} color={CV_DISTANT} />;

    case 'MultiLevel':
      return <FilterIcon size={20} color={CV_DISTANT} />;

    case 'Node':
      return <AtSignIcon size={20} color={CV_DISTANT} />;

    case 'Form':
      return <TableIcon size={20} color={CV_DISTANT} />;

    case 'Numeric':
      return <AtSignIcon size={20} color={CV_DISTANT} />;

    case 'Binary':
      return <ToggleIcon size={20} color={CV_DISTANT} />;

    case 'Select':
      return <RadioButtonIcon size={20} color={CV_DISTANT} />;

    case 'Checkbox':
      return <CheckboxIcon size={20} color={CV_DISTANT} />;

    case 'File':
      return <FilesFormatIcon size={20} color={CV_DISTANT} />;

    case 'User':
      return <UserIcon size={20} color={CV_DISTANT} />;

    default:
      return <Styled.Separator />;
  }
};
