import Header from './ContentHeader';
import * as Styled from 'views/Teams/Teams.styles';
import WorkSpace from './Space';
import PerfectScrollBar from 'components/ScrollBarProvider/ScrollBarProvider';

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
      <Header />
      <PerfectScrollBar>
        <Styled.SpaceListConatiner>
          {spaces.map((space, key) => (
            <WorkSpace key={key} space={space} />
          ))}
        </Styled.SpaceListConatiner>
      </PerfectScrollBar>
    </Styled.ContentSide>
  );
};

export default ContentSide;
