import RVTree from 'components/Tree/RVTree/RVTree';
import { useEffect, useState } from 'react';
import { useTemplateContext } from 'views/Templates/TemplateSinglePage/TemplateProvider';
import TemplateItemSettingListTreeItem from './TemplateItemSettingListTreeItem';

const TemplateItemSettingListTree = ({ nodes }) => {
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
    console.log('tree: ', _tree);

    setTree(_tree);
  }, [nodes, NodeTypeID]);

  return tree?.rootId ? (
    <RVTree data={tree}>
      <TemplateItemSettingListTreeItem />
    </RVTree>
  ) : null;
};
export default TemplateItemSettingListTree;
