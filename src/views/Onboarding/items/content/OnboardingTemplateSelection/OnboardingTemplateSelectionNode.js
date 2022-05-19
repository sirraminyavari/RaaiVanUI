import { useEffect, useState } from 'react';
import FormFill from 'components/FormElements/FormFill/FormFill';
import * as Styles from './OnboardingTemplateSelection.styles';
import { getTemplatePreview } from 'apiHelper/ApiHandlers/CNAPI/CNApi';
import FieldsLoadingSkelton from 'views/Node/nodeDetails/items/FieldsLoadingSkelton';

const OnboardingTemplateSelectionNode = ({ activeTemplate }) => {
  const [templateNodeElements, setTemplateNodeElements] = useState(false);

  useEffect(() => {
    (async () => {
      setTemplateNodeElements(false);
      const formElements = await getTemplatePreview({
        NodeTypeID: activeTemplate?.NodeTypeID,
      });
      setTemplateNodeElements(formElements);
      console.warn({ formElements, activeTemplate });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTemplate?.NodeTypeID]);

  return (
    <div>
      <Styles.OnboardingTemplateSelectionNodeContainer>
        {templateNodeElements ? (
          <FormFill data={templateNodeElements} editable />
        ) : (
          <FieldsLoadingSkelton />
        )}
      </Styles.OnboardingTemplateSelectionNodeContainer>
    </div>
  );
};

OnboardingTemplateSelectionNode.displayName = 'OnboardingTemplateSelectionNode';

export default OnboardingTemplateSelectionNode;
