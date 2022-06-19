import { useEffect, useState } from 'react';
import FormFill from 'components/FormElements/FormFill/FormFill';
import * as Styles from './OnboardingTemplateSelection.styles';
import API from 'apiHelper';
import FieldsLoadingSkelton from 'views/Node/nodeDetails/items/FieldsLoadingSkelton';
import useWindow from 'hooks/useWindowContext';
import EmptyState from 'components/EmptyState/EmptyState';

//TODO replace FormFill component with a labels only kind ...

const OnboardingTemplateSelectionNode = ({ activeTemplate }) => {
  const { RVDic } = useWindow();
  const [templateNodeElements, setTemplateNodeElements] = useState(false);

  //! RVDic i18n localization
  const RVDicِNothingToDisplayTemplate = RVDic.ThisTemplateHasNoFieldsToDisplay;

  useEffect(() => {
    (async () => {
      setTemplateNodeElements(false);
      const formElements = await API.CN.getTemplatePreview({
        NodeTypeID: activeTemplate?.NodeTypeID,
      });
      setTemplateNodeElements(formElements);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTemplate?.NodeTypeID]);

  return (
    <div>
      <Styles.OnboardingTemplateSelectionNodeContainer>
        {templateNodeElements ? (
          <>
            {templateNodeElements?.Elements?.length ? (
              <FormFill data={templateNodeElements} editable />
            ) : (
              <Styles.OnboardingTemplateSelectionNodeEmptyContainer>
                <div>
                  <EmptyState keepLastFrame />
                  {RVDicِNothingToDisplayTemplate}
                </div>
              </Styles.OnboardingTemplateSelectionNodeEmptyContainer>
            )}
          </>
        ) : (
          <FieldsLoadingSkelton />
        )}
      </Styles.OnboardingTemplateSelectionNodeContainer>
    </div>
  );
};

OnboardingTemplateSelectionNode.displayName = 'OnboardingTemplateSelectionNode';

export default OnboardingTemplateSelectionNode;
