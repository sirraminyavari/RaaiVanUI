import { useState } from 'react';
import Input from 'components/Inputs/Input';
import * as Styled from 'views/Profile/Profile.styles';
import Button from 'components/Buttons/Button';
import useWindow from 'hooks/useWindowContext';
import Timer from './Timer';

const VerificationCodeHandle = (props) => {
  const { codeCount, countDown, onSendCode, onTimeout } = props;
  const { RVDic } = useWindow();
  const inputsArray = [...Array(codeCount).keys()];
  const defaultValues = inputsArray.reduce((acc, input) => {
    return { ...acc, [`input-${input + 1}`]: '' };
  }, {});
  const [inputValues, setInputValues] = useState(defaultValues);

  const isButtonActive =
    Object.values(inputValues).filter(Boolean).length === codeCount;

  const handleInputForm = (e) => {
    //! Check for data that was inputted and if there is a next input, focus it.
    const input = e.target;
    setInputValues((v) => ({ ...v, [input.name]: input.value }));
    const nextInput =
      input?.parentElement?.parentElement?.nextElementSibling?.firstElementChild
        ?.firstElementChild;
    if (nextInput && input.value) {
      nextInput.focus();
      if (nextInput.value) {
        nextInput.select();
      }
    }
  };

  const handleInputChange = () => {};

  const handleSendCode = () => {
    onSendCode && onSendCode();
  };

  const handlePaste = (e) => {
    const input = e.target;
    const paste = e.clipboardData.getData('text');
    const pasteList = paste.split('');

    //! Set value for each input.
    if (input.name === 'input-1') {
      inputsArray.forEach((input) => {
        setInputValues((v) => ({
          ...v,
          [`input-${input + 1}`]: pasteList[input] || '',
        }));
      });
    }
  };

  return (
    <Styled.VerificationCodeContainer>
      <span>کد تایید ارسال شده را وارد کنید:</span>
      <Styled.VerificationForm onInput={handleInputForm}>
        <Styled.VerificationInputsContainer>
          {inputsArray?.map((key) => (
            <Styled.VerificationInputWrapper key={key}>
              <Input
                onPaste={handlePaste}
                value={inputValues[`input-${key + 1}`]}
                onChange={handleInputChange}
                type="text"
                name={`input-${key + 1}`}
                maxLength="1"
                style={{
                  maxWidth: '2.2rem',
                  textAlign: 'center',
                  direction: 'ltr',
                }}
              />
            </Styled.VerificationInputWrapper>
          ))}
        </Styled.VerificationInputsContainer>
      </Styled.VerificationForm>
      <Styled.VerificationFooterWrapper>
        <Button
          onClick={handleSendCode}
          disable={!isButtonActive}
          style={{ width: '5rem', height: '2rem' }}>
          {RVDic.Save}
        </Button>
        <Timer onTimeEnd={onTimeout} seconds={countDown} />
      </Styled.VerificationFooterWrapper>
    </Styled.VerificationCodeContainer>
  );
};

VerificationCodeHandle.defaultProps = {
  codeCount: 5,
};

export default VerificationCodeHandle;
