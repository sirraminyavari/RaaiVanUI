import * as Styled from './Templates-view.styles';
import TemplateCard from 'components/TemplatesGallery/TemplateCard';
import NewClass from './CreateNewClass';

const ClassTemplatesList = ({ itemProps }) => {
  const { item, provided } = itemProps;
  return (
    <Styled.ClassTemplatesContainer ref={provided.innerRef}>
      {item?.data?.templates?.map((template, key) => (
        <TemplateCard
          containerClass="class-template-card"
          mode="category"
          key={key}
          template={template}
        />
      ))}
      <NewClass />
    </Styled.ClassTemplatesContainer>
  );
};

export default ClassTemplatesList;
