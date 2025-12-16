import React, { useState } from 'react';
import './Input.css';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  name?: string;
  icon?: React.ReactNode;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  className?: string;
  id?: string;
  viewMode?: boolean;
  readOnly?: boolean;

  // Styles
  borderColor?: string;
  focusColor?: string;
  width?: string | number;
  height?: string | number;
  padding?: string;
  margin?: string;
  background?: string;
  fontSize?: string | number;
  fontWeight?: string | number;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder = '',
  value,
  name,
  icon,
  error,
  onChange,
  onBlur,
  onKeyDown,
  autoFocus,
  className,
  id,
  readOnly,
  borderColor,
  focusColor,
  width,
  height,
  padding,
  margin,
  background,
  viewMode = false,
  fontSize,
  fontWeight,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType =
    type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="input-wrapper" style={{ margin }}>
      <div
        className={`input-container ${error ? 'input-error' : ''} ${viewMode ? 'view-mode' : ''
          }`}
        style={
          {
            borderColor: viewMode ? 'transparent' : borderColor,
            backgroundColor: viewMode ? '#fff' : background || '#f9f9f9',
            padding,
            width,
            height,
            fontSize,
            fontWeight,
            '--focus-color': focusColor || 'var(--primary-color)',
          } as React.CSSProperties
        }
      >
        {icon && <span className="input-icon">{icon}</span>}

        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          autoFocus={autoFocus}
          className={`input-field ${className ?? ''}`}
          id={id}
          readOnly={readOnly || viewMode}
          style={{
            fontSize,
            fontWeight,
            backgroundColor: 'transparent',
            border: 'none',
          }}
        />

        {!viewMode && type === 'password' && value && (
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} color="#999" /> : <Eye size={18} color="#999" />}
          </span>
        )}
      </div>

      {error && <p className="input-error-text">{error}</p>}
    </div>
  );
};

export default Input;