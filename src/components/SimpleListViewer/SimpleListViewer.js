/**
 * Simple list viewer with the 'fetchMore' feature.
 */
import Button from 'components/Buttons/Button';
import Heading from 'components/Heading/Heading';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import React, { useEffect, useRef, useState } from 'react';
import { Component } from 'react';

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

  // At the first time that the component mounts, fetches data
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, true);

    setIsFetching(true);
    console.log('nodeTypes****#mounted');

    fetchMethod(pageSize, 0, (data, total, nodeTypeId) => {
      if (data) {
        setData(data);
        setTotal(total);
        setIsFetching(false);
        console.log(nodeTypeId, 'nodeTypes****#');
        onTotal(total);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
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
    setIsFetching(true);
    setData([]);
    console.log(extraData, 'nodeTypes****#$%extraData');

    fetchMethod(pageSize, 1, (data, total, nodeTypeId) => {
      if (data) {
        setData(data);
        setTotal(total);
        setIsFetching(false);
        onTotal(total);
        console.log(nodeTypeId, 'nodeTypes****#$');
      }
    });
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
  // under develop
  const handleScroll = (e) => {
    const lastScrollY = window.scrollY;
    const screenY = window.screenY;
    const elementHeight = container.current?.clientHeight;

    if (
      elementHeight - lastScrollY < 500 &&
      infiniteLoop &&
      scrollDir === 'scrolling down' &&
      !isFetching
    ) {
      // fetchMore();
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
        <div style={{ width: '100%' }} ref={container} onScroll={handleScroll}>
          {data.map((x, index) => renderItem(x, index))}
        </div>
      ) : (
        <Heading type={'h4'}>{'داده ای برای نمایش وجود ندارد'}</Heading>
      )}

      {data.length > 0 && data.length < total && (
        <Button
          loading={isFetching}
          disable={isFetching}
          onClick={fetchMore}
          style={{ maxWidth: '30%', alignSelf: 'center' }}>
          {'بیشتر'}
        </Button>
      )}
    </div>
  );
};
export default SimpleListViewer;
