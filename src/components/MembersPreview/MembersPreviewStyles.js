import styled from 'styled-components';
import { FLEX_RCE, FLEX_RCS } from 'constant/StyledCommonCss';
import { CV_WHITE } from '../../constant/CssVariables';

export const Container = styled.div`
  ${FLEX_RCE};
  width: 100%;
  max-width: ${({ maxWidth }) => maxWidth};
  direction: ${({ rtl }) => (!rtl ? 'rtl' : 'ltr')};
`;
Container.dispalyName = 'Container';

export const UnitWrapper = styled.div`
  height: ${({ size }) => size}rem;
  width: ${({ size }) => size}rem;
  transform: translateX(
    ${({ rtl, size, index }) =>
      rtl ? -0.3 * size * index : 0.3 * size * index}rem
  );
`;
UnitWrapper.dispalyName = 'UnitWrapper';

export const Image = styled.img.attrs(({ title }) => ({
  alt: 'thumbnail',
  title,
}))`
  height: ${({ size }) => 0.98 * size}rem;
  width: ${({ size }) => 0.98 * size}rem;
  border: ${({ size }) => 0.09 * size}rem solid ${CV_WHITE};
  border-radius: 100%;
`;
Image.dispalyName = 'Image';
