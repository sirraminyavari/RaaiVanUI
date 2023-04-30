import {
  Breadcrumb,
  RVBreadcrumb,
  RVColorProp,
  RVSizeProp,
  RVVariantProp,
} from '@cliqmind/rv-components';
import SearchInput from 'components/Inputs/SearchInput';
import styles from './breadCrumbLayout.module.scss';

export interface BreadcrumbLayoutType extends RVBreadcrumb {
  searchInputPlaceholder?: string;
  hideSearchInput?: boolean;
}

const BreadcrumbLayout = ({
  children,
  searchInputPlaceholder,
  hideSearchInput,
  ...props
}: BreadcrumbLayoutType) => {
  return (
    <div className={styles.breadcrumbLayoutContainer}>
      <div className={styles.breadcrumbContainer}>
        <Breadcrumb
          size={RVSizeProp.small}
          variant={RVVariantProp.white}
          color={RVColorProp.grayDark}
          className={styles.breadcrumb}
          {...props}
        />
        {children}
      </div>
      {hideSearchInput ?? (
        <SearchInput
          delayTime={300}
          className={styles.breadcrumbSearchInput}
          placeholder={searchInputPlaceholder}
        />
      )}
    </div>
  );
};

export default BreadcrumbLayout;
