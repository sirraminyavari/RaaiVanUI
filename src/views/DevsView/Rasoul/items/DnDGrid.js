import React from 'react';
import DnDManager from '../../../../components/DnDManager/DnDManager';
import styles from './DnDGrid.module.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortedList: sortList(props.list),
    };
  }

  sortList = () => {
    this.setState({
      ...this.state,
      sortedList: sortList(this.state.sortedList),
    });
  };

  reorderList = (sourceIndex, destinationIndex) => {
    if (destinationIndex === sourceIndex) {
      return;
    }
    const list = this.state.sortedList;
    if (destinationIndex === 0) {
      list[sourceIndex].order = list[0].order - 1;
      this.sortList();
      return;
    }
    if (destinationIndex === list.length - 1) {
      list[sourceIndex].order = list[list.length - 1].order + 1;
      this.sortList();
      return;
    }
    if (destinationIndex < sourceIndex) {
      list[sourceIndex].order =
        (list[destinationIndex].order + list[destinationIndex - 1].order) / 2;
      this.sortList();
      return;
    }
    list[sourceIndex].order =
      (list[destinationIndex].order + list[destinationIndex + 1].order) / 2;
    this.sortList();
  };

  render = () => (
    <div className={styles.App}>
      <DnDManager
        items={this.state.sortedList}
        direction="vertical"
        maxItems={0}
        render={(item) => <ListElement item={item} />}
        onDragEnd={this.reorderList}
      />
    </div>
  );
}

export default App;

function sortList(list) {
  return list.slice().sort((first, second) => first.order - second.order);
}

function ListElement({ item: { id } }) {
  return (
    <div className={styles.item}>
      <div>{id}</div>
    </div>
  );
}
