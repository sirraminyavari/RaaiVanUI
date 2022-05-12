import styled from 'styled-components';
import {
  CV_DISTANT,
  CV_FREEZED,
  CV_GRAY_DARK,
  CV_GRAY_LIGHT,
  CV_RED,
  CV_WHITE,
  TCV_DEFAULT,
  TCV_WARM,
} from 'constant/CssVariables';
import RxInput from 'components/Inputs/RxInput';

export const SettingButton = styled.div`
  background-color: ${CV_WHITE};
  color: ${CV_DISTANT};
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;

  &:hover {
    color: ${TCV_DEFAULT};
  }
`;
export const ModalContent = styled.div`
  padding: 0 1rem 1rem 1rem;
`;
export const Input = styled.input`
  width: 100%;
  outline: none;
  border: 1px solid ${CV_DISTANT};
  border-radius: 0.5rem;
  height: 3rem;
  padding: 0 1rem;
  color: ${CV_GRAY_DARK};
  font-weight: 500;
  font-size: 1rem;
  margin-bottom: 0.5rem;

  &:disabled {
    background-color: ${CV_FREEZED};
  }
`;

export const InputLabel = styled.div`
  font-size: 0.85rem;
  color: ${CV_DISTANT};
  font-weight: 300;
  margin-bottom: 0.2rem;
  margin-top: 1.5rem;
`;

export const SelectedUsersContainer = styled.div`
  width: 100%;
  border: 1px solid ${CV_DISTANT};
  border-radius: 0.5rem;
  min-height: 3rem;
  padding: 0.1rem 0.5rem;
  color: ${CV_GRAY_DARK};
  transition: height ${({ duration }) => duration}ms ease-in-out;

  .transition-enter {
    opacity: 0;
    transform: translate(0, 0.3rem);
  }

  .transition-enter-active {
    opacity: 1;
    transform: translate(0, 0);
    transition: all ${({ duration }) => duration}ms ease-in;
  }

  .transition-exit {
    opacity: 1;
    transform: translate(0, 0);
  }

  .transition-exit-active {
    opacity: 0;
    transform: translate(0, 0.3rem);
    transition: all ${({ duration }) => duration}ms ease-in;
  }
`;

export const ChipsWrapper = styled.div`
  display: inline-block;
  margin: 0.05rem 0.15rem;
`;

export const ChipsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 2.5rem;
  background-color: ${CV_DISTANT};
  border-radius: 1.3rem;
  gap: 0.5rem;
  padding: 0.3rem;
`;

export const ChipsProfileImage = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 100%;
  border: 0.05rem solid ${CV_WHITE};
`;

export const ChipsTitle = styled.div`
  height: 2rem;
  line-height: 2rem;
  color: ${TCV_WARM};
  font-weight: 500;
`;

export const ChipsCloseIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 100%;
  cursor: pointer;
  color: ${CV_RED};
`;

export const UserContainer = styled.div`
  width: 100%;
  background-color: ${CV_GRAY_LIGHT};
  border-radius: 0.5rem;
  height: 19.25rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
`;

export const ProfileImage = styled.img`
  height: 2rem;
  width: 2rem;
  border-radius: 100%;
  ${(props) => props?.highlight && `border: 0.13rem solid ${TCV_DEFAULT};`}
`;

export const UserTitle = styled.div`
  height: 2rem;
  line-height: 2rem;
  font-size: 1rem;
  color: ${(props) => (props?.highlight ? TCV_DEFAULT : CV_GRAY_DARK)};
`;

export const UserItemContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  margin: 0.8rem 0;
  cursor: pointer;
`;

export const ModalActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

export const Spacer = styled.div`
  flex-grow: 1;
`;
