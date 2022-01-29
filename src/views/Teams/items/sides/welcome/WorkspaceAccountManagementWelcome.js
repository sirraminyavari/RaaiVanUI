import * as Styled from 'views/Teams/Teams.styles';
import WorkspaceAccountManagementImage from 'assets/images/workspace-account-management.svg?file';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';

const WorkspaceAccountManagementWelcome = () => {
  const isMobileScreen = DimensionHelper().isMobile;
  return (
    <Styled.DesktopWelcomeSide style={{ height: '90vh' }}>
      {!isMobileScreen && (
        <>
          <Styled.WorkspaceImageWrapper>
            <Styled.WorkspaceImage
              src={WorkspaceAccountManagementImage}
              alt="workspace-invoice-illustration"
            />
          </Styled.WorkspaceImageWrapper>
        </>
      )}
    </Styled.DesktopWelcomeSide>
  );
};

export default WorkspaceAccountManagementWelcome;
