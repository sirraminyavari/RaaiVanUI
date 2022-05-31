import styled from 'styled-components';
import { FLEX_CCC, FLEX_RCS } from 'constant/StyledCommonCss';
import { CV_GRAY_DARK } from 'constant/CssVariables';
import TemplateInlineEdit from './TemplatesInlineEdit';
import TemplateCreateNew from './TemplateCreateNew';
import SaaSTemplateCard from './SaaSTemplateCard';
import TemplateDeleteButton from './TemplateDeleteButton';
import { useContext, useState } from 'react';
import { TemplateListContext } from '../TemplatesSettings';
import CaretIcon from 'components/Icons/CaretIcons/Caret';
import useWindowContext from 'hooks/useWindowContext';

const SaaSTemplateItem = ({ NodeTypeID, TypeName, Sub, isExpanded }) => {
  const { handleDeleteNode, handleAddNodeType } =
    useContext(TemplateListContext);

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
        <TemplateInlineEdit
          value={TypeName}
          color={CV_GRAY_DARK}
          fontSize={'1rem'}
        />
        <TemplateDeleteButton onDeleteConfirm={() => handleDelete()} />
      </ItemHead>
      <SubItems>
        {isOpen && (
          <Grid>
            {Sub?.map((x) => (
              <SaaSTemplateCard key={x?.NodeTypeID} {...x} />
            ))}
            <TemplateCreateNew
              parent={NodeTypeID}
              isSaaS={true}
              title={TypeName}
              onSubmit={(value, parent) => handleAddNodeType(value, parent)}
            />
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
