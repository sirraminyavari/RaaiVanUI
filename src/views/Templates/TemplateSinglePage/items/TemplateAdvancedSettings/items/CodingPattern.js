import * as Styled from './CodingPattrenStyles';
import { useContext, useEffect, useMemo, useState } from 'react';
import Modal from '../../../../../../components/Modal/Modal';
import CloseIcon from '../../../../../../components/Icons/CloseIcon/CloseIcon';
import {
  ID_PATTERNS,
  ID_PATTERNS_Georgian,
  ID_PATTERNS_Jalali,
  Other_Patterns,
} from './_IdPatterns';
import { useTemplateContext } from 'views/Templates/TemplateSinglePage/TemplateProvider';
import api from 'apiHelper';
import InfoToast from 'components/toasts/info-toast/InfoToast';

const CodingPattern = ({ pattern }) => {
  const { RVDic } = window;
  const [selectedPattern, setSelectedPattern] = useState(pattern);
  const [modalInfo, setModalInfo] = useState({
    show: false,
    title: 'الگوی کددهی آیتم‌ها',
    middle: true,
    contentWidth: '64rem',
    titleClass: 'rv-default',
  });
  const { NodeTypeID } = useTemplateContext();
  const [exampleDic, setExampleDic] = useState({});

  useEffect(() => {
    setSelectedPattern(pattern);
  }, [pattern]);

  useEffect(() => {
    const _pattern = encodePattern();
    const genertePattern = async () => {
      const { Dic } = await api?.CN?.generateAdditionalID({
        NodeTypeID,
        AdditionalIDPattern: _pattern,
      });
      setExampleDic(Dic);
    };
    genertePattern();
  }, [selectedPattern]);

  const openModal = () => setModalInfo({ ...modalInfo, show: true });

  const closeModal = () => setModalInfo({ ...modalInfo, show: false });

  const encodePattern = () => {
    let _pattern = '';
    selectedPattern?.forEach((p) => {
      const { Name, ElementID, Value, Length } = p;

      if (['/', '|', '-', '_'].includes(Name)) {
        _pattern = `${_pattern}${Name}`;
      } else if (Name === 'AlphaNumeric') {
        _pattern = `${_pattern}${Value}`;
      } else {
        _pattern = `${_pattern}~[[${Name}]]`;
      }
    });
    return _pattern;
  };

  const savePatternID = async () => {
    const _pattern = encodePattern();
    const { ErrorText, Succeed } = await api?.CN?.setAdditionalIdPattern({
      NodeTypeID,
      Pattern: _pattern,
    });

    if (ErrorText)
      InfoToast({ type: 'error', message: RVDic?.MSG[ErrorText] || ErrorText });

    if (Succeed) {
      InfoToast({ type: 'info', message: RVDic?.MSG[Succeed] || Succeed });
      setModalInfo({ ...modalInfo, show: false });
    }
  };

  const handlePatternSelect = (Name) => {
    let _pattern = [...selectedPattern];
    if (Name === 'AlphaNumeric') {
      _pattern.push({
        Name,
        Title: RVDic.CN.AddIDPattern[Name] || Name,
        Value: 0,
      });
    } else if (['/', '-', '|', '_'].includes(Name)) {
      _pattern.push({
        Name,
        Title: RVDic.CN.AddIDPattern[Name] || Name,
      });
    } else {
      _pattern.push({
        Name,
        Title: RVDic.CN.AddIDPattern[Name] || Name,
      });
    }
    setSelectedPattern(_pattern);
  };

  const handleRemoveItem = (index) => {
    let _pattern = [...selectedPattern];
    _pattern?.splice(index, 1);
    setSelectedPattern(_pattern);
  };

  const selectedPatternItems = useMemo(
    () =>
      selectedPattern?.map((x, index) => {
        return (
          <SelectedItem
            key={`selected-item-${index}`}
            item={x}
            onRemove={() => handleRemoveItem(index)}
          />
        );
      }),
    [selectedPattern]
  );

  const selectedPatternPreview = useMemo(
    () =>
      selectedPattern?.map((x, index) => {
        const { Name, Value } = x;
        return (
          <Styled.PreviewItem key={`selected-item-preview-${index}`}>
            {Value ? Value : exampleDic[`${Name}`] || Name}
          </Styled.PreviewItem>
        );
      }),
    [selectedPattern, exampleDic]
  );

  const JalaliDateItems = useMemo(() => {
    return ID_PATTERNS_Jalali?.map((Name) => {
      return (
        <PatternCheckbox
          onChange={() => handlePatternSelect(Name)}
          key={`item${Name}`}
          checked={!!selectedPattern?.find((x) => x?.Name === Name)}
        >
          {RVDic?.CN.AddIDPattern[Name] || Name}
        </PatternCheckbox>
      );
    });
  }, [selectedPattern]);

  const GeorgianDateItems = useMemo(() => {
    return ID_PATTERNS_Georgian?.map((Name) => {
      return (
        <PatternCheckbox
          onChange={() => handlePatternSelect(Name)}
          key={`item${Name}`}
          checked={!!selectedPattern?.find((x) => x?.Name === Name)}
        >
          {RVDic?.CN.AddIDPattern[Name] || Name}
        </PatternCheckbox>
      );
    });
  }, [selectedPattern]);

  const IdPatternsItems = useMemo(() => {
    return ID_PATTERNS?.map((Name) => {
      return (
        <PatternCheckbox
          onChange={() => handlePatternSelect(Name)}
          key={`item-${Name}`}
          checked={!!selectedPattern?.find((x) => x?.Name === Name)}
        >
          {RVDic?.CN.AddIDPattern[Name] || Name}
        </PatternCheckbox>
      );
    });
  }, [selectedPattern]);

  const OtherPatternsItems = useMemo(() => {
    return Other_Patterns?.map((Name) => {
      return (
        <PatternCheckbox
          onChange={() => handlePatternSelect(Name)}
          key={`item-${Name}`}
          checked={!!selectedPattern?.find((x) => x?.Name === Name)}
        >
          {RVDic?.CN.AddIDPattern[Name] || Name}
        </PatternCheckbox>
      );
    });
  }, [selectedPattern]);

  return (
    <Styled.CodingPatternContainer>
      <Styled.InputData modal={false}>{selectedPatternItems}</Styled.InputData>
      <Styled.EditButton onClick={openModal}>{RVDic?.Edit}</Styled.EditButton>

      <Modal onClose={closeModal} {...modalInfo}>
        <Styled.ExampleContainer>
          <Styled.ExampleTitle>{RVDic?.Example}</Styled.ExampleTitle>
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
            {RVDic?.Date}
          </Styled.ItemSelectionBlockTitle>
          <Styled.ItemSelectionBlockPatternsContainer>
            <Styled.ListContainer>{JalaliDateItems}</Styled.ListContainer>
            <Styled.ListContainer>{GeorgianDateItems}</Styled.ListContainer>
          </Styled.ItemSelectionBlockPatternsContainer>
        </Styled.ItemSelectionBlock>

        <Styled.ItemSelectionBlock>
          <Styled.ItemSelectionBlockTitle>
            {RVDic.FG.ElementTypes.Node}
          </Styled.ItemSelectionBlockTitle>
          <Styled.ItemSelectionBlockPatternsContainer>
            <Styled.ListContainer>{IdPatternsItems}</Styled.ListContainer>
          </Styled.ItemSelectionBlockPatternsContainer>
        </Styled.ItemSelectionBlock>

        <Styled.ItemSelectionBlock>
          <Styled.ItemSelectionBlockTitle>
            {RVDic?.Other}
          </Styled.ItemSelectionBlockTitle>
          <Styled.ItemSelectionBlockPatternsContainer>
            <Styled.ListContainer>{OtherPatternsItems}</Styled.ListContainer>
          </Styled.ItemSelectionBlockPatternsContainer>
        </Styled.ItemSelectionBlock>

        <Styled.ActionBar>
          <Styled.ActionButton type="primary" onClick={savePatternID}>
            {'ثبت الگوی کددهی'}
          </Styled.ActionButton>
        </Styled.ActionBar>
      </Modal>
    </Styled.CodingPatternContainer>
  );
};

const SelectedItem = ({ item, onRemove }) => {
  const { Title } = item;
  return (
    <Styled.Item>
      <div>{Title}</div>
      <Styled.RemoveIconButton onClick={onRemove}>
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
