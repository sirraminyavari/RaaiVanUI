import { useState, useEffect } from 'react';
import RadioSelect from 'components/Inputs/radio/Radio';
import * as Styled from 'views/Profile/Profile.styles';

const TwoFactorOptions = ({ options, enabled }) => {
  const [selected, setSelected] = useState('');

  const handleOnSelect = (radioValue) => {
    setSelected(radioValue);
  };

  useEffect(() => {
    if (!enabled) {
      setSelected('');
      return;
    }
  }, [enabled]);

  return (
    <Styled.TwoFactorOptionsWrapper enabled={enabled}>
      <div style={{ marginBottom: '2rem' }}>
        <span>کد تایید ورود دومرحله‌ای از چه طریقی برای شما ارسال شود</span>
      </div>
      <RadioSelect
        options={options}
        onSelect={handleOnSelect}
        selected={selected}
        optionStyle={{ margin: '1rem 0 0 0' }}
        selectedStyle={enabled && 'color: #2B7BE4;'}
        labelStyle={{ cursor: !enabled && 'default' }}
        disabled={!enabled}
      />
    </Styled.TwoFactorOptionsWrapper>
  );
};

export default TwoFactorOptions;
