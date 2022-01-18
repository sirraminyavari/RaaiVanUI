import styled from 'styled-components';
import { FLEX_RCS } from 'constant/StyledCommonCss';
import { CV_GRAY_DARK } from 'constant/CssVariables';
import TemplateInlineEdit from './TemplatesInlineEdit';
import TemplateCreateNew from './TemplateCreateNew';
import SaaSTemplateCard from './SaaSTemplateCard';

const SaaSTemplateItem = ({ NodeTypeID, TypeName, Sub, handleAddNodeType }) => {
  return (
    <>
      <ItemHead>
        <TemplateInlineEdit
          value={TypeName}
          color={CV_GRAY_DARK}
          fontSize={'1rem'}
        />
      </ItemHead>
      <SubItems>
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
      </SubItems>
    </>
  );
};
const ItemHead = styled.div`
  ${FLEX_RCS};
  color: ${CV_GRAY_DARK};
`;
const SubItems = styled.div`
  display: block;
  margin: 1.3rem 0;
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

  @media screen and (max-width: 9
  00px) {
    grid-template-columns: 1fr;
  }
`;
export default SaaSTemplateItem;
