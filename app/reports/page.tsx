"use client"

import Link from "next/link"
import {type ReactNode, useState} from "react"
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Bell,
  Settings,
  LogOut,
  User,
  Stethoscope,
  Download,
  Filter,
  Menu
} from "lucide-react"
import styles from "./reports.module.css"

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

interface Report {
  id: number
  title: string
  date: string
  type: string
  doctor: string
  status: "completed" | "pending" | "processing"
}

const reports: Report[] = [
  {
    id: 1,
    title: "Annual Health Check-up Report",
    date: "2024-03-15",
    type: "Check-up",
    doctor: "Dr. Sarah Johnson",
    status: "completed"
  },
  {
    id: 2,
    title: "Blood Test Analysis",
    date: "2024-03-10",
    type: "Laboratory",
    doctor: "Dr. Michael Chen",
    status: "completed"
  },
  {
    id: 3,
    title: "X-Ray Results",
    date: "2024-03-05",
    type: "Radiology",
    doctor: "Dr. Emily Rodriguez",
    status: "processing"
  },
  {
    id: 4,
    title: "Cardiology Assessment",
    date: "2024-02-28",
    type: "Specialist",
    doctor: "Dr. James Wilson",
    status: "pending"
  }
]

export default function ReportsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedType, setSelectedType] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from local storage
    setUser(null); // Reset user state
    router.push("/auth"); // Redirect to auth page
  };

  const filteredReports = reports.filter(report => {
    const matchesType = !selectedType || report.type === selectedType
    const matchesStatus = !selectedStatus || report.status === selectedStatus
    return matchesType && matchesStatus
  })

  const types = Array.from(new Set(reports.map(report => report.type)));
  const statuses = Array.from(new Set(reports.map(report => report.status)));

  return (
    <div className={styles.container}>
      <button className={styles.menuButton} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <Menu size={24} />
      </button>

      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
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
          <Link href="/reports" className={`${styles.navItem} ${styles.active}`}>
            <FileText size={20} />
            Reports
          </Link>
          <Link href="/plans" className={styles.navItem}>
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
          <button onClick={handleLogout} className={styles.navItem}>
            <LogOut size={20} />
            Log out
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Medical Reports</h1>
          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <label>Type</label>
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className={styles.select}
              >
                <option value="">All Types</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className={styles.select}
              >
                <option value="">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={styles.reports}>
          {filteredReports.map((report) => (
            <div key={report.id} className={styles.reportCard}>
              <div className={styles.reportHeader}>
                <h3>{report.title}</h3>
                <span className={`${styles.status} ${styles[report.status]}`}>
                  {report.status}
                </span>
              </div>
              
              <div className={styles.reportDetails}>
                <div className={styles.detail}>
                  <FileText size={16} />
                  <span>Type: {report.type}</span>
                </div>
                <div className={styles.detail}>
                  <Calendar size={16} />
                  <span>Date: {new Date(report.date).toLocaleDateString()}</span>
                </div>
                <div className={styles.detail}>
                  <User size={16} />
                  <span>Doctor: {report.doctor}</span>
                </div>
              </div>

              <button className={styles.downloadButton}>
                <Download size={16} />
                Download Report
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}