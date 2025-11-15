import { useState, useMemo } from 'react';
import { Layout, Menu, Avatar, Button, Space, Tooltip, Input, Popconfirm } from 'antd';
import {
  MessageOutlined,
  RobotOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  EditOutlined,
  DeleteOutlined,
  LeftOutlined, 
  PlusOutlined, 
} from '@ant-design/icons';

import './AppSider.css';

const { Sider } = Layout;

const AppSider = ({ 
  collapsed, 
  onToggle,
  onClose,
  onNewChat,
  isMobile,
  themeMode, 
  chatSessions, 
  activeChatId, 
  setActiveChatId,
  renamingChatId,
  setRenamingChatId,
  handleRenameChat,
  handleDeleteChat
}) => {

  const [hoveredChatId, setHoveredChatId] = useState(null);
  const [deletingChatId, setDeletingChatId] = useState(null);

  const chatMenuItems = useMemo(() => {
    return chatSessions.map(chat => ({
      key: chat.id,
      icon: <MessageOutlined />,
      label: (
        chat.id === renamingChatId ? (
          <Input
            defaultValue={chat.title}
            onClick={(e) => e.stopPropagation()}
            onPressEnter={(e) => handleRenameChat(chat.id, e.target.value)}
            onBlur={(e) => handleRenameChat(chat.id, e.target.value)}
            autoFocus
          />
        ) : (
          <div 
            className="menu-item-label"
            onMouseEnter={() => setHoveredChatId(chat.id)}
            onMouseLeave={() => setHoveredChatId(null)}
          >
            <span 
              onDoubleClick={(e) => { 
                e.stopPropagation(); 
                setRenamingChatId(chat.id);
              }}
              className="menu-item-text"
            >
              {chat.title}
            </span>
            
            {/* (SỬA) Cập nhật logic hiển thị nút Sửa/Xóa */}
            {
              // Điều kiện: (Luôn hiện trên Mobile) HOẶC (Hiện khi hover trên Desktop)
              ((isMobile && !collapsed) || 
               (!isMobile && !collapsed && (hoveredChatId === chat.id || deletingChatId === chat.id)))
              && ( // "&&" thay vì "?" để code gọn hơn
                <Space size={4}>
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      setRenamingChatId(chat.id);
                    }}
                    className="menu-item-edit-button"
                    data-theme={themeMode}
                  />
                  
                  <Popconfirm
                    title="Xóa cuộc trò chuyện?"
                    description="Bạn có chắc muốn xóa?"
                    placement="right"
                    open={deletingChatId === chat.id} 
                    onConfirm={(e) => {
                      e.stopPropagation();
                      handleDeleteChat(chat.id);
                      setDeletingChatId(null); 
                    }}
                    onCancel={(e) => {
                      e.stopPropagation();
                      setDeletingChatId(null); 
                    }}
                    okText="Xóa"
                    cancelText="Hủy"
                  >
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingChatId(chat.id); 
                      }}
                      className="menu-item-delete-button"
                    />
                  </Popconfirm>
                </Space>
              )
            }
          </div>
        )
      ),
    }));
  // (SỬA) Thêm 'isMobile' vào mảng dependencies
  }, [chatSessions, renamingChatId, setRenamingChatId, handleRenameChat, collapsed, hoveredChatId, themeMode, handleDeleteChat, deletingChatId, isMobile]);

  return (
    <Sider
      width={260}
      className="app-sider"
      data-theme={themeMode}
      collapsible={false} 
      collapsed={collapsed}
      breakpoint={undefined}
      trigger={null}
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }} 
    >
      <div 
        className="sider-logo-area" 
        data-theme={themeMode}
      >
        <Space>
          <Avatar
            size={40}
            className="sider-logo-avatar"
            icon={<RobotOutlined className="sider-logo-avatar-icon" />}
          />
          {!collapsed && (
            <span 
              className="sider-logo-text" 
              data-theme={themeMode}
            >
              InterviewAI
            </span>
          )}
        </Space>
      </div>

      {isMobile && !collapsed && (
        <div style={{ padding: '16px 16px 0 16px' }}>
          <Button 
            type="primary" 
            block 
            icon={<PlusOutlined />}
            onClick={onNewChat}
          >
            Cuộc trò chuyện mới
          </Button>
        </div>
      )}

      <div 
        className="sider-menu-area" 
        data-collapsed={collapsed}
        style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}
      >
        <div 
          className="sider-menu-header"
          data-theme={themeMode}
          data-collapsed={collapsed}
        >
          {!collapsed && <span>HISTORY</span>}
          <Tooltip title={isMobile ? "Đóng" : (collapsed ? "Mở Sidebar" : "Đóng Sidebar")} placement="right">
            <Button
              type="text"
              icon={isMobile ? <LeftOutlined /> : (collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />)}
              onClick={isMobile ? onClose : onToggle} 
              className="sider-collapse-button"
              data-theme={themeMode}
            />
          </Tooltip>
        </div>
        <Menu
          theme={themeMode}
          mode="inline"
          items={chatMenuItems}
          onClick={(info) => {
            if (renamingChatId === info.key) return;
            setRenamingChatId(null);
            setActiveChatId(info.key); 
          }}
          selectedKeys={[activeChatId]}
          className="sider-menu"
          inlineCollapsed={collapsed}
        />
      </div>
    </Sider>
  );
};

export default AppSider;