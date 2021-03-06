/**
 * Creates a SubjectItem urgently
 */
import APIHandler from 'apiHelper/APIHandler';
import Button from 'components/Buttons/Button';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import { CV_RED_SOFT } from 'constant/CssVariables';
import { decode, encode } from 'js-base64';
import React, { useEffect, useRef, useState } from 'react';
import {
  ButtonContainer,
  CustomInput,
  UrgentInput,
  UrgentButtonCancel,
  UrgentIconCancel,
} from '../AdvancedSearch.style';

const { RVDic } = window;

const addNode = new APIHandler('CNAPI', 'AddNode');
/**
 *
 * @param {String} nodeTypeId - nodeTypeId of a SubjectItem that will be created.
 * @param {Object} hierarchy - for accessing the Class Icon we need it here.
 * @param {Boolean} isVisible - makes UrgenCreate visible
 * @param {Callback} onDismiss - makes 'UrgenCreate' invisible
 * @param {CallBack} onForceFetch - forces NodeList to fetch again for new changes.
 * @param {any} dataFetched  - prevents the user inputting till fetching be completed.
 * @returns
 */
const UrgentCreateDesktop = ({
  nodeTypeId,
  hierarchy,
  isVisible,
  onDismiss,
  onForceFetch,
  dataFetched,
  nodeType,
}) => {
  // user inputs for creating urgent subject item.
  const [urgentInput, setUrgentInput] = useState('');
  // If True, means user can't do anything till result comes.
  const [isFetching, setIsFetching] = useState(false);
  // If True, means user can't do anything till result comes.(in creating Continuously)
  const [isFetchingContinually, setIsFetchingContinually] = useState(false);

  const inputRef = useRef();

  // Focuses the input when component mounted.
  useEffect(() => {
    if (isVisible || dataFetched !== null) {
      inputRef?.current?.focus();
    }
  }, [isVisible, dataFetched]);

  // By clicking 'create' will fire
  const onCreateUrgent = (continueToCreate = false) => {
    continueToCreate ? setIsFetchingContinually(true) : setIsFetching(true);
    addNode?.fetch(
      { NodeTypeID: nodeTypeId, Name: encode(urgentInput) },
      (response) => {
        continueToCreate
          ? setIsFetchingContinually(false)
          : setIsFetching(false);
        !continueToCreate && onDismiss();
        setUrgentInput('');
        onForceFetch();
      }
    );
  };
  // when the user  is inputting some thing will fire
  const onInput = (e) => {
    setUrgentInput(e?.target?.value);
  };
  // By pressing the enter button will fire
  const onKeyUp = (e) => {
    if (e?.which === 13) {
      onCreateUrgent(true);
    } //13: enter, 17: ctrl
  };

  return (
    <UrgentInput
      isVisible={isVisible}
      className={'rv-border-default rv-border-radius-half'}>
      <div style={{ width: '7.5rem' }}>
        <img
          style={{ height: '4rem', aspectRatio: 1 }}
          src={nodeType?.IconURL}
          alt={''}
        />
      </div>
      <CustomInput
        className={'rv-border-white'}
        value={urgentInput}
        onChange={onInput}
        ref={inputRef}
        onKeyUp={onKeyUp}
        disabled={dataFetched === null}
        placeholder={
          RVDic.Title +
          ' ' +
          RVDic?.NewN?.replace(
            '[n]',
            hierarchy && hierarchy?.length > 0
              ? decode(hierarchy[0]?.TypeName)
              : ''
          )
        }
      />

      <ButtonContainer>
        <Button
          disable={
            isFetching || isFetchingContinually || urgentInput?.length === 0
          }
          $circleEdges={true}
          style={{
            ...urgentButton,
            cursor:
              !isFetching ||
              !isFetchingContinually ||
              (!urgentInput?.length !== 0 && 'pointer'),
          }}
          loading={isFetching}
          onClick={() => onCreateUrgent()}
          type={'primary'}>
          {RVDic?.Save}
        </Button>

        <Button
          disable={
            isFetching || isFetchingContinually || urgentInput.length === 0
          }
          $circleEdges={true}
          style={{
            ...urgentButton,
            cursor:
              !isFetching ||
              !isFetchingContinually ||
              (!urgentInput?.length !== 0 && 'pointer'),
          }}
          loading={isFetchingContinually}
          onClick={() => onCreateUrgent(true)}
          type={'primary-o'}>
          {RVDic?.Save + ' ' + RVDic?.And + ' ' + RVDic?.Next}
        </Button>
        <UrgentButtonCancel
          style={cancelButton}
          $circleEdges={true}
          type={'primary-o'}>
          <UrgentIconCancel
            onClick={onDismiss}
            $circleEdges={true}
            style={urgentCancelIcon}></UrgentIconCancel>
        </UrgentButtonCancel>
      </ButtonContainer>
    </UrgentInput>
  );
};

export default UrgentCreateDesktop;

const urgentCancelIcon = {
  padding: '0.5rem',
  borderRadius: '10rem',
  fontSize: '1rem',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
};
const cancelButton = {
  margin: '0 0.5rem 0 0.5rem',
};
const urgentButton = {
  padding: '0.5rem 1rem 0.5rem 1rem',
  margin: '0 0.5rem 0 0.5rem',
};
