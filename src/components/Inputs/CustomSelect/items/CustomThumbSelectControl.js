import styled from 'styled-components';
import { components } from 'react-select';

const Thumbnail = styled.img`
  border-radius: 100%;
  height: 1.5rem;
  width: 1.5rem;
`;

const ThumbnailControllerContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: fit-content;
`;

const CustomThumbSelectControl = (props) => {
  const { children, selectProps } = props;
  const thumb = selectProps?.value?.thumb;

  return (
    <components.SingleValue {...props}>
      <ThumbnailControllerContainer>
        <Thumbnail src={thumb}></Thumbnail>
        <div>{children}</div>
      </ThumbnailControllerContainer>
    </components.SingleValue>
  );
};
export default CustomThumbSelectControl;
