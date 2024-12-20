'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const handleResize = () => {
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    setIsClient(true);

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!isClient) {
    return null; // Return nothing during SSR
  }

  const menuItems = [
    { label: 'Systems', href: '#', icon: <Image src="/menu-active.svg" alt="Systems" width={24} height={24} />, disabled: false },
    { label: 'System Code', href: '/system-code', icon: <Image src="/sub-menu.svg" alt="System Code" width={24} height={24} />, disabled: true },
    { label: 'Properties', href: '/properties', icon: <Image src="/sub-menu.svg" alt="Properties" width={24} height={24} />, disabled: true },
    { label: 'Menus', href: '/menus', icon: <Image src="/sub-menu.svg" alt="Menus" width={24} height={24} />, disabled: false },
    { label: 'API List', href: '/api-list', icon: <Image src="/sub-menu.svg" alt="API List" width={24} height={24} />, disabled: true },
    { label: 'Users & Group', href: '/users-group', icon: <Image src="/menu-inactive.svg" alt="Users & Group" width={24} height={24} />, disabled: true },
    { label: 'Competition', href: '/competition', icon: <Image src="/menu-inactive.svg" alt="Competition" width={24} height={24} />, disabled: true },
  ];

  return (
    <div className={`${isOpen ? 'w-64' : 'w-[5rem]'} bg-gray-800`}>
      <aside className={`${isOpen ? 'w-64' : 'w-[5rem]'} h-screen bg-gray-800 text-white py-[32px] pl-2 pr-4 fixed`}>
        <div className="p-4 flex justify-between">
          {isOpen && (
            <Link href="/">
              <Image src="/logo.svg" alt="" width={70} height={21} />
            </Link>
          )}

          <Image
            src={isOpen ? '/menu-open.svg' : '/menu-close.svg'}
            alt="Toggle Sidebar"
            width={18}
            height={12}
            onClick={() => setIsOpen(!isOpen)} // Toggle sidebar on click
            className="cursor-pointer"
          />
        </div>

        {/* Menu Items */}
        <ul className="mt-4">
          {menuItems.map((item, index) => (
            <li key={index} className={`${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <Link
                href={item.disabled ? '#' : item.href} // Disable click for disabled menus
                className={`px-4 py-2 flex items-center space-x-2 font-semibold ${
                  !item.disabled && pathname === item.href ? 'bg-[#9FF443] py-[12px] rounded-[16px] text-[#101828]' : 'hover:bg-gray-700'
                }`}
              >
                {item.icon}
                {isOpen && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
