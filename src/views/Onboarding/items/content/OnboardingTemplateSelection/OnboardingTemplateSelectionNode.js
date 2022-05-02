import { useEffect, useState } from 'react';
import FormFill from 'components/FormElements/FormFill/FormFill';
import * as Styles from './OnboardingTemplateSelection.styles';
// import {
//   getFormElements,
//   getFormInstance,
//   initializeOwnerFormInstance,
// } from 'apiHelper/ApiHandlers/FGAPI';
// import APIHandler from 'apiHelper/APIHandler';
import { getTemplatePreview } from 'apiHelper/ApiHandlers/CNApi';

// const ownerForm = new APIHandler('FGAPI', 'GetOwnerForm');
//formFill
//1 - getFormElements => ownerID=NodeTypeID

// 2- getOwnerForm(ownerID=NodeTypeID) =>  getFormElements(formID)

const OnboardingTemplateSelectionNode = ({ activeTemplate }) => {
  const [templateNodeElements, setTemplateNodeElements] = useState();

  // const getOwnerForm = async (NodeTypeID) => {
  //   const getFormFormOwner = new Promise((res) => {
  //     ownerForm?.fetch({ OwnerID: NodeTypeID }, (result) => res(result));
  //   });
  //   return getFormFormOwner;
  // };

  useEffect(() => {
    (async () => {
      // const ownerFormRes = await getOwnerForm(activeTemplate?.NodeTypeID);
      // const formElements = await getFormElements({
      //   OwnerID: activeTemplate?.NodeTypeID,
      // });
      const formElements = await getTemplatePreview({
        // NodeTypeID: activeTemplate?.NodeTypeID,
      });
      setTemplateNodeElements(formElements);
      console.warn({ formElements, activeTemplate });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTemplate?.NodeTypeID]);

  return (
    <div>
      <Styles.OnboardingTemplateSelectionNodeContainer>
        {templateNodeElements && (
          <FormFill data={templateNodeElements} editable />
        )}
      </Styles.OnboardingTemplateSelectionNodeContainer>
    </div>
  );
};

OnboardingTemplateSelectionNode.displayName = 'OnboardingTemplateSelectionNode';

export default OnboardingTemplateSelectionNode;
