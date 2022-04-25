import {
  Redirect,
  Route,
  Switch,
  useLocation,
  useParams,
  useRouteMatch,
} from 'react-router-dom';
import styled from 'styled-components';
import { lazy, useEffect, useState } from 'react';
import {
  getExtensions,
  getService,
} from 'apiHelper/ApiHandlers/CNAPI_ServiceSettings';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import { TemplateProvider } from './TemplateProvider';
import { themeSlice } from 'store/reducers/themeReducer';
import { useDispatch } from 'react-redux';
import { TEMPLATE_CONTENT } from '../../../constant/constants';

const TemplateSinglePage = () => {
  const dispatch = useDispatch();
  const { path } = useRouteMatch();
  const { pathname } = useLocation();
  console.log(path);
  const { id: NodeTypeID } = useParams();
  const [loading, setLoading] = useState(true);
  const [extensions, setExtensions] = useState({});
  const [service, setService] = useState({});

  const { setSidebarContent } = themeSlice.actions;

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
    dispatch(
      setSidebarContent({
        current: TEMPLATE_CONTENT,
        prev: '',
      })
    );
    const fetchData = async () => {
      const _extensions = await getExtensions({ NodeTypeID, Initialize: true });
      const _service = await getService({ NodeTypeID });

      if (!_extensions?.ErrorText) {
        setExtensions(_extensions);
        setService(_service);
        setLoading(false);
      }
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
            <Route
              exact
              path={`${path}/`}
              render={() => <Redirect to={`${pathname}/basic`} />}
            />
            <Route exact path={`${path}/basic`} component={generalSetting} />
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
