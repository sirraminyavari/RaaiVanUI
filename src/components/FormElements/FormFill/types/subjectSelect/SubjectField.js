import React, { useState } from 'react';
import styled from 'styled-components';
import FormCell from '../../FormCell';
import ItemSelection from 'components/ItemSelection/ItemSelection';
import Modal from 'components/Modal/Modal';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import AtIcon from 'components/Icons/AtIcon';
import { CV_GRAY } from 'constant/CssVariables';
import { isArray } from 'lodash-es';
import SelectedItem from './SelectedItems';
import AddButton from '../../items/AddButton';

const { RVDic, GlobalUtilities } = window;
const { to_json } = GlobalUtilities || {};

const SubjectField = ({
  value,
  decodeInfo,
  decodeTitle,
  onAnyFieldChanged,
  elementId,
  type,
  propsContext,
  save,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const onClose = () => {
    setIsVisible(false);
  };
  const onRemove = (e) => {
    console.log(e, 'selectedItems', selectedItems);
    setSelectedItems(selectedItems.filter((x) => x.NodeID !== e.NodeID));
  };
  const onSave = () => {
    setEditMode(!editMode);
  };
  const parseDecodeInfo = to_json(decodeInfo);
  console.log(parseDecodeInfo, 'parseDecodeInfo Node');

  return (
    <>
      <Modal
        onClose={onClose}
        contentWidth={DimensionHelper().isTabletOrMobile ? '98%' : '90%'}
        style={{ padding: '0', height: '50%' }}
        stick
        show={isVisible}>
        <ItemSelection
          nodeTypes={parseDecodeInfo?.NodeTypes}
          routeProps={propsContext}
          multiSelection={parseDecodeInfo?.MultiSelect}
          //join('|')
          onClose={() => setIsVisible(false)}
          onSelectedItems={(e) => {
            if (parseDecodeInfo?.MultiSelect) {
              isArray(e) && setIsVisible(false);
              setSelectedItems(e);
              console.log(e, 'onSelectedItems');
            } else {
              setSelectedItems([e]);
              setIsVisible(false);
            }
          }}
        />
      </Modal>
      <FormCell
        editMode={editMode}
        editModeVisible={true}
        onEdit={() => setEditMode(!editMode)}
        onSave={onSave}
        iconComponent={<AtIcon color={CV_GRAY} />}
        title={decodeTitle}>
        {selectedItems?.length > 0 ? (
          <EditModeContainer>
            {selectedItems.map((x) => (
              <SelectedItem item={x} onRemove={onRemove} editMode={editMode} />
            ))}
            {editMode && <AddButton onClick={() => setIsVisible(true)} />}
          </EditModeContainer>
        ) : (
          <Select onClick={() => setIsVisible(true)}>{RVDic.NodeSelect}</Select>
        )}
      </FormCell>
    </>
  );
};

export default SubjectField;

const Select = styled.div`
  cursor: pointer;
  margin: 0 2rem 0 2rem;
`;
const EditModeContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
`;
