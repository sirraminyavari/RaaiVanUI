import { Link } from 'react-router-dom';
import CaretIcon from 'components/Icons/CaretIcons/Caret';
import { BreadcrumbContainer, BreadcrumbItem } from './Breadcrumb.styles';
import useWindow from 'hooks/useWindowContext';

const Breadcrumb = (props) => {
  const { items } = props;
  const { RV_RevFloat, RV_Float } = useWindow();

  return (
    <BreadcrumbContainer dir={RV_Float}>
      {items?.map((item, index, self) => {
        const { id, title, linkTo } = item;
        return (
          <BreadcrumbItem key={id} as={Link} to={linkTo}>
            {title}
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
