/**
 * A component that catch JavaScript errors anywhere in their child component tree,
 * ...log those errors, and display a fallback UI.
 */
import { Component } from 'react';

/**
 * Creates error boundary
 * @class
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * Get error and updates state.
   * @param {*} error
   * @returns {Object} -The catched error.
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * @returns -An element that shows error message to user in nice manner.
   */
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong!</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
