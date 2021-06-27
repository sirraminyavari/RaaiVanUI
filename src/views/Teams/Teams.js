import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as Styled from './Teams.styles';
import ContentSide from './items/sides/content/Content';
import WelcomeSide from './items/sides/welcome/Welcome';
import { getApplications } from 'store/actions/applications/ApplicationsAction';

const TeamsView = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getApplications());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Styled.TeamsViewContainer>
      <ContentSide />
      <WelcomeSide />
    </Styled.TeamsViewContainer>
  );
};

export default TeamsView;
