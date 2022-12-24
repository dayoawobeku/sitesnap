import {createContext} from 'react';

interface UserContextProps {
  scrollRef: {
    current: {
      scrollPos: number;
    };
  };
}

const UserContext = createContext<UserContextProps>({} as UserContextProps);

export default UserContext;
