/**
 * Simple list viewer with the 'fetchMore' feature.
 */
import Button from 'components/Buttons/Button';
import Heading from 'components/Heading/Heading';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import React, { useEffect, useRef, useState } from 'react';
import PerfectScrollBar from 'components/ScrollBarProvider/ScrollBarProvider';
import LoadingIconFlat from 'components/Icons/LoadingIcons/LoadingIconFlat';

const { RVDic } = window;
/**
 *
 * @param {function} fetchMethod - the method that component uses to fetch list.
 * @param {Component} renderItem - pushes every node data in this component.
 * @param {number} pageSize - defines to how many items should fetch in every call.
 * @param {Boolean} infiniteLoop - If true, at the end of the list, it will automatically fetch more items.
 * @param {Boolean} extraData - A trigger for waking up the list to refresh itself by fetching the list.
 * @returns
 */
const SimpleListViewer = ({
  fetchMethod,
  renderItem,
  pageSize = 20,
  infiniteLoop,
  extraData,
  onTotal,
}) => {
  // fetched data
  const [data, setData] = useState([]);
  // count of the total data can be reached.
  const [total, setTotal] = useState(0);
  // If true, means component is fetching  list
  const [isFetching, setIsFetching] = useState(false);

  const [scrollDir, setScrollDir] = useState('scrolling down');

  const container = useRef();

  const fetchThem = () => {
    setIsFetching(true);

    fetchMethod(pageSize, 0, (data, total, nodeTypeId) => {
      if (data) {
        setData(data);
        setTotal(total);
        setIsFetching(false);
        onTotal(total);
      }
    });
  };

  // At the first time that the component mounts, fetches data
  useEffect(() => {
    // window.addEventListener('scroll', handleScroll, true);

    fetchThem();

    return () => {
      // window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  // under develop
  useEffect(() => {
    const threshold = 0;
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;

      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }
      setScrollDir(scrollY > lastScrollY ? 'scrolling down' : 'scrolling up');
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollDir]);

  // forces to fetch list again
  useEffect(() => {
    setData([]);
    fetchThem();
  }, [extraData]);

  // fetches more data if is available
  const fetchMore = () => {
    if (total > data.length) {
      console.log(total, '<===simple list fetch more', data.length);

      setIsFetching(true);

      fetchMethod(pageSize, data.length + 1, (newData, total) => {
        setData([...data, ...newData]);
        setIsFetching(false);
      });
    }
  };
  // under develop
  // const handleScroll = (e) => {
  //   const lastScrollY = window.scrollY;
  //   const screenY = window.screenY;
  //   const elementHeight = container.current?.clientHeight;
  //   if (
  //     elementHeight - lastScrollY < 500 &&
  //     infiniteLoop &&
  //     scrollDir === 'scrolling down' &&
  //     !isFetching &&
  //     data.length > 0 &&
  //     data.length < total
  //   ) {
  //     // fetchMore();
  //   }
  // };

  const onEndReached = () => {
    if (infiniteLoop && !isFetching && data.length > 0 && data.length < total) {
      fetchMore();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        width: '100%',
      }}>
      {isFetching && data.length === 0 ? (
        <LogoLoader />
      ) : data && data.length > 0 && renderItem ? (
        <div style={{ width: '100%' }} ref={container}>
          <PerfectScrollBar onYReachEnd={onEndReached}>
            {data.map((x, index) => (
              <div key={index}>{renderItem(x, index)}</div>
            ))}
          </PerfectScrollBar>
        </div>
      ) : (
        <Heading type={'h4'}>{'داده ای برای نمایش وجود ندارد'}</Heading>
      )}
      {infiniteLoop && isFetching && data.length > 0 ? (
        <>
          <span style={{ color: 'transparent' }}>1</span>
          <LoadingIconFlat className={'rv-default'} />
          <span style={{ color: 'transparent' }}>1</span>
        </>
      ) : (
        <>
          {data.length > 0 && data.length < total && (
            <Button
              loading={isFetching}
              disable={isFetching}
              onClick={fetchMore}
              style={{ maxWidth: '30%', alignSelf: 'center' }}>
              {RVDic.More}
            </Button>
          )}
        </>
      )}
    </div>
  );
};
export default SimpleListViewer;
