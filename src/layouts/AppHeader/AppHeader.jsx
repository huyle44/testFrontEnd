import { Layout, Button, Space, Tooltip } from 'antd';
import {
  SunOutlined,
  MoonOutlined,
  LeftOutlined,
  PlusOutlined,
} from '@ant-design/icons';

import './AppHeader.css';

const { Header } = Layout;


const AppHeader = ({ themeMode, toggleTheme, screens, onNewChat }) => {

  return (
    <Header
      className="app-header"
      data-theme={themeMode}
    >
      <div className="app-header-content">
        <Space size={12} align="center">
          {screens.lg && (
            <Button
              type="text"
              shape="circle"
              icon={<LeftOutlined />}
              className="app-header-button"
              data-theme={themeMode}
            />
          )}
          <div>
            <div
              className="app-header-title"
              data-theme={themeMode}
            >
              Interview for UI/UX Designer
            </div>
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