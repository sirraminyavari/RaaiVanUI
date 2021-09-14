import { mutateTree } from '@atlaskit/tree';
import getIcon from 'utils/treeUtils/getItemIcon';
import * as Styled from './Templates-view.styles';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import { CV_DISTANT } from 'constant/CssVariables';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import { getChildNodeTypes } from 'apiHelper/apiFunctions';

const ClassItem = ({ itemProps, tree, setTree }) => {
  const { item, provided } = itemProps;

  //! Change tree states before loading children.
  const beforeLoadingChildren = () => {
    let treeOptions;

    if (item?.isOther) {
      treeOptions = {
        isExpanded: true,
      };
    } else {
      treeOptions = {
        isChildrenLoading: true,
      };
    }
    const newTree = mutateTree(tree, item?.id, treeOptions);
    setTree(newTree);
  };

  //! Change tree states after loading children.
  const afterLoadingChildren = (children) => {
    let treeOptions;

    if (!!children.length) {
      treeOptions = {
        isExpanded: true,
        isChildrenLoading: false,
        children: [`${item?.id}-children`],
      };
    } else {
      treeOptions = {
        isChildrenLoading: false,
        children: [`${item?.id}-children`],
      };
    }
    const newTree = mutateTree(tree, item?.id, treeOptions);

    if (children.length) {
      setTree({
        ...newTree,
        items: {
          ...newTree.items,
          [`${item?.id}-children`]: {
            id: `${item?.id}-children`,
            children: [],
            hasChildren: false,
            isCategory: false,
            isExpanded: false,
            isChildrenLoading: false,
            data: {
              templates: children,
            },
          },
        },
      });
    } else {
      setTree(newTree);
    }
  };

  //! Calls on collapse item.
  const onCollapse = () => {
    const newTree = mutateTree(tree, item?.id, {
      isExpanded: false,
      isChildrenLoading: false,
    });
    setTree(newTree);
  };

  //! Calls on expand item.
  const onExpand = () => {
    beforeLoadingChildren();
    if (item?.isOther) return;

    getChildNodeTypes(item?.id)
      .then((response) => {
        console.log({ response });
        const children = response?.NodeTypes;
        afterLoadingChildren(children);
      })
      .catch((err) => console.log(err));
  };

  const handleClickItem = () => {
    //! Handle item open and close.
    if (item?.isExpanded) {
      onCollapse();
    } else {
      onExpand();
    }
  };

  const handleDeleteClass = (e) => {
    e.stopPropagation();
    console.log('delete class');
  };

  return (
    <Styled.ClassItemWrapper ref={provided.innerRef} onClick={handleClickItem}>
      {item?.isCategory && !item?.isChildrenLoading && getIcon(item)}
      {item?.isChildrenLoading && (
        <LogoLoader
          style={{ position: 'relative', top: '0.2rem' }}
          lottieWidth={30}
        />
      )}
      <Styled.ClassItemTitle isOther={item?.isOther}>
        {item.data.title}
      </Styled.ClassItemTitle>
      {!item?.isOther && (
        <div className="trash-wrapper" onClick={handleDeleteClass}>
          <TrashIcon color={CV_DISTANT} />
        </div>
      )}
    </Styled.ClassItemWrapper>
  );
};

export default ClassItem;
