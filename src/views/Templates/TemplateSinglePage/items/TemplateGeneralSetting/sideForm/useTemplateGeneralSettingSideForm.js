import { useTemplateContext } from '../../../TemplateProvider';
import { useState } from 'react';
import {
  disableExtension,
  enableComments,
  enableContribution,
  enableExtension,
  enableVersioning,
  isCommunityPage,
} from 'apiHelper/ApiHandlers/CNAPI_ServiceSettings';
import InfoToast from 'components/toasts/info-toast/InfoToast';

export const useTemplateGeneralSettingSideForm = () => {
  const { RVDic } = window;
  const {
    AppID: NodeTypeID,
    Extensions: extensions,
    IsCommunityPage,
    EnableComments,
    EnableContribution,
    EnablePreviousVersionSelect,
  } = useTemplateContext();

  const [wiki, setWiki] = useState(
    extensions.some((e) => e.Extension === 'Wiki' && !e.Disabled)
  );
  const [posts, setPosts] = useState(
    extensions.some((e) => e.Extension === 'Posts' && !e.Disabled)
  );
  const [communityPage, setCommunityPage] = useState(IsCommunityPage);
  const [comments, setComments] = useState(EnableComments);
  const [contributionState, setContributionState] =
    useState(EnableContribution);
  const [versioningState, setVersioningState] = useState(
    EnablePreviousVersionSelect
  );

  const handleWikiState = async (state) => {
    setWiki(state);
    const result = await toggleExtension(state, 'Wiki');
    if (!result) setWiki(!state);
  };

  const handlePostsState = async (state) => {
    setPosts(state);
    const result = await toggleExtension(state, 'Posts');
    if (!result) setPosts(!state);
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

  const handleCommunityPage = async (Value) => {
    setCommunityPage(Value);
    const { ErrorText } = await isCommunityPage({ NodeTypeID, Value });
    if (ErrorText) {
      InfoToast({
        type: 'error',
        autoClose: true,
        message: RVDic?.MSG[ErrorText] || ErrorText,
      });
      setCommunityPage(!Value);
    }
  };

  const handleEnableComments = async (Value) => {
    setComments(Value);
    const { ErrorText } = await enableComments({ NodeTypeID, Value });
    if (ErrorText) {
      InfoToast({
        type: 'error',
        autoClose: true,
        message: RVDic?.MSG[ErrorText] || ErrorText,
      });
      setComments(!Value);
    }
  };

  const handleEnableContribution = async (Value) => {
    setContributionState(Value);
    const { ErrorText } = await enableContribution({ NodeTypeID, Value });
    if (ErrorText) {
      InfoToast({
        type: 'error',
        autoClose: true,
        message: RVDic?.MSG[ErrorText] || ErrorText,
      });
      setContributionState(!Value);
    }
  };

  const handleVersioningState = async (Value) => {
    setVersioningState(Value);
    const { ErrorText } = await enableVersioning({ NodeTypeID, Value });
    if (ErrorText) {
      InfoToast({
        type: 'error',
        autoClose: true,
        message: RVDic?.MSG[ErrorText] || ErrorText,
      });
      setVersioningState(!Value);
    }
  };

  return {
    wiki,
    handleWikiState,
    posts,
    handlePostsState,
    communityPage,
    handleCommunityPage,
    comments,
    handleEnableComments,
    contributionState,
    handleEnableContribution,
    versioningState,
    handleVersioningState,
  };
};
