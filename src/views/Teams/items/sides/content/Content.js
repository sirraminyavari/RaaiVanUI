import Header from './ContentHeader';
import * as Styled from 'views/Teams/Teams.styles';
import WorkSpace from './Space';

const spaces = [
  {
    id: '1',
    role: 'admin',
    title: 'فضای کاری مدیر',
    teams: [],
  },
];

const ContentSide = () => {
  return (
    <Styled.ContentSide>
      {/* <Header /> */}
      <Styled.SpaceListConatiner>
        {spaces.map((space, key) => (
          <WorkSpace key={key} space={space} />
        ))}
      </Styled.SpaceListConatiner>
    </Styled.ContentSide>
  );
};

export default ContentSide;
