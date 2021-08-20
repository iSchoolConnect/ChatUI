/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React, { useState, useEffect, useRef, useImperativeHandle, useCallback } from 'react';
import clsx from 'clsx';
import { Flex } from '../Flex';
import { Icon } from '../Icon';
import { useLocale } from '../LocaleProvider';
import canUse from '../../utils/canUse';

const canPassive = canUse('passiveListener');
const listenerOpts = canPassive ? { passive: true } : false;
const listenerOptsWithoutPassive = canPassive ? { passive: false } : false;
const MOVE_INTERVAL = 80;

interface ButtonTextMap {
  [k: string]: string;
}

const btnTextMap: ButtonTextMap = {
  inited: 'hold2talk',
  recording: 'release2send',
  willCancel: 'release2send',
};

let ts = 0;
let startY = 0;

export interface RecorderHandle {
  stop: () => void;
}

export interface RecorderProps {
  canRecord?: boolean;
  volume?: number;
  onStart?: () => void;
  onEnd?: (data: { duration: number }) => void;
  onCancel?: () => void;
  ref?: React.MutableRefObject<RecorderHandle>;
}

export const Recorder = React.forwardRef<RecorderHandle, RecorderProps>((props, ref) => {
  const { volume, onStart, onEnd, onCancel } = props;
  const [status, setStatus] = useState('inited');
  const btnRef = useRef<HTMLDivElement>(null);
  const { trans } = useLocale('Recorder');

  const doEnd = useCallback(() => {
    const duration = Date.now() - ts;
    if (onEnd) {
      onEnd({ duration });
    }
  }, [onEnd]);

  useImperativeHandle(ref, () => ({
    stop() {
      setStatus('inited');
      doEnd();
      ts = 0;
    },
  }));

  useEffect(() => {
    const wrapper = btnRef.current!;

    function handleTouchStart(e: TouchEvent) {
      if (e.cancelable) {
        e.preventDefault();
      }
      const touch0 = e.touches[0];
      startY = touch0.pageY;
      ts = Date.now();
      setStatus('recording');

      if (onStart) {
        onStart();
      }
    }

    function handleTouchMove(e: TouchEvent) {
      if (!ts) return;
      const nowY = e.touches[0].pageY;
      const isCancel = startY - nowY > MOVE_INTERVAL;
      setStatus(isCancel ? 'willCancel' : 'recording');
    }

    function handleTouchEnd(e: TouchEvent) {
      if (!ts) return;
      const endY = e.changedTouches[0].pageY;
      const isRecording = startY - endY < MOVE_INTERVAL;

      setStatus('inited');

      if (isRecording) {
        doEnd();
      } else if (onCancel) {
        onCancel();
      }
    }

    function handleMouseDown(e: MouseEvent) {
      if (e.cancelable) {
        e.preventDefault();
      }
      ts = Date.now();
      setStatus('recording');
      if (onStart) {
        onStart();
      }
    }

    function handleMouseLeave() {
      if (!ts) return;
      setStatus('inited');
      if (onCancel) {
        onCancel();
      }
    }

    function handleMouseUp() {
      if (!ts) return;
      setStatus('inited');
      doEnd();
    }

    function handleKeyDown(e: KeyboardEvent){
      if(e.key === 'Enter'){
        if (e.cancelable) {
          e.preventDefault();
        }
        ts = Date.now();
        setStatus('recording');
        if (onStart) {
          onStart();
        }
      }
    }

    function handleKeyUp(e: KeyboardEvent){
      if(e.key === 'Enter'){
        if (!ts) return;
        setStatus('inited');
        doEnd();
      }
    }

    wrapper.addEventListener('touchstart', handleTouchStart, listenerOptsWithoutPassive);
    wrapper.addEventListener('touchmove', handleTouchMove, listenerOpts);
    wrapper.addEventListener('touchend', handleTouchEnd);
    wrapper.addEventListener('touchcancel', handleTouchEnd);
    wrapper.addEventListener('mousedown', handleMouseDown);
    wrapper.addEventListener('mouseleave', handleMouseLeave);
    wrapper.addEventListener('mouseup', handleMouseUp);
    wrapper.addEventListener('keydown', handleKeyDown);
    wrapper.addEventListener('keyup', handleKeyUp);

    return () => {
      wrapper.removeEventListener('touchstart', handleTouchStart);
      wrapper.removeEventListener('touchmove', handleTouchMove);
      wrapper.removeEventListener('touchend', handleTouchEnd);
      wrapper.removeEventListener('touchcancel', handleTouchEnd);
      wrapper.removeEventListener('mousedown', handleMouseDown);
      wrapper.removeEventListener('mouseleave', handleMouseLeave);
      wrapper.removeEventListener('mouseup', handleMouseUp);
    };
  }, [doEnd, onCancel, onStart]);

  const isCancel = status === 'willCancel';
  const wavesStyle = { transform: `scale(${(volume || 1) / 100 + 1})` };

  return (
    <div className={clsx('Recorder', { 'Recorder--cancel': isCancel })} ref={btnRef}>
      {status !== 'inited' && (
        <Flex className="RecorderToast" direction="column" center>
          <div className="RecorderToast-waves" hidden={status !== 'recording'} style={wavesStyle}>
            <Icon className="RecorderToast-wave-1" type="hexagon" />
            <Icon className="RecorderToast-wave-2" type="hexagon" />
            <Icon className="RecorderToast-wave-3" type="hexagon" />
          </div>
          <Icon className="RecorderToast-icon" type={isCancel ? 'cancel' : 'mic'} />
          <span>{trans(isCancel ? 'release2cancel' : 'releaseOrSwipe')}</span>
        </Flex>
      )}
      <div className="Recorder-btn" role="button" aria-label={trans('hold2talk')} tabIndex={0}>
        <span>{trans(btnTextMap[status])}</span>
      </div>
    </div>
  );
});
