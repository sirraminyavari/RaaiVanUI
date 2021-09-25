import styled from 'styled-components';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import Input from 'components/Inputs/Input';
import Button from 'components/Buttons/Button';
import {
  CV_RED_SOFT,
  CV_DISTANT,
  CV_RED,
  CV_WHITE,
} from 'constant/CssVariables';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';

const { GlobalUtilities } = window;

export const Fixer = styled.div`
  background-color: green;
  overflow: scroll;
`;

export const Container = styled.div`
  display: flex;
  ${({ RV_RTL }) =>
    RV_RTL ? 'flex-direction:row' : 'flex-direction:row-reverse'}
  width: 100%;
  align-items: flex-start;
  justify-content: center;
  max-height: calc(100vh - 11rem);
  padding: 2rem 2rem 2rem 2rem;
`;
export const ScrollProvider = styled.div`
  width: calc(
    ${({ isAdvancedShow }) => (isAdvancedShow ? '100% - 25rem' : '100%')}
  );

  box-shadow: 1px 3px 20px #0000001f;
`;
export const Scrollable = styled.div`
  width: 100%;
`;
export const Maintainer = styled.div`
  width: 100%;
  min-height: calc(100vh - 9rem);
  max-height: 100%;
  transition: min-width 0.5s, width 0.5s, left 0.5s;
`;
export const Side = styled.div`
  position: fixed;
  top: 7rem;
  ${({ dir }) => dir}: 0;
  height: calc(100vh - 9rem);
  padding: ${({ rtl }) => (rtl ? '0 0.5rem 0 1rem' : '0 1rem 0 0.5rem')};
  opacity: ${({ $isEnabled }) => ($isEnabled ? '1' : '0')};
  width: ${({ $isEnabled }) => ($isEnabled ? '25rem' : '0rem')};
  transition: width 0.5s, opacity 0.5s;
`;

export const TopFilter = styled.div`
  width: 100%;

  margin-bottom: 1rem;
  align-self: center;
  display: flex;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${() =>
    DimensionHelper()?.isTabletOrMobile ? 'center' : 'flex-end'};
  align-items: center;

  min-width: ${() => (DimensionHelper()?.isTabletOrMobile ? '90%' : '50%')};
`;
export const CustomInput = styled(Input)`
  min-width: ${() => (DimensionHelper()?.isTabletOrMobile ? '90%' : '90%')};
  border-width: 0;
  border-bottom-width: 1px;
  border-color: ${CV_DISTANT};
  border-radius: 0;
  margin: 0rem 1rem 0 1rem;
  ::placeholder {
    color: ${CV_DISTANT};
    font-size: 1.1rem;
    font-weight: 500;
  }
`;
export const AdvancedFilterDialog = styled.div`
  position: absolute;
  background-color: ${CV_WHITE};
  top: ${({ top }) => top + 53 + 'px'};
  left: ${({ left }) => left + 'px'};
  width: 30rem;
  min-height: 10rem;
  z-index: ${GlobalUtilities.zindex.alert()};
  box-shadow: 1px 3px 20px ${CV_DISTANT};
`;
export const Space = styled.div`
  width: ${({ $isEnabled }) => ($isEnabled ? '25rem' : '0rem')};
  ${({ dir }) => dir}: 0;
  height: 1rem;
  padding: ${({ rtl }) => (rtl ? '0 0.5rem 0 1rem' : '0 1rem 0 0.5rem')};
  transition: width 0.5s;
`;

export const SideColumnMaintainer = styled.div`
  box-shadow: 1px 3px 20px #0000001f;
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
`;
