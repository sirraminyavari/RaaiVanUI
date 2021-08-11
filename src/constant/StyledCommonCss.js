import { css } from 'styled-components';

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
 * @Align 'C'enter
 * @Justify space-'B'etween
 */
export const FLEX_RCB = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
