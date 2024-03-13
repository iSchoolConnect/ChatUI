import clsx from 'clsx';
import React from 'react';

export type ButtonVariant = 'text';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  label?: string;
  color?: 'primary';
  // title?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onEnter?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
}

function composeClass(type?: string) {
  return type && `Btn--${type}`;
}

export const Button: React.FC<ButtonProps> = (props) => {
  const {
    className,
    label,
    color,
    variant,
    size,
    loading = false,
    block,
    disabled = false,
    children,
    onClick,
    onEnter,
    ...other
  } = props;

  function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  }
  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (!disabled && !loading && event.key === 'Enter' && onEnter) {
      onEnter(event);
    }
  }

  return (
    <button
      className={clsx(
        'Btn',
        composeClass(color),
        composeClass(variant),
        composeClass(size),
        {
          'Btn--block': block,
        },
        className,
      )}
      type="button"
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...other}
    >
      {label || children}
    </button>
  );
};
