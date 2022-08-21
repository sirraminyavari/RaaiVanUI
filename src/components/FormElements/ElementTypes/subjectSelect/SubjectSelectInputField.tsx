import { useEffect, useState } from 'react';
import styled from 'styled-components';
import ItemSelection from 'components/ItemSelection/ItemSelection';
import Modal from 'components/Modal/Modal';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import { isArray } from 'lodash-es';
import SelectedItem from './SelectedItems';
import AddButton from '../../FormFill/items/AddButton';
import { decodeBase64 } from 'helpers/helpers';
import useWindow from 'hooks/useWindowContext';
import * as Styles from '../formElements.styles';

export interface ISubjectSelectInputItem {
  NodeID: string;
  Name: string;
  IconURL: string;
}
export interface ISubjectSelectInputField {
  info: {
    MultiSelect: boolean;
    NodeTypes: {
      NodeTypeID: string;
      NodeType: string;
    }[];
  };
  onChange;
  propsContext?: { [key: string]: any };
  isEditable: boolean;
  value;
}

const SubjectSelectInputField = ({
  value = [],
  info = { MultiSelect: true, NodeTypes: [] },
  onChange,
  propsContext,
  isEditable,
}: ISubjectSelectInputField) => {
  const { RVDic } = useWindow();

  const [isVisible, setIsVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState<ISubjectSelectInputItem[]>(
    []
  );

  useEffect(() => {
    const readyToSave = selectedItems?.map((x) => {
      return { ID: x.NodeID, Name: decodeBase64(x.Name), IconURL: x.IconURL };
    });
    onChange(readyToSave);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems]);

  const onClose = () => {
    setIsVisible(false);
  };
  const onRemove = (e) => {
    setSelectedItems((prevItems) => prevItems.filter((x) => x.NodeID !== e.ID));
  };

  return (
    <>
      <Modal
        onClose={onClose}
        // @ts-expect-error
        contentWidth={DimensionHelper().isTabletOrMobile ? '98%' : '90%'}
        style={{ padding: '0', height: '50%' }}
        stick
        show={isVisible}
        preventParentScroll
      >
        <ItemSelection
          nodeTypes={info?.NodeTypes}
          routeProps={propsContext}
          multiSelection={info?.MultiSelect}
          //join('|')
          onClose={() => {
            setIsVisible(false);
          }}
          onSelectedItems={(e) => {
            if (info?.MultiSelect) {
              if (isArray(e)) {
                setIsVisible(false);
              }

              setSelectedItems(e);
              console.log(e, 'onSelectedItems single');
            } else {
              setSelectedItems([e]);
              setIsVisible(false);
            }
          }}
        />
      </Modal>
      {value?.length > 0 ? (
        <EditModeContainer>
          {value.map((x) => (
            <SelectedItem item={x} onRemove={onRemove} editMode={isEditable} />
          ))}
          {isEditable && <AddButton onClick={() => setIsVisible(true)} />}
        </EditModeContainer>
      ) : (
        <Styles.SelectedFieldItemContainer
          muted
          onClick={() => setIsVisible(true)}
        >
          {RVDic.NodeSelect}
        </Styles.SelectedFieldItemContainer>
      )}
    </>
  );
};
SubjectSelectInputField.displayName = 'SubjectSelectInputField';
export default SubjectSelectInputField;

const EditModeContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
`;
