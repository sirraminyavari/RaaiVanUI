import React, { useEffect, useRef, useState } from 'react';
import { debounceTime, Subject } from 'rxjs';
import { tap, distinctUntilChanged } from 'rxjs/operators';
import { createSubject } from 'helpers/helpers';
import { RVColorProp, RVVariantProp, TextInput } from '@cliqmind/rv-components';

/**
 * @description simple input with delay time extension
 * @delayTime time to delay onChange event in millisecond, the default value is 0
 */
const RxInput = React.forwardRef(
  ({ value, onChange, delayTime = 0, ...props }, forwardedRef) => {
    const [inputValue, setInputValue] = useState(value);
    const observableRef = useRef(null);

    useEffect(() => {
      /**
       * @description handle input change as stream of data
       * @type {Subject<T>}
       */
      observableRef.current = createSubject();
      const input$ = observableRef.current;
      input$
        .pipe(
          debounceTime(delayTime),
          distinctUntilChanged(),
          tap((x) => {
            if (onChange) {
              onChange(x);
            }
          })
        )
        .subscribe();

      return () => {
        input$?.unsubscribe();
      };
    }, []);

    const handleInputChange = (e) => {
      setInputValue(e.target.value);
      observableRef.current.next(e);
    };

    return (
      <TextInput
        value={inputValue}
        onChange={(e) => handleInputChange(e)}
        ref={forwardedRef}
        variant={RVVariantProp.outline}
        color={RVColorProp.distant}
        IconPosition="trailing"
        {...props}
      />
    );
  }
);
RxInput.displayName = 'RxInput';
export default RxInput;
