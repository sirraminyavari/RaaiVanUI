import React from 'react';
import {
  Suggestion,
  SectionHeaderContainer,
  SectionHeader,
  SuggestionContainer,
  SuggestionAvatar,
  SuggestionTitle,
  SectionBottom,
} from './Mention.style';

const CustomEntry = ({ mentions, ...props }) => {
  const index = mentions.findIndex((x) => x.name === props.mention.name);
  return (
    <div
      onMouseDown={props.onMouseDown}
      onClick={props.onMouseEnter}
      onMouseUp={props.onMouseUp}
      id={index}
      role={props.role}
      key={index}
      {...props}>
      <Suggestion>
        {mentions[index - 1] &&
        mentions[index - 1].type === props.mention.type ? null : (
          <SectionHeaderContainer>
            <SectionHeader>{props.mention.type_label}</SectionHeader>
          </SectionHeaderContainer>
        )}
        <SuggestionContainer isFocused={props.isFocused}>
          {props.mention.type === 'people' && (
            <SuggestionAvatar src={props.mention.avatar} />
          )}

          <SuggestionTitle>{props.mention.name}</SuggestionTitle>
        </SuggestionContainer>
        {mentions[index + 1] &&
        mentions[index + 1].type !== props.mention.type ? (
          <SectionBottom />
        ) : null}
      </Suggestion>
    </div>
  );
};
export default CustomEntry;
