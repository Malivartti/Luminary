import Skeleton from 'react-loading-skeleton';

import cls from './EnvCardSkeleton.module.scss';
const EnvCardSkeleton = () => {
  return (
    <div className={cls.EnvCardSkeleton}>
      <Skeleton className={cls.EnvCardSkeleton__title} />
      <Skeleton className={cls.EnvCardSkeleton__description} count={4} />
      <div className={cls.EnvCardSkeleton__date}><Skeleton height={14}/></div>

    </div>
  );
};

export default EnvCardSkeleton;
