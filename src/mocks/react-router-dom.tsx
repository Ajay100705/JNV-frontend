// Mock implementation of react-router-dom for build purposes
// In production, use the actual react-router-dom package

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

// Types
export interface Location {
  pathname: string;
  search: string;
  hash: string;
  state: unknown;
}

export interface NavigateOptions {
  replace?: boolean;
  state?: unknown;
}

// Navigation context
interface RouterContextType {
  location: Location;
  navigate: (to: string, options?: NavigateOptions) => void;
}

const RouterContext = createContext<RouterContextType>({
  location: { pathname: '/', search: '', hash: '', state: null },
  navigate: () => {},
});

// BrowserRouter component
export const BrowserRouter: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<Location>({
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    state: null,
  });

  const navigate = useCallback((to: string, options?: NavigateOptions) => {
    if (options?.replace) {
      window.history.replaceState(options?.state, '', to);
    } else {
      window.history.pushState(options?.state, '', to);
    }
    setLocation({
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      state: options?.state,
    });
  }, []);

  // Listen for popstate events
  React.useEffect(() => {
    const handlePopState = () => {
      setLocation({
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
        state: window.history.state,
      });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <RouterContext.Provider value={{ location, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

// Hooks
export const useLocation = () => {
  const { location } = useContext(RouterContext);
  return location;
};

export const useNavigate = () => {
  const { navigate } = useContext(RouterContext);
  return navigate;
};

// Link component
interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  state?: unknown;
  style?: React.CSSProperties;
}

export const Link: React.FC<LinkProps> = ({ to, children, className, state, style }) => {
  const { navigate } = useContext(RouterContext);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(to, { state });
  };

  return (
    <a href={to} className={className} style={style} onClick={handleClick}>
      {children}
    </a>
  );
};

// Navigate component
interface NavigateProps {
  to: string;
  replace?: boolean;
  state?: unknown;
}

export const Navigate: React.FC<NavigateProps> = ({ to, replace, state }) => {
  const { navigate } = useContext(RouterContext);
  
  React.useEffect(() => {
    navigate(to, { replace, state });
  }, [navigate, to, replace, state]);

  return null;
};

// Route props interface
interface RouteProps {
  path: string;
  element: ReactNode;
}

// Routes component
interface RoutesProps {
  children: ReactNode;
}

export const Routes: React.FC<RoutesProps> = ({ children }) => {
  const { location } = useContext(RouterContext);
  
  // Find matching route
  let matchedElement: ReactNode = null;
  
  React.Children.forEach(children, (child) => {
    if (!matchedElement && React.isValidElement(child) && child.type === Route) {
      const props = child.props as RouteProps;
      const { path, element } = props;
      if (path === '*' || location.pathname === path || 
          (path && location.pathname.startsWith(path.replace('/*', '')))) {
        matchedElement = element;
      }
    }
  });

  return <>{matchedElement}</>;
};

// Route component
export const Route: React.FC<RouteProps> = () => null;

// Outlet for nested routes (simplified)
export const Outlet: React.FC = () => {
  return null;
};

// useParams hook (simplified)
export const useParams = () => {
  return {};
};
