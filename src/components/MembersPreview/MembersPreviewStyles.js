import styled from 'styled-components';
import { FLEX_RCC, FLEX_RCE, FLEX_RCS } from 'constant/StyledCommonCss';
import { CV_GRAY, CV_WHITE, TCV_DEFAULT } from '../../constant/CssVariables';

export const Container = styled.div`
  ${FLEX_RCE};
  width: 100%;
  max-width: ${({ maxWidth }) => maxWidth};
`;
Container.dispalyName = 'Container';

export const UnitWrapper = styled.div`
  display: flex;
  height: ${({ size }) => size}rem;
  width: ${({ size }) => size}rem !important;
  transform: translateX(
    ${({ rtl, size, index }) =>
      rtl ? 0.3 * size * index : -0.3 * size * index}rem
  );
  position: relative;
  cursor: pointer;
  z-index: 1;
  overflow: visible;
`;
UnitWrapper.dispalyName = 'UnitWrapper';

export const Image = styled.img.attrs(({ title }) => ({
  alt: 'thumbnail',
  title,
}))`
  height: ${({ size }) => 0.98 * size}rem;
  width: ${({ size }) => 0.98 * size}rem;
  border: ${({ size }) => 0.0625 * size}rem solid ${CV_WHITE};
  border-radius: 100%;
`;
Image.dispalyName = 'Image';

export const DropDown = styled.div`
  background-color: ${CV_WHITE};
  display: block;
  z-index: 1000;
  box-shadow: 1px 3px 20px #2b7be429;
  padding: 1rem 2rem;
  border-radius: 0.625rem;
  position: absolute;
  right: 2rem;
  bottom: 0.5rem;
  height: 10rem;
  overflow: hidden;
  min-width: 12rem;
`;

export const MoreUnits = styled.div`
  ${FLEX_RCC};
  height: ${({ size }) => 0.98 * size}rem;
  width: ${({ size }) => 0.98 * size}rem;
  border-radius: 100%;
  border: ${({ size }) => 0.09 * size}rem solid ${CV_WHITE};
  background-color: #e6f4f1;
  color: ${TCV_DEFAULT};
  font-size: 0.8rem;
  cursor: pointer;
`;

export const MoreObjectItemContainer = styled.div`
  direction: rtl;
  ${FLEX_RCS};
  gap: 0.5rem;
  margin-bottom: 0.2rem;
`;

export const MoreObjectItemImg = styled.img`
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 100%;
`;

export const MoreObjectItemTitle = styled.div`
  font-size: 0.8rem;
  color: ${CV_GRAY};
  font-weight: 400;
`;
