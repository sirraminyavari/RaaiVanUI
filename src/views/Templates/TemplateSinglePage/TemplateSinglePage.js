import { Route, Switch } from 'react-router-dom';
import TemplateGeneralSettings from './items/TemplateGeneralSetting/TemplateGeneralSettings';
import TemplateAdvancedSettings from './items/TemplateAdvancedSettings/TemplateAdvancedSettings';
import TemplateMembersSettings from './items/TemplateMembersSettings/TemplateMembersSettings';
import TemplateFormSettings from './items/TemplateFormSettings/TemplateFormSettings';
import TemplateItemSettings from './items/TemplateItemsSettings/TemplateItemSettings';

const TemplateSinglePage = () => {
  return (
    <>
      <div>single page</div>
      {/*<Switch>*/}
      {/*  <Route exact path={'/:id'} component={TemplateGeneralSettings} />*/}
      {/*  <Route exact path={'/forms/:id'} component={TemplateFormSettings} />*/}
      {/*  <Route*/}
      {/*    exact*/}
      {/*    path={'/advanced/:id'}*/}
      {/*    component={TemplateAdvancedSettings}*/}
      {/*  />*/}
      {/*  <Route exact path={'/items/:id'} component={TemplateItemSettings} />*/}
      {/*  <Route*/}
      {/*    exact*/}
      {/*    path={'/members/:id'}*/}
      {/*    component={TemplateMembersSettings}*/}
      {/*  />*/}
      {/*</Switch>*/}
    </>
  );
};
export default TemplateSinglePage;
