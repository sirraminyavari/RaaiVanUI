import * as Styled from '../../../Teams.styles';
import DragIcon from 'components/Icons/DragIcon/Drag';
import Avatar from 'components/Avatar/Avatar';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import Button from 'components/Buttons/Button';

const Team = ({ team }) => {
  const { title, excerpt, users, isActive } = team;
  return (
    <Styled.TeamConatiner>
      <Styled.DragIconWrapper>
        <DragIcon />
      </Styled.DragIconWrapper>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        }}>
        <div style={{ flexGrow: 1 }}>
          <Avatar color="#333" />
          <Styled.TeamTitle>{title}</Styled.TeamTitle>
          <Styled.TeamExcerpt>{excerpt}</Styled.TeamExcerpt>
        </div>
        <div>
          <Styled.TeamFooterConatiner>
            <Styled.TeamAvatarsWrapper>
              {users?.map((user, index) => {
                if (index > 3) return null;
                return (
                  <Avatar
                    key={index}
                    radius={32}
                    color={`#${index * 2 + 1}${index * 2 + 1}${index * 2 + 1}`}
                    style={{
                      position: 'relative',
                      right: `${-index * 10}px`,
                      zIndex: 10 - index,
                    }}
                  />
                );
              })}
            </Styled.TeamAvatarsWrapper>
            {isActive ? (
              <Styled.TeamTrashWrapper>
                <TrashIcon color="#BAC9DC" />
              </Styled.TeamTrashWrapper>
            ) : (
              <Button
                type="primary-o"
                style={{ height: '1.5rem', width: '5rem' }}>
                فعال سازی
              </Button>
            )}
          </Styled.TeamFooterConatiner>
        </div>
      </div>
    </Styled.TeamConatiner>
  );
};

export default Team;
