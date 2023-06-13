import { useContext } from 'react';
import { searchContext } from 'views/Search/SearchView';
import * as Styled from 'views/Search/SearchView.styles';
import Toggle from 'components/Buttons/Toggle/Toggle';
import useWindow from 'hooks/useWindowContext';

const QuestionToggles = () => {
  const { RVDic } = useWindow();
  const { togglesValue, setTogglesValue } = useContext(searchContext);
  const { SearchInN, Title, Description, Answers, Question } = RVDic || {};

  //! Provide toggle name.
  const getName = (name) => {
    return SearchInN?.replace('[n]', name);
  };

  //! Advanced search toggles.
  const toggleTypes = [
    { name: getName(Title), type: 'title' },
    { name: getName(Description), type: 'excerpt' },
    { name: getName(Answers), type: 'content' },
  ];

  return (
    <Styled.TogglesContainer>
      <Styled.TogglesTitle>{Question}</Styled.TogglesTitle>
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

export default QuestionToggles;
