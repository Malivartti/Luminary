import classNames from 'classnames';
import { FC, ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import cls from './Popup.module.scss';

type PopupProps = {
  className?: string;
  button: ReactNode;
  children: ReactNode;
  width?: number;
}

const Popup: FC<PopupProps> = ({ className, button, children, width }) => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const popupRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const handleResize = () => {
      requestAnimationFrame(() => {
        if (listRef.current) {
          const { x, width } = listRef.current.getBoundingClientRect();
          const viewportWidth = window.innerWidth;
  
          let newLeft = null;
  
          if (x + width > viewportWidth) {
            newLeft = '0px';
          } else if (x < 15) {
            newLeft = '15px';
          }
  
          if (newLeft !== null) {
            listRef.current.style.left = newLeft;
            listRef.current.style.right = newLeft === '0px' ? '15px' : '';
          }
        }
      });
    };
  
    handleResize();
    window.addEventListener('resize', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
