/**
 * Renders security modal content for node page side.
 */
import CMConfidentialitySetting from 'views/Templates/TemplateSinglePage/items/TemplateGeneralSetting/CMConfidetialitySetting/CMConfidentialitySetting';
import { PRIVACY_OBJECT_TYPE } from 'apiHelper/ApiHandlers/privacyApi';
import { TemplateProvider } from 'views/Templates/TemplateSinglePage/TemplateProvider';

//TODO needs immanent revision ...
const Security = ({ NodeTypeID }) => {
  return (
    <>
      <TemplateProvider service={{ NodeTypeID }}>
        <CMConfidentialitySetting type={PRIVACY_OBJECT_TYPE?.NodeType} />
      </TemplateProvider>
    </>
  );
};

export default Security;
