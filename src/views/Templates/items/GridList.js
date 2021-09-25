import { useHistory } from 'react-router-dom';
import * as Styled from '../settings-view/TemplatesSettings.styles';
import TemplateCard from 'components/TemplatesGallery/TemplateCard';
import { getURL } from 'helpers/helpers';

const GridList = (props) => {
  const { templates, isArchive, onRestore, ...rest } = props;
  const history = useHistory();

  const handleCardClick = (template) => {
    if (!!isArchive) return;
    const { NodeTypeID } = template || {};
    const templateURL = getURL('Classes', { NodeTypeID });
    history.push(templateURL);
  };

  return (
    <Styled.ClassTemplatesContainer {...rest}>
      {templates?.map((template, key) => (
        <TemplateCard
          containerClass="class-template-card"
          mode="grid"
          key={key}
          template={template}
          onClickCard={handleCardClick}
          isArchive={!!isArchive}
          onRestore={onRestore}
        />
      ))}
    </Styled.ClassTemplatesContainer>
  );
};

export default GridList;
