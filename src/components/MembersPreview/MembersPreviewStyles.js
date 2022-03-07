import styled from 'styled-components';
import { FLEX_RCC, FLEX_RCE, FLEX_RCS } from 'constant/StyledCommonCss';
import { CV_WHITE, TCV_DEFAULT } from '../../constant/CssVariables';

export const Container = styled.div`
  ${FLEX_RCE};
  width: 100%;
  max-width: ${({ maxWidth }) => maxWidth};
  direction: ${({ rtl }) => (!rtl ? 'rtl' : 'ltr')};
`;
Container.dispalyName = 'Container';

export const UnitWrapper = styled.div`
  display: flex;
  height: ${({ size }) => size}rem;
  width: ${({ size }) => size}rem !important;
  transform: translateX(
    ${({ rtl, size, index }) =>
      rtl ? -0.3 * size * index : 0.3 * size * index}rem
  );
  position: relative;
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

export const MoreUnits = styled.div`
  ${FLEX_RCC};
  height: ${({ size }) => 0.98 * size}rem;
  width: ${({ size }) => 0.98 * size}rem;
  border-radius: 100%;
  border: ${({ size }) => 0.09 * size}rem solid ${CV_WHITE};
  background-color: #e6f4f1;
  color: ${TCV_DEFAULT};
  font-size: 0.8rem;
`;

export const RemainListContainer = styled.div``;
