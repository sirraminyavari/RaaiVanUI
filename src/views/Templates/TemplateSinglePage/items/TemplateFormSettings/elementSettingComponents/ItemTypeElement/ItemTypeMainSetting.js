import ItemSelectInput from './ItemSelectInput';
import produce from 'immer';

const ItemTypeMainSetting = ({ current, setFormObjects }) => {
  const { NodeTypes } = current?.data?.Info || {};

  const addNodeType = (node) => {
    const exist = NodeTypes.find((x) => x?.NodeTypeID === node?.NodeTypeID);
    !exist &&
      setFormObjects(
        produce((d) => {
          const _current = d.find((x) => x.id === current.id);
          _current.data.Info.NodeTypes.push(node);
        })
      );
  };

  const removeNodeType = (node) => {
    const removedItemVersion = NodeTypes.filter(
      (x) => x?.NodeTypeID !== node?.NodeTypeID
    );
    setFormObjects(
      produce((d) => {
        const _current = d.find((x) => x.id === current.id);
        _current.data.Info.NodeTypes = removedItemVersion;
      })
    );
  };

  return <ItemSelectInput {...{ NodeTypes, addNodeType, removeNodeType }} />;
};
export default ItemTypeMainSetting;
