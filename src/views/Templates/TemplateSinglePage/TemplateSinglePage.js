import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import TemplateGeneralSettings from './items/TemplateGeneralSetting/TemplateGeneralSettings';
import TemplateAdvancedSettings from './items/TemplateAdvancedSettings/TemplateAdvancedSettings';
import TemplateMembersSettings from './items/TemplateMembersSettings/TemplateMembersSettings';
import TemplateFormSettings from './items/TemplateFormSettings/TemplateFormSettings';
import TemplateItemSettings from './items/TemplateItemsSettings/TemplateItemSettings';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
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
            <Route exact path={`${path}`} component={TemplateGeneralSettings} />
            <Route
              exact
              path={`${path}/forms`}
              component={TemplateFormSettings}
            />
            <Route
              exact
              path={`${path}/advanced`}
              component={TemplateAdvancedSettings}
            />
            <Route
              exact
              path={`${path}/items`}
              component={TemplateItemSettings}
            />
            <Route
              exact
              path={`${path}/members`}
              component={TemplateMembersSettings}
            />
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
