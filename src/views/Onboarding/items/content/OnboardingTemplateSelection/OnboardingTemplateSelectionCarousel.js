import PanelButton from 'components/Buttons/PanelButton';
import { decodeBase64 } from 'helpers/helpers';
import { useOnboardingTeamContent } from '../../others/OnboardingTeam.context';
import Carousel from 'components/Carousel/Carousel';

const OnboardingTemplateSelectionCarousel = ({
  templates,
  activateTemplate,
  activeTemplate,
}) => {
  const { selectedTemplates } = useOnboardingTeamContent();

  return (
    <Carousel>
      {(templates || []).map((template, idx) => {
        const { IconURL, TypeName, NodeTypeID } = template;
        return (
          <PanelButton
            grayScale
            active={
              NodeTypeID === activeTemplate?.NodeTypeID ||
              Object.keys(selectedTemplates).includes(NodeTypeID)
            }
            checked={Object.keys(selectedTemplates).includes(NodeTypeID)}
            onClick={() => {
              activateTemplate(template);
            }}
          >
            <img src={IconURL} width="70" alt="" />
            {decodeBase64(TypeName)}
          </PanelButton>
        );
      })}
    </Carousel>
  );
};

OnboardingTemplateSelectionCarousel.displayName =
  'OnboardingTemplateSelectionCarousel';

export default OnboardingTemplateSelectionCarousel;
