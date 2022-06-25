import { useSelector } from 'react-redux';
import CaretIcon from 'components/Icons/CaretIcons/Caret';
import useWindow from 'hooks/useWindowContext';
import { INTRO_ONBOARD } from 'constant/constants';
import { selectOnboarding } from 'store/slice/onboarding/selectors';

const ItemIcon = (item, onExpand, onCollapse) => {
  const { RV_RevFloat } = useWindow();

  const { name: onboardingName } = useSelector(selectOnboarding);

  //! Check if onboarding is activated on 'intro' mode.
  const isIntroOnboarding =
    !!onboardingName && onboardingName === INTRO_ONBOARD;

  //! Expand sidebar item on click.
  const handleOnExpand = () => {
    if (isIntroOnboarding) return;
    onExpand && onExpand(item.id);
  };

  //! Collapse sidebar item on click.
  const handleOnCollapse = () => {
    if (isIntroOnboarding) return;
    onCollapse && onCollapse(item.id);
  };

  if (item.hasChildren || item.isCategory) {
    return item.isExpanded ? (
      <CaretIcon size={20} onClick={handleOnCollapse} dir="down" />
    ) : (
      <CaretIcon size={20} onClick={handleOnExpand} dir={RV_RevFloat} />
    );
  }
  return null;
};

export default ItemIcon;
