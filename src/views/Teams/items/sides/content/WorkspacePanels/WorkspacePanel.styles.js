import styled from 'styled-components';
import {
  BG_GRAY_LIGHT,
  BG_WHITE,
  C_DISTANT,
  C_GRAY_DARK,
} from 'constant/Colors';
import { CV_DISTANT, CV_RED, TCV_DEFAULT } from 'constant/CssVariables';
import Input from 'components/Inputs/Input';

export const SpaceContainer = styled.div`
  width: 100%;
  margin: 0 0 1rem 0;
`;

export const TeamListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
  justify-content: center;
  &:after {
    content: '';
    clear: both;
    display: table;
  }
`;

export const SpaceListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  //TODO: remove it when space exists.
  margin-top: 2rem;
`;

export const SpaceHeaderContainer = styled.div.attrs({
  className: `${BG_GRAY_LIGHT}`,
})`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 0.2rem 0;
  position: sticky;
  // top: 4rem;
  top: 0;
  z-index: 200;
  padding: 1rem 0;
`;

export const SpaceHeaderTitle = styled.div.attrs({
  className: C_GRAY_DARK,
})`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1rem;
  font-size: 1rem;
  font-weight: bold;
`;

export const SpaceHeaderTitleInput = styled(Input).attrs({
  className: C_GRAY_DARK,
})`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1rem;
  font-size: 1rem;
  font-weight: bold;
  padding-block: 1rem;
  border-color: transparent;
  border-radius: 0;
  &:hover {
    border-color: transparent;
  }
  &:focus {
    border-color: transparent;
    border-bottom-color: ${CV_DISTANT};
  }
`;

export const TrashIconWrapper = styled.div.attrs((props) => ({
  className: `${C_DISTANT} ${BG_WHITE}`,
}))`
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 50%;
  padding: 0.5rem;
  :hover {
    color: ${CV_RED} !important;
  }
`;

export const SpaceHeaderActions = styled.div`
  width: 3rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export const SettingIconWrapper = styled.div.attrs((props) => ({
  className: `${C_DISTANT} ${BG_WHITE}`,
}))`
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 50%;
  padding: 0.4rem;
  margin: 0 0.2rem;
  :hover {
    color: ${TCV_DEFAULT} !important;
  }
`;
