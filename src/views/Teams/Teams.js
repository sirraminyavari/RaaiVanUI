import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Styled from './Teams.styles';
import ContentSide from './items/sides/content/Content';
import WelcomeSide from './items/sides/welcome/Welcome';
import { getApplications } from 'store/actions/applications/ApplicationsAction';
import { ApplicationsSlice } from 'store/reducers/applicationsReducer';
import useLocalStorage from 'hooks/useLocalStorage';

const { setApplications } = ApplicationsSlice.actions;

const TeamsView = () => {
  const dispatch = useDispatch();
  const authUserId = useSelector((state) => state.auth.authUser.UserID);
  const appsKey = 'apps_' + authUserId;
  const [localTeams] = useLocalStorage(appsKey, []);

  useEffect(() => {
    dispatch(setApplications(localTeams));
    dispatch(getApplications());
  }, []);

  return (
    <Styled.ViewContainer>
      <ContentSide />
      <WelcomeSide />
    </Styled.ViewContainer>
  );
};

export default TeamsView;
