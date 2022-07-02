import styled from 'styled-components';
import { FLEX_CCC, FLEX_RCS } from 'constant/StyledCommonCss';
import { CV_GRAY_DARK, CV_WHITE, TCV_DEFAULT } from 'constant/CssVariables';
import TemplateInlineEdit from './TemplatesInlineEdit';
import TemplateCreateNew from './TemplateCreateNew';
import SaaSTemplateCard from './SaaSTemplateCard';
import TemplateDeleteButton from './TemplateDeleteButton';
import { useContext, useState } from 'react';
import { TemplateListContext } from '../TemplatesSettings';
import CaretIcon from 'components/Icons/CaretIcons/Caret';
import useWindowContext from 'hooks/useWindowContext';
import { IoCheckmarkCircle } from 'react-icons/io5';

const SaaSTemplateItem = ({
  NodeTypeID,
  TypeName,
  Sub,
  isExpanded,
  unCategorized,
}) => {
  const { handleDeleteNode, handleAddNodeType } =
    useContext(TemplateListContext);

  const [editMode, setEditMode] = useState(false);
  const [isOpen, setIsOpen] = useState(isExpanded);

  const { RV_RTL } = useWindowContext();

  const handleDelete = () => {
    if (handleDeleteNode) handleDeleteNode(NodeTypeID);
  };

  return (
    <>
      <ItemHead>
        <ArrowIconWrapper rtl={RV_RTL}>
          <NodeIcon
            onClick={() => setIsOpen(!isOpen)}
            size={20}
            rtl={RV_RTL}
            opened={isOpen}
            dir={RV_RTL ? 'left' : 'right'}
          />
        </ArrowIconWrapper>

        {unCategorized && <NonEditingTitle>{TypeName}</NonEditingTitle>}

        {!unCategorized && (
          <TemplateInlineEdit
            value={TypeName}
            color={CV_GRAY_DARK}
            onModeChange={(mode) => setEditMode(mode)}
            fontSize={'1rem'}
          >
            {!unCategorized && !editMode && (
              <TemplateDeleteButton onDeleteConfirm={() => handleDelete()} />
            )}

            {!unCategorized && editMode && (
              <ConfirmButton onDeleteConfirm={() => handleDelete()}>
                <IoCheckmarkCircle size={20} />
              </ConfirmButton>
            )}
          </TemplateInlineEdit>
        )}
      </ItemHead>

      <SubItems>
        {isOpen && (
          <Grid>
            {Sub?.map((x) => (
              <SaaSTemplateCard key={x?.NodeTypeID} {...x} />
            ))}

            {!unCategorized && (
              <TemplateCreateNew
                parent={NodeTypeID}
                isSaaS={true}
                title={TypeName}
                onSubmit={(value, parent) => handleAddNodeType(value, parent)}
              />
            )}
          </Grid>
        )}
      </SubItems>
    </>
  );
};
const ItemHead = styled.div`
  ${FLEX_RCS};
  color: ${CV_GRAY_DARK};
  margin: 2.8rem 0 0.2rem 0;
`;

const SubItems = styled.div`
  display: block;
  margin: 1.3rem 0;
`;

const ArrowIconWrapper = styled.div`
  width: 20px;
  ${({ rtl }) => (rtl ? 'margin-left' : 'margin-right')}: 0.5rem;
  height: 2.5rem;
  ${FLEX_CCC};
`;

const ConfirmButton = styled.button`
  width: 2.5rem;
  aspect-ratio: 1;
  border-radius: 100%;
  background-color: ${CV_WHITE};
  color: ${TCV_DEFAULT};
  margin: 0 2rem;
  cursor: pointer;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-row-gap: 1.5rem;
  grid-column-gap: 1.5rem;

  @media screen and (max-width: 1600px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media screen and (max-width: 1200px) {
    grid-template-columns: 1fr 1fr;
  }

  @media screen and (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const NonEditingTitle = styled.div`
  font-weight: 600;
  height: 2.5rem;
  line-height: 2.5rem;
  font-size: 1rem;
`;

const NodeIcon = styled(CaretIcon).attrs((props) => ({
  size: props.size,
  dir: props.dir,
}))`
  color: ${CV_GRAY_DARK};
  cursor: pointer;
  transform: ${({ opened, rtl }) =>
    opened ? `rotate(${rtl ? '-90' : '90'}deg)` : 'rotate(0)'};
  transition: all 0.3s ease-out;
`;

export default SaaSTemplateItem;
