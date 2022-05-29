import * as Styles from './OnboardingTemplateSelection.styles';
import { decodeBase64 } from 'helpers/helpers';
import CaretIcon from 'components/Icons/CaretIcons/Caret';
import { useEffect, useState } from 'react';

const OnboardingTemplateSelectionGalleryItem = ({
  Name,
  Templates,
  onClick,
  activateTemplate,
  active,
  ...restProps
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(active);
  }, [active]);

  return (
    <Styles.OnboardingTemplateSelectionGalleryItemDetails
      open={isOpen}
      active={active}
    >
      <Styles.OnboardingTemplateSelectionGalleryItemSummery
        isOpen={isOpen}
        {...restProps}
        onClick={(event) => {
          event.preventDefault();
          setIsOpen(!isOpen);
          onClick && onClick(event);
        }}
      >
        <CaretIcon dir="left" />
        {decodeBase64(Name)}
      </Styles.OnboardingTemplateSelectionGalleryItemSummery>
      {Templates.map((template) => {
        const { TypeName, NodeID, IconURL } = template;
        return (
          <Styles.OnboardingTemplateSelectionGalleryItemSubItem
            key={NodeID}
            onClick={() => activateTemplate(template)}
          >
            <img src={IconURL} alt="" />
            {decodeBase64(TypeName)}
          </Styles.OnboardingTemplateSelectionGalleryItemSubItem>
        );
      })}
    </Styles.OnboardingTemplateSelectionGalleryItemDetails>
  );
};

OnboardingTemplateSelectionGalleryItem.displayName =
  'OnboardingTemplateSelectionGalleryItem';

export default OnboardingTemplateSelectionGalleryItem;
