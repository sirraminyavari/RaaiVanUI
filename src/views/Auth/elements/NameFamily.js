/**
 * A component for entering name & family name
 */
import AnimatedInput from 'components/Inputs/AnimatedInput';
import { SIGN_UP_EMAIL, SIGN_UP_PASSWORD } from 'const/LoginRoutes';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import setFamilyAction from 'store/actions/auth/setFamilyAction';
import setNameAction from 'store/actions/auth/setNameAction';
import styled from 'styled-components';
import { UpToDownAnimate } from './Animate.style';

const { RVDic, GlobalUtilities } = window;

const NameFamily = () => {
  const dispatch = useDispatch();

  // We use ref to pass component dimension to 'UpToDownAnimate'
  const ref = useRef();

  // If component is invisible, display should be 'none' to 'tab button' works correctly
  const [display, setDisply] = useState('none');

  const { currentRoute, name, nameError, family, familyError } = useSelector(
    (state) => ({
      currentRoute: state.auth.currentRoute,
      family: state.auth.family,
      familyError: state.auth.familyError,
      name: state.auth.name,
      nameError: state.auth.nameError,
    })
  );

  /**
   * According to 'currentRoute'
   * this function decides to return true or false.
   */
  const isVisible = () => {
    switch (currentRoute) {
      case SIGN_UP_EMAIL:
        return true;
      default:
        return false;
    }
  };

  //Listens to 'isVisible()' changes, once the 'isVisible()' being FALSE,
  //display will be 'none' with 1000ms delay with this target to finishing all screen animations.
  //Once the 'isVisible()' being TRUE,
  //Instantly 'display' will be 'flex'
  useEffect(() => {
    if (!isVisible()) {
      setTimeout(() => {
        setDisply('none');
      }, 1000);
    } else {
      setDisply('flex');
    }
  }, [isVisible()]);

  /**
   * Synchronously set user inputted value to Redux state
   * @param {String} value - inputted user name
   */
  const onNameChanged = (value) => {
    dispatch(setNameAction(value));
  };
  /**
   * Synchronously set user inputted value to Redux state
   * @param {String} value - inputted user family
   */
  const onFamilyChanged = (value) => {
    dispatch(setFamilyAction(value));
  };

  return (
    <UpToDownAnimate
      ref={ref}
      dimension={ref?.current?.getBoundingClientRect()}
      isVisible={isVisible()}>
      <Container>
        <AnimatedInput
          onChange={onNameChanged}
          value={name}
          placeholder={RVDic.Name}
          style={{ marginLeft: '0.5rem', display: `${display}` }}
          error={nameError}
          shake={!nameError ? false : GlobalUtilities.random()}
        />
        <AnimatedInput
          onChange={onFamilyChanged}
          value={family}
          placeholder={RVDic.LastName}
          style={{ marginRight: '0.5rem', display: `${display}` }}
          error={familyError}
          shake={!familyError ? false : GlobalUtilities.random()}
        />
      </Container>
    </UpToDownAnimate>
  );
};
export default NameFamily;
const Container = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  margin-top: 1.5rem;
`;
