import styled from 'styled-components';
import { FLEX_RCA, FLEX_RCC } from 'constant/StyledCommonCss';
import { BO_RADIUS_CIRCLE } from 'constant/constants';
import { CV_DISTANT, CV_GRAY_DARK, TCV_DEFAULT } from 'constant/CssVariables';

const { RV_Float } = window;

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

export const ImageCropper = styled.div.attrs({
  className: `${BO_RADIUS_CIRCLE}`,
})`
  width: 8rem;
  height: 8rem;
  position: relative;
  padding: 1rem;

  .cropper-avatar {
    background-color: ${CV_GRAY_DARK};
    border-radius: 50%;
  }

  :hover {
    div {
      opacity: 1;
    }
    ~ div {
      opacity: 0;
    }
  }
`;

export const PencilWrapper = styled.div.attrs({
  className: `${BO_RADIUS_CIRCLE}`,
})`
  width: 1.6rem;
  height: 1.6rem;
  position: absolute;
  bottom: 0.5rem;
  ${RV_Float}: 4.5rem;
  padding: 0.15rem 0.1rem 0 0;
  background-color: ${TCV_DEFAULT};
  border: 2px solid ${CV_DISTANT};
  opacity: 0;
  cursor: pointer;
  transition: all 0.3s ease;
`;
