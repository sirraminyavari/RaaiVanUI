import styled from 'styled-components';
import { FLEX_RCA, FLEX_RCC } from 'constant/StyledCommonCss';

export const ImageCropperWrapper = styled.div`
  width: 100%;
  height: 100%;
  text-align: center;
`;

export const CropperButtonsWrapper = styled.div`
  ${FLEX_RCC}
  gap: 2rem;
  margin-top: 3.5rem;
`;

export const ImageCropperContainer = styled.div`
  position: relative;
  height: 17rem;
  width: 100%;
`;

export const SliderWrapper = styled.div`
  ${FLEX_RCA}
  gap: 0.5rem;
  position: relative;
  top: 18rem;
`;
