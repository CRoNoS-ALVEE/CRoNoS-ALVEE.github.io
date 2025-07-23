"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Bell,
  Settings,
  LogOut,
  User,
  Stethoscope,
  Plus,
  Clock,
  Pill,
  Activity,
  Menu,
  X,
} from "lucide-react";
import styles from "./reminders.module.css";
import axios from "axios";

interface Reminder {
  id: string;
  title: string;
  time: string;
  type: string;
  description: string;
  completed: boolean;
}

interface ApiReminder {
  _id: string;
  user: string;
  title: string;
  description: string;
  type: string;
  time: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse extends Array<ApiReminder> {}

interface NavItemProps {
  href?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}
interface User {
  _id?: string;
  profile_pic?: string;
  name?: string;
}

type ReminderFormData = Omit<Reminder, "id" | "completed">;

export default function RemindersPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeReminders, setActiveReminders] = useState<Reminder[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newReminder, setNewReminder] = useState<ReminderFormData>({
    title: "",
    time: "",
    type: "medication",
    description: "",
  });
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/auth");
          return;
        }

        const response = await axios.get<ApiReminder[]>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reminder`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Axios throws for non-2xx responses, so no need to check response.ok

        const data = response.data;

        // Map API response to match our Reminder interface
        const mappedReminders: Reminder[] = data.map((item: any) => ({
          id: item._id,
          title: item.title,
          time: item.time,
          type: item.type.toLowerCase(),
          description: item.description,
          completed: item.isCompleted,
        }));

        // console.log("Mapped Reminders:", mappedReminders);

        setActiveReminders(mappedReminders);
      } catch (error) {
        console.error("Error fetching reminders:", error);
      }
    };

    fetchReminders();
  }, [router]);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth");
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from local storage
    setUser(null); // Reset user state
    router.push("/auth"); // Redirect to auth page
  };

  const toggleComplete = (id: string) => {
    setActiveReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === id
          ? { ...reminder, completed: !reminder.completed }
          : reminder
      )
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "medication":
        return <Pill size={20} />;
      case "appointment":
        return <Calendar size={20} />;
      case "exercise":
        return <Activity size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.menuButton}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu size={24} />
      </button>

      <aside
        className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}
      >
        <Link href="/" className={styles.mainLogo}>
          <div className={styles.logoIcon}>
            <Stethoscope size={24} />
          </div>
          <span>SymptoSeek</span>
        </Link>

        <nav className={styles.navigation}>
          <Link href="/dashboard" className={styles.navItem}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/reports" className={styles.navItem}>
            <FileText size={20} />
            Reports
          </Link>
          <Link href="/plans" className={styles.navItem}>
            <Calendar size={20} />
            Plans
          </Link>
          <Link
            href="/reminders"
            className={`${styles.navItem} ${styles.active}`}
          >
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
          <button onClick={handleLogout} className={styles.navItem}>
            <LogOut size={20} />
            Log out
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Reminders</h1>
          <button
            className={styles.addButton}
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={20} />
            Add Reminder
          </button>
        </div>

        <div className={styles.reminders}>
          {activeReminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`${styles.reminderCard} ${
                reminder.completed ? styles.completed : ""
              }`}
            >
              <div className={styles.reminderHeader}>
                <div className={styles.reminderIcon}>
                  {getIcon(reminder.type.toLowerCase())}
                </div>
                <div className={styles.reminderTime}>
                  <Clock size={16} />
                  {reminder.time}
                </div>
              </div>

              <div className={styles.reminderContent}>
                <h3>{reminder.title}</h3>
                <p>{reminder.description}</p>
              </div>

              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={reminder.completed}
                  onChange={() => toggleComplete(reminder.id)}
                />
                <span className={styles.checkmark}></span>
                Mark as completed
              </label>
            </div>
          ))}
        </div>

        {isAddModalOpen && (
          <div
            className={styles.modalOverlay}
            onClick={() => setIsAddModalOpen(false)}
          >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <button
                className={styles.closeButton}
                onClick={() => setIsAddModalOpen(false)}
              >
                <X size={20} />
              </button>

              <div className={styles.modalHeader}>
                <h2>Add New Reminder</h2>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();

                  if (!user || !user._id) {
                    console.error("User not loaded yet");
                    return;
                  }

                  try {
                    const token = localStorage.getItem("token");
                    if (!token) {
                      router.push("/auth");
                      return;
                    }

                    const body = {
                      user: user._id, // Dynamic user ID
                      title: newReminder.title,
                      description: newReminder.description,
                      type: newReminder.type,
                      time: newReminder.time,
                      isCompleted: false,
                    };

                    const response = await axios.post<ApiReminder>(
                      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reminder`,
                      body,
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "application/json",
                        },
                      }
                    );

                    const createdReminder = response.data;

                    const mappedReminder: Reminder = {
                      id: createdReminder._id,
                      title: createdReminder.title,
                      time: createdReminder.time,
                      type: createdReminder.type.toLowerCase(),
                      description: createdReminder.description,
                      completed: createdReminder.isCompleted,
                    };

                    setActiveReminders((prev) => [...prev, mappedReminder]);

                    // Reset form & close modal
                    setIsAddModalOpen(false);
                    setNewReminder({
                      title: "",
                      time: "",
                      type: "medication",
                      description: "",
                    });
                  } catch (error) {
                    console.error("Error adding reminder:", error);
                  }
                }}
              >
                <div className={styles.modalContent}>
                  <div className={styles.formGroup}>
                    <label htmlFor="title">Title</label>
                    <input
                      id="title"
                      type="text"
                      value={newReminder.title}
                      onChange={(e) =>
                        setNewReminder((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="e.g. Take Blood Pressure Medicine"
                      required
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="time">Time</label>
                      <input
                        id="time"
                        type="time"
                        value={newReminder.time}
                        onChange={(e) =>
                          setNewReminder((prev) => ({
                            ...prev,
                            time: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="type">Type</label>
                      <select
                        id="type"
                        value={newReminder.type}
                        onChange={(e) => {
                          const value = e.target
                            .value as ReminderFormData["type"];
                          setNewReminder((prev) => ({ ...prev, type: value }));
                        }}
                        required
                      >
                        <option value="Medication">Medication</option>
                        <option value="Appointment">Appointment</option>
                        <option value="Exercise">Exercise</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      className={styles.textarea}
                      value={newReminder.description}
                      onChange={(e) =>
                        setNewReminder((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Add any additional details..."
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
                    Add Reminder
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
