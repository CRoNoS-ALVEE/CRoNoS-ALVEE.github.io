"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Stethoscope,
  BarChart3,
  Calendar,
  Search,
  Download,
  RefreshCw,
  FileText,
  Filter,
  Menu,
  Settings,
  Clock,
  User,
  LogOut
} from "lucide-react"
import styles from "./reports.module.css"

interface Report {
  id: number
  title: string
  type: string
  date: string
  generatedBy: string
  status: "generated" | "pending" | "failed"
}

const reports: Report[] = [
  {
    id: 1,
    title: "Monthly Patient Statistics",
    type: "Analytics",
    date: "2024-03-15",
    generatedBy: "System",
    status: "generated"
  },
  {
    id: 2,
    title: "Doctor Performance Review",
    type: "Performance",
    date: "2024-03-14",
    generatedBy: "Admin",
    status: "generated"
  },
  {
    id: 3,
    title: "Appointment Analytics",
    type: "Analytics",
    date: "2024-03-13",
    generatedBy: "System",
    status: "pending"
  },
  {
    id: 4,
    title: "Revenue Report",
    type: "Financial",
    date: "2024-03-12",
    generatedBy: "System",
    status: "failed"
  }
]

export default function ReportsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Check authentication on page load
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("adminToken")
      if (!token) {
        router.push("/admin/auth")
        return
      }
      setIsAuthenticated(true)
      setAuthLoading(false)
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.push("/admin/auth")
  }

  const types = Array.from(new Set(reports.map(report => report.type)));
  const statuses = Array.from(new Set(reports.map(report => report.status)));

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.type.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = !selectedType || report.type === selectedType
    const matchesStatus = !selectedStatus || report.status === selectedStatus

    return matchesSearch && matchesType && matchesStatus
  })

  // Show loading while checking authentication
  if (authLoading) {
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
    )
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null
  }

  if (!isMounted) {
    return null
  }

  return (
      <div className={styles.container}>
        <button
            className={styles.menuToggle}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu size={24} />
        </button>

        <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
          <div className={styles.sidebarHeader}>
            <Stethoscope size={24} />
            <span>SymptoSeek Admin</span>
          </div>

          <nav className={styles.sidebarNav}>
            <Link href="/admin/dashboard" className={styles.sidebarLink}>
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
              <Calendar size={20} />
              Appointments
            </Link>
            <Link href="/admin/reports" className={`${styles.sidebarLink} ${styles.active}`}>
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
          <div className={styles.header}>
            <h1>Reports</h1>
          </div>

          <div className={styles.filters}>
            <div className={styles.searchBar}>
              <Search size={20} />
              <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className={styles.filterGroup}>
              <Filter size={20} />
              <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">All Types</option>
                {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                {statuses.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.reportsGrid}>
            {filteredReports.map(report => (
                <div key={report.id} className={styles.reportCard}>
                  <div className={styles.reportHeader}>
                    <h3 className={styles.reportTitle}>{report.title}</h3>
                    <div className={`${styles.status} ${styles[report.status]}`}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </div>
                  </div>

                  <div className={styles.details}>
                    <div className={styles.detail}>
                      <FileText size={16} />
                      <span>Type: {report.type}</span>
                    </div>
                    <div className={styles.detail}>
                      <Clock size={16} />
                      <span>Generated: {new Date(report.date).toLocaleDateString()}</span>
                    </div>
                    <div className={styles.detail}>
                      <User size={16} />
                      <span>By: {report.generatedBy}</span>
                    </div>
                  </div>

                  <div className={styles.actions}>
                    {report.status === "generated" ? (
                        <button className={`${styles.actionButton} ${styles.downloadButton}`}>
                          <Download size={16} />
                          Download Report
                        </button>
                    ) : (
                        <button className={`${styles.actionButton} ${styles.regenerateButton}`}>
                          <RefreshCw size={16} />
                          Regenerate Report
                        </button>
                    )}
                  </div>
                </div>
            ))}
          </div>
        </main>
      </div>
  )
}