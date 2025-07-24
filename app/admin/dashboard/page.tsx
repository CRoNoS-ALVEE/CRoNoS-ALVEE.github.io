"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import {
  Activity,
  Heart,
  Stethoscope,
  BarChart3,
  ArrowUp,
  ArrowDown,
  LogOut,
  Settings,
  Bell,
  Menu,
  FileText,
  User,
  Calendar,
} from "lucide-react";
import styles from "./dashboard.module.css";

interface StatCard {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

interface RecentActivity {
  id: number;
  action: string;
  user: string;
  time: string;
}

interface DashboardStats {
  users: number;
  doctors: number;
}

function setIsLoading(b: boolean) {
  
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    users: 0,
    doctors: 0,
  });

  // Check authentication on page load
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/admin/auth");
        return;
      }
      setIsAuthenticated(true);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const notifications = [
    {
      id: 1,
      title: "New doctor registration request",
      time: "5 minutes ago",
      icon: <User size={16} />,
    },
    {
      id: 2,
      title: "System maintenance scheduled",
      time: "1 hour ago",
      icon: <Settings size={16} />,
    },
    {
      id: 3,
      title: "New appointment request",
      time: "2 hours ago",
      icon: <Calendar size={16} />,
    },
  ];

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/dashboard-stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );

      console.log("Dashboard stats response:", response.data);

      setDashboardStats(response.data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    setIsClient(true);
    fetchDashboardStats();
  }, [isAuthenticated]);

  const stats: StatCard[] = [
    {
      title: "Total Users",
      value: loading ? "..." : dashboardStats.users.toLocaleString(),
      change: 12.5,
      icon: <Heart className={styles.statIcon} />,
    },
    {
      title: "Active Doctors",
      value: loading ? "..." : dashboardStats.doctors.toLocaleString(),
      change: 8.3,
      icon: <Stethoscope className={styles.statIcon} />,
    },
    {
      title: "Total Appointments",
      value: "2,856",
      change: 8.7,
      icon: <Activity className={styles.statIcon} />,
    },
    {
      title: "Satisfaction Rate",
      value: "95%",
      change: 15.3,
      icon: <BarChart3 className={styles.statIcon} />,
    },
  ];

  const recentActivity: RecentActivity[] = [
    {
      id: 1,
      action: "New doctor registered",
      user: "Dr. Sarah Johnson",
      time: "5 minutes ago",
    },
    {
      id: 2,
      action: "Appointment confirmed",
      user: "Dr. Michael Chen",
      time: "15 minutes ago",
    },
    {
      id: 3,
      action: "Doctor schedule updated",
      user: "Dr. Emily Rodriguez",
      time: "1 hour ago",
    },
    {
      id: 4,
      action: "New report generated",
      user: "Dr. James Wilson",
      time: "2 hours ago",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/auth");
  };

  // Show loading while checking authentication
  if (loading) {
    return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: '#f9fafb'
        }}>
          <div style={{
            padding: '2rem',
            background: 'white',
            borderRadius: '1rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            Loading...
          </div>
        </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  if (!isClient) return null;

  return (
      <div className={styles.container}>
        <button
            className={styles.menuToggle}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu size={24} />
        </button>

        <aside
            className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}
        >
          <div className={styles.sidebarHeader}>
            <Stethoscope size={24} />
            <span>SymptoSeek Admin</span>
          </div>

          <nav className={styles.sidebarNav}>
            <Link
                href="/admin/dashboard"
                className={`${styles.sidebarLink} ${styles.active}`}
            >
              <BarChart3 size={20} />
              Overview
            </Link>
            <Link href="/admin/doctors" className={styles.sidebarLink}>
              <Stethoscope size={20} />
              Doctors
            </Link>
            <Link href="/admin/users" className={styles.sidebarLink}>
              <User size={20} />
              Users
            </Link>
            <Link href="/admin/appointments" className={styles.sidebarLink}>
              <Activity size={20} />
              Appointments
            </Link>
            <Link href="/admin/reports" className={styles.sidebarLink}>
              <FileText size={20} />
              Reports
            </Link>
            <Link href="/admin/settings" className={styles.sidebarLink}>
              <Settings size={20} />
              Settings
            </Link>
          </nav>

          <button onClick={handleLogout} className={styles.logoutButton}>
            <LogOut size={20} />
            Logout
          </button>
        </aside>

        <main className={styles.main}>
          <header className={styles.header}>
            <h1>Admin Overview</h1>
            <div className={styles.headerActions}>
              <div className={styles.notificationButton}>
                <button
                    className={styles.iconButton}
                    onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell size={20} />
                  <span className={styles.notificationBadge}>3</span>
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
                                className={styles.notificationItem}
                            >
                              <div className={styles.notificationIcon}>
                                {notification.icon}
                              </div>
                              <div className={styles.notificationContent}>
                                <div className={styles.notificationTitle}>
                                  {notification.title}
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
              <Link href="/admin/settings" className={styles.iconButton}>
                <Settings size={20} />
              </Link>
            </div>
          </header>

          <div className={styles.stats}>
            {stats.map((stat, index) => (
                <div key={index} className={styles.statCard}>
                  <div className={styles.statHeader}>
                    {stat.icon}
                    <span className={styles.statTitle}>{stat.title}</span>
                  </div>
                  <div className={styles.statValue}>{stat.value}</div>
                  <div
                      className={`${styles.statChange} ${
                          stat.change >= 0 ? styles.positive : styles.negative
                      }`}
                  >
                    {stat.change >= 0 ? (
                        <ArrowUp size={16} />
                    ) : (
                        <ArrowDown size={16} />
                    )}
                    {Math.abs(stat.change)}%
                  </div>
                </div>
            ))}
          </div>

          <section className={styles.activitySection}>
            <h2>Recent Activity</h2>
            <div className={styles.activityList}>
              {recentActivity.map((activity) => (
                  <div key={activity.id} className={styles.activityItem}>
                    <div className={styles.activityContent}>
                  <span className={styles.activityAction}>
                    {activity.action}
                  </span>
                      <span className={styles.activityUser}>{activity.user}</span>
                    </div>
                    <span className={styles.activityTime}>{activity.time}</span>
                  </div>
              ))}
            </div>
          </section>
        </main>
      </div>
  );
}
