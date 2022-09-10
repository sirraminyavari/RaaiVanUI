import Button from 'components/Buttons/Button';
import useWindow from 'hooks/useWindowContext';

/**
 * Renders an Outlined Return button
 */
const ReturnButton = ({ onClick, ...restProps }) => {
  const { RVDic } = useWindow();
  const RVDicReturn = RVDic.Return;
  return (
    <Button onClick={onClick} {...restProps} type="negative-secondary-o">
      {RVDicReturn}
    </Button>
  );
};

export default ReturnButton;
