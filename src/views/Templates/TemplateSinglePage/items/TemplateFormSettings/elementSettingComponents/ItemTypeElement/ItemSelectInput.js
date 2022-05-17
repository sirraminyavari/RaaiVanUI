import { useMemo, useState } from 'react';
import TemplateSelect from 'components/TemplateSelect/TemplateSelect';
import * as Styles from './ItemSelectInputStyle';
import { IoChevronBackOutline, IoChevronForward } from 'react-icons/io5';
import { decodeBase64 } from 'helpers/helpers';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import { SelectedItemImg, SelectItemContainer } from './ItemSelectInputStyle';

const ItemSelectInput = ({ NodeTypes, addNodeType, removeNodeType }) => {
  const { RV_RTL } = window;
  const [modalOpen, setModalOpen] = useState(false);

  const handleSelection = (e) => {
    const { NodeTypeID, TypeName: NodeType, IconURL } = e;
    addNodeType && addNodeType({ NodeTypeID, NodeType, IconURL });
  };

  const handleRemove = (e, item) => {
    e?.stopPropagation();
    const { NodeTypeID, TypeName: NodeType, IconURL } = item;
    removeNodeType && removeNodeType({ NodeTypeID, NodeType, IconURL });
  };

  const selectedNodes = useMemo(() => {
    return NodeTypes?.map((x) => (
      <Styles.SelectItemContainer key={x?.NodeTypeID}>
        <Styles.SelectedItemImg src={x?.IconURL} />
        <Styles.SelectedItemTitle>
          {decodeBase64(x?.NodeType)}
        </Styles.SelectedItemTitle>
        <Styles.SelectedItemRemove onClick={(e) => handleRemove(e, x)}>
          <CloseIcon size={20} outline={true} />
        </Styles.SelectedItemRemove>
      </Styles.SelectItemContainer>
    ));
  }, [NodeTypes]);
  return (
    <>
      <Styles.ItemInputContainer onClick={() => setModalOpen(!modalOpen)}>
        <Styles.SelectedItemContainer>
          {selectedNodes}
        </Styles.SelectedItemContainer>
        <Styles.ArrowButton>
          {RV_RTL ? (
            <IoChevronBackOutline size={20} />
          ) : (
            <IoChevronForward size={20} />
          )}
        </Styles.ArrowButton>
      </Styles.ItemInputContainer>
      <TemplateSelect
        isOpen={modalOpen}
        onModalClose={(e) => setModalOpen(false)}
        onSelect={(e) => handleSelection(e)}
      />
    </>
  );
};
export default ItemSelectInput;
