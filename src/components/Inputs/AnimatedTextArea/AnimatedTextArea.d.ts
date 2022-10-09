import React from 'react';

export interface IAnimatedTextAreaProps {
  label?: string;
  placeholder?: string;
  rows?: number;
  autoresize?: boolean;
  value?: string;
  onChange?: (props: any) => void;
}

declare const AnimatedTextArea: React.FC<IAnimatedTextAreaProps>;
export default AnimatedTextArea;
