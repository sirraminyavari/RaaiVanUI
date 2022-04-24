import React, { useCallback, useMemo, useRef, useState } from 'react';
import Editor from '@draft-js-plugins/editor';
import { default as createMentionPlugin } from '@draft-js-plugins/mention';
import { EditorState } from 'draft-js';
import CustomEntry from './Mention/items/CustomEntry';
import CustomMention from './Mention/items/CustomMention';
import CustomSuggestionsFilter from './Mention/items/CustomSuggestionFilter.js.js';
import mentions from './Mention/items/mentions';
import styled from 'styled-components';
import mentionStyles from './Mention/items/Mention.module.css';

const styleMap = {
  MENTION: {
    textDecoration: 'underline',
    color: 'green',
  },
};
const MainEditor = () => {
  const ref = useRef(null);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState(mentions);

  const { MentionSuggestions, plugins } = useMemo(() => {
    const mentionPlugin = createMentionPlugin({
      entityMutability: 'IMMUTABLE',
      theme: {
        mentionSuggestions: mentionStyles.mentionSuggestions,
        mentionSuggestionsEntry: mentionStyles.suggestion,
        mentionSuggestionsEntryAvatar: mentionStyles.avatar,
        mentionSuggestionsEntryText: mentionStyles.text,
        mention: mentionStyles.mention,
      },
      mentionComponent: (props) => <CustomMention {...props} />,
    });
    // eslint-disable-next-line no-shadow
    const { MentionSuggestions } = mentionPlugin;
    // eslint-disable-next-line no-shadow
    const plugins = [mentionPlugin];
    return { plugins, MentionSuggestions };
  }, []);

  const onOpenChange = useCallback((_open) => {
    setOpen(_open);
  }, []);

  const onSearchChange = useCallback(({ value }) => {
    setSuggestions(CustomSuggestionsFilter(value, mentions));
  }, []);

  const onChange = (props) => {
    setEditorState(props);
  };

  return (
    <Container
      // className={editorStyles.editor}
      onClick={() => {
        ref.current.focus();
      }}
    >
      <Editor
        editorKey={'editor'}
        editorState={editorState}
        onChange={onChange}
        plugins={plugins}
        ref={ref}
        customStyleMap={styleMap}
      />
      <MentionSuggestions
        open={open}
        onOpenChange={onOpenChange}
        suggestions={suggestions}
        onSearchChange={onSearchChange}
        entryComponent={(props) => (
          <CustomEntry mentions={mentions} {...props} />
        )}
      />
    </Container>
  );
};

export default MainEditor;

const Container = styled.div`
  box-sizing: border-box;
  border: 1px solid #ddd;
  cursor: text;
  padding: 16px;
  border-radius: 2px;
  margin-bottom: 2em;
  box-shadow: inset 0px 1px 8px -3px #ababab;
  background: #fefefe;
`;
