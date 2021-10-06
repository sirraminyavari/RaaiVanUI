import { BO_RADIUS_QUARTER } from 'constant/constants';
import { CV_DISTANT, TCV_DEFAULT } from 'constant/CssVariables';
import { FLEX_CCC } from 'constant/StyledCommonCss';
import styled from 'styled-components';

export const DropzoneContainer = styled.div.attrs({
  className: `${BO_RADIUS_QUARTER}`,
})`
  width: 100%;
  height: 100%;
  border: 0.15rem dashed ${CV_DISTANT};
  padding: 0.5rem;
  cursor: pointer;
  ${FLEX_CCC}
  gap: 1rem;
`;

export const DropzonePlaceholder = styled.span`
  font-size: 0.8rem;
  color: ${CV_DISTANT};
`;

export const UploadIconWrapper = styled.div`
  border: 2px solid transparent;
  display: inline-block;
  border-radius: 50%;
  line-height: 0.8rem;
  padding: 0.2rem 0.3rem;
  background-color: ${TCV_DEFAULT};
`;

export const InputWrapper = styled.div`
  width: 100%;
  font-size: 0.8rem;
  margin-right: 0.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
`;

export const ThumbsContainer = styled.aside`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

export const Thumb = styled.div`
  display: inline-flex;
  border-radius: 0.3rem;
  border: 0.2rem solid #999;
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;
  width: 8rem;
  height: 8rem;
  padding: 0.4rem;
  box-sizing: border-box;
`;

export const ThumbInner = styled.div`
  display: flex;
  min-width: 0;
  overflow: hidden;
`;

export const ThumbImage = styled.img`
  display: block;
  width: auto;
  height: 100%;
  border-radius: 0.3rem;
`;
