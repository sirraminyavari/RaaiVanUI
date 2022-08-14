import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CV_DISTANT, CV_GRAY, CV_GRAY_DARK } from 'constant/CssVariables';
import { FLEX_CSA } from 'constant/StyledCommonCss';
import RxInput from 'components/Inputs/RxInput';
import { renameNodeType } from 'apiHelper/ApiHandlers/CNAPI';
import InfoToast from 'components/toasts/info-toast/InfoToast';
import { useTemplateContext } from '../../../TemplateProvider';
import { setServiceDescription } from 'apiHelper/ApiHandlers/CNAPI/api-service';
import { decodeBase64 } from 'helpers/helpers';
import RxTextarea from 'components/Inputs/RxTextarea';
import BlockEditorWrapper from 'components/BlockEditor/BlockEditor';

const TemplateTitleForm = ({ name }) => {
  const { RVDic } = window;
  const { NodeTypeID, Description: description } = useTemplateContext();
  const [title, setTitle] = useState(name);
  const [subtitle, setSubtitle] = useState(decodeBase64(description));

  const handleTitleChange = async (e) => {
    const Name = e?.target?.value;
    setTitle(Name);

    const { ErrorText } = await renameNodeType({ NodeTypeID, Name });

    if (ErrorText) {
      InfoToast({
        type: 'error',
        autoClose: true,
        message: RVDic?.MSG[ErrorText] || ErrorText,
      });
    }
  };

  const handleSubtitleChange = async (e) => {
    const Description = e?.target?.value;
    setSubtitle(Description);

    const { ErrorText } = await setServiceDescription({
      NodeTypeID,
      Description,
    });

    if (ErrorText) {
      InfoToast({
        type: 'error',
        autoClose: true,
        message: RVDic?.MSG[ErrorText] || ErrorText,
      });
    }
  };

  return (
    <Container>
      <TitleInput value={title} onChange={handleTitleChange} delayTime={1000} />

      <SubtitleInput
        row="1"
        placeholder={'راهنمای تکمیل قالب'}
        value={subtitle}
        onChange={handleSubtitleChange}
        delayTime={1000}
      />

      {/* <BlockEditorWrapper
        textarea={true}
        editorState={subtitle}
        setEditorState={(e) => console.log(e)}
      /> */}
    </Container>
  );
};
const Container = styled.div`
  ${FLEX_CSA};
  gap: 2.1rem;
  width: 100%;
`;

const TitleInput = styled(RxInput)`
  height: 2.75rem;
  width: 36rem;
  outline: none;
  border: none;
  border-bottom: 1px solid ${CV_DISTANT};
  color: ${CV_GRAY_DARK};
  background-color: transparent;
  font-size: 1.75rem;
`;

const SubtitleInput = styled(RxTextarea)`
  max-width: 48rem;
  width: 100%;
  outline: none;
  border: none;
  border-bottom: 1px solid ${CV_DISTANT};
  background-color: transparent;
  font-size: 0.85rem;
  color: ${CV_GRAY};
`;

export default TemplateTitleForm;
