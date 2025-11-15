import React, { useState, useRef, useEffect, useCallback } from 'react';

import GlobalStyles from '../components/GlobalStyle/GlobalStyles';
import AppSider from './AppSider/AppSider';
import AppHeader from './AppHeader/AppHeader';
import ChatWindow from './ChatWindow/ChatWindow';
import RecordingIndicator from '../components/RecordingIndicator/RecordingIndicator';
import ChatInput from '../components/ChatInput/ChatInput';

import './InterviewChatbot.css'; 

import { Layout, ConfigProvider, theme, Grid, message, Drawer } from 'antd'; 

import { useTheme } from '../hooks/useTheme';
import { useChat } from '../hooks/useChat';
import { useFiles } from '../hooks/useFiles';
import { useSpeech } from '../hooks/useSpeech';

import { getCurrentTime, recognition } from '../utils/chatHelpers'; 

const { Content, Footer } = Layout;
const { darkAlgorithm, defaultAlgorithm } = theme;
const { useBreakpoint } = Grid;

// const InterviewChatbot = () => {
//   const screens = useBreakpoint();
//   const messagesEndRef = useRef(null);
//   const [collapsed, setCollapsed] = useState(false); // UI State có thể giữ lại

  
//   const { themeMode, toggleTheme } = useTheme();
  
//   const {
//     chatSessions,
//     activeChatId,
//     activeChat,
//     messages,
//     renamingChatId,
//     setChatSessions, 
//     setActiveChatId,
//     setRenamingChatId,
//     triggerAiResponse,
//     handleRenameChat,
//     handleNewChat,
//     handleDeleteChat
//   } = useChat();
  
//   const { 
//     stagedFiles, 
//     setStagedFiles, 
//     handleFileUpload, 
//     handleRemoveStagedFile 
//   } = useFiles();
  
//   const { 
//     input, 
//     setInput, 
//     isRecording, 
//     setIsRecording,
//     handleVoiceToggle, 
//     silenceTimeoutRef,
//     inputRef 
//   } = useSpeech();
  
//   const handleSend = useCallback(() => {
//     if (isRecording) {
//       setIsRecording(false); 
//     }
    
//     const currentInput = inputRef.current; 
    
//     if (!currentInput.trim() && stagedFiles.length === 0) return;

//     let newTitle = null; 
//     let titleUpdated = false;
//     const newMessages = []; 

//     // 1. Xử lý text
//     if (currentInput.trim()) {
//       newMessages.push({ 
//         sender: 'user', 
//         text: currentInput, 
//         time: getCurrentTime(), 
//         type: 'text' 
//       });
//       if (activeChat && activeChat.title === 'New Chat') {
//         newTitle = currentInput.length > 30 ? currentInput.substring(0, 30) + '...' : currentInput;
//         titleUpdated = true;
//       }
//     }

//     // 2. Xử lý file
//     if (stagedFiles.length > 0) {
//       stagedFiles.forEach(file => {
//         newMessages.push({
//           sender: 'user',
//           text: file.data, // Gửi data base64
//           time: getCurrentTime(),
//           type: file.type
//         });
//         if (activeChat && activeChat.title === 'New Chat' && !newTitle) {
//           newTitle = file.name;
//           titleUpdated = true;
//         }
//       });
//     }

//     // 3. Cập nhật state MỘT LẦN DUY NHẤT
//     setChatSessions(prevSessions =>
//       prevSessions.map(chat => {
//         if (chat.id === activeChatId) {
//           return {
//             ...chat,
//             messages: [...chat.messages, ...newMessages], 
//             title: newTitle ? newTitle : chat.title 
//           };
//         }
//         return chat;
//       })
//     );

//     // 4. Dọn dẹp
//     setInput(''); 
//     setStagedFiles([]);

//     // 5. Kích hoạt AI
//     triggerAiResponse();
//   }, [activeChat, activeChatId, isRecording, setIsRecording, setChatSessions, setInput, setStagedFiles, stagedFiles, triggerAiResponse]);
  
