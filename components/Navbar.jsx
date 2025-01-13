// components/Navbar.jsx
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          SocialApp
        </Link>
        <div>
          <Link href="/login" className="text-white px-4">Login</Link>
          <Link href="/register" className="text-white px-4">Register</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
