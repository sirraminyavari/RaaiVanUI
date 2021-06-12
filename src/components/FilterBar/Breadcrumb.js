import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createSelector } from 'reselect';
import ChevronIcon from 'components/Icons/ChevronIcons/Chevron';
import { BreadcrumbContainer, BreadcrumbItem } from './FilterBar.style';
import { decodeBase64 } from 'helpers/helpers';
import useWindow from 'hooks/useWindowContext';

const selectedTeam = createSelector(
  (state) => state.theme,
  (theme) => theme.selectedTeam
);

const Breadcrumb = (props) => {
  const { hierarchy } = props;
  const { RV_RevFloat, RV_Float } = useWindow();
  const selectedApp = useSelector(selectedTeam);

  return (
    <BreadcrumbContainer dir={RV_Float}>
      <BreadcrumbItem as={Link} to="/classes">
        {selectedApp.name}
        {!!hierarchy?.length && (
          <ChevronIcon
            style={{ verticalAlign: 'middle' }}
            size={18}
            dir={RV_RevFloat}
          />
        )}
      </BreadcrumbItem>
      {hierarchy?.map((item, index, self) => {
        const { NodeTypeID: id, TypeName: name } = item;
        return (
          <BreadcrumbItem as={Link} to={`/classes/${id}`}>
            {decodeBase64(name)}
            {self.length - 1 !== index && (
              <ChevronIcon
                style={{ verticalAlign: 'middle' }}
                size={18}
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
