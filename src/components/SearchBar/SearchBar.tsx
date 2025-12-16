import React, { useState, useMemo } from "react";
import "./SearchBar.css";
import { debounce } from "../../utils/debounce";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  width?: string;
  borderColor?: string;
  backgroundColor?: string;
  iconColor?: string;
  textColor?: string;
  focusBorderColor?: string;
  fontSize?: string;
  size?: 'small' | 'medium' | 'large';
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Tìm kiếm...",
  onSearch,
  width,
  borderColor = "#d0d7de",
  backgroundColor = "#fff",
  iconColor = "#4361ee",
  textColor = "#333",
  focusBorderColor = "#4361ee",
  fontSize,
  size = 'medium',
}) => {
  const [value, setValue] = useState("");

  // Determine size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: '6px 10px',
          fontSize: fontSize || '12px',
          iconSize: '14px',
          borderRadius: '6px'
        };
      case 'large':
        return {
          padding: '12px 16px',
          fontSize: fontSize || '16px',
          iconSize: '18px',
          borderRadius: '10px'
        };
      case 'medium':
      default:
        return {
          padding: '8px 12px',
          fontSize: fontSize || '14px',
          iconSize: '16px',
          borderRadius: '8px'
        };
    }
  };

  const sizeStyles = getSizeStyles();

  // Default width based on size if not provided
  const defaultWidth = width || (size === 'small' ? '200px' : size === 'large' ? '400px' : '300px');

  const debounceSearch = useMemo(() => {
    return debounce((val: string) => {
      onSearch && onSearch(val);
    }, 300);
  }, [onSearch]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    setValue("");
    onSearch && onSearch("");
  };

  return (
    <div
      className={`searchbar ${size}`}
      style={
        {
          "--border-color": borderColor,
          "--background-color": backgroundColor,
          "--icon-color": iconColor,
          "--text-color": textColor,
          "--focus-border-color": focusBorderColor,
          "--font-size": sizeStyles.fontSize,
          "--padding": sizeStyles.padding,
          "--border-radius": sizeStyles.borderRadius,
          width: defaultWidth,
        } as React.CSSProperties
      }
    >
      <i 
        className={`fas fa-search search-icon ${size}`} 
        onClick={() => {
          if (onSearch) {
            onSearch(value);
          }
        }}
        style={{ fontSize: sizeStyles.iconSize }}
      ></i>

      <input
        type="text"
        className={`search-input ${size}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          setValue(val);
          debounceSearch(val);
        }}
        onKeyDown={handleKeyPress}
      />

      {value && (
        <i 
          className="fas fa-times clear-icon" 
          onClick={handleClear}
          style={{ fontSize: sizeStyles.iconSize }}
          title="Xóa tìm kiếm"
        ></i>
      )}
    </div>
  );
};

export default SearchBar;