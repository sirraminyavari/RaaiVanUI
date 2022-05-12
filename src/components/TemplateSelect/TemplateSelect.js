import { useEffect, useRef, useState, createContext } from 'react';
import * as Styled from './TemplateSelect.styles';
import Modal from 'components/Modal/Modal';
import { getNodeTypes } from 'apiHelper/apiFunctions';
import TemplatesList from './TemplatesList';
import TemplateFields from './TemplateFields';
import usePreventScroll from 'hooks/usePreventScroll';
import { provideNodeTypesForTree } from './utils';

export const TemplateSelectContext = createContext({});

const TemplateSelect = (props) => {
  const { isOpen, onModalClose, onSelect } = props;
  const [nodeTree, setNodeTree] = useState({});
  const [currentNode, setCurrentNode] = useState(null);
  const containerRef = useRef();

  usePreventScroll(containerRef);

  useEffect(() => {
    getNodeTypes()
      .then((response) => {
        if (response?.NodeTypes) {
          setNodeTree(provideNodeTypesForTree(response));
          setCurrentNode(response?.NodeTypes?.[0]);
          // console.log(response?.NodeTypes);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return () => {
      setNodeTree([]);
    };
  }, []);

  return (
    <TemplateSelectContext.Provider
      value={{
        currentNode,
        setCurrentNode,
        nodeTree,
        setNodeTree,
        onModalClose,
        onSelect,
      }}
    >
      <Styled.TemplateSelectContainer ref={containerRef}>
        <Modal
          contentWidth="70%"
          titleContainerClass="select-template-modal-title-container"
          contentClass="select-template-modal-content"
          show={isOpen}
          onClose={onModalClose}
        >
          <Styled.ModalContentWrapper>
            <TemplatesList />
            <TemplateFields />
          </Styled.ModalContentWrapper>
        </Modal>
      </Styled.TemplateSelectContainer>
    </TemplateSelectContext.Provider>
  );
};

export default TemplateSelect;
