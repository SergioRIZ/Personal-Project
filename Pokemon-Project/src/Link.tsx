import React from 'react';
import { BUTTONS } from './const';
import { navigate } from './navigation';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  target?: string;
}

export function Link({ target, to, ...props }: LinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const isMainEvent = e.button === BUTTONS.primary;
    const isModifiedEvent = e.metaKey || e.ctrlKey || e.altKey || e.shiftKey;
    const isManageableEvent = target === undefined || target === '_self';

    if (isMainEvent && isManageableEvent && !isModifiedEvent) {
      e.preventDefault();
      navigate(to);
    }
  };

  return <a onClick={handleClick} href={to} target={target} {...props} />;
}
