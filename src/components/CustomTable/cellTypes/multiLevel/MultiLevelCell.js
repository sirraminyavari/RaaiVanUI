import { useState, useEffect } from 'react';
import Select from 'react-select';
import { getChildNodes } from 'apiHelper/apiFunctions';
import * as Styled from './MultiLevelCell.styles';
import { decodeBase64 } from 'helpers/helpers';
import useWindow from 'hooks/useWindowContext';
import { customStyles } from './MultiLevelCell.styles';

const normalizedOptions = (options) =>
  options?.nodes?.map((node) => {
    return { label: decodeBase64(node.Name), value: { ...node } };
  });

const MultiLevelCell = (props) => {
  // console.log(props, 'multi');
  const {
    value,
    row,
    column,
    onCellChange,
    editable: isTableEditable,
    editingRow,
    isNew,
    header,
    multiSelect,
    data,
  } = props;

  const { RVDic } = useWindow();

  const rowId = row?.original?.id;
  const columnId = column?.id;

  const isCellEditable = !!header?.options?.editable;
  const isRowEditing = rowId === editingRow;

  const { Levels, NodeType } = value?.Info || {};
  const { ID, Name } = NodeType || {};

  const [levels, setLevels] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState(
    Levels.map((x) => ({ ID: '', Name: '' }))
  );

  useEffect(() => {
    getChildNodes(ID)
      .then((response) => {
        const firstLevelNodes = response?.Nodes;
        setLevels(
          Levels.map((level, index) =>
            index === 0 ? { nodes: firstLevelNodes } : level
          )
        );
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      {levels?.map((level, index) => {
        const { ID, Name } = selectedLevels[index] || {};
        return (
          <>
            {!!normalizedOptions(level) ? (
              <div key={index}>
                <Select
                  onBlur={() => {}}
                  options={normalizedOptions(level)}
                  value={{ value: ID, label: Name }}
                  placeholder={RVDic.Select}
                  styles={customStyles}
                  isSearchable={true}
                  onChange={(event, triggeredAction) => {
                    // if (triggeredAction.action === 'clear') {
                    //   const selectedTemp = selectedLevels?.map((x, ind) =>
                    //     ind === index ? { ID: undefined, Name: undefined } : x
                    //   );
                    //   setSelectedLevels(selectedTemp);
                    //   onAnyFieldChanged(elementId, selectedTemp, type);
                    //   setLevels(selectedTemp);
                    //   // Clear happened
                    // } else {
                    //   onLevelSelected(elementId, event, type, index);
                    // }
                  }}
                />
              </div>
            ) : null}
          </>
        );
      })}
    </div>
  );
};

export default MultiLevelCell;
