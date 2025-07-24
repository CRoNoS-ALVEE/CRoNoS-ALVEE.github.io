"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Stethoscope,
  BarChart3,
  Calendar,
  Search,
  Plus,
  Edit,
  X,
  MapPin,
  Clock,
  User,
  Filter,
  Menu,
  FileText,
  Settings,
  LogOut
} from "lucide-react"
import styles from "./appointments.module.css"
import router from "next/router"
import axios from "axios"

interface Appointment {
  _id: string
  userId: {
    name: string
    email: string
    profile_pic?: string
  }
  doctors_id: {
    name: string
    speciality: string
    hospital_name: string
    address: string
  }
  date: string

export default function AppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("adminToken")
      router.push("/admin/auth")
    }
  }

  const types = Array.from(new Set(appointments.map(appointment => appointment.type)))
  const statuses = Array.from(new Set(appointments.map(appointment => appointment.status)))

  if (!isMounted) {
    return null
  }
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.type.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = !selectedType || appointment.type === selectedType
    const matchesStatus = !selectedStatus || appointment.status === selectedStatus

    return matchesSearch && matchesType && matchesStatus
  })

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
            <Link href="/admin/appointments" className={`${styles.sidebarLink} ${styles.active}`}>
              <Calendar size={20} />
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
          <div className={styles.header}>
            <h1>Appointments</h1>
            <button className={styles.addButton}>
              <Plus size={20} />
              New Appointment
            </button>
          </div>

          <div className={styles.filters}>
            <div className={styles.searchBar}>
              <Search size={20} />
              <input
                  type="text"
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className={styles.filterGroup}>
              <Filter size={20} />

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

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              Loading appointments...
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
              {error}
            </div>
          ) : (
          <div className={styles.appointmentsGrid}>
            {filteredAppointments.map(appointment => (
                <div key={appointment._id} className={styles.appointmentCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.patientInfo}>
                      <img
                          src={appointment.userId?.profile_pic || "https://img.freepik.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg?w=740"}
                          alt={appointment.userId?.name || "Patient"}
                          className={styles.avatar}
                      />
                      <div>
                        <div className={styles.patientName}>{appointment.userId?.name || "Unknown Patient"}</div>
                        <div className={styles.appointmentType}>{appointment.reason || "General consultation"}</div>
                      </div>
                    </div>
                    <div className={`${styles.status} ${styles[appointment.status.toLowerCase()]}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </div>
                  </div>

                  <div className={styles.details}>
                    {(() => {
                      const { date, time } = formatAppointmentDate(appointment.date);
                      return (
                        <>
                    <div className={styles.detail}>
                      <Calendar size={16} />
                          <span>{date}</span>
                    </div>
                    <div className={styles.detail}>
                      <Clock size={16} />
                          <span>{time}</span>
                    </div>
                        </>
                      );
                    })()}
                    <div className={styles.detail}>
                      <MapPin size={16} />
                      <span>{appointment.doctors_id?.hospital_name || 'N/A'} - {appointment.doctors_id?.address || 'N/A'}</span>
                    </div>
                    <div className={styles.detail}>
                      <User size={16} />
                      <span>Dr. {appointment.doctors_id?.name || 'Unknown'}</span>
                    </div>
                  </div>

                  <div className={styles.actions}>
                    {appointment.status === "Pending" && (
                      <>
                        <button 
                          className={`${styles.actionButton} ${styles.confirmButton}`}
                          onClick={() => updateAppointmentStatus(appointment._id, "Confirmed")}
                        >
                          <Calendar size={16} />
                          Confirm
                        </button>
                        <button 
                          className={`${styles.actionButton} ${styles.cancelButton}`}
                          onClick={() => updateAppointmentStatus(appointment._id, "Cancelled")}
                        >
                          <X size={16} />
                          Cancel
                        </button>
                      </>
                    )}
                    {appointment.status === "Confirmed" && (
                      <button 
                        className={`${styles.actionButton} ${styles.cancelButton}`}
                        onClick={() => updateAppointmentStatus(appointment._id, "Cancelled")}
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    )}
                    {appointment.status === "Cancelled" && (
                      <div style={{ color: '#6b7280', fontSize: '0.875rem', textAlign: 'center', padding: '0.5rem' }}>
                        Appointment Cancelled
                      </div>
                    )}
                  </div>
                </div>
            ))}
          </div>
          )}
        </main>
      </div>
  )
}