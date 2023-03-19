import * as Styles from './TemplateUploadIconStyles';
import ImageIcon from 'components/Icons/ImageIcon/ImageIcon';
import { CV_WHITE } from 'constant/CssVariables';
import PencilIcon from 'components/Icons/EditIcons/Pencil';
import TabView from 'components/TabView/TabView';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import { useState } from 'react';
import Uploader from './Uploader';
import EmojiPicker from 'components/EmojiPicker/EmojiPicker';
import api from 'apiHelper';
import { useTemplateContext } from 'views/Templates/TemplateSinglePage/TemplateProvider';
import InfoToast from 'components/toasts/info-toast/InfoToast';
import OnClickAway from 'components/OnClickAway/OnClickAway';

const TemplateUploadIcon = () => {
  const { RV_RTL, RVDic } = window;
  const [openState, setOpenState] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newUploadedImageURL, setNewUploadedImageURL] = useState('');
  const { NodeTypeID: ID, IconURL } = useTemplateContext();

  const open = () => setOpenState(true);

  const close = () => setOpenState(false);

  const handelEmojiSelect = async (emojiObject) => {
    const { ErrorText } = await api?.CN?.setAvatar({
      ID,
      AvatarName: emojiObject?.title,
    });
    if (ErrorText)
      InfoToast({ type: 'error', message: RVDic?.MSG[ErrorText] || ErrorText });
    else close();
  };
  const handleUploadDone = (newImageURL) => {
    setIsUploadModalOpen(false);
    setNewUploadedImageURL(newImageURL);
  };
  return (
    <Styles.Container>
      <Styles.Icon>
        {IconURL ? (
          <Styles.AvatarIcon url={newUploadedImageURL || IconURL} />
        ) : (
          <ImageIcon size={54} />
        )}

        <Styles.AddButton rtl={RV_RTL} onClick={open}>
          <PencilIcon color={CV_WHITE} size={18} />
        </Styles.AddButton>
        {openState && (
          <OnClickAway
            onAway={() => {
              if (!isUploadModalOpen) close();
            }}
          >
            <Styles.UploaderLayout>
              <TabView height={2.5}>
                <TabView.Item type="Item" label={'اموجی'}>
                  <Styles.TabViewContentWrapper>
                    <EmojiPicker onEmojiSelect={handelEmojiSelect} />
                  </Styles.TabViewContentWrapper>
                </TabView.Item>
                <TabView.Item type="Item" label={'بارگذاری تصویر'}>
                  <Styles.TabViewContentWrapper>
                    <Uploader
                      uploadID={ID}
                      setOpenStatus={setIsUploadModalOpen}
                      onDone={handleUploadDone}
                    />
                  </Styles.TabViewContentWrapper>
                </TabView.Item>

                <TabView.Action type="Action">
                  <Styles.CloseButton onClick={close}>
                    <CloseIcon outline={true} size={20} />
                  </Styles.CloseButton>
                </TabView.Action>
              </TabView>
            </Styles.UploaderLayout>
          </OnClickAway>
        )}
      </Styles.Icon>
    </Styles.Container>
  );
};

export default TemplateUploadIcon;
