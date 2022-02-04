import { Route, Switch, useRouteMatch } from 'react-router-dom';
import TemplateGeneralSettings from './items/TemplateGeneralSetting/TemplateGeneralSettings';
import TemplateAdvancedSettings from './items/TemplateAdvancedSettings/TemplateAdvancedSettings';
import TemplateMembersSettings from './items/TemplateMembersSettings/TemplateMembersSettings';
import TemplateFormSettings from './items/TemplateFormSettings/TemplateFormSettings';
import TemplateItemSettings from './items/TemplateItemsSettings/TemplateItemSettings';
import styled from 'styled-components';

const TemplateSinglePage = () => {
  const { path } = useRouteMatch();

  return (
    <Container>
      <Switch>
        <Route exact path={`${path}`} component={TemplateGeneralSettings} />
        <Route exact path={`${path}/forms`} component={TemplateFormSettings} />
        <Route
          exact
          path={`${path}/advanced`}
          component={TemplateAdvancedSettings}
        />
        <Route exact path={`${path}/items`} component={TemplateItemSettings} />
        <Route
          exact
          path={`${path}/members`}
          component={TemplateMembersSettings}
        />
      </Switch>
    </Container>
  );
};
const Container = styled.div`
  padding: 1rem;
`;
export default TemplateSinglePage;
