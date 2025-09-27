"use client";

import { useState, useRef, useEffect } from "react";

interface ValueState {
  name: string;
  id: string;
}

interface DropDownProps {
  values: ValueState[] | [];
  onItemSelected: (value: ValueState) => void;
  dropdownPosition?: string;
  placeholder?: string;
}

// Example: 
// <DropDown
//     values={branchesName}
//     onItemSelected={(selectedBranch) => {
//       setFormData((prev) => ({
//          ...prev,
//          branch: {
//          branchId: selectedBranch.id,
//          name: selectedBranch.name,
//        },
//        }));
//     }}
//     placeholder="Select a branch"
// />

const DropDown = ({
  values,
  dropdownPosition = "dropdown-top",
  onItemSelected,
  placeholder = "Select an option",
}: DropDownProps) => {
  const [input, setInput] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [matchedItem, setMatchedItem] = useState<ValueState | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLSpanElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputString = e.target.value;
    setInput(inputString);
    setSelectedIndex(-1);

    const searchTerm = inputString.toLowerCase();
    const matchingItems = values.filter((item) =>
      item.name.toLowerCase().includes(searchTerm)
    );

    if (matchingItems.length === 1) {
      setIsHovered(true);
      setMatchedItem(matchingItems[0]);
    } else {
      setIsHovered(false);
      setMatchedItem(null);
    }

    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
    }
  };

  const getFilteredItems = () => {
    if (!input) return values;
    return values.filter((item) =>
      item.name.toLowerCase().includes(input.toLowerCase())
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const filteredItems = getFilteredItems();
    
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isDropdownOpen) {
        setIsDropdownOpen(true);
      }
      setSelectedIndex(prev => 
        prev < filteredItems.length - 1 ? prev + 1 : 0
      );
    }
    
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!isDropdownOpen) {
        setIsDropdownOpen(true);
      }
      setSelectedIndex(prev => 
        prev > 0 ? prev - 1 : filteredItems.length - 1
      );
    }
    
    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < filteredItems.length) {
        const selectedItem = filteredItems[selectedIndex];
        setInput(selectedItem.name);
        setIsDropdownOpen(false);
        setSelectedIndex(-1);
        onItemSelected(selectedItem);
      } else if (matchedItem) {
        setInput(matchedItem.name);
        setIsDropdownOpen(false);
        onItemSelected(matchedItem);
      }
    }
    
    if (e.key === "Escape") {
      setIsDropdownOpen(false);
      setSelectedIndex(-1);
    }
  };

  const handleInputClick = () => {
    setIsDropdownOpen((prev) => !prev);
    setSelectedIndex(-1);
  };

  const handleItemClick = (item: ValueState, index: number) => {
    setInput(item.name);
    setIsDropdownOpen(false);
    setSelectedIndex(-1);
    onItemSelected(item);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <span ref={dropdownRef} className="relative">
      <input
        type="text"
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onClick={handleInputClick}
        className="input w-full focus:outline-none disabled:opacity-80"
        placeholder={placeholder}
      />

      {isDropdownOpen && (
        <ul className={`w-52 rounded-box bg-white border border-gray-200 shadow-lg menu absolute z-50 max-h-60 overflow-y-auto left-0 ${dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'}`}>
          {(() => {
            const filteredItems = getFilteredItems();
            return filteredItems.map((item, index) => (
              <li
                className={`capitalize hover:bg-gray-100 text-black  p-2 text-sm rounded-md cursor-pointer ${
                  selectedIndex === index ? "bg-gray-100" : ""
                } ${isHovered && matchedItem?.id === item.id ? "bg-gray-100" : ""}`}
                key={item.id}
                onClick={() => handleItemClick(item, index)}>
                {input ? item.name : item.name}
              </li>
            ));
          })()}
        </ul>
      )}
    </span>
  );
};

export default DropDown;