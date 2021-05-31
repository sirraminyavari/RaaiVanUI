import { useContext } from 'react';
import * as Styled from '../../../Teams.styles';
import DragIcon from 'components/Icons/DragIcon/Drag';
import Avatar from 'components/Avatar/Avatar';
import Button from 'components/Buttons/Button';
import Badge from 'components/Badge/Badge';
import PopupMenu from 'components/PopupMenu/PopupMenu';
import { decodeBase64 } from 'helpers/helpers';
import { WindowContext } from 'context/WindowProvider';

const InactiveTeam = ({ team }) => {
  const { Title, Description, Users: appUsers, IconURL } = team;
  const { TotalCount, Users } = appUsers;
  const { RVGlobal } = useContext(WindowContext);
  const { IsSystemAdmin } = RVGlobal;

  return (
    <Styled.TeamConatiner>
      <Styled.DragIconWrapper>
        <DragIcon />
      </Styled.DragIconWrapper>
      <Styled.TeamContentWrapper>
        <Styled.TeamDescription>
          <div>
            <Avatar
              radius={45}
              style={{ width: '50px' }}
              imageStyles={{ filter: 'grayscale(100%)' }}
              userImage={IconURL}
            />
          </div>
          <Styled.TeamTitle style={{ color: '#707070' }}>
            {decodeBase64(Title)}
          </Styled.TeamTitle>
          <Styled.TeamExcerpt style={{ color: '#707070' }}>
            {!!Description
              ? decodeBase64(Description)
              : 'کلیک مایند. مغز تیم شما!'}
          </Styled.TeamExcerpt>
        </Styled.TeamDescription>
        <Styled.TeamFooterConatiner>
          <Styled.TeamAvatarsWrapper>
            {Users?.map((user, index) => {
              if (index > 3) return null;
              return (
                <Avatar
                  key={index}
                  userImage={user.ProfileImageURL}
                  radius={32}
                  imageStyles={{ filter: 'grayscale(100%)' }}
                  style={{
                    position: 'relative',
                    right: `${-index * 9}px`,
                    zIndex: 10 - index,
                  }}
                />
              );
            })}
            {TotalCount > 4 && (
              <PopupMenu
                align="top"
                arrowClass="hidden-arrow"
                menuClass="extra-users-popup">
                <Styled.ExtraUsersWrapper>
                  <Badge
                    showText={`${TotalCount - 4}+`}
                    className="team-extra-users inactive"
                  />
                </Styled.ExtraUsersWrapper>
                <div className="non-scroll">
                  {Users?.filter((user, index) => index > 3 && user).map(
                    (user) => {
                      return (
                        <Styled.ExtraUserItem>
                          <Avatar
                            color="#333"
                            userImage={user.ProfileImageURL}
                            style={{ width: '30px' }}
                            radius={25}
                          />
                          <Styled.ExtraUserTitle>
                            {`${decodeBase64(user.FirstName)} ${decodeBase64(
                              user.LastName
                            )}`}
                          </Styled.ExtraUserTitle>
                        </Styled.ExtraUserItem>
                      );
                    }
                  )}
                </div>
              </PopupMenu>
            )}
          </Styled.TeamAvatarsWrapper>
          {IsSystemAdmin && (
            <Button
              type="primary-o"
              style={{ height: '1.5rem', width: '5rem' }}>
              فعال سازی
            </Button>
          )}
        </Styled.TeamFooterConatiner>
      </Styled.TeamContentWrapper>
    </Styled.TeamConatiner>
  );
};

export default InactiveTeam;
