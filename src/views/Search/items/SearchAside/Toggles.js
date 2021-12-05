import { useContext } from 'react';
import { searchContext } from 'views/Search/SearchView';
import * as Styled from 'views/Search/SearchView.styles';
import Toggle from 'components/Toggle/Toggle';
import useWindow from 'hooks/useWindowContext';

const Toggles = () => {
  const { RVDic } = useWindow();
  const { togglesValue, setTogglesValue } = useContext(searchContext);
  const { SearchInN, Title, Abstract, Content, Keywords, FileContents } =
    RVDic || {};

  const getName = (name) => {
    return SearchInN?.replace('[n]', name);
  };

  const toggleTypes = [
    { name: getName(Title), type: 'title' },
    { name: getName(Abstract), type: 'excerpt' },
    { name: getName(Content), type: 'content' },
    { name: getName(Keywords), type: 'keywords' },
    { name: getName(FileContents), type: 'file' },
  ];

  return (
    <Styled.TogglesContainer>
      <Styled.TogglesTitle>آیتم</Styled.TogglesTitle>
      {toggleTypes.map((toggle, index) => {
        return (
          <Toggle
            key={index}
            title={toggle.name}
            onToggle={(value) =>
              setTogglesValue((oldValue) => ({
                ...oldValue,
                [toggle.type]: value,
              }))
            }
            isChecked={togglesValue?.[toggle.type]}
            clickableLabel
          />
        );
      })}
    </Styled.TogglesContainer>
  );
};

export default Toggles;
