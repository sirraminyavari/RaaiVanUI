import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import * as Styled from './Templates-view.styles';
import ActionBar from './TemplatesActionBar';
import ClassList from './ClassList';

const TemplatesView = () => {
  const breadcrumbItems = [
    { id: 1, title: 'تنظیمات تیم', linkTo: '#' },
    {
      id: 2,
      title: 'تنظیمات کلاس ها',
      linkTo: '#',
    },
  ];

  return (
    <Styled.TemplatesViewContainer>
      <Breadcrumb className="templates-breadcrumb" items={breadcrumbItems} />
      <Styled.TemplatesViewTitle>تنظیمات کلاس ها</Styled.TemplatesViewTitle>
      <ActionBar />
      <ClassList />
    </Styled.TemplatesViewContainer>
  );
};

export default TemplatesView;
