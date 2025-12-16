import React from 'react';
import './FilterTabs.css';

interface TabItem {
  id: string;
  label: string;
}

interface FilterTabsProps {
  items: TabItem[];
  activeTabId: string;
  onTabClick: (tabId: string) => void;
  activeColor?: string;
  hoverColor?: string;
  transitionDuration?: string;
  margin?: string; // ✅ Thêm: hỗ trợ margin tuỳ chỉnh (vd: '10px 0', '20px 0 0 0')
}

const FilterTabs: React.FC<FilterTabsProps> = ({
  items,
  activeTabId,
  onTabClick,
  activeColor = '#4361ee',
  hoverColor,
  transitionDuration = '0.3s',
  margin = '0 0 20px 0', // ✅ Mặc định có margin-bottom như cũ
}) => {
  const handleTabClick = (tabId: string) => {
    onTabClick(tabId);
  };

  return (
    <nav
      className="filter-tabs"
      style={{
        '--active-color': activeColor,
        '--hover-color': hoverColor || `${activeColor}0D`,
        '--transition-duration': transitionDuration,
        margin,
      } as React.CSSProperties}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className={`filter-tab-item ${activeTabId === item.id ? 'active' : ''}`}
          onClick={() => handleTabClick(item.id)}
        >
          <span className="tab-label">{item.label}</span>
          <div className="active-indicator"></div>
        </div>
      ))}
    </nav>
  );
};

export default FilterTabs;
