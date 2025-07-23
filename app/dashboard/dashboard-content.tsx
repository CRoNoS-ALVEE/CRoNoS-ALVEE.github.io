"use client"

import { useCallback, useEffect, useState } from "react"
import Particles from "react-tsparticles"
import { loadSlim } from "tsparticles-slim"
import Link from "next/link"
import axios from "axios";
import { useRouter } from "next/navigation";
import type { Engine } from "tsparticles-engine"
import { Calendar, Clock, MessageSquare, Stethoscope, User, Plus } from "lucide-react"
import Navbar from "../components/Navbar/Dashboard-Navbar"
import Footer from "../components/Footer/Footer"
import styles from "./dashboard.module.css"

export default function DashboardContent() {

  const router = useRouter();

  interface User {
    _id: string;
    name: string;
    email: string;
    bio: string;
    gender: string;
    age: number | null;
    phone: string;
    address: string;
    zip_code: string;
    country: string;
    state: string;
    city: string;
    profile_pic?: string;
    role: string;
    status: string;
    blood_group: string;
    weight: string;
    height: string;
    allergies: string;
    medical_conditions: string;
    medications: string;
    surgeries: string;
    family_medical_history: string;
    emergency_contact: string;
    date: string;
    __v: number;
  }

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("id");
      
      console.log('Dashboard - Token:', token ? 'Present' : 'Missing');
      console.log('Dashboard - User ID:', userId);
      
      if (!token) {
        console.log('Dashboard - No token found, redirecting to auth');
        router.push("/auth");
        return;
      }
      
      if (!userId) {
        console.log('Dashboard - No user ID found, redirecting to auth');
        localStorage.removeItem("token");
        router.push("/auth");
        return;
      }
      
      try {
        console.log('Dashboard - Making API call to:', `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/auth/profile/${userId}`);

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/auth/profile/${userId}`, {
          headers: {Authorization: `Bearer ${token}`},
        });
        
        console.log('Dashboard - API Response status:', response.status);
        console.log('Dashboard - API Response data:', response.data);
        
        if (response.data) {
          setUser(response.data);
          setIsLoggedIn(true);
          setError("");
          console.log('Dashboard - User data set successfully');
        } else {
          throw new Error("No user data received");
        }
      } catch (err) {
        console.error("Dashboard - Failed to fetch user data:", err);
        
        if (axios.isAxiosError(err)) {
          console.log('Dashboard - Axios error status:', err.response?.status);
          console.log('Dashboard - Axios error data:', err.response?.data);
          
          if (err.response?.status === 401) {
            console.log('Dashboard - Unauthorized, clearing token');
            localStorage.removeItem("token");
            localStorage.removeItem("id");
            router.push("/auth");
            return;
          } else if (err.response?.status === 404) {
            setError(`User not found with ID: ${userId}. Please login again.`);
            localStorage.removeItem("token");
            localStorage.removeItem("id");
            setTimeout(() => router.push("/auth"), 2000);
          } else {
            setError(`Failed to fetch user data: ${err.response?.data?.message || err.message}`);
          }
        } else {
          setError("Network error. Please check your connection and try again.");
        }
        
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("id");
      setUser(null);
      setIsLoggedIn(false);
      router.push("/auth");
    }
  };


  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  const stats = [
    { value: "0", label: "Upcoming Appointments", link: "/reminders"},
    { value: "0", label: "Past Consultations" },
    { value: "0", label: "Active Plans", link: "/plans" },
    { value: "0%", label: "Health Score" },
  ]

  const recentActivity = [
    {
      icon: <Calendar size={20} />,
      title: "Appointment scheduled with Dr. Sarah Johnson",
      time: "2 hours ago",
    },
    {
      icon: <MessageSquare size={20} />,
      title: "Chat session with AI Health Assistant",
      time: "Yesterday",
    },
    {
      icon: <Stethoscope size={20} />,
      title: "Health check-up completed",
      time: "3 days ago",
    },
    {
      icon: <User size={20} />,
      title: "Profile information updated",
      time: "1 week ago",
    },
  ]

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2>Something went wrong</h2>
          <p className={styles.errorMessage}>{error}</p>
          <div className={styles.errorActions}>
            <button 
              onClick={() => window.location.reload()} 
              className={styles.retryButton}
            >
              Try Again
            </button>
            <button 
              onClick={() => router.push("/auth")} 
              className={styles.loginButton}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>🔒</div>
          <h2>Authentication Required</h2>
          <p>Please login to access your dashboard.</p>
          <button 
            onClick={() => router.push("/auth")} 
            className={styles.loginButton}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
      <div className={styles.container}>
        <Navbar 
          isLoggedIn={isLoggedIn} 
          userImage={user?.profile_pic || "https://img.freepik.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg?w=740"} 
          onLogout={handleLogout} 
        />
        <main className={styles.main}>
          <section className={styles.welcomeSection}>
            <Particles
                className={styles.particles}
                init={particlesInit}
                options={{
                  fullScreen: { enable: false },
                  background: {
                    color: {
                      value: "transparent",
                    },
                  },
                  fpsLimit: 120,
                  interactivity: {
                    events: {
                      onHover: {
                        enable: true,
                        mode: "repulse",
                      },
                      resize: true,
                    },
                    modes: {
                      repulse: {
                        distance: 100,
                        duration: 0.4,
                      },
                    },
                  },
                  particles: {
                    color: {
                      value: "#9333EA",
                    },
                    links: {
                      color: "#9333EA",
                      distance: 150,
                      enable: true,
                      opacity: 0.2,
                      width: 1,
                    },
                    move: {
                      direction: "none",
                      enable: true,
                      outModes: {
                        default: "bounce",
                      },
                      random: false,
                      speed: 2,
                      straight: false,
                    },
                    number: {
                      density: {
                        enable: true,
                        area: 800,
                      },
                      value: 50,
                    },
                    opacity: {
                      value: 0.2,
                    },
                    shape: {
                      type: "circle",
                    },
                    size: {
                      value: { min: 1, max: 3 },
                    },
                  },
                  detectRetina: true,
                }}
            />
            <div className={styles.welcomeContent}>
              <h1 className={styles.welcomeTitle}>Welcome back, {user.name}!</h1>
              <p className={styles.welcomeText}>
                Track your health journey and manage your appointments all in one place
              </p>
            </div>
          </section>

          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
                <Link
                    key={index}
                    href={stat.link || "#"}
                    className={styles.statCard}
                    style={{ textDecoration: 'none' }}
                >
                  <div className={styles.statValue}>{stat.value}</div>
                  <div className={styles.statLabel}>{stat.label}</div>
                  {stat.link && (
                      <div className={styles.statAction}>
                        <Plus size={16} />
                        View
                      </div>
                  )}
                </Link>
            ))}
          </div>

          <section className={styles.recentActivity}>
            <h2 className={styles.sectionTitle}>Recent Activity</h2>
            <div className={styles.activityList}>
              {recentActivity.map((activity, index) => (
                  <div key={index} className={styles.activityItem}>
                    <div className={styles.activityIcon}>{activity.icon}</div>
                    <div className={styles.activityContent}>
                      <Link href="/profile" className={styles.activityTitle}>{activity.title}</Link>
                      <div className={styles.activityTime}>{activity.time}</div>
                    </div>
                  </div>
              ))}
            </div>
          </section>
        </main>
        <Footer />
      </div>
  )
}