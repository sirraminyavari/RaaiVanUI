import * as Styles from './OnboardingTemplateSelection.styles';
import { decodeBase64 } from 'helpers/helpers';
import CaretIcon from 'components/Icons/CaretIcons/Caret';
import { useState } from 'react';

const OnboardingTemplateSelectionGalleryItem = ({ Name, Templates }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <details open={isOpen}>
      <Styles.OnboardingTemplateSelectionGalleryItemSummery
        isOpen={isOpen}
        onClick={(event) => {
          event.preventDefault();
          setIsOpen(!isOpen);
        }}
      >
        <CaretIcon dir="left" />
        {decodeBase64(Name)}
      </Styles.OnboardingTemplateSelectionGalleryItemSummery>
      {Templates.map(({ TypeName, NodeID, NodeTypeID, IconURL }) => {
        return (
          <Styles.OnboardingTemplateSelectionGalleryItemSubItem key={NodeID}>
            <img src={IconURL} alt="" />
            {decodeBase64(TypeName)}
          </Styles.OnboardingTemplateSelectionGalleryItemSubItem>
        );
      })}
    </details>
  );
};

OnboardingTemplateSelectionGalleryItem.displayName =
  'OnboardingTemplateSelectionGalleryItem';

export default OnboardingTemplateSelectionGalleryItem;
