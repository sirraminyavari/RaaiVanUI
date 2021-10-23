import { components } from 'react-select';
import * as Styled from './CustomSelectStyle';
import ArrowHead from '../../../components/Icons/ArrowIcons/ArrowHead';
import { ThumbnailControllerContainer } from './CustomSelectStyle';
export const Indicator = (props) => {
  const { isFocused } = props;

  return (
    <components.DropdownIndicator {...props}>
      <Styled.IndicatorIcon>
        <ArrowHead dir={isFocused ? 'up' : 'down'} />
      </Styled.IndicatorIcon>
    </components.DropdownIndicator>
  );
};

export const ThumbnailOption = ({ children, data, ...props }) => {
  // console.log(props);

  const { value, label, thumb } = data;

  return (
    <components.Option {...props}>
      <Styled.ThumbnailOptionContainer>
        <Styled.Thumbnail src={thumb} />
        <div>{children}</div>
      </Styled.ThumbnailOptionContainer>
    </components.Option>
  );
};

export const ThumbnailControl = ({ children, selectProps, ...props }) => {
  console.log(props);

  const thumb = selectProps?.value?.thumb;

  console.log('thumb: ', thumb);

  return (
    <components.SingleValue {...props}>
      <Styled.ThumbnailControllerContainer>
        <Styled.Thumbnail src={thumb}></Styled.Thumbnail>
        <div>{children}</div>
      </Styled.ThumbnailControllerContainer>
    </components.SingleValue>
  );
};
