// import Header from './ContentHeader';
import * as Styled from 'views/Teams/Teams.styles';
import MobileWorkSpace from './MobileSpace';

const spaces = [
  {
    id: '1',
    role: 'admin',
    title: 'فضای کاری مدیر',
    teams: [],
  },
];

const MobileContentSide = () => {
  return (
    <Styled.MobileContentSide>
      {/* <Header /> */}
      <Styled.SpaceListConatiner>
        {spaces?.map((space, key) => (
          <MobileWorkSpace key={key} space={space} />
        ))}
      </Styled.SpaceListConatiner>
    </Styled.MobileContentSide>
  );
};

export default MobileContentSide;
