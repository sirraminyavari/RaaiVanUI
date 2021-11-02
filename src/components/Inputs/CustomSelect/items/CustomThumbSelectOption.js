import styled from 'styled-components';
import { components } from 'react-select';

const ThumbnailOptionContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const Thumbnail = styled.img`
  border-radius: 100%;
  height: 1.5rem;
  width: 1.5rem;
`;

const CustomThumbSelectOption = (props) => {
  const { data, children } = props;
  const { value, label, thumb } = data;

  return (
    <components.Option {...props}>
      <ThumbnailOptionContainer>
        <Thumbnail src={thumb} />
        <div>{children}</div>
      </ThumbnailOptionContainer>
    </components.Option>
  );
};
export default CustomThumbSelectOption;
