import * as Styled from 'views/Teams/Teams.styles';
import WorkspaceDeleteImage from 'assets/images/workspace-delete.svg?file';
import Button from 'components/Buttons/Button';
import useWindow from 'hooks/useWindowContext';
import { useHistory } from 'react-router-dom';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';

const WorkspaceDeleteWelcome = () => {
  const { RVDic } = useWindow();
  const { goBack } = useHistory();
  const RVDicReturn = RVDic.Return;
  const isMobileScreen = DimensionHelper().isMobile;
  return (
    <Styled.DesktopWelcomeSide>
      {!isMobileScreen && (
        <>
          <Styled.WorkspaceDeleteWelcomeHeader>
            <Button
              onClick={goBack}
              type="negative-secondary-o"
              style={{ marginInline: '0.5rem' }}>
              {RVDicReturn}
            </Button>
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
