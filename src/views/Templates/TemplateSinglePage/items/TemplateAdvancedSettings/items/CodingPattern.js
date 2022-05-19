import * as Styled from './CodingPattrenStyles';
import { useMemo, useState } from 'react';
import Modal from '../../../../../../components/Modal/Modal';
import { RemoveIconButton } from './CodingPattrenStyles';
import CloseIcon from '../../../../../../components/Icons/CloseIcon/CloseIcon';

const _selectedPatternMockData = [
  {
    id: 1,
    title: 'سال 4رقمی',
  },
  {
    id: 2,
    title: 'ماه 2رقمی',
  },
  {
    id: 3,
    title: 'کد تمپلیت',
  },
];
const CodingPattern = ({}) => {
  const { RVDic } = window;
  const [selectedPattern, setSelectedPattern] = useState(
    _selectedPatternMockData
  );
  const [modalInfo, setModalInfo] = useState({
    show: false,
  });

  const openModal = () => setModalInfo({ ...modalInfo, show: true });

  const closeModal = () => setModalInfo({ ...modalInfo, show: false });

  const selectedPatternItems = useMemo(
    () =>
      selectedPattern?.map((x) => {
        const { id, title } = x;
        return <SelectedItem key={id} item={x} />;
      }),
    [selectedPattern]
  );
  return (
    <Styled.CodingPatternContainer>
      <Styled.InputData>{selectedPatternItems}</Styled.InputData>
      <Styled.EditButton onClick={openModal}>{RVDic?.Edit}</Styled.EditButton>

      <Modal onClose={closeModal} {...modalInfo}></Modal>
    </Styled.CodingPatternContainer>
  );
};
const SelectedItem = ({ item }) => {
  return (
    <Styled.Item>
      <div>{item?.title}</div>
      <Styled.RemoveIconButton>
        <CloseIcon outline={true} size={22} />
      </Styled.RemoveIconButton>
    </Styled.Item>
  );
};
export default CodingPattern;
