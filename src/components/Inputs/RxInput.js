import React, { useEffect, useRef, useState } from 'react';
import { createSubject } from '../../helpers/helpers';
import { debounceTime } from 'rxjs';
import { distinctUntilChanged, tap } from 'rxjs/operators';

const RxInput = React.forwardRef(
  ({ value, onChange, delayTime = 0, ...props }, forwardedRef) => {
    const [inputValue, setInputValue] = useState(value);
    const observableRef = useRef(null);

    useEffect(() => {
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
      setInputValue(e?.target?.value);
      observableRef.current.next(e?.target?.value);
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
RxInput.displayName = 'SearchInput';
export default RxInput;
