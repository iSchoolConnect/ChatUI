import clsx from 'clsx';
import React from 'react';
import { Button, ButtonProps } from '../Button';
import { Icon } from '../Icon';

export type IconButtonProps = ButtonProps & {
  className?: string;
  icon: string;
  onEnter?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
};

export const IconButton: React.FC<IconButtonProps> = (props) => {
  const { className, icon, ...other } = props;

  return (
    <Button className={clsx('IconBtn', className)} {...other}>
      <Icon type={icon} />
    </Button>
  );
};
