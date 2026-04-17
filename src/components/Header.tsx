import { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

export function Header(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [storageAvailable, setStorageAvailable] = useState<boolean>(true);

  const checkAuth = useCallback(() => {
    try {
      const auth = sessionStorage.getItem('hirehub_admin_auth');
      setIsAuthenticated(auth === 'true');
    } catch {
      console.warn('sessionStorage is not available');
      setStorageAvailable(false);
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth, location]);

  const handleLogout = (): void => {
    try {
      sessionStorage.removeItem('hirehub_admin_auth');
    } catch {
      console.warn('sessionStorage is not available');
    }
    setIsAuthenticated(false);
    setMenuOpen(false);
    navigate('/admin');
  };

  const handleLogin = (): void => {
    setMenuOpen(false);
    navigate('/admin');
  };

  const toggleMenu = (): void => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = (): void => {
    setMenuOpen(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
    isActive ? 'header-nav-link header-nav-link--active' : 'header-nav-link';

  return (
    <header className="header">
      <div className="header-container">
        <NavLink to="/" className="header-logo" onClick={closeMenu}>
          HireHub
        </NavLink>

        <button
          className={`header-hamburger ${menuOpen ? 'header-hamburger--open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          type="button"
        >
          <span className="header-hamburger-bar" />
          <span className="header-hamburger-bar" />
          <span className="header-hamburger-bar" />
        </button>

        <nav className={`header-nav ${menuOpen ? 'header-nav--open' : ''}`}>
          <NavLink to="/" className={navLinkClass} onClick={closeMenu} end>
            Home
          </NavLink>
          <NavLink to="/apply" className={navLinkClass} onClick={closeMenu}>
            Apply
          </NavLink>
          <NavLink to="/admin" className={navLinkClass} onClick={closeMenu}>
            Admin
          </NavLink>

          {!storageAvailable && (
            <span className="header-error">Storage unavailable</span>
          )}

          {storageAvailable && (
            <button
              className="header-auth-btn"
              onClick={isAuthenticated ? handleLogout : handleLogin}
              type="button"
            >
              {isAuthenticated ? 'Logout' : 'Login'}
            </button>
          )}
        </nav>
      </div>

      <style>{`
        .header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background-color: var(--color-primary, #1a1a2e);
          color: var(--color-text-light, #ffffff);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          height: 64px;
        }

        .header-logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-accent, #e94560);
          text-decoration: none;
          letter-spacing: 1px;
        }

        .header-logo:hover {
          opacity: 0.9;
        }

        .header-nav {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .header-nav-link {
          color: var(--color-text-light, #ffffff);
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          transition: background-color 0.2s, color 0.2s;
        }

        .header-nav-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .header-nav-link--active {
          color: var(--color-accent, #e94560);
          background-color: rgba(233, 69, 96, 0.1);
        }

        .header-auth-btn {
          background-color: var(--color-accent, #e94560);
          color: #ffffff;
          border: none;
          padding: 0.5rem 1.25rem;
          border-radius: 4px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
          margin-left: 0.5rem;
        }

        .header-auth-btn:hover {
          background-color: #d63851;
        }

        .header-error {
          color: #ff6b6b;
          font-size: 0.8rem;
          font-style: italic;
        }

        .header-hamburger {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 28px;
          height: 20px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .header-hamburger-bar {
          display: block;
          width: 100%;
          height: 3px;
          background-color: var(--color-text-light, #ffffff);
          border-radius: 2px;
          transition: transform 0.3s, opacity 0.3s;
        }

        .header-hamburger--open .header-hamburger-bar:nth-child(1) {
          transform: translateY(8.5px) rotate(45deg);
        }

        .header-hamburger--open .header-hamburger-bar:nth-child(2) {
          opacity: 0;
        }

        .header-hamburger--open .header-hamburger-bar:nth-child(3) {
          transform: translateY(-8.5px) rotate(-45deg);
        }

        @media (max-width: 768px) {
          .header-hamburger {
            display: flex;
          }

          .header-nav {
            display: none;
            flex-direction: column;
            position: absolute;
            top: 64px;
            left: 0;
            right: 0;
            background-color: var(--color-primary, #1a1a2e);
            padding: 1rem;
            gap: 0.75rem;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          }

          .header-nav--open {
            display: flex;
          }

          .header-nav-link {
            padding: 0.5rem 1rem;
            width: 100%;
            text-align: center;
          }

          .header-auth-btn {
            margin-left: 0;
            width: 100%;
            padding: 0.75rem 1.25rem;
          }
        }
      `}</style>
    </header>
  );
}

export default Header;