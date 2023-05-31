import { useContext } from 'react';
import { searchContext } from 'views/Search/SearchView';
import * as Styled from 'views/Search/SearchView.styles';
import Toggle from 'components/Buttons/Toggle/Toggle';
import useWindow from 'hooks/useWindowContext';

const QuestionToggles = () => {
  const { RVDic } = useWindow();
  const { togglesValue, setTogglesValue } = useContext(searchContext);
  const { File } = RVDic || {};

  //! Advanced search toggles.
  const toggleTypes = [
    { name: 'PDF', type: 'pdf' },
    { name: 'DOC/DOCX', type: 'doc|docx' },
    { name: 'XLS', type: 'xlsx' },
    { name: 'PPT/PPTX', type: 'ppt|pptx' },
    { name: 'TXT', type: 'txt' },
    { name: 'XML', type: 'xml' },
    { name: 'HTM/HTML', type: 'htm|html' },
  ];

  return (
    <Styled.TogglesContainer>
      <Styled.TogglesTitle>{File}</Styled.TogglesTitle>
      {toggleTypes.map((toggle, index) => {
        return (
          <Toggle
            key={index}
            title={toggle.name}
            onToggle={(value) => {
              if (value) {
                setTogglesValue((oldValue) => ({
                  ...oldValue,
                  fileTypes: [...oldValue.fileTypes, toggle.type],
                }));
              } else {
                setTogglesValue((oldValue) => ({
                  ...oldValue,
                  fileTypes: oldValue.fileTypes.filter(
                    (item) => item !== toggle.type
                  ),
                }));
              }
            }}
            isChecked={togglesValue?.fileTypes?.includes(toggle.type)}
            clickableLabel
          />
        );
      })}
    </Styled.TogglesContainer>
  );
};

export default QuestionToggles;
