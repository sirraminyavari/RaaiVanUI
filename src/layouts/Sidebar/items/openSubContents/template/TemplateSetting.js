import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import { decodeBase64 } from 'helpers/helpers';
import ArrowIcon from 'components/Icons/ArrowIcons/Arrow';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { MAIN_CONTENT, SETTING_CONTENT } from 'constant/constants';
import { useDispatch } from 'react-redux';
import { useThemeSlice } from 'store/slice/theme';
import { useState, useEffect, useMemo } from 'react';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import api from 'apiHelper';

const TemplateSetting = () => {
  const { RVDic } = window;

  const { pathname } = useLocation();
  const path = pathname.split('/');
  const id = path[3];
  const root = path.filter((x, i) => i < path.length - 1).join('/');

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [iconUrl, setIconURL] = useState();

  const dispatch = useDispatch();
  const {
    actions: { setSidebarContent },
  } = useThemeSlice();
  const { RV_RevFloat } = window;

  useEffect(() => {
    let isMount = true;
    const fetchData = async () => {
      const { error, ...res } = await api?.CN?.getNodeTypes({
        NodeTypeIDs: [id],
        Icon: true,
      });
      const { TypeName, IconURL } = res?.NodeTypes[0] || {};
      setTitle(decodeBase64(TypeName));
      setIconURL(IconURL);
      setLoading(false);
    };

    id && isMount && fetchData();

    return () => {
      isMount = false;
    };
  }, []);

  const handleOnClick = () => {
    dispatch(
      setSidebarContent({
        current: SETTING_CONTENT,
        prev: MAIN_CONTENT,
      })
    );
  };
  const items = useMemo(
    () => [
      {
        id: 1,
        title: 'عمومی',
        linkTo: `${root}/basic`,
        isActive: pathname === `${root}/basic`,
      },
      {
        id: 2,
        title: 'مدیریت فرم',
        linkTo: `${root}/forms`,
        isActive: pathname === `${root}/forms`,
      },
      {
        id: 3,
        title: 'تنظیمات پیشرفته',
        linkTo: `${root}/advanced`,
        isActive: pathname === `${root}/advanced`,
      },
      {
        id: 4,
        title: 'آیتم‌ها',
        linkTo: `${root}/items`,
        isActive: pathname === `${root}/items`,
      },
      {
        id: 5,
        title: RVDic?.Members,
        linkTo: `${root}/members`,
        isActive: pathname === `${root}/members`,
      },
    ],
    [pathname]
  );

  if (loading) return <LogoLoader />;

  return (
    <>
      <Styled.SidebarTitle>
        <Styled.CenterIcon>
          <Styled.TitleTextContainer>
            <Styled.TitleImage src={iconUrl} />
            <Styled.TitleText>{title}</Styled.TitleText>
          </Styled.TitleTextContainer>
        </Styled.CenterIcon>
        <Styled.SettingWrapper onClick={handleOnClick}>
          <ArrowIcon dir={RV_RevFloat} size={25} />
        </Styled.SettingWrapper>
      </Styled.SidebarTitle>
      <Styled.PanelListWrapper>
        {items?.map((x) => {
          const { id, title, linkTo, isActive } = x;
          return (
            <Styled.SettingItemWrapper
              key={id}
              as={NavLink}
              to={linkTo}
              active={isActive}
            >
              <Styled.SettingItemTitle>{title}</Styled.SettingItemTitle>
            </Styled.SettingItemWrapper>
          );
        })}
      </Styled.PanelListWrapper>
    </>
  );
};
export default TemplateSetting;
