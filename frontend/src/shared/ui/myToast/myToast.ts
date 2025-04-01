

import { toast } from 'react-toastify';

import cls from './myToast.module.scss';

const myToast = (message: string, type: 'error' | 'success') => {
  toast(message, {
    position: 'top-center',
    type,
    className: cls.myToast,
  });
};

export default myToast;
