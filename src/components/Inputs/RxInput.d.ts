import React, { FC } from 'react';
/**
 *
 */
export interface IRxInputProps {
  delayTime: number;
  placeholder: string;
  value: string;
  onChange: (e?: any) => void;
}

declare const RxInput: FC<IRxInputProps>;
export default RxInput;
