import * as Styled from '../../../Teams.styles';
import DragIcon from 'components/Icons/DragIcon/Drag';
import Avatar from 'components/Avatar/Avatar';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import Button from 'components/Buttons/Button';
import Badge from 'components/Badge/Badge';
import PopupMenu from 'components/PopupMenu/PopupMenu';
import { decodeBase64 } from 'helpers/helpers';

const Team = ({ team }) => {
  const { Title, Description, Users: appUsers, isActive, IconURL } = team;
  const { TotalCount, Users } = appUsers;
  return (
    <Styled.TeamConatiner>
      <Styled.DragIconWrapper>
        <DragIcon />
      </Styled.DragIconWrapper>
      <Styled.TeamContentWrapper>
        <Styled.TeamDescription>
          <div>
            <Avatar radius={60} style={{ width: '70px' }} userImage={IconURL} />
          </div>
          <Styled.TeamTitle>{decodeBase64(Title)}</Styled.TeamTitle>
          <Styled.TeamExcerpt>
            {!!Description
              ? decodeBase64(Description)
              : 'کلیک مایند. مغز تیم شما!'}
          </Styled.TeamExcerpt>
        </Styled.TeamDescription>
        <Styled.TeamFooterConatiner>
          <Styled.TeamAvatarsWrapper>
            {Users?.map((user, index) => {
              if (index > 0) return null;
              return (
                <Avatar
                  key={index}
                  userImage={user.ProfileImageURL}
                  radius={32}
                  style={{
                    position: 'relative',
                    right: `${-index * 9}px`,
                    zIndex: 10 - index,
                  }}
                />
              );
            })}
            {TotalCount > 1 && (
              <PopupMenu
                align="top"
                arrowClass="hidden-arrow"
                menuClass="extra-users-popup">
                <Styled.ExtraUsersWrapper>
                  <Badge
                    showText={`${TotalCount - 1}+`}
                    className="team-extra-users"
                  />
                </Styled.ExtraUsersWrapper>
                <div className="non-scroll">
                  {Users?.filter((user, index) => index > 0 && user).map(
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
          {isActive ? (
            <Styled.TeamTrashWrapper>
              <TrashIcon />
            </Styled.TeamTrashWrapper>
          ) : (
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

export default Team;
