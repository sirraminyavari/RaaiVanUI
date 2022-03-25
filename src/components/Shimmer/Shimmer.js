import styled from 'styled-components';

/**
 * @component
 * @param [props.children]
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
const Shimmer = ({ children, ...restProps }) => {
  return <ShimmerElement {...restProps}>{children}</ShimmerElement>;
};
export default Shimmer;

const ShimmerElement = styled.div`
  .shimmerEffect > * {
    border-color: transparent !important;
    color: transparent !important;
    animation: shimmer 2s infinite linear;
    background: linear-gradient(to right, #eff1f3 4%, #e2e2e2 25%, #eff1f3 36%);
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
