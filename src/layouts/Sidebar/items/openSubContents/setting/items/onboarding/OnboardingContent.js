import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import OnboardingTeamItem from './OnboardingTeamItem';
import { decodeBase64 } from 'helpers/helpers';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

const OnboardingContent = () => {
  const { teamName, templates } = useSelector(({ onboarding }) => ({
    teamName: onboarding.teamName,
    templates: onboarding.templates,
  }));
  return (
    <>
      <Styled.PanelListWrapper>
        <Styled.SidebarTitle>{teamName}</Styled.SidebarTitle>
        {templates.map(({ isSetupComplete, IconURL, TypeName }) => {
          return (
            <OnboardingTeamItem
              IconURL={IconURL}
              TypeName={decodeBase64(TypeName)}
              isLoading={!isSetupComplete}
            />
          );
        })}
      </Styled.PanelListWrapper>
    </>
  );
};
export default withRouter(OnboardingContent);
