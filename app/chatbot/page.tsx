"use client"

import React, { useState, useRef, useEffect } from "react"
import { Bot, Plus, Mic, Paperclip, Send, MessageSquare, Stethoscope, Menu, X, Search, Bell, User, Settings, LogOut, Home, Calendar, FileText } from "lucide-react"
import styles from "./chatbot.module.css"
import { useRouter } from "next/navigation"
import axios from "axios"
import Link from "next/link"
import Navbar from "../components/Navbar/Navbar"

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

interface UserLocation {
  latitude: number | null
  longitude: number | null
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
        const response = await axios.get(`http://localhost:5000/api/auth/profile`, {
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
      localStorage.removeItem("id")
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
  const [isSidebarHovered, setIsSidebarHovered] = useState(false)
  const [isSidebarPinned, setIsSidebarPinned] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [isMobile, setIsMobile] = useState(true) // Start as true to prevent flash
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<number | null>(null)
  const sidebarTimeoutRef = useRef<number | null>(null)
  const notificationRef = useRef<HTMLDivElement>(null)

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      if (window.innerWidth > 768) {
        setIsSidebarHovered(false)
        setIsSidebarPinned(false)
      } else {
        // On mobile, ensure sidebar is closed by default
        setIsSidebarHovered(false)
        setIsSidebarPinned(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle click outside notifications
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  const handleMouseEnterSidebar = () => {
    if (isMobile) return
    if (sidebarTimeoutRef.current) {
      clearTimeout(sidebarTimeoutRef.current)
    }
    setIsSidebarHovered(true)
  }

  const handleMouseLeaveSidebar = () => {
    if (isMobile) return
    if (!isSidebarPinned) {
      sidebarTimeoutRef.current = window.setTimeout(() => {
        setIsSidebarHovered(false)
      }, 300)
    }
  }

  const toggleSidebarPin = () => {
    if (isMobile) {
      const newState = !isSidebarHovered
      setIsSidebarHovered(newState)
      setIsSidebarPinned(false) // Never pin on mobile
      return
    }
    setIsSidebarPinned(!isSidebarPinned)
    if (!isSidebarPinned) {
      setIsSidebarHovered(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isTyping) return

    const newMessage: Message = {
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    }

    setMessages((prev: Message[]) => [...prev, newMessage])
    const userMessage = inputMessage
    setInputMessage("")
    setIsTyping(true)

    // Check for reset command
    if (userMessage.toLowerCase() === 'reset') {
      setMessages([{
        text: "Session has been reset. How can I help you today?",
        isUser: false,
        timestamp: new Date()
      }])
      setIsTyping(false)
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Authentication error. Please login again.")
        router.push("/auth")
        return
      }

      // Get user location if available
      let userLocation: UserLocation = { latitude: null, longitude: null }
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject)
          })
          userLocation.latitude = position.coords.latitude
          userLocation.longitude = position.coords.longitude
        } catch (err) {
          console.warn("Could not get location:", err)
        }
      }

      const response = await axios.post(
        'http://localhost:5000/api/chat',
        {
          message: userMessage,
          latitude: userLocation.latitude,
          longitude: userLocation.longitude
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const data = response.data

      if (data.success && data.bot_response_parts) {
        // Process bot response parts
        for (const part of data.bot_response_parts) {
          if (part.type === 'text') {
            const botResponse: Message = {
              text: part.content,
              isUser: false,
              timestamp: new Date()
            }
            setMessages((prev: Message[]) => [...prev, botResponse])
          } else if (part.type === 'doctors' && Array.isArray(part.content)) {
            // Handle doctors list
            let doctorText = "Here are some recommended doctors:\n\n"
            part.content.forEach((doc: any, index: number) => {
              doctorText += `${index + 1}. **${doc.name || 'N/A'}**\n`
              doctorText += `   ${doc.degree || ''}\n`
              doctorText += `   Specialty: ${doc.speciality || 'N/A'}\n`
              doctorText += `   Hospital: ${doc.hospital_name || 'N/A'}\n`
              doctorText += `   Phone: ${doc.number || 'N/A'}\n\n`
            })
            
            const doctorMessage: Message = {
              text: doctorText,
              isUser: false,
              timestamp: new Date()
            }
            setMessages((prev: Message[]) => [...prev, doctorMessage])
          }
        }
      } else {
        // Handle cases where success is false
        const botResponse: Message = {
          text: data.message || "I'm here to help. Could you provide more details about your symptoms?",
          isUser: false,
          timestamp: new Date()
        }
        setMessages((prev: Message[]) => [...prev, botResponse])
      }
    } catch (error: any) {
      console.error('Send message error:', error)
      let errorMessage = "I'm having trouble connecting right now. Please try again."
      
      if (error.response?.status === 401) {
        errorMessage = "Your session has expired. Please login again."
        router.push("/auth")
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      
      const errorResponse: Message = {
        text: errorMessage,
        isUser: false,
        timestamp: new Date()
      }
      setMessages((prev: Message[]) => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const startNewConversation = () => {
    setCurrentConversation(null)
    setMessages([])
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
  }

  const quickActions = [
    "I have a headache",
    "I'm feeling nauseous", 
    "I have chest pain",
    "I have a fever",
    "I have stomach pain",
    "Find doctors near me"
  ]

  const notifications = [
    {
      id: 1,
      title: "New health tip available",
      message: "Check out our latest wellness recommendations",
      time: "5 minutes ago",
      unread: true
    },
    {
      id: 2,
      title: "Appointment reminder",
      message: "You have an upcoming appointment tomorrow",
      time: "1 hour ago",
      unread: true
    },
    {
      id: 3,
      title: "Health report ready",
      message: "Your latest health analysis is available",
      time: "2 hours ago",
      unread: false
    }
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
        {/* Always show navbar */}
        {loggedIn ? (
            /* Top Navbar for logged in users */
            <div className={`${styles.topNavbar} ${styles.darkNavbar}`}>
              <div className={styles.navbarContent}>
                <div className={styles.navbarLeft}>
                  <div
                      className={styles.sidebarTrigger}
                      onClick={toggleSidebarPin}
                  >
                    <Menu size={20} />
                  </div>
                  <div className={styles.logoContainer}>
                    <div className={styles.logoIcon}>
                      <Stethoscope size={20} />
                    </div>
                    <span className={styles.logoText}>SymptoSeek</span>
                  </div>
                </div>
                <div className={styles.navbarRight}>

                  <div className={styles.notificationContainer} ref={notificationRef}>
                    <button
                        className={styles.navIconButton}
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                      <Bell size={20} />
                      {notifications.filter(n => n.unread).length > 0 && (
                          <span className={styles.notificationBadge}>
                          {notifications.filter(n => n.unread).length}
                        </span>
                      )}
                    </button>
                    {showNotifications && (
                        <div className={styles.notificationDropdown}>
                          <div className={styles.notificationHeader}>
                            <h3>Notifications</h3>
                          </div>
                          <div className={styles.notificationList}>
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`${styles.notificationItem} ${notification.unread ? styles.unread : ''}`}
                                >
                                  <div className={styles.notificationContent}>
                                    <div className={styles.notificationTitle}>
                                      {notification.title}
                                    </div>
                                    <div className={styles.notificationMessage}>
                                      {notification.message}
                                    </div>
                                    <div className={styles.notificationTime}>
                                      {notification.time}
                                    </div>
                                  </div>
                                </div>
                            ))}
                          </div>
                        </div>
                    )}
                  </div>
                  <Link href="/profile" className={styles.userProfile}>
                    <img
                        src={user?.profile_pic || "https://img.freepik.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg?w=740"}
                        alt="Profile"
                        className={styles.profileImage}
                    />
                  </Link>
                </div>
              </div>
            </div>
        ) : (
            /* Regular navbar for non-logged users */
            <Navbar
                isLoggedIn={false}
                onLogout={handleLogout}
            />
        )}

        {loggedIn && (
            /* Sidebar only for logged in users */
            <div
                className={`${styles.sidebar} ${(isSidebarHovered || isSidebarPinned) ? styles.sidebarExpanded : ''}`}
                onMouseEnter={!isMobile ? handleMouseEnterSidebar : undefined}
                onMouseLeave={!isMobile ? handleMouseLeaveSidebar : undefined}
            >
              <div className={styles.sidebarContent}>
                <div className={styles.sidebarTop}>
                  <div className={styles.sidebarSearch}>
                    <Search size={16} />
                    <input type="text" placeholder="Search..." />
                  </div>
                </div>

                <div className={styles.sidebarHeader}>
                  <button className={styles.newChatButton} onClick={startNewConversation}>
                    <Plus size={18} />
                    <span>New chat</span>
                  </button>
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

                <div className={styles.sidebarBottom}>
                  <Link href="/dashboard" className={styles.sidebarNavItem}>
                    <Home size={18} />
                    <span>Dashboard</span>
                  </Link>
                  <Link href="/profile" className={styles.sidebarNavItem}>
                    <User size={18} />
                    <span>Profile</span>
                  </Link>
                  <Link href="/settings" className={styles.sidebarNavItem}>
                    <Settings size={18} />
                    <span>Settings</span>
                  </Link>
                  <button onClick={handleLogout} className={styles.sidebarNavItem}>
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* Main Chat Area */}
        <div className={`${styles.mainChat} ${loggedIn ? styles.loggedInLayout : styles.notLoggedInLayout} ${loggedIn && (isSidebarHovered || isSidebarPinned) && !isMobile ? styles.withSidebar : ''}`}>
          {!currentConversation && messages.length === 0 ? (
              // Welcome Screen
              <div
                  className={`${styles.welcomeScreen} ${!loggedIn ? styles.welcomeScreenNotLoggedIn : ''}`}
              >
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

        {/* Overlay for mobile sidebar */}
        {loggedIn && isMobile && isSidebarHovered && (
            <div className={styles.sidebarOverlay} onClick={() => {
              setIsSidebarHovered(false)
              setIsSidebarPinned(false)
            }} />
        )}
      </div>
  )
}