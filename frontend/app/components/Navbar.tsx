'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../context/appContext';
import Login from './Login';
import SignUp from './Signup';

const Navbar = () => {
  const {
    cartCount,
    showLogin,
    setShowLogin,
    showSignUp,
    setShowSignUp,
    isLoggedIn,
    logout,
  } = useAppContext();

  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState('home');
  const router = useRouter();

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <>
      <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
        <Link href="/">
          <Image src="/logo.jpeg" alt="Logo" width={90} height={40} className="cursor-pointer" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-8">
          <Link href="/" onClick={() => setActive('home')} className={active === 'home' ? 'font-semibold' : ''}>Home</Link>
          <Link href="/shop" onClick={() => setActive('shop')} className={active === 'shop' ? 'font-semibold' : ''}>Shop</Link>
          <Link href="/partner" onClick={() => setActive('partner')} className={active === 'partner' ? 'font-semibold' : ''}>Partner</Link>
          <Link href="/contact" onClick={() => setActive('contact')} className={active === 'contact' ? 'font-semibold' : ''}>Contact</Link>

          {/* Cart Icon */}
          <div onClick={() => router.push('/cart')} className="relative cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0" stroke="#615fff" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <button className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full">{cartCount}</button>
          </div>

          {/* Auth Button */}
          {isLoggedIn ? (
            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="cursor-pointer px-6 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm"
            >
              Log Out
            </button>
          ) : (
            <button
              onClick={() => {
                setShowSignUp(true);
                setShowLogin(false);
              }}
              className="cursor-pointer px-6 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm"
            >
              Login
            </button>
          )}
        </div>

        {/* Burger Icon for Mobile */}
        <button onClick={toggleOpen} aria-label="Menu" className="sm:hidden z-50 relative">
          <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="21" height="1.5" rx=".75" fill="#426287" />
            <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
            <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
          </svg>
        </button>

        {/* Mobile Menu */}
        <div className={`${isOpen ? 'flex' : 'hidden'} z-40 absolute top-[60px] left-0 w-full bg-gray-300 shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}>
          <Link href="/" className="block" onClick={() => { setActive('home'); setIsOpen(false); }}>Home</Link>
          <Link href="/shop" className="block" onClick={() => { setActive('shop'); setIsOpen(false); }}>Shop</Link>
          <Link href="/partner" className="block" onClick={() => { setActive('partner'); setIsOpen(false); }}>Partners</Link>
          <Link href="/contact" className="block" onClick={() => { setActive('contact'); setIsOpen(false); }}>Contact</Link>
          <Link href="/cart" className="block" onClick={() => setIsOpen(false)}>Cart</Link>
          {isLoggedIn ? (
            <button
              className="cursor-pointer px-6 py-2 mt-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm"
              onClick={() => {
                logout();
                setIsOpen(false);
                router.push('/');
              }}
            >
              Log Out
            </button>
          ) : (
            <button
              className="cursor-pointer px-6 py-2 mt-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm"
              onClick={() => {
                setShowLogin(true);
                setShowSignUp(false);
                setIsOpen(false);
              }}
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Modals */}
      {showSignUp && (
        <SignUp
          closeForm={() => setShowSignUp(false)}
          switchToLogin={() => {
            setShowSignUp(false);
            setShowLogin(true);
          }}
        />
      )}
      {showLogin && (
        <Login
          closeForm={() => setShowLogin(false)}
          switchToSignUp={() => {
            setShowLogin(false);
            setShowSignUp(true);
          }}
        />
      )}
    </>
  );
};

export default Navbar;
