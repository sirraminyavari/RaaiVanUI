import * as Styled from 'views/Node/nodeDetails/NodeDetails.style';
import Badge from 'components/Badge/Badge';

const SideInfo = (props) => {
  const { itemInfo } = props;

  return (
    <Styled.SideInfoContainer>
      <Styled.InfoImageWrapper>
        <img
          src={itemInfo?.imageURL || '../../images/Preview.png'}
          alt="side-info-avatar"
        />
      </Styled.InfoImageWrapper>
      <Styled.InfosWrapper>
        <Styled.DocInfoTitle>
          {itemInfo?.Title || 'بازاریابی / اسناد مارکتینگ'}
        </Styled.DocInfoTitle>
        <Styled.DocInfoID>
          {itemInfo?.AdditionalID || '1400035892'}
        </Styled.DocInfoID>
        <Styled.DocTagsContainer>
          {/* {itemInfo?.Tags?.map(tag => ...)} */}
          <Badge className="doc-tags-badge" showText="فرم" />
          <Badge className="doc-tags-badge" showText="دانشنامه" />
          <Badge className="doc-tags-badge" showText="دیدگاه‌ها" />
        </Styled.DocTagsContainer>
      </Styled.InfosWrapper>
    </Styled.SideInfoContainer>
  );
};

export default SideInfo;
