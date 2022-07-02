import { css } from 'styled-components';
import { CV_DISTANT, CV_GRAY_DARK } from './CssVariables';

const FLEX_COLUMN = css`
  display: flex;
  flex-direction: column;
`;

/**
 * @description 'Flex'
 * @Direction 'C'olumn
 * @Align flex-'S'tart
 * @Justify 'C'enter
 */
export const FLEX_CSC = css`
  ${FLEX_COLUMN}
  align-items: flex-start;
  justify-content: center;
`;

/**
 * @description 'Flex'
 * @Direction 'C'olumn
 * @Align flex-'E'nd
 * @Justify 'C'enter
 */
export const FLEX_CEC = css`
  ${FLEX_COLUMN}
  align-items: flex-end;
  justify-content: center;
`;

/**
 * @description 'Flex'
 * @Direction 'C'olumn
 * @Align 'C'enter
 * @Justify 'C'enter
 */
export const FLEX_CCC = css`
  ${FLEX_COLUMN}
  align-items: center;
  justify-content: center;
`;

/**
 * @description 'Flex'
 * @Direction 'C'olumn
 * @Align 'C'enter
 * @Justify space-'B'etween
 */
export const FLEX_CCB = css`
  ${FLEX_COLUMN}
  align-items: center;
  justify-content: space-between;
`;

/**
 * @description 'Flex'
 * @Direction 'C'olumn
 * @Align 'C'enter
 * @Justify space-'A'round
 */
export const FLEX_CCA = css`
  ${FLEX_COLUMN}
  align-items: center;
  justify-content: space-around;
`;

/**
 * @description 'Flex'
 * @Direction 'C'olumn
 * @Align flex-'S'tart
 * @Justify space-'A'round
 */
export const FLEX_CSA = css`
  ${FLEX_COLUMN}
  align-items: flex-start;
  justify-content: space-around;
`;

/**
 * @description 'Flex'
 * @Direction 'C'olumn
 * @Align flex-'S'tart
 * @Justify space-'B'etween
 */
export const FLEX_CSB = css`
  ${FLEX_COLUMN}
  align-items: flex-start;
  justify-content: space-between;
`;

/**
 * @description 'Flex'
 * @Direction 'R'ow
 * @Align 'C'enter
 * @Justify space-'A'round
 */
export const FLEX_RCA = css`
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

/**
 * @description 'Flex'
 * @Direction 'R'ow
 * @Align 'C'enter
 * @Justify 'C'enter
 */
export const FLEX_RCC = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * @description 'Flex'
 * @Direction 'R'ow
 * @Align flex-'S'tart
 * @Justify flex-'S'tart
 */
export const FLEX_RSS = css`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;

/**
 * @description 'Flex'
 * @Direction 'R'ow
 * @Align 'C'enter
 * @Justify flex-'S'tart
 */
export const FLEX_RCS = css`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

/**
 * @description 'Flex'
 * @Direction 'R'ow
 * @Align 'C'enter
 * @Justify flex-'E'nd
 */
export const FLEX_RCE = css`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

/**
 * @description 'Flex'
 * @Direction 'R'ow
 * @Align flex-'E'nd
 * @Justify space-'B'etween
 */
export const FLEX_REB = css`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

/**
 * @description 'Flex'
 * @Direction 'R'ow
 * @Align 'C'enter
 * @Justify space-'B'etween
 */
export const FLEX_RCB = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

/**
 * @description 'Flex'
 * @Direction 'R'ow
 * @Align flex-'S'tart
 * @Justify space-'B'etween
 */
export const FLEX_RSB = css`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

/**
 * @description 'Add scrollbar'
 * @Direction 'Horizontal'
 */
export const HorizontalScrollbar = css`
  scroll-behavior: smooth;

  /*! Show scrollbar for Firefox */
  scrollbar-height: thin;
  scrollbar-width: thin;

  /*! Show scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: block;
    height: 0.4rem;
    width: 0.4rem;
  }

  &::-webkit-scrollbar-track:hover {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${CV_DISTANT};
    border-radius: 0.5rem;

    :hover {
      // background-color: ${CV_GRAY_DARK};
    }
  }
`;

export const ViewContentCard = css`
  position: relative;
  box-shadow: 0.06rem 0.29rem 0.98rem #0000001f;
  border-radius: 0.625rem;
  padding: 4rem 1.5rem 1.5rem 1.5rem;
  background-color: var(--rv-gray-color-light);
  min-height: calc(100vh - 8rem);
`;

/**
 * @description use this style to automatically truncate text
 *** important *** if you are using this inside a flex box, make sure that you set a width for the parent element
 ***************** you can use this for parent: { flex: 1 1 auto; width: 0; } this works like a charm
 */
export const Ellipsis = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
