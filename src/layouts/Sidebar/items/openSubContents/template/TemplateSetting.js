import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import { decodeBase64 } from 'helpers/helpers';
import ArrowIcon from 'components/Icons/ArrowIcons/Arrow';
import { NavLink, useLocation } from 'react-router-dom';
import { MAIN_CONTENT, SETTING_CONTENT } from 'constant/constants';
import { useDispatch } from 'react-redux';
import { themeSlice } from 'store/reducers/themeReducer';

const TemplateSetting = () => {
  const { pathname } = useLocation();
  const path = pathname.split('/');
  const title = decodeBase64(path[path.length - 2]);
  const root = path.filter((x, i) => i < path.length - 1).join('/');

  const dispatch = useDispatch();
  const { setSidebarContent } = themeSlice.actions;
  const { RV_RevFloat } = window;

  const handleOnClick = () => {
    dispatch(
      setSidebarContent({
        current: SETTING_CONTENT,
        prev: MAIN_CONTENT,
      })
    );
  };
  const items = [
    {
      id: 1,
      title: 'عمومی',
      linkTo: `${root}/basic`,
    },
    {
      id: 2,
      title: 'مدیریت فرم',
      linkTo: `${root}/forms`,
    },
  ];
  return (
    <>
      <Styled.SidebarTitle>
        <Styled.CenterIcon>
          <Styled.TitleText>{title}</Styled.TitleText>
        </Styled.CenterIcon>
        <Styled.SettingWrapper onClick={handleOnClick}>
          <ArrowIcon dir={RV_RevFloat} size={25} />
        </Styled.SettingWrapper>
      </Styled.SidebarTitle>
      <Styled.PanelListWrapper>
        {items?.map((x) => {
          const { id, title, linkTo } = x;
          return (
            <Styled.SettingItemWrapper key={id} as={NavLink} to={linkTo}>
              <Styled.SettingItemTitle>{title}</Styled.SettingItemTitle>
            </Styled.SettingItemWrapper>
          );
        })}
      </Styled.PanelListWrapper>
    </>
  );
};
export default TemplateSetting;
