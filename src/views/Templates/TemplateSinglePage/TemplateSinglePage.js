import { Route, Switch, useRouteMatch } from 'react-router-dom';
import TemplateGeneralSettings from './items/TemplateGeneralSetting/TemplateGeneralSettings';
import TemplateAdvancedSettings from './items/TemplateAdvancedSettings/TemplateAdvancedSettings';
import TemplateMembersSettings from './items/TemplateMembersSettings/TemplateMembersSettings';
import TemplateFormSettings from './items/TemplateFormSettings/TemplateFormSettings';
import TemplateItemSettings from './items/TemplateItemsSettings/TemplateItemSettings';

const TemplateSinglePage = () => {
  const { path } = useRouteMatch();

  console.log(path);
  return (
    <>
      <div>single page</div>
      <Switch>
        <Route path={'/:id'} component={TemplateGeneralSettings} />
        <Route path={'/forms/:id'} component={TemplateFormSettings} />
        <Route path={'/advanced/:id'} component={TemplateAdvancedSettings} />
        <Route path={'/items/:id'} component={TemplateItemSettings} />
        <Route path={'/members/:id'} component={TemplateMembersSettings} />
      </Switch>
    </>
  );
};
export default TemplateSinglePage;
