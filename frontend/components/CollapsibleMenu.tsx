'use client';
import { useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { IoAdd } from "react-icons/io5";
import { MdEdit, MdDeleteForever  } from "react-icons/md";
import ModalPopup from '@/components/ModalPopup';

interface MenuItem {
  id?: number;
  parentId: number | undefined;
  label: string;
  children?: MenuItem[];
}

interface CollapsibleMenuProps {
  items: MenuItem[];
  defaultItems: MenuItem[];
  refreshMenu?: () => void;
}

const CollapsibleMenu = ({ items, defaultItems, refreshMenu }: CollapsibleMenuProps) => {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: undefined as number | undefined,
    parentId: undefined as number | undefined,
    label: "",
  });

  const url = process.env.NEXT_PUBLIC_API_URL ?? "";

  const [parentData, setParentData] = useState<MenuItem | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      label: e.target.value,
    });
  };

  const toggleExpand = (index: string, hasChildren: boolean) => {
    if (hasChildren) {
      setExpanded((prevState) => ({
        ...prevState,
        [index]: !prevState[index],
      }));
    }
  };

  const getItemsWithChildren = (items: MenuItem[]): MenuItem[] => {
    const result: MenuItem[] = [];
    const traverse = (items: MenuItem[]) => {
      items.forEach((item) => {
        if (item.children && item.children.length > 0) {
          result.push(item);
          traverse(item.children);
        }
      });
    };
    traverse(items);
    return result;
  };
  const getParentData = (parentId: number) => {
    const foundParent = defaultItems.filter((e) => e.id === parentId)[0];
    return foundParent;
  };


  const handleComboBoxChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedItem(e.target.value);
    const selectedItemLabel = e.target.value;
    // Find the selected item and expand it
    const findItemAndExpand = (items: MenuItem[]) => {
      for (const item of items) {
        if (item.label === selectedItemLabel) {
          const index = `${0}-${items.indexOf(item)}`;
          setExpanded((prevState) => ({
            ...prevState,
            [index]: true,
          }));
          break;
        }
        if (item.children) {
          findItemAndExpand(item.children);
        }
      }
    };
    findItemAndExpand(items);
  };

  const expandAll = () => {
    const newExpanded: { [key: string]: boolean } = {};
    const traverse = (items: MenuItem[], level = 0) => {
      items.forEach((item, index) => {
        const itemIndex = `${level}-${index}-${item.id}`;
        newExpanded[itemIndex] = true;
        if (item.children) {
          traverse(item.children, level + 1);
        }
      });
    };
    traverse(items);
    setExpanded(newExpanded);
  };

  const collapseAll = () => {
    setExpanded({});
  };
  const itemsWithChildren = getItemsWithChildren(items);

  const handleAdd = (item: MenuItem) => {
    console.log("Adding a child to:", item);
    setFormData({
      id: undefined,
      parentId: item.id,
      label: "",
    });
    const gpd = getParentData(Number(item.id))
    setParentData(gpd);
  };
  
  const handleEdit = (item: MenuItem) => {
    console.log("Editing item:", item);
    setFormData({
      id: item.id,
      parentId: item.parentId,
      label: item.label,
    });
    const gpd = getParentData(Number(item.parentId))
    setParentData(gpd);
  };
  
  const handleDelete = (item: MenuItem) => {
    console.log("Deleting item:", item);
    setFormData({
      id: item.id,
      parentId: item.parentId,
      label: item.label,
    });
    setIsModalOpen(true); 
  };
  
  const handleConfirmDelete = async () => {
    if (formData?.id) {
      console.log("Deleting item:", formData?.id);

      const response = await fetch(`${url}/menu/${formData.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        resetData();
        refreshMenu?.();

      } else {
        setMessage('Failed to Create/Update menu.');
      }
    }
  };

  const resetData = () => {
    const data = {
      id: undefined,
      parentId: undefined,
      label: "",
    }
    setFormData(data);    
    setParentData(data);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url_ = formData?.id ? `${url}/menu/${formData.id}` : `${url}/menu`;
      const response = await fetch(url_, {
        method: formData?.id ? "PATCH" : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('response data :',data)
        setMessage(data.message);

        resetData();
        refreshMenu?.();

      } else {
        setMessage('Failed to Create/Update menu.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error creating menu.');
    }
  };

  const renderMenu = (items: MenuItem[], level = 0) => {
    return (
      <ul className={`pl-${level * 4} pr-0 md:pr-6`} style={{ paddingLeft: `${level * 6}px` }}>
        {items.map((item, index) => {
          const itemIndex = `${level}-${index}-${item.id}`; // Unique key for each item

          return (
            <li
              key={itemIndex}
              className="relative"
              onMouseEnter={() => setHoveredItem(itemIndex)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {item.children && item.children.length > 0 ? (
                    <button onClick={() => toggleExpand(itemIndex, true)}>
                      {expanded[itemIndex] ? (
                        <FaAngleUp />
                      ) : (
                        <FaAngleDown />
                      )}                      
                    </button>
                  ) : (
                    <span className="mr-4"></span>
                  )}
                  <span className="ml-2 my-2">{item.label}</span>
                </div>
              </div>

              {hoveredItem === itemIndex && (
                <div className="absolute right-0 top-0 flex space-x-2">
                  {item.children && item.children.length > 0 ? (
                    <>
                      <button
                        className="p-[6px] bg-blue-500 text-white rounded-full hover:bg-blue-600"
                        onClick={() => handleAdd(item)}
                      >
                        <IoAdd />
                      </button>
                      <button
                        className="p-[6px] bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
                        onClick={() => handleEdit(item)}
                      >
                        <MdEdit />
                      </button>
                    </>
                  ) : (
                    hoveredItem === itemIndex && (
                      <>
                      <button
                      className="p-[6px] bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
                      onClick={() => handleEdit(item)}
                    >
                      <MdEdit />
                    </button>
                      <button
                        className="p-[6px] bg-red-500 text-white rounded-full hover:bg-red-600"
                        onClick={() => handleDelete(item)}
                      >
                        <MdDeleteForever />
                      </button>
                      </>
                    )
                  )}
                </div>
              )}

              {expanded[itemIndex] && item.children && renderMenu(item.children, level + 1)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <>
    <div>
      <label htmlFor="menuSelect" className="mr-2">Menu</label>
      <div className="mb-4">
        <select
          id="menuSelect"
          value={selectedItem || ''}
          onChange={handleComboBoxChange}
          className="border p-3 w-[350px] bg-[#F9FAFB] rounded-[8px]"
        >
          <option value="">Select an item</option>
          {itemsWithChildren.map((item, index) => (
            <option key={index} value={item.label}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <div className='block md:flex'>
        <div className='w-full md:w-1/2'>
          <div className="mb-4">
            <button
              onClick={expandAll}
              className="mr-4 p-2 bg-[#1D2939] py-[12px] px-[32px] rounded-[48px] text-white"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="p-2 bg-[#D0D5DD] py-[12px] px-[32px] rounded-[48px] text-[#475467]"
            >
              Collapse All
            </button>
          </div>

          {renderMenu(items)}
        </div>
        <div className='w-full md:w-1/2'>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="menuId" className="block text-sm font-medium">
                Menu ID
              </label>
              <input
                type="text"
                id="menuId"
                value={formData?.parentId ? "56320ee9-6af6-11ed-a7ba-f220afe5e4a9" : ""}
                className="w-full p-2 border rounded-[16px]"
                disabled={true}
              />
            </div>
            <div>
              <label htmlFor="depth" className="block text-sm font-medium">
                Depth
              </label>
              <input
                type="text"
                id="depth"
                value={formData?.parentId ?? ""} 
                className="w-full p-2 border rounded-[16px] md:max-w-[262px]"
                disabled={true}
              />
            </div>
            <div>
              <label htmlFor="parentData" className="block text-sm font-medium">
                Parent Data
              </label>
              <input
                type="text"
                id="parentData"
                value={parentData?.label ?? ""}
                className="w-full p-2 border rounded-[16px] md:max-w-[262px]"
                disabled={true}
              />
            </div>
            <div>
              <label htmlFor="menuName" className="block text-sm font-medium">
                Name
              </label>
              <input
                type="text"
                id="menuName"
                value={formData?.label}
                onChange={handleLabelChange}
                className="w-full p-2 border rounded-[16px] md:max-w-[262px]"
                required
              />
            </div>

            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              Submit
            </button>
          </form>
          {message && <p className="mt-4 text-green-500">{message}</p>}        

        </div>
      </div>
      
    </div>
    <ModalPopup
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      onConfirm={handleConfirmDelete}
      message={`Are you sure you want to delete "${formData?.label}"?`}
    />
    </>
  );
};

export default CollapsibleMenu;
