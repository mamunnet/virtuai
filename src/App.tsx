import { useState, useEffect, useRef } from 'react';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { ChatMessages } from './components/chat/ChatMessages';
import { ChatInput } from './components/chat/ChatInput';
import { QuestionList } from './components/learn/QuestionList';
import { ChatHistory } from './components/history/ChatHistory';
import { SettingsPage } from './components/settings/SettingsPage';
import { ImagePage } from './components/image/ImagePage';
import { LearnPage } from './components/learn/LearnPage';
import { AuthPage } from './components/auth/AuthPage';
import { getAIResponse } from './services/ai';
import { auth } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface Message {
  id: string;
  text: string;
  isAI: boolean;
  pending?: boolean;
  timestamp?: number;
}

interface ChatHistoryItem {
  id: string;
  messages: Message[];
  lastMessage: string;
  timestamp: number;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [replyTo, setReplyTo] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleReply = (text: string) => {
    setReplyTo(text);
    const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (inputElement) {
      inputElement.focus();
    }
  };

  const handleSend = async () => {
    if (message.trim() && !isLoading) {
      setActiveTab('chat');

      const userMessage: Message = {
        id: Date.now().toString(),
        text: message,
        isAI: false,
        timestamp: Date.now()
      };
      
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      
      const pendingMessage: Message = {
        id: Date.now().toString() + '-ai',
        text: '...',
        isAI: true,
        pending: true,
        timestamp: Date.now()
      };
      
      setMessages([...newMessages, pendingMessage]);
      setMessage('');
      setReplyTo(null);
      setIsLoading(true);

      try {
        const prompt = replyTo 
          ? `Previous message: "${replyTo}"\n\nUser's reply: ${message}`
          : message;

        const response = await getAIResponse(prompt);
        const aiMessage: Message = {
          ...pendingMessage,
          text: response,
          pending: false
        };
        
        const finalMessages = [...newMessages, aiMessage];
        setMessages(finalMessages);
        
        const chatId = Date.now().toString();
        const newChat: ChatHistoryItem = {
          id: chatId,
          messages: finalMessages,
          lastMessage: message,
          timestamp: Date.now()
        };
        setChatHistory(prev => [newChat, ...prev]);
      } catch (error) {
        const errorMessage: Message = {
          ...pendingMessage,
          text: 'Sorry, I encountered an error. Please try again.',
          pending: false
        };
        setMessages([...newMessages, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleQuestionClick = (question: string) => {
    setMessage(question);
    if (activeTab !== 'home') {
      setActiveTab('home');
    }
  };

  const handleCloseChat = () => {
    setActiveTab('home');
    setMessage('');
  };

  const handleHistoryClick = (chat: ChatHistoryItem) => {
    setMessages(chat.messages);
    setActiveTab('chat');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <ChatMessages 
              messages={messages} 
              onReply={handleReply}
            />
            <div ref={messagesEndRef} />
          </div>
        );
      
      case 'learn':
        return <LearnPage />;
      
      case 'image':
        return <ImagePage />;
      
      case 'history':
        return <ChatHistory history={chatHistory} onChatSelect={handleHistoryClick} />;
      
      case 'settings':
        return <SettingsPage />;
      
      case 'home':
      default:
        return (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <QuestionList onQuestionClick={handleQuestionClick} />
            </div>
          </div>
        );
    }
  };

  const shouldShowChatInput = activeTab === 'home' || activeTab === 'chat';

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-background text-foreground md:hidden">
      <Header 
        showCloseButton={activeTab === 'chat'}
        onClose={() => setActiveTab('home')}
        user={user}
      />

      <main className="flex-1 px-5 py-6 flex flex-col min-h-0">
        {renderContent()}
      </main>

      {shouldShowChatInput && (
        <ChatInput
          message={message}
          isLoading={isLoading}
          replyTo={replyTo}
          onChange={setMessage}
          onSend={handleSend}
          onCancelReply={() => setReplyTo(null)}
        />
      )}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
