import { Link } from 'react-router-dom';
import ChevronIcon from 'components/Icons/ChevronIcons/Chevron';
import { BreadcrumbContainer, BreadcrumbItem } from './FilterBar.style';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';

const Breadcrumb = () => {
  const hierarchy = [
    {
      ID: '37b1cd1d-60d3-4b0a-afd1-d1823be4ba6c',
      Name: encodeBase64('تیم شاهین'),
    },
    {
      ID: '37b1cd1d-60d3-4b0a-afd1-d1823be4ba6c',
      Name: encodeBase64('بازاریابی'),
    },
    {
      ID: '37b1cd1d-60d3-4b0a-afd1-d1823be4ba6c',
      Name: encodeBase64('اسناد مارکتینگ'),
    },
  ];

  return (
    <BreadcrumbContainer>
      {hierarchy.map((item, index, self) => {
        return (
          <BreadcrumbItem as={Link} to={`/classes/${item.ID}`}>
            {decodeBase64(item.Name)}
            {self.length - 1 !== index && (
              <ChevronIcon
                style={{ verticalAlign: 'middle' }}
                size={18}
                dir="left"
              />
            )}
          </BreadcrumbItem>
        );
      })}
    </BreadcrumbContainer>
  );
};

export default Breadcrumb;
