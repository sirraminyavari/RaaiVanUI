import { Link } from 'react-router-dom';
import Icons from 'components/Icons';
import {
  CloseContentContainer,
  ArrowUp,
  ArrowDown,
  IconListContainer,
  IconListWrap,
  MiniIconWrapper,
  SidebarTitle,
  SettingWrapper,
} from './Sidebar.styles';

const miniSide = [
  'home',
  'teams',
  'inbox',
  'settings',
  'notifications',
  'home',
  'teams',
  'inbox',
  'settings',
  'notifications',
];

const CloseContent = ({ showSettings }) => {
  return (
    <>
      <SidebarTitle>
        <SettingWrapper onClick={showSettings}>
          {Icons['settings']}
        </SettingWrapper>
      </SidebarTitle>
      <CloseContentContainer>
        <ArrowUp>{Icons['chevronUp']}</ArrowUp>
        <IconListContainer>
          <IconListWrap>
            {miniSide.map((icon, key) => {
              return (
                <MiniIconWrapper as={Link} to="#" key={key}>
                  {Icons[icon]}
                </MiniIconWrapper>
              );
            })}
          </IconListWrap>
        </IconListContainer>
        <ArrowDown>{Icons['chevronDown']}</ArrowDown>
      </CloseContentContainer>
    </>
  );
};

export default CloseContent;
