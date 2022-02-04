import * as Styled from 'views/Teams/Teams.styles';
import WorkspaceInvoiceImage from 'assets/images/workspace-invoice.svg?file';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';

const WorkspaceInvoiceWelcome = () => {
  const isTabletScreen = DimensionHelper().isTabletOrMobile;
  return (
    <>
      {!isTabletScreen && (
        <Styled.DesktopWelcomeSide style={{ height: '50vh' }}>
          <Styled.WorkspaceImageWrapper>
            <Styled.WorkspaceImage
              src={WorkspaceInvoiceImage}
              alt="workspace-invoice-illustration"
            />
          </Styled.WorkspaceImageWrapper>
        </Styled.DesktopWelcomeSide>
      )}
    </>
  );
};

export default WorkspaceInvoiceWelcome;
