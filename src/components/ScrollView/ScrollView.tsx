/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React, { useRef, useImperativeHandle } from 'react';
import clsx from 'clsx';
import { Item, ScrollViewItemProps } from './Item';
import { IconButton } from '../IconButton';
import canUse from '../../utils/canUse';

export type ScrollViewProps<T> = Pick<ScrollViewItemProps, 'effect' | 'onIntersect'> & {
  data: Array<T>;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  scrollX?: boolean;
  itemKey?: string | ((item: T, index: number) => string);
  onScroll?: (event: React.UIEvent<HTMLDivElement, UIEvent>) => void;
  children?: React.ReactNode;
};

const hasControls = !canUse('touch');

export interface ScrollViewHandle {
  scrollTo: (coord: { x?: number; y?: number }) => void;
}

export const ScrollView = React.forwardRef<ScrollViewHandle, ScrollViewProps<any>>((props, ref) => {
  const {
    className,
    fullWidth,
    scrollX = true,
    effect = 'slide',
    data,
    itemKey,
    renderItem,
    onIntersect,
    onScroll,
    children,
    ...other
  } = props;

  const scrollerRef = useRef<HTMLDivElement>(null!);

  function handlePrev() {
    const el = scrollerRef.current;
    el.scrollLeft -= el.offsetWidth;
  }

  function handleNext() {
    const el = scrollerRef.current;
    el.scrollLeft += el.offsetWidth;
  }

  function getItemKey(item: any, index: number) {
    let key;
    if (itemKey) {
      key = typeof itemKey === 'function' ? itemKey(item, index) : item[itemKey];
    }
    return key || index;
  }

  useImperativeHandle(ref, () => ({
    scrollTo: ({ x, y }: { x?: number; y?: number }) => {
      if (x != null) {
        scrollerRef.current.scrollLeft = x;
      }
      if (y != null) {
        scrollerRef.current.scrollTop = y;
      }
    },
  }));

  return (
    <div
      className={clsx(
        'ScrollView',
        {
          'ScrollView--fullWidth': fullWidth,
          'ScrollView--x': scrollX,
          'ScrollView--hasControls': hasControls,
        },
        className,
      )}
      ref={ref as React.RefObject<HTMLDivElement>}
      {...other}
    >
      {hasControls && (
        <IconButton tabIndex={-1} className="ScrollView-control" icon="chevron-left" onClick={handlePrev} />
      )}
      <div tabIndex={0} className="ScrollView-scroller" ref={scrollerRef} onScroll={onScroll}>
        <div className="ScrollView-inner">
          {data.map((item, i) => (
            <Item item={item} effect={effect} onIntersect={onIntersect} key={getItemKey(item, i)}>
              {renderItem(item, i)}
            </Item>
          ))}
          {children ? (
            <Item item={{}} effect={effect} onIntersect={onIntersect}>
              {children}
            </Item>
          ) : null}
        </div>
      </div>
      {hasControls && (
        <IconButton tabIndex={-1} className="ScrollView-control" icon="chevron-right" onClick={handleNext} />
        )}
        </div>
        );
      });
      
