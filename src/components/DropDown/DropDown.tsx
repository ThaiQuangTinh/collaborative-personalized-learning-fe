import React, { useState, useRef, useEffect } from 'react';
import './DropDown.css';

interface DropDownProps {
  options: string[];
  placeholder?: string;
  onSelect?: (value: string) => void;
  width?: string;
  borderColor?: string;
  backgroundColor?: string;
  activeColor?: string;
  textColor?: string;
  borderRadius?: string;
  shadowColor?: string;
}

const DropDown: React.FC<DropDownProps> = ({
  options,
  placeholder = 'Chọn...',
  onSelect,
  width = '200px',
  borderColor = '#ccc',
  backgroundColor = '#fff',
  activeColor = '#4361ee',
  textColor = '#000',
  borderRadius = '8px',
  shadowColor = 'rgba(0, 123, 255, 0.2)',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (value: string) => {
    setSelected(value);
    setIsOpen(false);
    if (onSelect) onSelect(value);
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="dropdown"
      style={
        {
          '--border-color': borderColor,
          '--background-color': backgroundColor,
          '--text-color': textColor,
          '--active-color': activeColor,
          '--shadow-color': shadowColor,
          '--border-radius': borderRadius,
          width,
        } as React.CSSProperties
      }
    >
      <button
        className="dropdown-btn"
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        {selected || placeholder}
        <span className={`arrow ${isOpen ? 'open' : ''}`}>
          <i className="fa-solid fa-angle-down"></i>
        </span>
      </button>

      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((option) => {
            return (
              <li
                key={option}
                className={`dropdown-item ${selected === option ? 'active' : ''}`}
                onClick={() => handleSelect(option)}
              >
                {option}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  );
};

export default DropDown;