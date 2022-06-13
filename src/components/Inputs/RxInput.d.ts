import React, { forwardRef } from 'react';
import { SiJenkinsx } from 'react-icons/si';
/**
 *
 */
export interface IRxInput extends HTMLInputElement {
  delayTime: number;
}

// export function RxInput(
//   render: React.ForwardRefRenderFunction<HTMLInputElement, IRxInput>
// ): React.ForwardRefExoticComponent<React.RefAttributes<any>>;
export declare const RxInput = (props: IRxInput) => JSX.Element;
