import styled from 'styled-components';

/**
 * @component
 * @param {React.ReactNode} [props.children]
 * @param {boolean} [props.darkMode] - Sets the color of shimmer effect to dark (more suitable for dark background colors)
 *
 * Shimmer component is basically a wrapping <div/> tag for shimmer effect styles
 *
 * ***Warning***: Shimmer component's nested elements with "shimmerEffect" className,
 * should not have more than ***ONE*** level of nested elements
 *
 * example:
 *
 * ```js
 * <Shimmer>
 *   <div className="shimmerEffect some-other-class">
 *     <h1>some long text</h1>
 *     <h2>some short text</h2>
 *   </div>
 * </Shimmer>
 * ```
 *
 */
const Shimmer = ({ children, darkMode = false, ...restProps }) => {
  return (
    <ShimmerElement {...restProps} darkMode={darkMode}>
      {children}
    </ShimmerElement>
  );
};
export default Shimmer;

const ShimmerElement = styled.div`
  .shimmerEffect > * {
    border-color: transparent !important;
    color: transparent !important;
    animation: shimmer 2s infinite linear;
    ${({ darkMode }) =>
      darkMode
        ? `
    background-image: linear-gradient(to right,rgb(255,255,255,20%) 4%,rgb(255,255,255,35%) 25%,rgb(255,255,255,20%) 36%);
    `
        : `
    background-image: linear-gradient(to right, #eff1f3 4%, #e2e2e2 25%, #eff1f3 36%);
    `}
    background-size: 1000px 100%;
    > * {
      visibility: hidden;
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
`;
