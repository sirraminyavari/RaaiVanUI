import SearchIcon from 'components/Icons/SearchIcon/Search';
import { FLEX_RCB, FLEX_RCS } from 'constant/StyledCommonCss';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useDictionaryContext } from '../DictionaryProvider';

export interface ISearchSection {
  onSelect?: (props: any) => void;
}

const SearchSection: React.FC<ISearchSection> = ({ onSelect }) => {
  const { selected, setSelected, list } = useDictionaryContext();
  const [searchText, setSearchText] = useState<string>('');

  const handleSearchChange = (e) => {
    setSearchText(e?.target?.value || '');
  };

  useEffect(() => {
    selected && onSelect && onSelect(selected);
  }, [selected]);

  const List = useMemo(() => {
    return list
      ?.filter((x) => x?.title.includes(searchText))
      ?.map((x) => {
        const { title, id } = x;
        return (
          <ListItem
            key={id}
            $isSelected={selected?.id === x?.id}
            onClick={() => setSelected(x)}
          >
            {title}
          </ListItem>
        );
      });
  }, [searchText, selected]);

  return (
    <Container>
      <InputContainer>
        <Input value={searchText} onChange={handleSearchChange} />
        <SearchIcon size={24} />
      </InputContainer>
      <ListWrapper>{List}</ListWrapper>
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  max-width: 20rem;
  width: 100%;
  box-shadow: 1px 5px 15px #0000001f;
`;

const InputContainer = styled.div`
  ${FLEX_RCB};
  height: 3rem;
  border: 1px solid var(--rv-color-distant);
  color: var(--rv-color-distant);
  border-radius: 0.5rem;
  gap: 0.5rem;
  padding: 0 0.75rem;
  margin: 1.5rem;
  overflow: hidden;
`;

const Input = styled.input`
  border: none;
  outline: none;
  width: 100%;
  height: 3rem;
`;

const ListWrapper = styled.div`
  height: calc(100% - 7rem);
  overflow: hidden;
`;

const ListItem = styled.div<any>`
  ${FLEX_RCS};
  height: 4rem;
  padding: 0 1.5rem;
  font-weight: bold;
  font-size: 1rem;
  color: var(--rv-color-warm) !important;
  cursor: pointer;
  background-color: ${(props) =>
    props?.$isSelected ? 'var(--rv-color-soft)' : 'transparent'};
`;

export default SearchSection;
