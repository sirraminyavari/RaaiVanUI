import React from 'react';
import {
  cleanup,
  render,
  screen,
  fireEvent,
} from '../../../utils/TestUtils/TestUtils';
import SubjectItem from './SubjectItem';
import { decode } from 'js-base64';

beforeEach(cleanup);

test('renders SubjectItem component', () => {
  const itemInput = {
    NodeID: '3d7c7551-3a1f-4e9d-8d83-72bd41cd6972',
    Name: '2KfYt9mE2KfYudin2Kog2LTYqNqp2YfigIzZh9in24wg2KfYrNiq2YXYp9i524w=',
    NodeTypeID: 'a790cf42-e2ba-40c8-a6ff-646d7f15be92',
    NodeType: '2LXZgdit2Yc=',
    AdditionalID: 'MTQwMDAzMDAy',
    Description: '',
    IconURL: '../../images/Preview.png',
    Archived: false,
    ChildsCount: 0,
    CreationDate: '1400/01/23',
    Creator: {
      UserID: '33485344-0a27-45f4-bd81-0313004faf5a',
      UserName: 'a2hqYWhhbmlhbg==',
      FirstName: '2K7YtNin24zYp9ix',
      LastName: '2KzZh9in2YbbjNin2YY=',
      ProfileImageURL: '../../Images/unknown.jpg',
    },
    RelatedNodesCount: 0,
    ExpertsCount: 0,
    Extensions: [],
    HasChild: false,
    HideCreators: false,
    LikeStatus: false,
    LikesCount: 0,
    MembersCount: 0,
    Status: '',
    UserStatus: {
      Editable: false,
      IsAdminMember: false,
      IsAreaAdmin: false,
      IsContributor: false,
      IsCreator: false,
      IsExpert: false,
      IsMember: false,
      IsServiceAdmin: false,
      VisitsCount: 0,
      WFState: '',
    },
  };
  render(
    <SubjectItem
      onChecked={(value, item) => console.log(value, item, 'onChecked')}
      selectMode={false}
      item={itemInput}
      isSaas={true}
    />
  );
  const subItem = screen.queryByText(decode(itemInput.Name));

  // expect(subItem).toBe(decode(itemInput.Name));
  expect(subItem).toHaveTextContent(decode(itemInput.Name));
});
