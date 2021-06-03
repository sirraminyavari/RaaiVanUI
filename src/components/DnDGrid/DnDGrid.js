import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GridGenerator from './GridGenerator';
import { GridProvider } from './GridContext';

const DnDGrid = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <GridProvider>
        <GridGenerator />
      </GridProvider>
    </DndProvider>
  );
};

export default DnDGrid;
