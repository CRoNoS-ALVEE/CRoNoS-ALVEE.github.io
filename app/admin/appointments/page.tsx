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

interface Appointment {
  id: number
  patientName: string
  patientImage: string
  type: string
  date: string
  time: string
  location: string
  doctor: string
  status: "scheduled" | "completed" | "cancelled"
}

const appointments: Appointment[] = [
  {
    id: 1,
    patientName: "John Smith",
    patientImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100",
    type: "General Check-up",
    date: "2024-03-20",
    time: "09:00 AM",
    location: "Main Clinic, Room 102",
    doctor: "Dr. Sarah Johnson",
    status: "scheduled"
  },
  {
    id: 2,
    patientName: "Emma Wilson",
    patientImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
    type: "Dental Consultation",
    date: "2024-03-20",
    time: "10:30 AM",
    location: "Dental Wing, Room 205",
    doctor: "Dr. Michael Chen",
    status: "completed"
  },
  {
    id: 3,
    patientName: "David Brown",
    patientImage: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=100",
    type: "Follow-up",
    date: "2024-03-21",
    time: "02:00 PM",
    location: "Main Clinic, Room 105",
    doctor: "Dr. Emily Rodriguez",
    status: "cancelled"
  }
]

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

          <div className={styles.appointmentsGrid}>
            {filteredAppointments.map(appointment => (
                <div key={appointment.id} className={styles.appointmentCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.patientInfo}>
                      <img
                          src={appointment.patientImage}
                          alt={appointment.patientName}
                          className={styles.avatar}
                      />
                      <div>
                        <div className={styles.patientName}>{appointment.patientName}</div>
                        <div className={styles.appointmentType}>{appointment.type}</div>
                      </div>
                    </div>
                    <div className={`${styles.status} ${styles[appointment.status]}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </div>
                  </div>

                  <div className={styles.details}>
                    <div className={styles.detail}>
                      <Calendar size={16} />
                      <span>{new Date(appointment.date).toLocaleDateString()}</span>
                    </div>
                    <div className={styles.detail}>
                      <Clock size={16} />
                      <span>{appointment.time}</span>
                    </div>
                    <div className={styles.detail}>
                      <MapPin size={16} />
                      <span>{appointment.location}</span>
                    </div>
                    <div className={styles.detail}>
                      <User size={16} />
                      <span>{appointment.doctor}</span>
                    </div>
                  </div>

                  <div className={styles.actions}>
                    <button className={`${styles.actionButton} ${styles.editButton}`}>
                      <Edit size={16} />
                      Edit
                    </button>
                    <button className={`${styles.actionButton} ${styles.cancelButton}`}>
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
            ))}
          </div>
        </main>
      </div>
  )
}