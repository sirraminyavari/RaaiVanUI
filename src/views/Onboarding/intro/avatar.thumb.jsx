import './avatar.thumb.css';
import RemoveIcon from './remove.icon';
import { useContext, useState } from 'react';
import { StepperContext } from '../context/stepper.context';

const AvatarThumb = ({ url }) => {
  const { dispatch } = useContext(StepperContext);
  const [showRemove, setShowRemove] = useState(false);

  return (
    <div
      className="thumbnail"
      onMouseEnter={() => setShowRemove(true)}
      onMouseLeave={() => setShowRemove(false)}>
      <img src={url} />

      <div
        className={`remove ${!showRemove ? 'hide' : ''}`}
        onClick={() => dispatch({ type: 'SET_AVATAR', avatar: undefined })}>
        <RemoveIcon color={'#ef5350'}></RemoveIcon>
      </div>
    </div>
  );
};
export default AvatarThumb;