//   // (SỬA) Bước 3: Chuyển useEffect của SpeechRecognition về đây
//   useEffect(() => {
//     if (!recognition) return;
//     const clearSilenceTimeout = () => {
//       if (silenceTimeoutRef.current) {
//         clearTimeout(silenceTimeoutRef.current);
//         silenceTimeoutRef.current = null;
//       }
//     };
//     if (isRecording) {
//       recognition.start();
//       recognition.onresult = (event) => {
//         clearSilenceTimeout(); 
//         let interim_transcript = '';
//         let final_transcript = '';
//         for (let i = 0; i < event.results.length; ++i) {
//             const transcript = event.results[i][0].transcript;
//             if (event.results[i].isFinal) {
//                 final_transcript += transcript + ' ';
//             } else {
//                 interim_transcript += transcript;
//             }
//         }
//         setInput(final_transcript + interim_transcript);
//       };
//       recognition.onspeechend = () => {
//           clearTimeout(silenceTimeoutRef.current);
//           silenceTimeoutRef.current = setTimeout(() => {
//               console.log("15s im lặng, tự động ngắt...");
//               setIsRecording(false); 
//               const finalInput = inputRef.current;
//               if (finalInput.trim() || stagedFiles.length > 0) {
//                   handleSend();
//               }
//           }, 15000);
//       };
//       recognition.onerror = (event) => {
//         console.error("Speech recognition error:", event.error);
//         clearSilenceTimeout();
//         setIsRecording(false);
//       };
//       recognition.onend = () => {
//         clearSilenceTimeout();
//         setIsRecording(false);
//       };
//     } else {
//       recognition.stop();
//       clearSilenceTimeout();
//     }
//     return () => {
//       if (recognition) recognition.stop();
//       clearSilenceTimeout();
//     };
//   }, [isRecording, stagedFiles, handleSend, setInput, setIsRecording, silenceTimeoutRef]); 
  
  
//   // (SỬA) handleNewChat cần dọn dẹp input và speech
//   const handleNewChatWrapper = () => {
//     if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
//     setIsRecording(false);
//     setInput('');
//     setStagedFiles([]); 
//     handleNewChat(); // Gọi hàm gốc từ useChat
//   };
  
//   const handleVoiceToggleWrapper = () => {
//       // (SỬA) handleVoiceToggle giờ trả về true/false
//       const success = handleVoiceToggle();
//       if (!success) {
//            message.error('Trình duyệt không hỗ trợ Speech-to-Text');
//       }
//   };

//   // --- RENDER ---
//   return (
//     <ConfigProvider
//       theme={{
//         algorithm: themeMode === 'dark' ? darkAlgorithm : defaultAlgorithm,
//         token: {
//           fontFamily: "'Inter', sans-serif",
//           colorPrimary: '#1677ff',
//         }
//       }}
//     >
//       <GlobalStyles />
//       <Layout 
//         className="chatbot-layout"
//       >
        
//         <AppSider 
//           collapsed={collapsed} 
//           setCollapsed={setCollapsed} // Truyền state UI
//           themeMode={themeMode}
//           chatSessions={chatSessions}
//           activeChatId={activeChatId}
//           setActiveChatId={setActiveChatId}
//           renamingChatId={renamingChatId}
//           setRenamingChatId={setRenamingChatId}
//           handleRenameChat={handleRenameChat}
//           handleDeleteChat={handleDeleteChat}
//         />

//         {/* (SỬA) Thêm style={{ height: '100dvh', overflow: 'hidden' }}
//             vào Layout (cấp 2) để ngăn nó cuộn trên mobile
//         */}
//         <Layout style={{ height: '100dvh', overflow: 'hidden' }}>
          
//           <AppHeader
//             themeMode={themeMode}
//             toggleTheme={toggleTheme}
//             screens={screens}
//             onNewChat={handleNewChatWrapper}
//           />

//           {/* (SỬA) Bỏ 'style' và cấu trúc lại với Footer */}
//           <Layout> 
//             <Content
//               className="chatbot-content"
//               data-theme={themeMode}
//             >
//               <ChatWindow messages={messages} messagesEndRef={messagesEndRef} themeMode={themeMode} />
//             </Content>

//             {/* (MỚI) Thêm component Footer để chứa input */}
//             <Footer className="chatbot-footer" data-theme={themeMode}>
//               <RecordingIndicator isRecording={isRecording} themeMode={themeMode} />
//               <ChatInput
//                 input={input}
//                 setInput={setInput}
//                 isRecording={isRecording}
//                 handleSend={handleSend} 
//                 handleVoiceToggle={handleVoiceToggleWrapper}
//                 handleFileUpload={handleFileUpload}
//                 themeMode={themeMode}
//                 stagedFiles={stagedFiles}
//                 handleRemoveStagedFile={handleRemoveStagedFile}
//               />
//             </Footer>
//           </Layout>
          
//         </Layout>
//       </Layout>
//     </ConfigProvider>
//   );
// };

// export default InterviewChatbot;

// import React, { useState, useRef, useEffect, useCallback } from 'react';

