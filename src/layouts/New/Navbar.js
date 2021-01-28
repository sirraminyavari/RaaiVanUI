import { useState } from 'react';
import Avatar from 'components/Avatar';
import SearchIcon from 'assets/icons/search.svg';
import SearchSelectedIcon from 'assets/icons/search-selected.svg';
import SocialIcon from 'assets/icons/social.svg';
import TeamsIcon from 'assets/icons/teams.svg';
import MessagesIcon from 'assets/icons/messages.svg';
import NotificationsIcon from 'assets/icons/notifications.svg';
import NavbarButton from './NavbarButton';

const NewNavbar = () => {
  const [isFocused, setIsFocused] = useState(false);
  const handleWidth = () => {
    setIsFocused(!isFocused);
  };
  return (
    <div
      style={{
        backgroundColor: '#2B7BE4',
        height: '11%',
        overflow: 'hidden',
        position: 'fixed',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        top: 0,
        width: 'calc(100% - 250px)',
        padding: '0 20px',
        zIndex: 1,
        boxShadow: '0px 3px 10px #333',
      }}>
      <div style={{ height: '100%', display: 'flex' }}>
        <NavbarButton label="اجتماعی" icon={SocialIcon} />
        <NavbarButton label="تیم ها" icon={TeamsIcon} />
        <NavbarButton label="پیام ها" icon={MessagesIcon} />
        <NavbarButton label="اعلان ها" icon={NotificationsIcon} badge={99} />
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          width: '400px',
        }}>
        <div style={{ position: 'relative' }}>
          <img
            src={isFocused ? SearchSelectedIcon : SearchIcon}
            style={{
              position: 'absolute',
              left: 5,
              top: 5,
            }}
            alt="search-icon"
          />
          <input
            type="search"
            placeholder={
              isFocused ? '' : 'جستجو در مطالب،کاربران،ابزارها و ...'
            }
            onFocus={handleWidth}
            onBlur={handleWidth}
            style={{
              border: 'none',
              borderRadius: '5px',
              outline: 0,
              color: '#333',
              height: '32px',
              padding: '0 10px',
              width: isFocused ? 300 : 230,
              transition: 'all 0.5s ease',
            }}
          />
        </div>
        <Avatar radius={40} />
      </div>
    </div>
  );
};

export default NewNavbar;
