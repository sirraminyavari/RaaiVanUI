import { Link } from 'react-router-dom';
import CaretIcon from 'components/Icons/CaretIcons/Caret';
import { BreadcrumbContainer, BreadcrumbItem } from './Breadcrumb.styles';
import useWindow from 'hooks/useWindowContext';
import Heading from 'components/Heading/Heading';

const Breadcrumb = (props) => {
  const { items, className } = props;
  const { RV_RevFloat, RV_Float, GlobalUtilities } = useWindow();

  return (
    <BreadcrumbContainer className={className} dir={RV_Float}>
      {items?.map((item, index, self) => {
        const { id, title, linkTo } = item;
        return (
          <BreadcrumbItem
            key={id || GlobalUtilities.random_str(10)}
            as={Link}
            to={linkTo}
          >
            <Heading type="h4">{title}</Heading>
            {self.length - 1 !== index && (
              <CaretIcon
                style={{ verticalAlign: 'middle', margin: '0 0.2rem' }}
                size={13}
                dir={RV_RevFloat}
              />
            )}
          </BreadcrumbItem>
        );
      })}
    </BreadcrumbContainer>
  );
};

export default Breadcrumb;