// import GlobalStyles from '../components/GlobalStyle/GlobalStyles';
// import AppSider from './components/AppSider/AppSider';
// import AppHeader from './components/AppHeader/AppHeader';
// import ChatWindow from './components/ChatWindow/ChatWindow';
// import RecordingIndicator from './components/RecordingIndicator/RecordingIndicator';
// import ChatInput from './components/ChatInput/ChatInput';

// import './InterviewChatbot.css'; 

// // (SỬA) Import 'Drawer' và 'Footer'
// import { Layout, Footer ,ConfigProvider, theme, Grid, message, Drawer } from 'antd'; 

// import { useTheme } from '../hooks/useTheme';
// import { useChat } from '../hooks/useChat';
// import { useFiles } from '../hooks/useFiles';
// import { useSpeech } from '../hooks/useSpeech';

// // (SỬA) Import 'recognition', 'interviewQuestions', 'defaultWelcomeMessage'
// import { getCurrentTime, recognition, interviewQuestions, defaultWelcomeMessage } from '../utils/chatHelpers'; 

// // (SỬA) Destructure 'Footer'
// const { Content } = Layout; 
// const { darkAlgorithm, defaultAlgorithm } = theme;
// // (SỬA) Destructure 'useBreakpoint'
// const { useBreakpoint } = Grid; 

