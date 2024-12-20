'use client';
import { useEffect, useState } from 'react';
import CollapsibleMenu from '@/components/CollapsibleMenu';
import Image from "next/image";
import { FaRegFolder } from "react-icons/fa";
interface MenuItem {
  id?: number;
  parentId: number | undefined;
  label: string;
  children?: MenuItem[];
}

export default function Menus() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [defaultItems, setDefaulttems] = useState<MenuItem[]>([]);
  
    function buildMenu(items: MenuItem[]): [] {
      const map = new Map();
      items.forEach((item: MenuItem) => {
        map.set(item.id, { ...item, children: [] });
      });
    
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nestedMenu:any = [];
    
      items.forEach((item: MenuItem) => {
        if (item.parentId === null) {
          nestedMenu.push(map.get(item.id));
        } else {
          const parent = map.get(item.parentId);
          if (parent) {
            parent.children.push(map.get(item.id));
          }
        }
      });
    
      return nestedMenu;
    }
  
    
    const fetchMenu = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_API_URL + '/menu';
        const response = await fetch(url);
        const data = await response.json();
        const menuItemss = buildMenu(data);
        console.log('Fetched data:', {
          data: data,
          menuItems: menuItemss,
        });
        setDefaulttems(data);
        setMenuItems(menuItemss);
      } catch (error) {
        console.error('Error fetching menu:', error);
      }
    };
  
    useEffect(() => {
      fetchMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
      <div>
        <div className="flex py-[16px] items-center gap-2">
          <button className=" rounded-full hover:bg-blue-600" >
          <FaRegFolder size={24} />
          </button>
          / 
          <h6 className="text-sm">Menu</h6>
        </div>
        <div className="flex py-[16px] items-center gap-4">
          <button className="p-[14px] bg-[#253BFF] text-white rounded-full hover:bg-blue-600" >
          <Image src="/sub-menu-white.svg" alt="Properties" width={24} height={24} />
          </button>
          <h1 className="text-4xl font-bold">Menu</h1>
        </div>
        <CollapsibleMenu 
          items={menuItems} 
          defaultItems={defaultItems}
          refreshMenu={fetchMenu}
         />
        
      </div>
    );
}
  