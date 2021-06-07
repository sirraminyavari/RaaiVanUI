import React from 'react';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import styled from 'styled-components';

const Handle = SortableHandle(({ tabIndex }) => (
  <div tabIndex={tabIndex} style={{ width: '20px' }}>
    <svg viewBox="0 0 50 50">
      <path
        d="M 0 7.5 L 0 12.5 L 50 12.5 L 50 7.5 L 0 7.5 z M 0 22.5 L 0 27.5 L 50 27.5 L 50 22.5 L 0 22.5 z M 0 37.5 L 0 42.5 L 50 42.5 L 50 37.5 L 0 37.5 z"
        color="#000"
      />
    </svg>
  </div>
));

const StyledItem = styled.div`
  float: left;
  padding: 8px;
  width: calc(25% - 16px);
  min-width: 200px;
  .content {
    padding: 8px 12px;
    background-color: #ddd;
    height: 150px;
    background-color: blue;
  }
`;

const SortableItem = SortableElement((props) => {
  const { value: item } = props;
  console.log(props);
  return (
    <StyledItem>
      <div className="content">
        {item.caption}
        {props.shouldUseDragHandle && <Handle />}
      </div>
    </StyledItem>
  );
});

const StyledContainer = styled.div`
  background-color: #ddd;
  margin-left: -8px;
  margin-right: -8px;
  white-space: wrap;
  &:after {
    content: '';
    clear: both;
    display: table;
  }
`;

const SortableList = SortableContainer((props) => {
  const { items, ...restProps } = props;
  return (
    <StyledContainer>
      {items.map((item, index) => (
        <SortableItem
          key={`item-${item.id}`}
          index={index}
          value={item}
          {...restProps}
        />
      ))}
    </StyledContainer>
  );
});

const Container = styled.div`
  width: 800px;
  max-width: 500px;
  margin: 0 auto;
`;

function App() {
  const [photos, setPhotos] = React.useState([
    {
      id: 1,
      preview:
        'https://s3-us-west-1.amazonaws.com/rentzend-dev/user-content/test/file/1f58b506-b788-4802-bab9-718cbc31dbc5.jpg',
      caption: 'test 1',
      starred: true,
    },
    {
      id: 2,
      preview:
        'https://s3-us-west-1.amazonaws.com/rentzend-dev/user-content/test/file/9515dc3a-cdda-497c-b8fa-e82b3f83b06f.jpg',
      caption: 'test 2',
    },
    {
      id: 3,
      preview:
        'https://s3-us-west-1.amazonaws.com/rentzend-dev/user-content/test/file/383ecb2c-a5a1-4aa3-8ab9-0df9858e6802.jpg',
      caption: 'test 3',
    },
    {
      id: 4,
      preview:
        'https://s3-us-west-1.amazonaws.com/rentzend-dev/user-content/test/file/61f4e57b-6b15-4091-ae1d-cc90a9ec9662.jpg',
      caption: 'test 4',
    },
    {
      id: 5,
      preview:
        'https://s3-us-west-1.amazonaws.com/rentzend-dev/user-content/test/file/1f58b506-b788-4802-bab9-718cbc31dbc5.jpg',
      caption: 'test 5',
    },
    {
      id: 6,
      preview:
        'https://s3-us-west-1.amazonaws.com/rentzend-dev/user-content/test/file/9515dc3a-cdda-497c-b8fa-e82b3f83b06f.jpg',
      caption: 'test 6',
    },
  ]);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setPhotos(arrayMove(photos, oldIndex, newIndex));
  };

  return (
    <Container>
      <SortableList
        shouldUseDragHandle={true}
        useDragHandle
        axis="xy"
        items={photos}
        onSortEnd={onSortEnd}
      />
    </Container>
  );
}

export default App;
