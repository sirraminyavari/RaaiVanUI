import { CV_DISTANT } from 'constant/CssVariables';
import * as Styled from 'views/Profile/Profile.styles';

const HeaderStatus = () => {
  return (
    <Styled.HeaderStatusContainer>
      <Styled.StatusWrapper>
        <span>تعداد آیتم‌ها</span>
        <Styled.StatusCount>145</Styled.StatusCount>
      </Styled.StatusWrapper>
      <Styled.StatusWrapper
        style={{
          borderLeft: `1px solid ${CV_DISTANT}`,
          borderRight: `1px solid ${CV_DISTANT}`,
        }}>
        <span>تعداد آیتم‌های مرتبط</span>
        <Styled.StatusCount>99+</Styled.StatusCount>
      </Styled.StatusWrapper>
      <Styled.StatusWrapper>
        <span>تعداد موضوعات نشان شده</span>
        <Styled.StatusCount>78</Styled.StatusCount>
      </Styled.StatusWrapper>
    </Styled.HeaderStatusContainer>
  );
};

export default HeaderStatus;
