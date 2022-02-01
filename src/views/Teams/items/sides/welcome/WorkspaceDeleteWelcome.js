import * as Styled from 'views/Teams/Teams.styles';
import WorkspaceDeleteImage from 'assets/images/workspace-delete.svg?file';
import { useHistory } from 'react-router-dom';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import ReturnButton from 'components/Buttons/ReturnButton';

const WorkspaceDeleteWelcome = () => {
  const { goBack } = useHistory();
  const isTabletOrMobile = DimensionHelper().isTabletOrMobile;
  return (
    <Styled.DesktopWelcomeSide>
      {!isTabletOrMobile && (
        <>
          <Styled.WorkspaceDeleteWelcomeHeader>
            <ReturnButton onClick={goBack} style={{ marginInline: '0.5rem' }} />
          </Styled.WorkspaceDeleteWelcomeHeader>
          <Styled.WorkspaceImageWrapper>
            <Styled.WorkspaceImage
              src={WorkspaceDeleteImage}
              alt="workspace-delete-illustration"
            />
          </Styled.WorkspaceImageWrapper>
        </>
      )}
    </Styled.DesktopWelcomeSide>
  );
};

export default WorkspaceDeleteWelcome;
