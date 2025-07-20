"use client"

import React, { useState, useRef, useEffect } from "react"
import { Mic, Paperclip, Send, Stethoscope } from "lucide-react"
import styles from "../chatbot.module.css"
import Navbar from "../../components/Navbar/Navbar"

interface Message {
  text: string
  isUser: boolean
  timestamp: Date
}

export default function ChatbotNotLoggedIn() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || isTyping) return

    const newMessage: Message = {
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    }

    setMessages((prev: Message[]) => [...prev, newMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI response for non-logged users
    setTimeout(() => {
      const responses = [
        "I can help you with basic health information. For personalized advice and doctor recommendations, please sign up or log in.",
        "Based on your symptoms, I'd recommend consulting with a healthcare professional. Sign up to get personalized doctor recommendations in your area.",
        "I can provide general health guidance. For detailed analysis and local doctor suggestions, please create an account.",
        "That sounds concerning. While I can offer general advice, I'd strongly recommend seeing a doctor. Sign up to find qualified doctors near you.",
        "I understand your concern. For comprehensive health analysis and personalized recommendations, please create a free account."
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      
      const botResponse: Message = {
        text: randomResponse,
        isUser: false,
        timestamp: new Date()
      }
      setMessages((prev: Message[]) => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const quickActions = [
    "I have a headache",
    "I'm feeling nauseous", 
    "I have chest pain",
    "I have a fever",
    "I have stomach pain",
    "Find doctors near me"
  ]

  const handleQuickAction = (action: string) => {
    setInputMessage(action)
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent
    handleSubmit(syntheticEvent)
  }

  const handleLogout = () => {
    // This won't be called for non-logged users, but needed for Navbar component
  }

  return (
    <div className={styles.container}>
      {/* Regular navbar for non-logged users */}
      <Navbar
        isLoggedIn={false}
        onLogout={handleLogout}
      />

      {/* Main Chat Area */}
      <div className={`${styles.mainChat} ${styles.notLoggedInLayout}`}>
        {messages.length === 0 ? (
          // Welcome Screen
          <div className={`${styles.welcomeScreen} ${styles.welcomeScreenNotLoggedIn}`}>
            <div className={styles.welcomeContent}>
              <div className={styles.welcomeHeader}>
                <h1>Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}!</h1>
                <p>Get AI-powered health insights. Sign up for personalized recommendations!</p>
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
                <span>SymptoSeek uses AI. Check for mistakes. Sign up for personalized health tracking and doctor recommendations.</span>
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