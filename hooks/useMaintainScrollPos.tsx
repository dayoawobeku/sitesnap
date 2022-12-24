import {useContext, useEffect} from 'react';
import {UserContext} from '../context';

export const useMaintainScrollPos = () => {
  const {scrollRef} = useContext(UserContext);

  useEffect(() => {
    window.scrollTo(0, scrollRef?.current.scrollPos);

    const handleScrollPos = () => {
      scrollRef.current.scrollPos = window.scrollY;
    };

    window.addEventListener('scroll', handleScrollPos);

    return () => {
      window.removeEventListener('scroll', handleScrollPos);
    };
  }, [scrollRef]);

  return scrollRef;
};
