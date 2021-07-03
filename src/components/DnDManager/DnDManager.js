import DragAndDropWrapper from './DnDWrapper';
import withMaxItems from './WithMaxItems';
import withReactToItemsChange from './WithReactToItemsChange';
import { v4 as uuidv4 } from 'uuid';

const ComponentWithMaxItems = withMaxItems(DragAndDropWrapper, uuidv4);
const ComponentWithReactToItemsChange = withReactToItemsChange(
  ComponentWithMaxItems
);

const DnDManager = ComponentWithReactToItemsChange;

export default DnDManager;
