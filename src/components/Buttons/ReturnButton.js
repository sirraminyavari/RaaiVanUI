import Button from 'components/Buttons/Button';
import useWindow from 'hooks/useWindowContext';

/**
 * Renders an Outlined Return button
 * @param {Boolean} disabled - If True, onClick will not fire
 * @callback onClick - Fires, if user clicks the button.
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
