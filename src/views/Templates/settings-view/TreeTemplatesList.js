import { useHistory } from 'react-router-dom';
import * as Styled from './TemplatesSettings.styles';
import TemplateCard from 'components/TemplatesGallery/TemplateCard';
import NewClass from './CreateNewClass';
import { getURL } from 'helpers/helpers';

const ClassTemplatesList = ({ itemProps }) => {
  const { item, provided } = itemProps;
  const history = useHistory();

  const handleCardClick = (template) => {
    const { NodeTypeID } = template || {};
    const templateURL = getURL('Classes', { NodeTypeID });
    history.push(templateURL);
  };

  return (
    <Styled.ClassTemplatesContainer ref={provided.innerRef}>
      {item?.data?.templates?.map((template, key) => (
        <TemplateCard
          containerClass="class-template-card"
          mode="grid"
          key={key}
          template={template}
          onClickCard={() => handleCardClick(template)}
        />
      ))}
      {item?.id !== 'not-categorized-children' && (
        <NewClass parent={item?.data?.parent} />
      )}
    </Styled.ClassTemplatesContainer>
  );
};

export default ClassTemplatesList;
