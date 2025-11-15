import React from 'react';
import { Layout, Menu, Button, Space, Tooltip, message } from 'antd';
import {
  SunOutlined,
  MoonOutlined,
  SettingOutlined,
  LogoutOutlined,
  PlusOutlined,
  MenuOutlined, 
} from '@ant-design/icons';

import './AppHeader.css';

const { Header } = Layout;


// (SỬA) Thêm 'onToggleSider'
const AppHeader = ({ themeMode, toggleTheme, screens, onNewChat, onToggleSider }) => {

  return (
    <Header
      className="app-header"
      data-theme={themeMode}
    >
      <div className="app-header-content">
        <Space size={12} align="center">
        
          {/* (SỬA) Hiển thị nút Hamburger (Menu) trên mobile */}
          {!screens.lg && (
             <Button
              type="text"
              shape="circle"
              icon={<MenuOutlined />}
              className="app-header-button"
              data-theme={themeMode}
              onClick={onToggleSider} // (MỚI) Mở Drawer
            />
          )}

          <div>
            <div
              className="app-header-title"
              data-theme={themeMode}
            >
              Interview for UI/UX Designer
            </div>
            {/* (SỬA) Giấu subtitle trên mobile cho gọn */}
            {screens.lg && (
              <div
                className="app-header-subtitle"
                data-theme={themeMode}
              >
                AI Assistant
              </div>
            )}
          </div>
        </Space>
        <Space size={12} align="center">
          <Button
            type="text"
            shape="circle"
            icon={themeMode === 'dark' ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggleTheme}
            className="app-header-button"
            data-theme={themeMode}
          />

          {/* (SỬA) Chỉ hiển thị nút New Chat trên desktop (lg) */}
          {screens.lg && (
            <Tooltip title="Cuộc trò chuyện mới">
              <Button
                type="text"
                shape="circle"
                icon={<PlusOutlined />}
                onClick={onNewChat}
                className="app-header-button"
                data-theme={themeMode}
              />
            </Tooltip>
          )}
        </Space>
      </div>
    </Header>
  );
};

export default AppHeader;