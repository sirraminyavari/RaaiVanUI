import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import { lazy, useEffect, useState } from 'react';
import {
  getExtensions,
  getService,
} from 'apiHelper/ApiHandlers/CNAPI_ServiceSettings';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import { TemplateProvider } from './TemplateProvider';

const TemplateSinglePage = () => {
  const { path } = useRouteMatch();
  const { id: NodeTypeID } = useParams();
  const [loading, setLoading] = useState(true);
  const [extensions, setExtensions] = useState({});
  const [service, setService] = useState({});

  const generalSetting = lazy(() =>
    import('./items/TemplateGeneralSetting/TemplateGeneralSettings')
  );

  const membersSetting = lazy(() =>
    import('./items/TemplateMembersSettings/TemplateMembersSettings')
  );

  const formSettings = lazy(() =>
    import('./items/TemplateFormSettings/TemplateFormSettings')
  );

  const advancedSettings = lazy(() =>
    import('./items/TemplateAdvancedSettings/TemplateAdvancedSettings')
  );

  const itemSettings = lazy(() =>
    import('./items/TemplateItemsSettings/TemplateItemSettings')
  );

  useEffect(() => {
    const fetchData = async () => {
      const _extensions = await getExtensions({ NodeTypeID, Initialize: true });
      const _service = await getService({ NodeTypeID });

      setExtensions(_extensions);
      setService(_service);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <Container>
      {loading ? (
        <LogoLoader />
      ) : (
        <TemplateProvider extensions={extensions} service={service}>
          <Switch>
            <Route exact path={`${path}`} component={generalSetting} />
            <Route exact path={`${path}/forms`} component={formSettings} />
            <Route
              exact
              path={`${path}/advanced`}
              component={advancedSettings}
            />
            <Route exact path={`${path}/items`} component={itemSettings} />
            <Route exact path={`${path}/members`} component={membersSetting} />
          </Switch>
        </TemplateProvider>
      )}
    </Container>
  );
};
const Container = styled.div`
  padding: 1rem;
`;
Container.displayName = 'Container';
export default TemplateSinglePage;
