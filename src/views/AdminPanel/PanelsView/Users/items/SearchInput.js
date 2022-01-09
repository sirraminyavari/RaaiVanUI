import React, { useEffect, useRef, useState } from 'react';
import { debounceTime, Subject } from 'rxjs';
import { tap, distinctUntilChanged } from 'rxjs/operators';
import { createSubject } from 'helpers/helpers';
const SearchInput = React.forwardRef(
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
SearchInput.displayName = 'SearchInput';
export default SearchInput;
