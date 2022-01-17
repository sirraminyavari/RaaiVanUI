/**
 * A component that catch JavaScript errors anywhere in their child component tree,
 * ...log those errors, and display a fallback UI.
 */
import Heading from 'components/Heading/Heading';
import { Component } from 'react';
import ErrorState from 'components/ErrorState/ErrorState';
import { Container } from './ErrorBoundry.style';

/**
 * Creates error boundary
 * @class
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.RVGlobal = window.RVGlobal;
    this.state = { errorFound: false, error: null };
  }
  componentDidCatch(error, info) {
    // simple hack to prevent react components unmount when an error occurs
    this.setState({
      errorFound: true,
    });

    if (this.RVGlobal.IsDev) {
      this.setState({ errorFound: false });
      alert(`Error Boundary: ${error.message}`, {
        autoClose: 60000,
      });
    }
    console.error('info: ', info);
    console.error('error: ', error.message);
  }

  /**
   * Get error and updates state.
   * @param {*} error
   * @returns {Object} -The catched error.
   */
  // static getDerivedStateFromError(error) {
  //   return { errorFound: true, error };
  // }

  /**
   * @returns -An element that shows error message to user in nice manner.
   */
  render() {
    if (this.state.errorFound) {
      return (
        <Container>
          <ErrorState />
          <Heading type={'H1'}>
            {'متاسفانه در حال حاضر امکان دسترسی به صفحه موردنظر وجود ندارد.'}
          </Heading>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
