import { useState, useEffect, useCallback, useContext } from 'react';
import { EditorState, convertFromRaw } from 'draft-js';
import { convertLegacyHtmlToEditorState } from '@sirraminyavari/rv-block-editor';
import { textColors, highlightColors } from 'components/BlockEditor/data';
import BlockEditor from 'components/BlockEditor/BlockEditor';
import OnClickAway from 'components/OnClickAway/OnClickAway';
import { IHandleSaveBlocks } from 'components/BlockEditor/BlockEditor.type';
import { getNodePageUrl, getProfilePageUrl } from 'apiHelper/getPageUrl';
import FormCell from '../../FormCell';
import ParagraphInputIcon from 'components/Icons/InputIcon/ParagraphInputIcon';
import { CV_GRAY } from 'constant/CssVariables';
import { suggestTags } from 'components/BlockEditor/API';
import { decodeBase64 } from 'helpers/helpers';
import { EditableContext } from '../../FormFill';

export interface IParagraphField {
  value: string;
  onAnyFieldChanged?: (
    elementId?: String,
    content?: string,
    type?: string,
    force?: true
  ) => void;
  elementId?: string;
  decodeTitle?: string;
  iconComponent?: JSX.Element;
  type?: string;
  isEditable?: boolean;
}

function ParagraphField({
  value,
  onAnyFieldChanged,
  elementId,
  decodeTitle,
  iconComponent = <ParagraphInputIcon color={CV_GRAY} size={'1.4rem'} />,
  type,
  isEditable,
}: IParagraphField) {
  const [editorState, setEditorState] = useState(null);
  const editableCtx = useContext(EditableContext);
  const editable = isEditable || editableCtx;
  const [isFocused, setIsFocused] = useState(false);

  //TODO needs checking for arguments ...
  const convertLegacyHtmlStringToEditorState = useCallback(
    (legacyContent: string) => {
      setEditorState(
        EditorState.createWithContent(
          convertFromRaw(
            convertLegacyHtmlToEditorState(legacyContent, {
              colors: { textColors, highlightColors },
              //@ts-expect-error
              getMentionLink: async (search) => {
                console.log(search);
                const rawMentions = await suggestTags({
                  //@ts-expect-error
                  text: search,
                });
                const mentions = rawMentions.map((suggestTag) => ({
                  ...suggestTag,
                  id: suggestTag.ItemID,
                  name: suggestTag.Name,
                  avatar: suggestTag.ImageURL,
                  link:
                    suggestTag.Type === 'User'
                      ? getProfilePageUrl(suggestTag.ItemID)
                      : getNodePageUrl(suggestTag.ItemID),
                }));
                return mentions;
              },
            })
          )
        )
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [EditorState]
  );

  //update the content when the value of 'nodeId' changes
  useEffect(() => {
    (async () => {
      try {
        const parsedValue = JSON.parse(decodeBase64(value));
        setEditorState(
          EditorState.createWithContent(convertFromRaw(parsedValue))
        );
      } catch (err) {
        if (value.length)
          convertLegacyHtmlStringToEditorState(`<span>${value}</span>`);
        else setEditorState(EditorState.createEmpty());
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //use 'saveBlocks' api to save a block
  //content: { blocks: 'array of the blocks to be saved', entityMap: 'current version of entity map' }
  //insertAfterKey: the key of the last block that is places immediately before the blocks to be saved
  const handleSaveBlocks: IHandleSaveBlocks = async ({ content } = {}) => {
    //TODO investigate why save functionality not working when using the [props.save] function
    if (onAnyFieldChanged)
      await onAnyFieldChanged(elementId, JSON.stringify(content), type, true);
  };

  //@ts-expect-error
  if (!editable && !editorState?.getCurrentContent().hasText()) return <></>;
  return (
    <>
      {/*@ts-expect-error */}
      <FormCell iconComponent={iconComponent} title={decodeTitle}>
        <OnClickAway
          style={{ width: '100%' }}
          onAway={() => setIsFocused(false)}
          onClick={() => {
            if (isFocused) return;
            setIsFocused(true);
          }}
        >
          <>
            {editorState && (
              <BlockEditor
                editorState={editorState}
                setEditorState={setEditorState}
                handleSaveBlocks={handleSaveBlocks}
                textarea
                showHint={editable}
                readOnly={!editable || !isFocused}
              />
            )}
          </>
        </OnClickAway>
      </FormCell>
    </>
  );
}
export default ParagraphField;
