import styled from 'styled-components';
import {
  CV_DISTANT,
  CV_FREEZED,
  CV_GRAY,
  CV_GRAY_LIGHT,
  CV_WHITE,
  TCV_DEFAULT,
  TCV_LIGHTWARM,
} from 'constant/CssVariables';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
Container.displayName = 'Container';

export const ResetButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${CV_WHITE};
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 100%;
  color: ${CV_DISTANT};
  cursor: pointer;

  &:hover {
    color: ${TCV_DEFAULT};
  }
`;
ResetButton.displayName = 'ResetButton';

export const ProfileWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2.5rem;
`;
ProfileWrapper.displayName = 'ProfileWrapper';

export const ActionContainer = styled.div`
  margin-top: 4rem;
  height: 12.6rem;
  border-radius: 0.5rem;
  background-color: ${CV_GRAY_LIGHT};
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
`;
ActionContainer.displayName = 'ActionContainer';

export const RemoveMessage = styled.div`
  color: ${CV_GRAY};
  font-size: 1.1rem;
  height: 1.75rem;
  line-height: 1.75rem;
`;
RemoveMessage.displayName = 'RemoveMessage';

export const ActionButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;
ActionButtonContainer.displayName = 'ActionButtonContainer';

export const PasswordChangeTitle = styled.div`
  font-size: 1rem;
  color: ${CV_GRAY};
  height: 1.2rem;
  line-height: 1.2rem;
`;
PasswordChangeTitle.displayName = 'PasswordChangeTitle';

export const PasswordInput = styled.input`
  height: 3rem;
  width: 16rem;
  border-radius: 0.3rem;
  outline: none;
  border: 1px solid ${CV_DISTANT};
  text-align: center;
  font-size: 1rem;
  background-color: ${CV_FREEZED};
`;
PasswordInput.displayName = 'PasswordInput';

export const CopyButton = styled.div`
  height: 3rem;
  width: 7.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  user-select: none;
  background-color: ${TCV_DEFAULT};
  color: ${CV_WHITE};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: ${TCV_LIGHTWARM};
  }
`;
CopyButton.displayName = 'CopyButton';
