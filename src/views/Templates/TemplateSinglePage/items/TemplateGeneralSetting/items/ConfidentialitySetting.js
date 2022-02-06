import styled from 'styled-components';
import { FLEX_RCS } from 'constant/StyledCommonCss';
import { CV_GRAY_DARK } from 'constant/CssVariables';
import CustomSelectIndicator from 'components/Inputs/CustomSelect/items/CustomSelectIndicator';
import UserAccessTypeOption from 'components/Inputs/CustomSelect/items/UserAccessTypeOption';
import CustomSelect from 'components/Inputs/CustomSelect/CustomSelect';

const ConfidentialitySetting = () => {
  const confidentialityOptions = [
    {
      value: 1,
      label: 'غیرمحرمانه',
      description: 'دسترسی برای همه کاربران',
    },
    {
      value: 2,
      label: 'محرمانه',
      description: 'دسترسی برای مدیران',
    },
    {
      value: 3,
      label: 'محرمانه پیشرفته',
      description: 'دسترسی پیشرفته و قابل شخصی سازی',
    },
  ];
  return (
    <Container>
      <SelectionBlock>
        <BlockTitle>{'تنظیمات محرمانگی'}</BlockTitle>
        <BlockSelectWrapper>
          <CustomSelect
            placeholder=""
            components={{
              DropdownIndicator: CustomSelectIndicator,
              Option: UserAccessTypeOption,
            }}
            classNamePrefix="select"
            options={confidentialityOptions}
          />
        </BlockSelectWrapper>
      </SelectionBlock>
    </Container>
  );
};
const Container = styled.div`
  margin-top: 4rem;
`;
const SelectionBlock = styled.div`
  height: 3rem;
  ${FLEX_RCS};
  gap: 0.75rem;
`;

const BlockTitle = styled.div`
  width: 11.25rem;
  font-weight: 500;
  color: ${CV_GRAY_DARK};
`;

const BlockSelectWrapper = styled.div`
  max-width: 23.5rem;
  width: 100%;
`;

export default ConfidentialitySetting;
