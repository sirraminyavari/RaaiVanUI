/**
 * Simple list viewer with the 'fetchMore' feature.
 */
import EmptyState from 'components/EmptyState/EmptyState';
import Heading from 'components/Heading/Heading';
import LoadingIconFlat from 'components/Icons/LoadingIcons/LoadingIconFlat';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import usePrevious from 'hooks/usePrevious';
import React, { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const { RVDic } = window;
/**
 *
 * @param {function} fetchMethod - the method that component uses to fetch list.
 * @param {Component} renderItem - pushes every node data in this component.
 * @param {number} pageSize - defines to how many items should fetch in every call.
 * @param {Boolean} infiniteLoop - If true, at the end of the list, it will automatically fetch more items.
 * @param {Boolean} extraData - A trigger for waking up the list to refresh itself by fetching the list.
 */

const SimpleListViewer = ({
  fetchMethod,
  renderItem,
  pageSize = 20,
  infiniteLoop,
  extraData = false,
  onTotal,
}) => {
  // fetched data
  const [data, setData] = useState([]);
  // count of the total data can be reached.
  const [total, setTotal] = useState(0);
  // If true, means component is fetching  list
  const [isFetching, setIsFetching] = useState(false);
  const [onEndCounter, setOnEndCounter] = useState(0);

  const [scrollDir, setScrollDir] = useState('scrolling down');
  const preExtraData = usePrevious(extraData);

  const container = useRef();

  const fetchThem = () => {
    setIsFetching(true);

    fetchMethod(pageSize, 0, (data, total, nodeTypeId) => {
      //ask ramin
      setData(data);
      setTotal(total);
      setIsFetching(false);
      onTotal(total);
      setOnEndCounter(onEndCounter + 1);
    });
  };

  // At the first time that the component mounts, fetches data

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
    if (preExtraData !== undefined) {
      fetchThem();
    }
  }, [extraData]);

  // fetches more data if is available
  const fetchMore = () => {
    if (total > data.length) {
      setIsFetching(true);

      fetchMethod(pageSize, data.length + 1, (newData, total) => {
        setData([...data, ...newData]);
        setIsFetching(false);
      });
    }
  };

  const onEndReached = () => {
    if (infiniteLoop && !isFetching && data.length > 0 && data.length < total)
      fetchMore();
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      {isFetching && data.length === 0 ? (
        <LogoLoader />
      ) : data && data.length > 0 && renderItem ? (
        <div style={{ width: '100%' }} ref={container}>
          <InfiniteScroll
            dataLength={data.length} //This is important field to render the next data
            next={onEndReached}
            hasMore={true}
          >
            {data.map((x, index) => (
              <div key={index}>{renderItem(x, index)}</div>
            ))}
          </InfiniteScroll>
        </div>
      ) : (
        <>
          <EmptyState />
          <Heading type={'h4'} style={{ textAlign: 'center' }}>
            {RVDic.NothingToDisplay}
          </Heading>
        </>
      )}
      {infiniteLoop && isFetching && data.length > 0 && (
        <>
          <span style={{ color: 'transparent' }}>1</span>
          <LoadingIconFlat className={'rv-default'} />

          <span style={{ color: 'transparent' }}>1</span>
        </>
      )}
    </div>
  );
};

export default SimpleListViewer;
