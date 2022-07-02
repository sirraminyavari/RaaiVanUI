import RVTree from 'components/Tree/RVTree/RVTree';
import { useEffect, useState } from 'react';
import { useTemplateContext } from 'views/Templates/TemplateSinglePage/TemplateProvider';
import TemplateItemSettingListTreeItem from './TemplateItemSettingListTreeItem';
import api from 'apiHelper';
import InfoToast from 'components/toasts/info-toast/InfoToast';

const TemplateItemSettingListTree = ({ nodes }) => {
  const { RVDic } = window;
  const { NodeTypeID } = useTemplateContext();
  const [tree, setTree] = useState({});

  useEffect(() => {
    let _tree = {
      rootId: NodeTypeID,
      items: {
        [`${NodeTypeID}`]: {
          id: NodeTypeID,
          children: nodes.map((i) => i?.NodeID),
          hasChildren: true,
          isExpanded: false,
          isChildrenLoading: false,
          data: {},
        },
      },
    };

    [...nodes].forEach((x) => {
      _tree.items = {
        ..._tree.items,
        [`${x?.NodeID}`]: {
          id: x?.NodeID,
          children: [],
          hasChildren: x?.HasChild,
          isExpanded: false,
          isChildrenLoading: false,
          data: { ...x },
        },
      };
    });

    setTree(_tree);
  }, [nodes, NodeTypeID]);

  const handleMoveEvent = async (id, ParentID) => {
    const { ErrorText, ...rest } = await api?.CN?.moveNode({
      NodeIDs: [`${id}`],
      ParentID,
    });

    if (ErrorText) {
      InfoToast({
        type: 'error',
        message: RVDic?.MSG[ErrorText] || ErrorText,
      });
    }
  };

  return tree?.rootId ? (
    <RVTree
      data={tree}
      onMove={handleMoveEvent}
      offsetPerLevel={0}
      isDragEnabled={true}
      isNestingEnabled={true}
    >
      {(render) => {
        return <TemplateItemSettingListTreeItem {...render} />;
      }}
    </RVTree>
  ) : null;
};
export default TemplateItemSettingListTree;
