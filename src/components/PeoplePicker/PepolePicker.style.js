import Input from 'components/Inputs/Input';
import { CV_DISTANT } from 'constant/CssVariables';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;
export const PeopleBody = styled.div`
  display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')};
  position: absolute;
  flex-direction: column;
  align-items: center;
  top: 3rem;
  left: -1rem;
  box-shadow: 1px 3px 20px ${CV_DISTANT};
  padding: 0rem 1.5rem 0rem 1.5rem;
  min-width: 16rem;
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
export const SearchInput = styled(Input)``;

export const PeopleItemContent = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 1.5rem;
  margin: 0.5rem 0 0.5rem 0;
  width: 12.5rem;
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
