import * as Styled from './TemplatesGallery.styles';
import Badge from 'components/Badge/Badge';
import { decodeBase64 } from 'helpers/helpers';
import ToolTip from 'components/Tooltip/react-tooltip/Tooltip';
import TooltipContent from './CardTooltipContent';

const TemplateCard = ({
  template,
  mode,
  containerClass,
  onClickCard,
  isTransition,
}) => {
  const [firstTag, ...extraTags] = template?.Tags;

  const hasTags = !!template?.Tags?.length;
  const extraTagsLength = extraTags.length;

  const handleClickCard = () => {
    if (!isTransition) {
      onClickCard && onClickCard(template);
    }
  };

  return (
    <Styled.TemplateCardContainer
      className={containerClass}
      mode={mode}
      onClick={handleClickCard}>
      {hasTags && (
        <ToolTip
          multiline
          tipId={template?.NodeTypeID}
          effect="solid"
          place="top"
          type="light"
          clickable
          delayHide={300}
          arrowColor="transparent"
          className="card-tags-tooltip"
          disable={!extraTagsLength}
          renderContent={() => <TooltipContent extraTags={extraTags} />}>
          <Styled.CardBadgeContainer>
            <Styled.CardTagTitle>
              {decodeBase64(firstTag?.Name)}
            </Styled.CardTagTitle>
            {!!extraTagsLength && (
              <Badge
                className="more-tags-badge"
                showText={`${extraTagsLength}+`}
              />
            )}
          </Styled.CardBadgeContainer>
        </ToolTip>
      )}
      <div>
        <img width={45} src={template?.IconURL} alt="template-logo" />
      </div>
      <Styled.TemplateCardTitle>
        {decodeBase64(template?.TypeName)}
      </Styled.TemplateCardTitle>
      <Styled.TemplateCardExcerpt>
        {template?.Description || 'توضیحات مربوط به قالب اینجا قرار می گیرد'}
      </Styled.TemplateCardExcerpt>
    </Styled.TemplateCardContainer>
  );
};

export default TemplateCard;
