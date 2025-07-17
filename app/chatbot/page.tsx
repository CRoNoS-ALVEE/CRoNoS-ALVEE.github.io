"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, Plus, Mic, Paperclip, Send, MessageSquare, Stethoscope, Menu, X, User, Settings, LogOut } from "lucide-react"
import Navbar from "../components/Navbar/Navbar"
import styles from "./chatbot.module.css"
import { useRouter } from "next/navigation"
import axios from "axios"
import Link from "next/link"

interface Message {
  text: string
  isUser: boolean
  timestamp: Date
}

interface Conversation {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
}

export default function ChatbotPage() {
  const router = useRouter()

  interface User {
    profile_pic?: string
    name?: string
  }

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setLoggedIn(false)
        setLoading(false)
        return
      }
      try {
        const userId = localStorage.getItem("id")
        const response = await axios.get(`http://localhost:5000/api/auth/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUser(response.data)
        setLoggedIn(true)
      } catch (err) {
        console.error("Failed to fetch user data:", err)
        setError("Failed to fetch user data.")
        setLoggedIn(false)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      setUser(null)
      setLoggedIn(false)
      router.push("/auth")
    }
  }

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "Headache and Fever Symptoms",
      lastMessage: "Based on your symptoms, I recommend...",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: "2", 
      title: "Chest Pain Consultation",
      lastMessage: "Let me help you understand your chest pain...",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      id: "3",
      title: "Skin Rash Analysis",
      lastMessage: "Can you describe the appearance of the rash?",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: "4",
      title: "Sleep Disorder Discussion",
      lastMessage: "Sleep disorders can have various causes...",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  ])

  const [currentConversation, setCurrentConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<number | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isTyping) return

    const newMessage: Message = {
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, newMessage])
    setInputMessage("")
    setIsTyping(true)

    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = window.setTimeout(() => {
      const botResponse: Message = {
        text: "I understand your concern. Could you provide more details about your symptoms? For example, when did they start, and have you noticed any patterns or triggers?",
        isUser: false,
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 2000)
  }

  const startNewConversation = () => {
    setCurrentConversation(null)
    setMessages([])
    setIsSidebarOpen(false)
  }

  const selectConversation = (conversationId: string) => {
    setCurrentConversation(conversationId)
    setMessages([
      {
        text: "Hello! I'm your AI health assistant. How can I help you today?",
        isUser: false,
        timestamp: new Date()
      }
    ])
    setIsSidebarOpen(false)
  }

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen)
  }

  const quickActions = [
    "Analyze symptoms",
    "Get health advice", 
    "Learn about conditions",
    "Medication guidance",
    "Emergency signs",
    "Wellness tips"
  ]

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const handleQuickAction = (action: string) => {
    setInputMessage(action)
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent
    handleSubmit(syntheticEvent)
  }

  return (
    <div className={styles.container}>
      {/* Conditional Navbar - only show for non-logged-in users */}
      {!loggedIn && (
        <Navbar 
          isLoggedIn={false} 
          userImage="" 
          onLogout={handleLogout} 
        />
      )}

      {/* Logged-in Layout */}
      {loggedIn && (
        <>
          {/* Top Navbar for logged-in users */}
          <div className={styles.topNavbar}>
            <div className={styles.navbarContent}>
              <div className={styles.navbarLeft}>
                <button 
                  className={styles.sidebarToggle}
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  <Menu size={20} />
                </button>
                <Link href="/" className={styles.navbarTitle}>
                  <Stethoscope size={24} className={styles.navbarLogo} />
                  <span>SymptoSeek</span>
                </Link>
              </div>
              <div className={styles.navbarRight}>
                <Link href="/dashboard" className={styles.navButton}>
                  Dashboard
                </Link>
                <Link href="/doctors" className={styles.navButton}>
                  Doctors
                </Link>
                <div className={styles.profileContainer} ref={profileRef}>
                  <button onClick={toggleProfile} className={styles.profileButton}>
                    <div className={styles.profilePicture}>
                      <img 
                        src={user?.profile_pic || "https://img.freepik.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg?w=740"} 
                        alt="Profile" 
                        width={32}
                        height={32}
                      />
                    </div>
                  </button>
                  {isProfileOpen && (
                    <div className={styles.profileDropdown}>
                      <Link href="/profile" className={styles.dropdownItem}>
                        <User size={16} />
                        <span>Profile</span>
                      </Link>
                      <Link href="/settings" className={styles.dropdownItem}>
                        <Settings size={16} />
                        <span>Settings</span>
                      </Link>
                      <button onClick={handleLogout} className={styles.dropdownItem}>
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar for logged-in users */}
          <div className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
            <div className={styles.sidebarHeader}>
              <div className={styles.sidebarTop}>
                <button className={styles.newChatButton} onClick={startNewConversation}>
                  <Plus size={18} />
                  <span>New chat</span>
                </button>
                <button 
                  className={styles.closeSidebarButton}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            <div className={styles.conversationsList}>
              {conversations.map((conversation) => (
                <div 
                  key={conversation.id}
                  className={`${styles.conversationItem} ${currentConversation === conversation.id ? styles.active : ''}`}
                  onClick={() => selectConversation(conversation.id)}
                >
                  <div className={styles.conversationTitle}>{conversation.title}</div>
                  <div className={styles.conversationTime}>{formatTime(conversation.timestamp)}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Overlay for mobile sidebar */}
      {loggedIn && isSidebarOpen && <div className={styles.overlay} onClick={() => setIsSidebarOpen(false)} />}

      {/* Main Chat Area */}
      <div className={`${styles.mainChat} ${loggedIn ? styles.loggedInLayout : styles.guestLayout}`}>
        {!currentConversation && messages.length === 0 ? (
          // Welcome Screen
          <div className={styles.welcomeScreen}>
            <div className={styles.welcomeContent}>
              <div className={styles.welcomeHeader}>
                <h1>Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}{user?.name ? `, ${user.name}` : ''}!</h1>
                <p>What can I help you with today?</p>
              </div>
              
              <div className={styles.quickActions}>
                {quickActions.map((action, index) => (
                  <button 
                    key={index}
                    className={styles.quickActionButton}
                    onClick={() => handleQuickAction(action)}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
            
            <div className={styles.inputSection}>
              <form onSubmit={handleSubmit} className={styles.inputContainer}>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask anything..."
                    className={styles.input}
                    disabled={isTyping}
                  />
                  <div className={styles.inputActions}>
                    <button type="button" className={styles.actionButton}>
                      <Paperclip size={18} />
                    </button>
                    <button type="button" className={styles.actionButton}>
                      <Mic size={18} />
                    </button>
                    <button type="submit" className={styles.sendButton} disabled={!inputMessage.trim() || isTyping}>
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </form>
              
              <div className={styles.disclaimer}>
                <Stethoscope size={16} />
                <span>SymptoSeek uses AI. Check for mistakes. Conversations are used to train AI and SymptoSeek can learn about your health patterns.</span>
              </div>
            </div>
          </div>
        ) : (
          // Chat Messages
          <div className={styles.chatMessages}>
            <div className={styles.messagesContainer}>
              {messages.map((message, index) => (
                <div key={index} className={styles.messageWrapper}>
                  {!message.isUser && (
                    <div className={styles.botAvatar}>
                      <Stethoscope size={20} />
                    </div>
                  )}
                  <div className={`${styles.message} ${message.isUser ? styles.userMessage : styles.assistantMessage}`}>
                    {message.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className={styles.messageWrapper}>
                  <div className={styles.botAvatar}>
                    <Stethoscope size={20} />
                  </div>
                  <div className={styles.typing}>
                    <div className={styles.typingDot}></div>
                    <div className={styles.typingDot}></div>
                    <div className={styles.typingDot}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className={styles.inputSection}>
              <form onSubmit={handleSubmit} className={styles.inputContainer}>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask anything..."
                    className={styles.input}
                    disabled={isTyping}
                  />
                  <div className={styles.inputActions}>
                    <button type="button" className={styles.actionButton}>
                      <Paperclip size={18} />
                    </button>
                    <button type="button" className={styles.actionButton}>
                      <Mic size={18} />
                    </button>
                    <button type="submit" className={styles.sendButton} disabled={!inputMessage.trim() || isTyping}>
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}