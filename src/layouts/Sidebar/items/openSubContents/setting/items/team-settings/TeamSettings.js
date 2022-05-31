import { useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import useWindow from 'hooks/useWindowContext';
import { SETTING_CONTENT, SETT_URL_CONTENT } from 'constant/constants';
import { useThemeSlice } from 'store/slice/theme';
import { selectSidebar } from 'store/slice/sidebar/selectors';

const TeamSettings = () => {
  const { RVDic } = useWindow();
  const dispatch = useDispatch();

  const {
    actions: { setSidebarContent },
  } = useThemeSlice();

  const { configPanels: panels } = useSelector(selectSidebar);

  const handleClickPanel = useCallback(
    (url) => () => {
      dispatch(
        setSidebarContent({
          current: SETT_URL_CONTENT.replace('{url}', url),
          prev: SETTING_CONTENT,
        })
      );
    },
    []
  );

  return (
    <>
      {panels?.map((panel, key) => {
        return (
          <Styled.PanelWrapper
            onClick={handleClickPanel(panel?.URL)}
            key={key}
            as={NavLink}
            to={`/configuration/${panel?.URL}`}
          >
            <Styled.PanelImage
              src={`${process.env.PUBLIC_URL}/images/icons/${panel?.Icon}`}
              alt="panel-icon"
            />
            <Styled.PanelLink>
              {RVDic.PRVC[panel?.Name] || RVDic[panel?.Name] || panel?.Name}
            </Styled.PanelLink>
          </Styled.PanelWrapper>
        );
      })}
    </>
  );
};

export default TeamSettings;
