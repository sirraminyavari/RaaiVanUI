import { useTemplateContext } from '../../../TemplateProvider';
import { useState } from 'react';
import {
  disableExtension,
  enableExtension,
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

  return {
    wiki,
    handleWikiState,
    posts,
    handlePostsState,
  };
};
