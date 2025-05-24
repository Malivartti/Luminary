import { Role } from '@entities/user';
import envPageStore from '@pages/EnvPage/store';
import { AppRoutes } from '@shared/config/router';
import { validateUrlId } from '@shared/lib/validate';
import Text from '@shared/ui/Text';
import AccessComponent from '@widgets/AccessComponent/AccessComponent';
import { default as cn } from 'classnames';
import { observer } from 'mobx-react-lite';
import { FC, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import cls from './Navbar.module.scss';

type Props = {
  onLinkClick?: () => void;
};


const Navbar: FC<Props> = observer(( { onLinkClick }) => {
  const { pathname } = useLocation();
  const currentHref = '/' + pathname.split('/').at(-1);
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 720);
  const [isDragging, setIsDragging] = useState(false);
  const [canScroll, setCanScroll] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth > 720);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const checkScrollNeed = () => {
      const slider = sliderRef.current;
      if (!slider || !isWideScreen) {
        setCanScroll(false);
        return;
      }
      
      const hasScroll = slider.scrollWidth > slider.clientWidth;
      setCanScroll(hasScroll);
    };

    checkScrollNeed();
    
    window.addEventListener('resize', checkScrollNeed);
    const timeoutId = setTimeout(checkScrollNeed, 100);
    
    return () => {
      window.removeEventListener('resize', checkScrollNeed);
      clearTimeout(timeoutId);
    };
  }, [isWideScreen]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.style.cursor = canScroll ? 'grab' : 'default';
    }
  }, [canScroll]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || !isWideScreen || !canScroll) {

      if (slider) {
        slider.style.cursor = 'default';
      }
      return;
    }

    let isDown = false;
    let startX = 0;
    let startY = 0;
    let scrollLeft = 0;
    let totalMovement = 0;
    const DRAG_THRESHOLD = 5;

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      totalMovement = 0;
      slider.style.cursor = 'grabbing';
      startX = e.pageX - slider.offsetLeft;
      startY = e.pageY;
      scrollLeft = slider.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      slider.style.cursor = canScroll ? 'grab' : 'default';
      if (totalMovement > DRAG_THRESHOLD) {
        setIsDragging(true);
        setTimeout(() => setIsDragging(false), 50);
      }
    };

    const handleMouseUp = () => {
      isDown = false;
      slider.style.cursor = canScroll ? 'grab' : 'default';
      if (totalMovement > DRAG_THRESHOLD) {
        setIsDragging(true);
        setTimeout(() => setIsDragging(false), 50);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      
      const deltaX = Math.abs(e.pageX - slider.offsetLeft - startX);
      const deltaY = Math.abs(e.pageY - startY);
      totalMovement = Math.max(totalMovement, deltaX + deltaY);
      
      if (totalMovement > DRAG_THRESHOLD) {
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1;
        slider.scrollLeft = scrollLeft - walk;
      }
    };

    slider.style.cursor = 'grab';

    slider.addEventListener('mousedown', handleMouseDown);
    slider.addEventListener('mouseleave', handleMouseLeave);
    slider.addEventListener('mouseup', handleMouseUp);
    slider.addEventListener('mousemove', handleMouseMove);

    return () => {
      slider.removeEventListener('mousedown', handleMouseDown);
      slider.removeEventListener('mouseleave', handleMouseLeave);
      slider.removeEventListener('mouseup', handleMouseUp);
      slider.removeEventListener('mousemove', handleMouseMove);

      if (slider) {
        slider.style.cursor = 'default';
      }
    };
  }, [isWideScreen, canScroll]);

  const handleLinkClick = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const navItems = [
    { to: AppRoutes.ENVS, label: 'Окружения', isActive: currentHref === AppRoutes.ENVS },
    ...(validateUrlId(pathname) ? [{
      to: '',
      label: envPageStore.envTitle,
      isActive: true,
      isEnv: true,
    }] : []),
    { to: AppRoutes.ASSISTANTS, label: 'Ассистенты', isActive: currentHref === AppRoutes.ASSISTANTS },
    { to: AppRoutes.AI_MODELS, label: 'Модели', isActive: currentHref === AppRoutes.AI_MODELS },
    { to: AppRoutes.HISTORY, label: 'История', isActive: currentHref === AppRoutes.HISTORY }
  ];

  if (isWideScreen) {
    return (
      <div className={cls.Navbar}>
        <AccessComponent roles={[Role.DEMO]}>
          <div 
            className={cn(cls.sliderContainer, { [cls.scrollable]: canScroll })} 
            ref={sliderRef}
          >
            <div className={cls.navSlider}>
              {navItems.map((item, index) => (
                item.isEnv ? (
                  <div key={index} className={cn(cls.Navbar__link, cls.Navbar__link_env)}>
                    <Text view='p-16' color='accent'>{item.label}</Text>
                  </div>
                ) : (
                  <Link 
                    key={index}
                    to={item.to} 
                    className={cls.Navbar__link}
                    onClick={handleLinkClick}
                    onDragStart={(e) => e.preventDefault()}
                  >
                    <Text view='p-16' color={item.isActive ? 'accent' : 'primary'}>
                      {item.label}
                    </Text>
                  </Link>
                )
              ))}
            </div>
          </div>
        </AccessComponent>
      </div>
    );
  }

  return (
    <div className={cls.NavbarVertical}>
      <AccessComponent roles={[Role.DEMO]}>
        {navItems.map((item, index) => (
          item.isEnv ? (
            <div key={index} className={cn(cls.NavbarVertical__link, cls.NavbarVertical__link_env)}>
              <Text view='p-16' color='accent'>{item.label}</Text>
            </div>
          ) : (
            <Link 
              key={index}
              to={item.to} 
              className={cls.NavbarVertical__link}
              onClick={() => onLinkClick?.()}
            >
              <Text view='p-16' color={item.isActive ? 'accent' : 'primary'}>
                {item.label}
              </Text>
            </Link>
          )
        ))}
      </AccessComponent>
    </div>
  );
});

export default Navbar;
