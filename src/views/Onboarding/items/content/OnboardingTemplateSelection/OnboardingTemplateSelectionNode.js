import { useEffect, useState } from 'react';
import FormFill from 'components/FormElements/FormFill/FormFill';
import * as Styles from './OnboardingTemplateSelection.styles';
import { getTemplatePreview } from 'apiHelper/ApiHandlers/CNAPI';
import FieldsLoadingSkelton from 'views/Node/nodeDetails/items/FieldsLoadingSkelton';
// import useWindow from 'hooks/useWindowContext';
import EmptyState from 'components/EmptyState/EmptyState';

const OnboardingTemplateSelectionNode = ({ activeTemplate }) => {
  // const { RVDic } = useWindow();
  const [templateNodeElements, setTemplateNodeElements] = useState(false);

  //TODO update RVDic i18n
  //! RVDic i18n localization
  const RVDicِNothingToDisplayTemplate = 'این تمپلیت فیلد قابل نمایشی ندارد!';

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
          <>
            {templateNodeElements.Elements.length ? (
              <FormFill data={templateNodeElements} editable />
            ) : (
              <Styles.OnboardingTemplateSelectionNodeEmptyContainer>
                <div>
                  <EmptyState loop />
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
