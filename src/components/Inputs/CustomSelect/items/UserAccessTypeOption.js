import { components } from 'react-select';
import styled from 'styled-components';
import InfoCircleIcon from '../../../Icons/InfoCircleIcon/InfoIcon';
import { CV_DISTANT } from '../../../../constant/CssVariables';

const OptionContainer = styled.div`
  padding: 0.2rem;
`;

const OptionLabel = styled.div`
  font-size: 1rem;
`;

const DescriptionContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.35rem;
  color: ${CV_DISTANT};
`;

const Description = styled.div`
  font-size: 0.75rem;
`;

const UserAccessTypeOption = (props) => {
  const { data, children } = props;
  const { value, label, description } = data;

  return (
    <components.Option {...props}>
      <OptionContainer>
        <div>{children}</div>
        <DescriptionContainer>
          <InfoCircleIcon size={14} />
          <Description>{description}</Description>
        </DescriptionContainer>
      </OptionContainer>
    </components.Option>
  );
};
export default UserAccessTypeOption;
