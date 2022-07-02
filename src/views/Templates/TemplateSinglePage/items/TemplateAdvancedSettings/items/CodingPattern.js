import * as Styled from './CodingPattrenStyles';
import { useContext, useMemo, useState } from 'react';
import Modal from '../../../../../../components/Modal/Modal';
import CloseIcon from '../../../../../../components/Icons/CloseIcon/CloseIcon';
import {
  ID_PATTERNS,
  ID_PATTERNS_Georgian,
  ID_PATTERNS_Jalali,
  Other_Patterns,
} from './_IdPatterns';
import { useTemplateContext } from 'views/Templates/TemplateSinglePage/TemplateProvider';
import { AdvandcedContenxt } from '../TemplateAdvancedSettings';

const _selectedPatternMockData = [
  {
    id: 1,
    title: 'سال 4رقمی',
    preview: '1400',
  },
  {
    id: 2,
    title: 'ماه 2رقمی',
    preview: '01',
  },
  {
    id: 3,
    title: 'کد تمپلیت',
    preview: '123',
  },
];
const CodingPattern = ({}) => {
  const { RVDic } = window;
  const [selectedPattern, setSelectedPattern] = useState(
    _selectedPatternMockData
  );
  const [modalInfo, setModalInfo] = useState({
    show: false,
    title: 'الگوی کددهی آیتم‌ها',
    middle: true,
    contentWidth: '64rem',
    titleClass: 'rv-default',
  });
  const context = useTemplateContext();
  const { nodeType } = useContext(AdvandcedContenxt);

  console.log(nodeType);

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

  const selectedPatternPreview = useMemo(
    () =>
      selectedPattern?.map((x) => {
        const { id, preview } = x;
        return <Styled.PreviewItem key={id}>{preview}</Styled.PreviewItem>;
      }),
    [selectedPattern]
  );

  const JalaliDateItems = useMemo(() => {
    return ID_PATTERNS_Jalali(RVDic)?.map((x) => {
      return <PatternCheckbox key={x?.id}>{x?.title}</PatternCheckbox>;
    });
  }, [selectedPattern]);

  const GeorgianDateItems = useMemo(() => {
    return ID_PATTERNS_Georgian(RVDic)?.map((x) => {
      return <PatternCheckbox key={x?.id}>{x?.title}</PatternCheckbox>;
    });
  }, [selectedPattern]);

  const IdPatternsItems = useMemo(() => {
    return ID_PATTERNS(RVDic)?.map((x) => {
      return <PatternCheckbox key={x?.id}>{x?.title}</PatternCheckbox>;
    });
  }, [selectedPattern]);

  const OtherPatternsItems = useMemo(() => {
    return Other_Patterns(RVDic)?.map((x) => {
      return <PatternCheckbox key={x?.id}>{x?.title}</PatternCheckbox>;
    });
  }, [selectedPattern]);

  return (
    <Styled.CodingPatternContainer>
      <Styled.InputData modal={false}>{selectedPatternItems}</Styled.InputData>
      <Styled.EditButton onClick={openModal}>{RVDic?.Edit}</Styled.EditButton>

      <Modal onClose={closeModal} {...modalInfo}>
        <Styled.ExampleContainer>
          <Styled.ExampleTitle>{'مثال'}</Styled.ExampleTitle>
          <Styled.ExamplePreviewContainer>
            {selectedPatternPreview}
          </Styled.ExamplePreviewContainer>
        </Styled.ExampleContainer>
        <Styled.ModalContentContainer>
          <Styled.InputData modal={true}>
            {selectedPatternItems}
          </Styled.InputData>
        </Styled.ModalContentContainer>

        <Styled.ItemSelectionBlock>
          <Styled.ItemSelectionBlockTitle>
            {'تاریخ'}
          </Styled.ItemSelectionBlockTitle>
          <Styled.ItemSelectionBlockPatternsContainer>
            <Styled.ListContainer>{JalaliDateItems}</Styled.ListContainer>
            <Styled.ListContainer>{GeorgianDateItems}</Styled.ListContainer>
          </Styled.ItemSelectionBlockPatternsContainer>
        </Styled.ItemSelectionBlock>

        <Styled.ItemSelectionBlock>
          <Styled.ItemSelectionBlockTitle>
            {'آیتم'}
          </Styled.ItemSelectionBlockTitle>
          <Styled.ItemSelectionBlockPatternsContainer>
            <Styled.ListContainer>{IdPatternsItems}</Styled.ListContainer>
          </Styled.ItemSelectionBlockPatternsContainer>
        </Styled.ItemSelectionBlock>

        <Styled.ItemSelectionBlock>
          <Styled.ItemSelectionBlockTitle>
            {'سایر'}
          </Styled.ItemSelectionBlockTitle>
          <Styled.ItemSelectionBlockPatternsContainer>
            <Styled.ListContainer>{OtherPatternsItems}</Styled.ListContainer>
          </Styled.ItemSelectionBlockPatternsContainer>
        </Styled.ItemSelectionBlock>

        <Styled.ActionBar>
          <Styled.ActionButton type="primary">
            {'ثبت الگوی کددهی'}
          </Styled.ActionButton>
        </Styled.ActionBar>
      </Modal>
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

const PatternCheckbox = ({ children, checked, disabled, ...rest }) => {
  return (
    <Styled.CheckboxContainer active={checked}>
      <Styled.Input {...rest} />
      {children}
    </Styled.CheckboxContainer>
  );
};
export default CodingPattern;
