import styled from 'styled-components';
import {
  CV_DISTANT,
  CV_GRAY_DARK,
} from '../../../../../../constant/CssVariables';
import { FLEX_RCB } from '../../../../../../constant/StyledCommonCss';
import ToggleButton from '../../../../../../components/Buttons/Toggle/Toggle';

const RVSideContentSetting = () => {
  return (
    <Container>
      <Block>
        <BlockTitle>{'افزونه‌ها'}</BlockTitle>
        <ToggleRow>
          <ToggleRowTitle>{'مرورگر'}</ToggleRowTitle>
          <ToggleButton />
        </ToggleRow>
      </Block>

      <Block>
        <BlockTitle>{'انوع تمپلیت'}</BlockTitle>
        <ToggleRow>
          <ToggleRowTitle>{'فاقد محتواست'}</ToggleRowTitle>
          <ToggleButton />
        </ToggleRow>

        <ToggleRow>
          <ToggleRowTitle>{'از نوع دانش است'}</ToggleRowTitle>
          <ToggleButton />
        </ToggleRow>

        <ToggleRow>
          <ToggleRowTitle>{'از نوع مستند است'}</ToggleRowTitle>
          <ToggleButton />
        </ToggleRow>
      </Block>

      <Block>
        <BlockTitle>{'تنظیمات بیشتر'}</BlockTitle>

        <ToggleRow>
          <ToggleRowTitle>{'نمایش چکیده و کلمات کلیدی'}</ToggleRowTitle>
          <ToggleButton />
        </ToggleRow>

        <ToggleRow>
          <ToggleRowTitle>{'امکان الصاق فایل به موضوع'}</ToggleRowTitle>
          <ToggleButton />
        </ToggleRow>

        <ToggleRow>
          <ToggleRowTitle>{'امکان ویرایش موضوعات مرتبط'}</ToggleRowTitle>
          <ToggleButton />
        </ToggleRow>

        <ToggleRow>
          <ToggleRowTitle>{'امکان سازمان‌دهی به صورت درختی'}</ToggleRowTitle>
          <ToggleButton />
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
