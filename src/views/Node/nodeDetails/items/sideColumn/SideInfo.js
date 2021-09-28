import { useContext } from 'react';
import * as Styled from 'views/Node/nodeDetails/NodeDetails.style';
// import Badge from 'components/Badge/Badge';
import { decodeBase64 } from 'helpers/helpers';
import { SideContext } from './SideColumn';

const SideInfo = () => {
  const { nodeDetails } = useContext(SideContext);

  const { IconURL, NodeType, AdditionalID } = nodeDetails || {};

  //! Name of the document with hierarchy.
  const nameHierarchy = NodeType?.Value.map((val) =>
    decodeBase64(val?.Name)
  ).join(' / ');

  return (
    <Styled.SideInfoContainer>
      <Styled.InfoImageWrapper>
        <img src={IconURL?.Value} alt="side-info-avatar" />
      </Styled.InfoImageWrapper>
      <Styled.InfosWrapper>
        <Styled.DocInfoTitle>{nameHierarchy}</Styled.DocInfoTitle>
        <Styled.DocInfoID>{AdditionalID}</Styled.DocInfoID>
        {/* <Styled.DocTagsContainer>
          {itemInfo?.Tags?.map(tag => ...)}
          <Badge className="doc-tags-badge" showText="فرم" />
          <Badge className="doc-tags-badge" showText="دانشنامه" />
          <Badge className="doc-tags-badge" showText="دیدگاه‌ها" />
        </Styled.DocTagsContainer> */}
      </Styled.InfosWrapper>
    </Styled.SideInfoContainer>
  );
};

export default SideInfo;
