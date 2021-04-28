import withTheme from 'components/withTheme/withTheme';
import styled from 'styled-components';
import { OPEN_WIDTH, CLOSE_WIDTH } from 'constant/constants';
import Input from 'components/Inputs/Input';
import { TBG_WARM, TC_DEFAULT, TC_WARM, C_GRAY } from 'constant/Colors';

const { RV_RevFloat, RV_Float, GlobalUtilities } = window;

export const NavbarContainer = withTheme(styled.div.attrs({
  className: TBG_WARM,
})`
  width: ${({ theme, isMobile }) =>
    `calc(100% - ${
      !isMobile
        ? theme.states.isSidebarOpen
          ? OPEN_WIDTH
          : CLOSE_WIDTH
        : CLOSE_WIDTH
    }rem)`};
  height: 4rem;
  position: fixed;
  display: flex;
  z-index: ${GlobalUtilities.zindex.alert()};
  justify-content: space-between;
  align-items: center;
  top: 0;
  ${`${RV_RevFloat}: 0;`}
  opacity: 1;
  padding: 0 1.5rem;
  box-shadow: 0 3px 10px #00000029;
  transition: all 0.7s ease;

  .no-arrow {
    display: none;
  }
`);

export const WideScreenMenu = styled.div`
  height: 100%;
  padding: 0.2rem 0;
  display: flex;
`;

//! Due to this error >>>> "React does not recognize the {prop} prop on a DOM element"
const DIV = styled.div``;

export const ButtonContainer = styled(({ isActive, ...props }) => (
  <DIV {...props} />
))`
  width: 4.7rem;
  height: auto;
  margin: -0.17rem 0rem;
  padding: 0.5rem;
  border-bottom: ${({ isActive }) => (isActive ? '0.2rem solid #fff' : '')};
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  &:hover {
    background-color: #27499f;
  }
  &:hover span {
    transform: rotateX(180deg);
  }
`;

export const ButtonIcon = styled.div`
  text-align: center;
  position: relative;
  font-size: 1.3rem;
  color: #e6f4f1;
`;

export const ButtonTitle = styled.div`
  font-size: 0.7rem;
  font-weight: bold;
  color: #e6f4f1;
  opacity: 1;
  position: relative;
  bottom: 5px;
  width: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: capitalize;
`;

export const BadgeWrapper = styled.div`
  position: absolute;
  top: 0.3rem;
  ${`${RV_Float}: 0.7rem;`}
`;

export const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  color: inherit;
`;

export const SearchContainer = styled.div`
  margin: 0 1rem;
  position: relative;
  :focus-within input {
    width: 16rem;
  }
  :focus-within svg {
    color: #2b7be4 !important;
  }
`;

export const SearchInput = styled(Input)`
  border: none;
  border-radius: 0.3rem;
  outline: 0;
  color: #000;
  height: 2rem;
  padding: 0.1rem 0.6rem;
  width: 14rem;
  transition: all 0.6s ease;
  :focus::placeholder {
    color: transparent;
  }
  ::placeholder {
    color: #bac9dc;
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  ${`${RV_RevFloat}: 0.3rem;`}
  top: 0.3rem;
  font-size: 1.5rem;
  color: #ddd;
`;

export const FixActionsContainer = styled.div`
  width: 12rem;
  height: auto;
  padding: 0.5rem;
  margin: -0.7rem;
  overflow: hidden;
  background-color: #fcfcfd;
  border-radius: 0.6rem;
  box-shadow: 1px 3px 20px #2b7be44d;
`;

export const AlertActionsContainer = styled.div`
  width: 23rem;
  height: auto;
  min-height: 3rem;
  padding: 1rem;
  padding-bottom: 0;
  margin: -0.7rem 0;
  overflow: hidden;
  background-color: #fcfcfd;
  border-radius: 0.6rem;
  box-shadow: 1px 3px 20px #2b7be44d;
`;

export const AlertListContainer = styled.div`
  width: 100%;
  height: auto;
  margin: 0;
  margin-bottom: 1.7rem;
  padding: 0;
`;

export const EmptyAlert = styled.div`
  text-align: center;
`;

export const AlertItemContainer = styled.div`
  width: 100%;
  height: 5rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  max-height: 6rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border: 0.5px solid #bac9dc;
  border-radius: 0.5rem;
`;

export const AlertContentWrapper = styled.div`
  height: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  margin-right: 1rem;
  padding: 0.3rem 0;
`;

export const AlertMessageWrapper = styled.div.attrs({
  className: TC_WARM,
})`
  max-height: 2.2rem;
  overflow: hidden;
`;

export const AlertTimeWrapper = styled.div.attrs({
  className: C_GRAY,
})`
  font-size: 0.7rem;
`;

export const AlertFooterContainer = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  bottom: 1rem;
`;

export const AlertFooterCheckWrapper = styled.div.attrs({
  className: TC_DEFAULT,
})`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

export const AlertFooterNavigation = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const AlertFooterArrowWrapper = styled.div.attrs({
  className: TC_DEFAULT,
})`
  min-width: 1.4rem;
  padding: 0.1rem;
  margin: 0 0.2rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e6f4f1;
  cursor: pointer;
`;

export const ButtonAction = styled.div`
  display: flex;
  place-items: center;
  color: #000;
  border-radius: 0.3rem;
  margin: 0.3rem 0;
  padding: 0.3rem 0.8rem;
  transition: all 0.5s ease;
  :hover {
    background-color: #f4f8fe;
  }
`;

export const ActionTitle = styled.span`
  margin: 0.3rem 0.5rem;
`;

export const NavMenuContainer = styled.div`
  cursor: pointer;
  position: relative;
`;

export const MenuOptionsWrapper = styled.div`
  height: 12rem;
  width: 17rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  box-shadow: 0px 1px 10px #333;
  border-radius: 0.5rem;
  background-color: #fff;
  margin: -10px;
`;

export const NavMenuOption = styled.div`
  width: 33%;
  height: 33%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #000;
`;

export const Arrow = styled.span`
  width: 0;
  height: 0;
  margin: 0 0.2rem;
  border-left: 0.3rem solid transparent;
  border-right: 0.3rem solid transparent;
  border-top: 0.3rem solid #fff;
  transition: all 0.5s ease;
`;

export const AvatarMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: auto;
  min-width: 11rem;
  max-width: 14rem;
  padding: 0rem 0.7rem;
`;

export const AvatarMenuItem = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: end;
  align-items: center;
  padding: 0.4rem;
  color: #000;
  border-radius: 0.4rem;
  cursor: pointer;
`;

export const AvatarMenuTitle = styled.span`
  padding: 0 0.6rem;
  font-size: 0.85rem;
  text-transform: capitalize;
  color: ${({ color }) => color};
`;

export const Divider = styled.div`
  margin: 0.5rem -1.4rem;
  border-top: 0.1rem solid #ccc;
`;