const InterviewChatbot = () => {
  const screens = useBreakpoint();
  const messagesEndRef = useRef(null);
  
  // (SỬA) Dùng state này, BỎ state 'collapsed' cũ
  const [isSiderVisible, setIsSiderVisible] = useState(false); 

  // --- GỌI CÁC CUSTOM HOOK ---
  
  const { themeMode, toggleTheme } = useTheme();
  
  const {
    chatSessions,
    activeChatId,
    activeChat,
    messages,
    renamingChatId,
    setChatSessions, 
    setActiveChatId,
    setRenamingChatId,
    triggerAiResponse,
    handleRenameChat,
    handleNewChat,
    handleDeleteChat
  } = useChat();
  
  const { 
    stagedFiles, 
    setStagedFiles, 
    handleFileUpload, 
    handleRemoveStagedFile 
  } = useFiles();
  
  const { 
    input, 
    setInput, 
    isRecording, 
    setIsRecording,
    handleVoiceToggle, 
    silenceTimeoutRef,
    inputRef 
  } = useSpeech();
  
  const handleSend = useCallback(() => {
    if (isRecording) {
      setIsRecording(false); 
    }
    const currentInput = inputRef.current; 
    if (!currentInput.trim() && stagedFiles.length === 0) return;
    let newTitle = null; 
    let titleUpdated = false;
    const newMessages = []; 
    if (currentInput.trim()) {
      newMessages.push({ 
        id: crypto.randomUUID(),
        sender: 'user', 
        text: currentInput, 
        time: getCurrentTime(), 
        type: 'text' 
      });
      if (activeChat && activeChat.title === 'New Chat') {
        newTitle = currentInput.length > 30 ? currentInput.substring(0, 30) + '...' : currentInput;
        titleUpdated = true;
      }
    }
    if (stagedFiles.length > 0) {
      stagedFiles.forEach(file => {
        newMessages.push({
          id: crypto.randomUUID(),
          sender: 'user',
          text: file.data, 
          time: getCurrentTime(),
          type: file.type
        });
        if (activeChat && activeChat.title === 'New Chat' && !newTitle) {
          newTitle = file.name;
          titleUpdated = true;
        }
      });
    }
    setChatSessions(prevSessions =>
      prevSessions.map(chat => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: [...chat.messages, ...newMessages], 
            title: newTitle ? newTitle : chat.title 
          };
        }
        return chat;
      })
    );
    setInput(''); 
    setStagedFiles([]);
    triggerAiResponse();
  }, [activeChat, activeChatId, isRecording, setIsRecording, setChatSessions, setInput, setStagedFiles, stagedFiles, triggerAiResponse]);
  
  // (SỬA) Bước 1: Tạo một Ref để "bọc" hàm handleSend
  const handleSendRef = useRef(handleSend);

  // (SỬA) Bước 2: Cập nhật Ref mỗi khi handleSend (bản gốc) thay đổi
  useEffect(() => {
    handleSendRef.current = handleSend;
  }, [handleSend]);


  // (SỬA) Bước 3: Sửa useEffect của SpeechRecognition
  useEffect(() => {
    if (!recognition) return;
    const clearSilenceTimeout = () => {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
    };
    if (isRecording) {
      // (FIX) Thêm try...catch để tránh lỗi nếu 'start' được gọi khi đang 'starting'
      try {
        recognition.start();
      } catch (e) {
        console.warn("Lỗi khi bắt đầu ghi âm (có thể đã bắt đầu):", e);
      }
      
      recognition.onresult = (event) => {
        clearSilenceTimeout(); 
        let interim_transcript = '';
        let final_transcript = '';
        for (let i = 0; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                final_transcript += transcript + ' ';
            } else {
                interim_transcript += transcript;
            }
        }
        setInput(final_transcript + interim_transcript);
      };
      recognition.onspeechend = () => {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = setTimeout(() => {
              console.log("15s im lặng, tự động ngắt...");
              setIsRecording(false); 
              const finalInput = inputRef.current;
              // (SỬA) Kiểm tra stagedFiles (lấy từ state)
              if (finalInput.trim() || stagedFiles.length > 0) {
                  // (SỬA) Gọi hàm handleSend thông qua Ref
                  handleSendRef.current(); 
              }
          }, 15000);
      };
      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        clearSilenceTimeout();
        setIsRecording(false);
      };
      recognition.onend = () => {
        clearSilenceTimeout();
        setIsRecording(false);
      };
    } else {
      recognition.stop();
      clearSilenceTimeout();
    }
    return () => {
      if (recognition) recognition.stop();
      clearSilenceTimeout();
    };
  // (SỬA) Bước 4: Xóa 'handleSend', 'stagedFiles', 'setInput' khỏi mảng dependencies
  // Chỉ lắng nghe 'isRecording' (trigger chính)
  }, [isRecording, setIsRecording, setInput, silenceTimeoutRef, inputRef, stagedFiles]); 
  
  
  // (SỬA) handleNewChat cần dọn dẹp input và speech
  const handleNewChatWrapper = () => {
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    setIsRecording(false);
    setInput('');
    setStagedFiles([]); 
    handleNewChat(); 
    if (!screens.lg) {
      setIsSiderVisible(false);
    }
  };
  
  const handleVoiceToggleWrapper = () => {
      const success = handleVoiceToggle();
      if (!success) {
           message.error('Trình duyệt không hỗ trợ Speech-to-Text');
      }
  };

  // (MỚI) Hàm để render Sider (để tái sử dụng)
  const renderSider = (isMobile = false) => (
    <AppSider 
      isMobile={isMobile}
      collapsed={!isSiderVisible && !isMobile} 
      onToggle={() => setIsSiderVisible(!isSiderVisible)} 
      onClose={() => setIsSiderVisible(false)} 
      onNewChat={handleNewChatWrapper} 
      
      themeMode={themeMode}
      chatSessions={chatSessions}
      activeChatId={activeChatId}
      setActiveChatId={(id) => {
        setActiveChatId(id);
        if (isMobile) setIsSiderVisible(false); 
      }}
      renamingChatId={renamingChatId}
      setRenamingChatId={setRenamingChatId}
      handleRenameChat={handleRenameChat}
      handleDeleteChat={handleDeleteChat}
    />
  );

  // --- RENDER ---
  return (
    <ConfigProvider
      theme={{
        algorithm: themeMode === 'dark' ? darkAlgorithm : defaultAlgorithm,
        token: {
          fontFamily: "'Inter', sans-serif",
          colorPrimary: '#1677ff',
        }
      }}
    >
      <GlobalStyles />
      <Layout 
        className="chatbot-layout"
      >
        
        {screens.lg ? (
          renderSider(false)
        ) : (
          <Drawer
            placement="left"
            onClose={() => setIsSiderVisible(false)}
            open={isSiderVisible}
            closable={false}
            width={260} 
            bodyStyle={{ padding: 0 }}
          >
            {renderSider(true)}
          </Drawer>
        )}

        <Layout style={{ height: '100dvh', overflow: 'hidden' }}>
          
          <AppHeader
            themeMode={themeMode}
            toggleTheme={toggleTheme}
            screens={screens}
            onNewChat={handleNewChatWrapper}
            onToggleSider={() => setIsSiderVisible(!isSiderVisible)}
          />

          <Layout> 
            <Content
              className="chatbot-content"
              data-theme={themeMode}
            >
              <ChatWindow messages={messages} messagesEndRef={messagesEndRef} themeMode={themeMode} />
            </Content>

            <Footer className="chatbot-footer" data-theme={themeMode}>
              <RecordingIndicator isRecording={isRecording} themeMode={themeMode} />
              <ChatInput
                input={input}
                setInput={setInput}
                isRecording={isRecording}
                handleSend={handleSend} 
                handleVoiceToggle={handleVoiceToggleWrapper}
                handleFileUpload={handleFileUpload}
                themeMode={themeMode}
                stagedFiles={stagedFiles}
                handleRemoveStagedFile={handleRemoveStagedFile}
              />
            </Footer>
          </Layout>
          
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default InterviewChatbot;