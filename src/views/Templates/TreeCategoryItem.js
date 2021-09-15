import { useContext } from 'react';
import { mutateTree } from '@atlaskit/tree';
import getIcon from 'utils/treeUtils/getItemIcon';
import * as Styled from './Templates-view.styles';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import ArchiveIcon from 'components/Icons/ArchiveIcon/ArchiveIcon';
import { CV_DISTANT } from 'constant/CssVariables';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import {
  getChildNodeTypes,
  recoverNodeType,
  removeNodeType,
} from 'apiHelper/apiFunctions';
import UndoToast from 'components/toasts/undo-toast/UndoToast';
import { TemplatesViewContext } from './Templates-view';

const ClassItem = ({ itemProps, tree, setTree }) => {
  const { item, provided } = itemProps;
  const { refetchNodes } = useContext(TemplatesViewContext);

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
        children: [],
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
              parent: item,
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
        // console.log({ response });
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

  //!Undo remove category.
  const restoreCategory = (nodeId) => {
    recoverNodeType(nodeId)
      .then((response) => {
        // console.log(response);
        refetchNodes();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //! Remove category.
  const handleRemoveCategory = (e) => {
    e.stopPropagation();

    removeNodeType(item?.id)
      .then((response) => {
        // console.log(response);
        if (response?.Succeed) {
          refetchNodes();

          const deleteMSG = `دسته "${item?.data?.title}" حذف خواهد شد`;

          UndoToast({
            type: 'error',
            autoClose: 10000,
            message: deleteMSG,
            onUndo: () => restoreCategory(item?.data?.nodeType?.NodeTypeID),
            toastId: `templates-view-remove-${item?.id}`,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleRecoverCategory = (e) => {
    e.stopPropagation();
    console.log('recover');
    restoreCategory(item?.id);
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
      {!item?.isOther &&
        (item?.isArchived ? (
          <ArchiveIcon onClick={handleRecoverCategory} />
        ) : (
          <div className="trash-wrapper" onClick={handleRemoveCategory}>
            <TrashIcon color={CV_DISTANT} />
          </div>
        ))}
    </Styled.ClassItemWrapper>
  );
};

export default ClassItem;
