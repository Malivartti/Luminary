import classNames from 'classnames';
import { FC, ReactNode, useEffect, useRef } from 'react';

import cls from './Modal.module.scss';

type ModalProps = {
  children: ReactNode;
  isShow: boolean;
  setIsShow: (value: boolean) => void;
}

const Modal: FC<ModalProps> = ({ children, isShow, setIsShow }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!modalRef.current?.contains(event.target as HTMLElement)) {
        setIsShow(false);
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [isShow, setIsShow]);

  return (
    <div className={classNames(
      cls.Modal,
      { [cls.Modal_hide]: !isShow }
    )}>
      <div className={cls.Modal__container} ref={modalRef}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
