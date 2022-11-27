import ToggleNecessaryState from '../sharedItems/ToggleNecessaryState';
import * as Styles from '../sharedItems/SharedStyles';
import produce from 'immer';
import { decodeBase64 } from 'helpers/helpers';
import SelectInputField from 'components/FormElements/ElementTypes/Select/SelectInputField';

const MultiLevelSideBoxSetting = ({
  current,
  setFormObjects,
  loadMultiLevelChildNodes,
  getMultiLevelNodeDepth,
}) => {
  const { nodes, data } = current || {};

  const NodeTypes = async () => {
    const nodeTypes = await loadMultiLevelChildNodes();
    setFormObjects(
      produce((d) => {
        const _current = d?.find((x) => x?.id === current?.id);
        _current.nodes = nodeTypes.map((item) => ({
          label: decodeBase64(item.TypeName),
          value: item.NodeTypeID,
        }));
      })
    );
  };

  const setMultiLevelDepth = async (NodeTypeID) => {
    if (!getMultiLevelNodeDepth) return;
    const { Depth } = await getMultiLevelNodeDepth(NodeTypeID);
    setFormObjects(
      produce((d) => {
        const _current = d?.find((x) => x?.id === current?.id);
        _current.selectedNodeDepth = Depth;
        _current.data.Info.Levels = [];
        const selectedNodeType = _current.nodes?.find(
          ({ value }) => value === NodeTypeID
        );
        _current.data.Info.NodeType = {
          ID: selectedNodeType.value,
          Name: selectedNodeType.label,
        };
      })
    );
  };
  return (
    <Styles.Row
      onFocusCapture={() => {
        NodeTypes();
        // if (data.Info.NodeType?.ID) setMultiLevelDepth(data.Info.NodeType?.ID);
      }}
    >
      <ToggleNecessaryState {...{ current, setFormObjects }} />
      <Styles.ToggleRow>
        <Styles.ToggleRowTitle>{'کلاس'}</Styles.ToggleRowTitle>
        <SelectInputField
          isFocused
          isEditable
          options={nodes}
          selectedValue={
            data.Info.NodeType
              ? {
                  label: decodeBase64(data.Info.NodeType.Name),
                  value: data.Info.NodeType.ID,
                }
              : undefined
          }
          onChange={(selectedItem) => {
            setMultiLevelDepth(selectedItem.value);
          }}
        />
      </Styles.ToggleRow>
    </Styles.Row>
  );
};
export default MultiLevelSideBoxSetting;
