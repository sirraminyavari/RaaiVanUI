export interface IStickerProps {
  align: 'bottom' | 'top' | 'left' | 'right';
  fit: boolean;
  leftOffset: number;
  topOffset: number;
  onResposition: (props: any) => void;
}

export declare const Sticker: FC<IStickerProps>;
