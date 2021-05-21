import Button from 'components/Buttons/Button';
import Heading from 'components/Heading/Heading';
import React, { useEffect, useRef, useState } from 'react';

const SimpleListViewr = ({
  fetchMethod,
  renderItem,
  pageSize = 20,
  onEndReached,
}) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const container = useRef();
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, true);

    setIsFetching(true);

    fetchMethod(pageSize, 0, (data, total) => {
      console.log(data, 'simple list viewer', total);
      if (data) {
        setData(data);
        setTotal(total);
        setIsFetching(false);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  const fetchMore = () => {
    if (total > data.length) {
      if (data.length + pageSize < total) {
        setIsFetching(true);

        fetchMethod(pageSize, data.length, (newData, total) => {
          setData([...data, ...newData]);
          setIsFetching(false);
        });
      }
      // else {
      //   setIsFetching(true);

      //   fetchMethod(total - data.length, data.length, (newData, total) => {
      //     setIsFetching(false);
      //     setData([...data, ...newData]);
      //   });
      // }
    }
  };
  const handleScroll = (e) => {
    const lastScrollY = window.scrollY;
    const elementHeight = container.current?.clientHeight;
    console.log(lastScrollY, 'handle scroll', container.current?.clientHeight);

    if (elementHeight - lastScrollY < 500 && onEndReached) {
      onEndReached();
    }
    // if (!ticking) {
    //   window.requestAnimationFrame(() => {
    //     this.nav.current.style.top = `${lastScrollY}px`;
    //     ticking = false;
    //   });

    //   ticking = true;
    // }
  };

  return (
    <>
      {isFetching && data.length === 0 ? (
        <Heading type={'h4'}>{'درحال دریافت اطلاعات'}</Heading>
      ) : data && data.length > 0 && renderItem ? (
        <div ref={container} onScroll={handleScroll}>
          {data.map((x) => renderItem(x))}
        </div>
      ) : (
        <Heading type={'h4'}>{'داده ای برای نمایش وجود ندارد'}</Heading>
      )}
      {console.log(data.length, '****')}

      {data.length > 0 && data.length < total && (
        <Button loading={isFetching} disable={isFetching} onClick={fetchMore}>
          {'بیشتر'}
        </Button>
      )}
    </>
  );
};
export default SimpleListViewr;
