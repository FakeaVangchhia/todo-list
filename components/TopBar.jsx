'use client';

import { useEffect, useRef, useState } from 'react';
import { GoogleIcon, ProfileIcon } from '@/components/icons';
import {
  getAvatarUrl,
  getDisplayName,
  signInWithGoogle,
  signOut,
} from '@/lib/auth';

export default function TopBar({ user, authLoading, onAuthError }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleGoogleSignIn() {
    try {
      setSigningIn(true);
      onAuthError?.(null);
      await signInWithGoogle();
    } catch (err) {
      onAuthError?.(err.message);
      setSigningIn(false);
    }
  }

  async function handleSignOut() {
    try {
      setSigningOut(true);
      onAuthError?.(null);
      await signOut();
      setMenuOpen(false);
    } catch (err) {
      onAuthError?.(err.message);
    } finally {
      setSigningOut(false);
    }
  }

  const displayName = user ? getDisplayName(user) : '';
  const avatarUrl = user ? getAvatarUrl(user) : null;

  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        </div>
        <div className="brand-copy">
          <span className="topbar-title">Task App</span>
          <span className="topbar-subtitle">Next.js classroom demo</span>
        </div>
      </div>

      <div className="topbar-actions">
        {!user && !authLoading && (
          <button
            className="google-signin-btn"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={signingIn}
          >
            <GoogleIcon />
            {signingIn ? 'Signing in...' : 'Sign in with Google'}
          </button>
        )}

        {user && (
          <div className="profile-wrap" ref={menuRef}>
            <button
              className={`profile-btn signed-in${avatarUrl ? '' : ''}`}
              type="button"
              aria-label="Open profile menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              disabled={signingOut}
            >
              {avatarUrl ? (
                <img className="profile-avatar" src={avatarUrl} alt="" />
              ) : (
                <ProfileIcon />
              )}
            </button>

            {menuOpen && (
              <div className="profile-menu">
                <div className="profile-menu-header">
                  <p className="profile-menu-name">{displayName}</p>
                </div>
                <p className="profile-menu-email">{user.email}</p>
                <button
                  className="profile-menu-signout"
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                >
                  {signingOut ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
