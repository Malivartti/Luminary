import classNames from 'classnames';
import { FC, ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import cls from './Popup.module.scss';

type PopupPosition = 'top' | 'bottom' | 'left' | 'right';

type PopupProps = {
className?: string;
button: ReactNode;
children: ReactNode;
width?: number;
position?: PopupPosition;
}

const Popup: FC<PopupProps> = ({
  className,
  button,
  children,
  width,
  position = 'bottom',
}) => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const popupRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const adjustPosition = () => {
      if (!listRef.current) return;

      const popupEl = listRef.current;
      const rect = popupEl.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const offset = 15;

      let top = popupEl.offsetTop;
      let left = popupEl.offsetLeft;

      const parent = popupEl.offsetParent as HTMLElement;
      if (!parent) return;

      const parentRect = parent.getBoundingClientRect();

      if (rect.right > viewportWidth - offset) {
        left -= rect.right - viewportWidth + offset;
      }
      if (rect.left < offset) {
        left += offset - rect.left;
      }
      if (rect.bottom > viewportHeight - offset) {
        top -= rect.bottom - viewportHeight + offset;
      }
      if (rect.top < offset) {
        top += offset - rect.top;
      }

      popupEl.style.position = 'absolute';
      popupEl.style.left = `${left}px`;
      popupEl.style.top = `${top}px`;
    };

    requestAnimationFrame(adjustPosition);
    window.addEventListener('resize', adjustPosition);

    return () => {
      window.removeEventListener('resize', adjustPosition);
    };
  }, [isShow]);

  const toggle = useCallback(() => {
    setIsShow(prev => !prev);
  }, []);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!popupRef.current?.contains(event.target as HTMLElement)) {
        setIsShow(false);
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className={classNames(cls.Popup, className)}>
      <button
        ref={popupRef}
        className={cls.Popup__button}
        type='button'
        onClick={toggle}
      >
        {button}
      </button>
      <div
        className={classNames(
          cls.Popup__list,
          cls[`Popup__list_position_${position}`],
          { [cls.Popup__list_hide]: !isShow }
        )}
        ref={listRef}
        style={{
          width: width ?? undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Popup;