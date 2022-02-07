import React, { useEffect, useRef, useState } from 'react';
import { debounceTime, Subject } from 'rxjs';
import { tap, distinctUntilChanged } from 'rxjs/operators';
import { createSubject } from 'helpers/helpers';

const RxInput = React.forwardRef(
  ({ defaultValue, onChange, delayTime = 0, ...props }, forwardedRef) => {
    const [inputValue, setInputValue] = useState(defaultValue);
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
      setInputValue(e);
      observableRef.current.next(e);
    };

    return (
      <input
        value={inputValue}
        onChange={(e) => handleInputChange(e)}
        {...props}
        ref={forwardedRef}
      />
    );
  }
);
RxInput.displayName = 'RxInput';
export default RxInput;
