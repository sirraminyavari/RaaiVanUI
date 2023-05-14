import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { debounceTime, Subject } from 'rxjs';
import { tap, distinctUntilChanged } from 'rxjs/operators';
import { createSubject } from 'helpers/helpers';
import {
  RVColorProp,
  RVTextInput,
  RVVariantProp,
  TextInput,
} from '@cliqmind/rv-components';

export interface RxInputType extends RVTextInput {
  delayTime?: number;
}
/**
 * @description simple input with delay time extension
 * @delayTime time to delay onChange event in millisecond, the default value is 0
 */
const RxInput = React.forwardRef<HTMLInputElement, RxInputType>(
  ({ value, onChange, delayTime = 0, ...props }, forwardedRef) => {
    const [inputValue, setInputValue] = useState(value);
    const observableRef =
      useRef<Subject<ChangeEvent<HTMLInputElement | HTMLTextAreaElement>>>(
        null
      );

    useEffect(() => {
      /**
       * @description handle input change as stream of data
       */
      //@ts-expect-error
      observableRef.current = createSubject();
      if (!observableRef.current) return;
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
    }, [delayTime, onChange]);

    const handleInputChange: RxInputType['onChange'] = (e) => {
      setInputValue(e.target.value);
      observableRef.current?.next(e);
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
