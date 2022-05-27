import { useTemplateContext } from '../../../TemplateProvider';
import { useState } from 'react';
import InfoToast from 'components/toasts/info-toast/InfoToast';
import {
  enableExtension,
  isKnowledge,
  disableExtension,
  noContentService,
  isDocument,
  abstractAndKeywordsDisabled,
  fileUploadDisabled,
  relatedNodesSelectDisabled,
  isTree,
} from 'apiHelper/ApiHandlers/CNAPI/api-service';

/**
 * @description
 */
const useRVSideContentSetting = () => {
  const { RVDic } = window;
  const {
    NodeTypeID,
    Extensions,
    NoContent,
    IsKnowledge,
    IsDocument,
    DisableAbstractAndKeywords,
    DisableFileUpload,
    DisableRelatedNodesSelect,
    IsTree,
  } = useTemplateContext();

  const [Browser, setBrowser] = useState(
    Extensions.some((e) => e.Extension === 'Browser' && !e.Disabled)
  );
  const [noContent, setNoContent] = useState(NoContent);
  const [isKnowledgeState, setIsKnowledge] = useState(IsKnowledge);
  const [isDocumentState, setIsDocumentState] = useState(IsDocument);
  const [fileUploadState, setFileUploadState] = useState(DisableFileUpload);
  const [isTreeState, setIsTree] = useState(IsTree);
  const [relatedNodesSelectState, setRelatedNodesSelectState] = useState(
    DisableRelatedNodesSelect
  );
  const [disableAbstractAndKeywords, setDisableAbstractAndKeywords] = useState(
    DisableAbstractAndKeywords
  );

  const handleBrowserState = async (state) => {
    setBrowser(state);
    const result = await toggleExtension(state, 'Wiki');
    if (!result) setBrowser(!state);
  };

  const toggleExtension = async (state, Name) => {
    if (state) {
      const { ErrorText } = await enableExtension({
        NodeTypeID,
        Name,
      });

      if (ErrorText) {
        InfoToast({
          type: 'error',
          autoClose: true,
          message: RVDic?.MSG[ErrorText] || ErrorText,
        });
        return false;
      }
    } else {
      const { ErrorText } = await disableExtension({
        NodeTypeID,
        Name,
      });
      if (ErrorText) {
        InfoToast({
          type: 'error',
          autoClose: true,
          message: RVDic?.MSG[ErrorText] || ErrorText,
        });
        return false;
      }
    }
    return true;
  };

  const handleNoCotentServiceStateChange = async (Value) => {
    setNoContent(Value);
    const { ErrorText } = await noContentService({ NodeTypeID, Value });

    if (ErrorText) {
      InfoToast({
        type: 'error',
        autoClose: true,
        message: RVDic?.MSG[ErrorText] || ErrorText,
      });
      setNoContent(!Value);
    }
  };

  const handleIsKnowledgeStateChange = async (Value) => {
    setIsKnowledge(Value);
    const { ErrorText } = await isKnowledge({ NodeTypeID, Value });

    if (ErrorText) {
      InfoToast({
        type: 'error',
        autoClose: true,
        message: RVDic?.MSG[ErrorText] || ErrorText,
      });
      setIsKnowledge(!Value);
    }
  };

  const handleIsDocumentStateChange = async (Value) => {
    setIsDocumentState(Value);
    const { ErrorText } = await isDocument({ NodeTypeID, Value });

    if (ErrorText) {
      InfoToast({
        type: 'error',
        autoClose: true,
        message: RVDic?.MSG[ErrorText] || ErrorText,
      });
      setIsDocumentState(!Value);
    }
  };

  const handleDisableAbstractAndKeywords = async (Value) => {
    setDisableAbstractAndKeywords(Value);
    const { ErrorText } = await abstractAndKeywordsDisabled({
      IDs: [`${NodeTypeID}`],
      Value,
    });

    if (ErrorText) {
      InfoToast({
        type: 'error',
        autoClose: true,
        message: RVDic?.MSG[ErrorText] || ErrorText,
      });
      setDisableAbstractAndKeywords(!Value);
    }
  };

  const handleFileUploadState = async (Value) => {
    setFileUploadState(Value);
    const { ErrorText } = await fileUploadDisabled({
      IDs: [`${NodeTypeID}`],
      Value,
    });

    if (ErrorText) {
      InfoToast({
        type: 'error',
        autoClose: true,
        message: RVDic?.MSG[ErrorText] || ErrorText,
      });
      setFileUploadState(!Value);
    }
  };

  const handleRelatedNodesSelectStateChange = async (Value) => {
    setRelatedNodesSelectState(Value);
    const { ErrorText } = await relatedNodesSelectDisabled({
      IDs: [`${NodeTypeID}`],
      Value,
    });

    if (ErrorText) {
      InfoToast({
        type: 'error',
        autoClose: true,
        message: RVDic?.MSG[ErrorText] || ErrorText,
      });
      setRelatedNodesSelectState(!Value);
    }
  };

  const handleTreeStateChange = async (Value) => {
    setIsTree(Value);
    const { ErrorText } = await isTree({
      IDs: [`${NodeTypeID}`],
      Value,
    });

    if (ErrorText) {
      InfoToast({
        type: 'error',
        autoClose: true,
        message: RVDic?.MSG[ErrorText] || ErrorText,
      });
      setIsTree(!Value);
    }
  };

  return {
    Extensions,
    Browser,
    handleBrowserState,
    noContent,
    handleNoCotentServiceStateChange,
    isKnowledgeState,
    handleIsKnowledgeStateChange,
    isDocumentState,
    handleIsDocumentStateChange,
    disableAbstractAndKeywords,
    handleDisableAbstractAndKeywords,
    fileUploadState,
    handleFileUploadState,
    relatedNodesSelectState,
    handleRelatedNodesSelectStateChange,
    isTreeState,
    handleTreeStateChange,
  };
};
export default useRVSideContentSetting;
