import { useSelector } from 'react-redux';
import * as Styled from '../Navbar.styles';
import AlertFooter from './AlertFooter';
import AlertItem from './AlertItem';
import { createSelector } from 'reselect';

const selectNavAlerts = createSelector(
  (state) => state.navbarAlert,
  (navbarAlert) => navbarAlert.alertsList
);

const selectOffset = createSelector(
  (state) => state.navbarAlert,
  (navbarAlert) => navbarAlert.offset
);

const selectPerPage = createSelector(
  (state) => state.navbarAlert,
  (navbarAlert) => navbarAlert.perPage
);

const AlertActions = () => {
  const alerts = useSelector(selectNavAlerts);
  const offset = useSelector(selectOffset);
  const perPage = useSelector(selectPerPage);

  //! Chunks alerts list based on current page and per page values.
  const slicedAlerts = alerts.slice(offset, offset + perPage);

  //! Checks if there is any alert to show or not.
  const hasAlert = slicedAlerts.length;

  return (
    <Styled.AlertActionsContainer>
      {hasAlert ? (
        <>
          <Styled.AlertListContainer>
            {slicedAlerts.map((alert, index) => (
              <AlertItem alert={alert} key={index} />
            ))}
          </Styled.AlertListContainer>
          <AlertFooter />
        </>
      ) : (
        <Styled.EmptyAlert>
          در حال حاضر اعلان خوانده نشده وجود ندارد
        </Styled.EmptyAlert>
      )}
    </Styled.AlertActionsContainer>
  );
};

export default AlertActions;
