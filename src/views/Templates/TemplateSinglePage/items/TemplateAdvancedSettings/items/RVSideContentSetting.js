import styled from 'styled-components';
import {
  CV_DISTANT,
  CV_GRAY_DARK,
} from '../../../../../../constant/CssVariables';
import { FLEX_RCB } from '../../../../../../constant/StyledCommonCss';
import ToggleButton from '../../../../../../components/Buttons/Toggle/Toggle';
import useRVSideContentSetting from './useRVSideContentSetting';

const RVSideContentSetting = () => {
  const {
    Browser,
    handleBrowserState,
    noContent,
    handleNoCotentServiceStateChange,
    isKnowledgeState,
    handleIsKnowledgeStateChange,
    isDocumentState,
    handleIsDocumentStateChange,
    disableAbstractAndKeywords,
    handleDisableAbstractAndKeywords,
    fileUploadState,
    handleFileUploadState,
    relatedNodesSelectState,
    handleRelatedNodesSelectStateChange,
    isTreeState,
    handleTreeStateChange,
  } = useRVSideContentSetting({});

  return (
    <Container>
      <Block>
        <BlockTitle>{'افزونه‌ها'}</BlockTitle>
        <ToggleRow>
          <ToggleRowTitle>{'مرورگر'}</ToggleRowTitle>
          <ToggleButton value={Browser} onToggle={handleBrowserState} />
        </ToggleRow>
      </Block>

      <Block>
        <BlockTitle>{'انوع تمپلیت'}</BlockTitle>
        <ToggleRow>
          <ToggleRowTitle>{'فاقد محتواست'}</ToggleRowTitle>
          <ToggleButton
            value={noContent}
            onToggle={handleNoCotentServiceStateChange}
          />
        </ToggleRow>

        <ToggleRow>
          <ToggleRowTitle>{'از نوع دانش است'}</ToggleRowTitle>
          <ToggleButton
            value={isKnowledgeState}
            onToggle={handleIsKnowledgeStateChange}
          />
        </ToggleRow>

        <ToggleRow>
          <ToggleRowTitle>{'از نوع مستند است'}</ToggleRowTitle>
          <ToggleButton
            value={isDocumentState}
            onToggle={handleIsDocumentStateChange}
          />
        </ToggleRow>
      </Block>

      <Block>
        <BlockTitle>{'تنظیمات بیشتر'}</BlockTitle>

        <ToggleRow>
          <ToggleRowTitle>{'نمایش چکیده و کلمات کلیدی'}</ToggleRowTitle>
          <ToggleButton
            value={!disableAbstractAndKeywords}
            onToggle={handleDisableAbstractAndKeywords}
          />
        </ToggleRow>

        <ToggleRow>
          <ToggleRowTitle>{'امکان الصاق فایل به موضوع'}</ToggleRowTitle>
          <ToggleButton
            value={fileUploadState}
            onToggle={handleFileUploadState}
          />
        </ToggleRow>

        <ToggleRow>
          <ToggleRowTitle>{'امکان ویرایش موضوعات مرتبط'}</ToggleRowTitle>
          <ToggleButton
            value={relatedNodesSelectState}
            onToggle={handleRelatedNodesSelectStateChange}
          />
        </ToggleRow>

        <ToggleRow>
          <ToggleRowTitle>{'امکان سازمان‌دهی به صورت درختی'}</ToggleRowTitle>
          <ToggleButton value={isTreeState} onToggle={handleTreeStateChange} />
        </ToggleRow>
      </Block>
    </Container>
  );
};
const Container = styled.div`
  padding: 1rem;
`;

const Block = styled.div`
  margin: 2rem 0 1rem 0;
`;

const BlockTitle = styled.div`
  font-size: 0.8rem;
  font-weight: 300;
  color: ${CV_DISTANT};
`;

const ToggleRow = styled.div`
  ${FLEX_RCB};
  padding: 0.75rem 0;
`;
const ToggleRowTitle = styled.div`
  font-weight: 500;
  color: ${CV_GRAY_DARK};
`;
export default RVSideContentSetting;
