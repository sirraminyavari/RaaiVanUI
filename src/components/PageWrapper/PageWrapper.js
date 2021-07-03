/**
 * Renders a component that will wrap another component
 * and will change page head tag content.
 */
import { forwardRef, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
/**
 * @typedef PropType
 * @property {RefType} ref
 * @property {string} title -The page title.
 */

/**
 * @description Renders a page wrapper.
 * @type {React.FC<PropType>}
 */
const PageWrapper = forwardRef(({ children, title, ...rest }, ref) => {
  const docTitleRef = useRef(document.title);

  useEffect(() => {
    //!Clean up
    return () => {
      document.title = docTitleRef.current;
    };
  }, []);

  return (
    <div ref={ref} {...rest}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {children}
    </div>
  );
});

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};

PageWrapper.defaultProps = {
  title: '',
};

PageWrapper.displayName = 'PageWrapperComponent';

export default PageWrapper;
