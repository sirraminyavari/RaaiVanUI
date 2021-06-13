import { SortableHandle } from 'react-sortable-hoc';
import DragIcon from 'components/Icons/DragIcon/Drag';
import useWindow from 'hooks/useWindowContext';
import * as Styled from 'views/Teams/Teams.styles';

const SortHandle = SortableHandle(({ tabIndex }) => {
  const { RV_RevFloat } = useWindow();

  return (
    <Styled.DragIconWrapper dir={RV_RevFloat} tabIndex={tabIndex}>
      <DragIcon />
    </Styled.DragIconWrapper>
  );
});

export default SortHandle;
