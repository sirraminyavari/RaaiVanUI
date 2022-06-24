import Input from 'components/Inputs/Input';
import { CV_DISTANT, TCV_DEFAULT, CV_WHITE } from 'constant/CssVariables';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;
export const PeopleBody = styled.div`
  display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')};
  position: ${({ triggerButtonRect }) =>
    triggerButtonRect ? 'fixed' : 'absolute'};
  flex-direction: column;
  align-items: center;
  /* ${({ Direction }) => `${Direction}:3rem`} */
  bottom: ${({ Direction }) => Direction === 'bottom' && `4rem`};
  top: ${({ Direction }) => Direction === 'top' && `3rem`};
  left: -1rem;
  ${({ triggerButtonRect }) =>
    `${
      triggerButtonRect &&
      `top: ${triggerButtonRect.y + triggerButtonRect.height}px;left: ${
        triggerButtonRect.x
      }px;`
    }`}

  box-shadow: 1px 3px 20px ${CV_DISTANT};
  padding: 0rem 0.75rem 0rem 0.75rem;
  min-width: 14.5rem;
  z-index: 100;
`;
export const Apply_Picked = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 1rem 0 1rem 0;
  position: relative;
`;
export const SearchInput = styled(Input)`
  border-width: 0 0 1px 0;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  border-radius: 0;
  width: 100%;
  ::placeholder {
    color: ${CV_DISTANT};
  }
`;
export const ResetContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: flex-start;
  flex-direction: row;
  justify-content: flex-end;
  z-index: 10;
  margin: 0.5rem 0.75rem 0 0.75rem;
`;

export const PeopleItemContent = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 1.5rem;
  margin: 0.5rem 0 0.5rem 0;
  width: 12.5rem;
  border-style: solid;
  border-width: 1px;
  padding: 0.3rem;
  border-color: ${({ pickedPeople }) =>
    pickedPeople ? TCV_DEFAULT : CV_WHITE};
`;

export const Avatar = styled.img`
  width: 1.5rem;
  aspect-ratio: 1;
  border-radius: 3rem;
  margin: 0 0.5rem 0 0.5rem;
`;
export const PeopleList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  margin-top: 1rem;
  margin-bottom: 1rem;
  max-height: 10rem;
`;
export const JustMeSaved = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 1rem;
  margin: 1rem 0.75rem 0 0.75rem;
`;
export const PickedList = styled.div`
  display: flex;
  flex-direction: row;
  align-self: center;
`;
export const PickedContent = styled.div`
  position: absolute;
  height: 2rem;
  top: 0;

  margin-right: ${({ index }) => index * 1 + 'rem'};
`;
export const PickedAvatar = styled.img`
  height: 100%;
  aspect-ratio: 1;
  border-radius: 3rem;
`;
