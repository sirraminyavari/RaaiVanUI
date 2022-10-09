import { FLEX_CCC, FLEX_RCS } from 'constant/StyledCommonCss';
import styled from 'styled-components';
import { MdAccountCircle } from 'react-icons/md';
import { BsFillCalendarFill } from 'react-icons/all';

const DictionarySelectedItemDetail = () => {
  return (
    <Container>
      <Block>
        <BlockTitle>Last edit</BlockTitle>
        <BlockDetailContainer>
          <DetialBlock>
            <BlockDetailIconWrapper>
              <MdAccountCircle size={20} />
            </BlockDetailIconWrapper>
            <div>AmirHossein Seyf</div>
          </DetialBlock>

          <DetialBlock>
            <BlockDetailIconWrapper>
              <BsFillCalendarFill size={14} />
            </BlockDetailIconWrapper>
            <div>2022/07/11 15:58</div>
          </DetialBlock>
        </BlockDetailContainer>
      </Block>

      <Block>
        <BlockTitle>Location </BlockTitle>
        <BlockDetailContainer>
          <Path>
            {'CM/Settings/Template Mng./Received Letters/Form Builder'}
          </Path>
        </BlockDetailContainer>
      </Block>
    </Container>
  );
};

const Container = styled.div`
  padding-left: 2rem;
`;

const Block = styled.div`
  margin-bottom: 2rem;
`;

const BlockTitle = styled.div`
  font-size: 0.75rem;
  color: var(--rv-gray-color);
  margin-bottom: 0.5rem;
`;

const BlockDetailContainer = styled.div`
  min-height: 4rem;
  background-color: #e0e0e0e0;
  border-radius: 0.5rem;
  max-width: 16rem;
  padding: 1rem;
`;

const DetialBlock = styled.div`
  ${FLEX_RCS};
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

const BlockDetailIconWrapper = styled.div`
  color: var(--rv-color);
  height: 1.25rem;
  aspect-ratio: 1;
  ${FLEX_CCC};
`;

const Path = styled.p`
  font-style: italic;
  color: var(--rv-color-warm);
`;
export default DictionarySelectedItemDetail;
