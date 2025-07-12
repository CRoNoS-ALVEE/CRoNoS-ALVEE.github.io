"use client"

import {type ReactNode, useState} from 'react'
import { Calendar, Clock, Plus, LayoutDashboard, FileText, Bell, User, Settings, LogOut, Stethoscope, Menu, X } from "lucide-react"
import Link from "next/link"
import Navbar from "../components/Navbar/Navbar"
import Footer from "../components/Footer/Footer"
import styles from "./plans.module.css"
import {useRouter} from "next/navigation";

interface NavItemProps {
  href?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}
interface User {
  profile_pic?: string;
  name?: string;
}

interface Plan {
  id: number
  title: string
  date: string
  time: string
  type: string
  status: "upcoming" | "completed" | "cancelled"
}

interface Reminder {
  id: number
  title: string
  date: string
  isActive: boolean
}

const plans: Plan[] = [
  {
    id: 1,
    title: "General Health Check-up",
    date: "2024-04-15",
    time: "10:00 AM",
    type: "Check-up",
    status: "upcoming"
  },
  {
    id: 2,
    title: "Dental Cleaning",
    date: "2024-04-20",
    time: "2:30 PM",
    type: "Dental",
    status: "upcoming"
  },
  {
    id: 3,
    title: "Blood Test",
    date: "2024-03-10",
    time: "9:00 AM",
    type: "Test",
    status: "completed"
  }
]

const reminders: Reminder[] = [
  {
    id: 1,
    title: "Take medication",
    date: "2024-04-15",
    isActive: true
  },
  {
    id: 2,
    title: "Fast before blood test",
    date: "2024-04-20",
    isActive: true
  }
]

export default function PlansPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeReminders, setActiveReminders] = useState(reminders)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newPlan, setNewPlan] = useState({
    title: "",
    date: "",
    time: "",
    type: "Check-up",
    description: "",
    status: "upcoming"
  })

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically make an API call to add the plan
    console.log('New plan data:', newPlan)
    setIsAddModalOpen(false)
  }

  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from local storage
    setUser(null); // Reset user state
    router.push("/auth"); // Redirect to auth page
  };

  const toggleComplete = (id: number) => {

  }

  return (
      <div className={styles.container}>
        <button
            className={styles.menuButton}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu size={24} />
        </button>

        <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
          <Link href="/" className={styles.mainLogo}>
            <div className={styles.logoIcon}>
              <Stethoscope size={24} />
            </div>
            <span>SymptoSeek</span>
          </Link>

          <nav>
            <Link href="/dashboard" className={styles.navItem}>
              <LayoutDashboard size={20} />
              Dashboard
            </Link>
            <Link href="/reports" className={styles.navItem}>
              <FileText size={20} />
              Reports
            </Link>
            <Link href="/plans" className={`${styles.navItem} ${styles.active}`}>
              <Calendar size={20} />
              Plans
            </Link>
            <Link href="/reminders" className={styles.navItem}>
              <Bell size={20} />
              Reminders
            </Link>
            <Link href="/profile" className={styles.navItem}>
              <User size={20} />
              Profile
            </Link>
          </nav>

          <div className={styles.bottomNav}>
            <Link href="/settings" className={styles.navItem}>
              <Settings size={20} />
              Settings
            </Link>
            <button onClick={handleLogout}  className={styles.navItem}>
              <LogOut size={20} />
              Log out
            </button>
          </div>
        </aside>

        <main className={styles.main}>
          <div className={styles.header}>
            <h1>Health Plans</h1>
            <button className={styles.addButton} onClick={() => setIsAddModalOpen(true)}>
              <Plus size={20} />
              New Plan
            </button>
          </div>

          <div className={styles.content}>
            {plans.map((plan) => (
                <div key={plan.id} className={`${styles.planCard} ${styles[plan.status]}`}>
                  <div className={styles.planHeader}>
                    <h3 className={styles.planTitle}>{plan.title}</h3>
                    <span className={styles.planStatus}>{plan.status}</span>
                  </div>
                  <div className={styles.planDetails}>
                    <div className={styles.planInfo}>
                      <Calendar size={16} />
                      <span>{new Date(plan.date).toLocaleDateString()}</span>
                    </div>
                    <div className={styles.planInfo}>
                      <Clock size={16} />
                      <span>{plan.time}</span>
                    </div>
                  </div>
                  <div className={styles.planType}>{plan.type}</div>
                </div>
            ))}
          </div>

          {isAddModalOpen && (
              <div className={styles.modalOverlay} onClick={() => setIsAddModalOpen(false)}>
                <div className={styles.modal} onClick={e => e.stopPropagation()}>
                  <button
                      className={styles.closeButton}
                      onClick={() => setIsAddModalOpen(false)}
                  >
                    <X size={20} />
                  </button>

                  <div className={styles.modalHeader}>
                    <h2>Add New Health Plan</h2>
                  </div>

                  <form onSubmit={handleAddPlan}>
                    <div className={styles.modalContent}>
                      <div className={styles.formGroup}>
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            type="text"
                            value={newPlan.title}
                            onChange={(e) => setNewPlan(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="e.g. General Health Check-up"
                            required
                        />
                      </div>

                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label htmlFor="date">Date</label>
                          <input
                              id="date"
                              type="date"
                              value={newPlan.date}
                              onChange={(e) => setNewPlan(prev => ({ ...prev, date: e.target.value }))}
                              required
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="time">Time</label>
                          <input
                              id="time"
                              type="time"
                              value={newPlan.time}
                              onChange={(e) => setNewPlan(prev => ({ ...prev, time: e.target.value }))}
                              required
                          />
                        </div>
                      </div>

                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label htmlFor="type">Type</label>
                          <select
                              id="type"
                              value={newPlan.type}
                              onChange={(e) => setNewPlan(prev => ({ ...prev, type: e.target.value }))}
                              required
                          >
                            <option value="Check-up">Check-up</option>
                            <option value="Dental">Dental</option>
                            <option value="Test">Test</option>
                            <option value="Vaccination">Vaccination</option>
                            <option value="Therapy">Therapy</option>
                          </select>
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="status">Status</label>
                          <select
                              id="status"
                              value={newPlan.status}
                              onChange={(e) => setNewPlan(prev => ({ ...prev, status: e.target.value }))}
                              required
                          >
                            <option value="upcoming">Upcoming</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            className={styles.textarea}
                            value={newPlan.description}
                            onChange={(e) => setNewPlan(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Add any additional details about the plan..."
                            rows={4}
                        />
                      </div>
                    </div>

                    <div className={styles.modalActions}>
                      <button
                          type="button"
                          className={styles.cancelButton}
                          onClick={() => setIsAddModalOpen(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className={styles.saveButton}>
                        Add Plan
                      </button>
                    </div>
                  </form>
                </div>
              </div>
          )}
        </main>
      </div>
  )
}