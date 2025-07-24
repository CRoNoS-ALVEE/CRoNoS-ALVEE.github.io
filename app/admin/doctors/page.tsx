"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Stethoscope,
  BarChart3,
  Calendar,
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  MapPin,
  Mail,
  Phone,
  Menu,
  FileText,
  Settings,
  Filter,
  LogOut,
  Clock,
  Building,
  User
} from "lucide-react"
import styles from "./doctors.module.css"
import axios from "axios"

interface Doctor {
  _id: string
  name: string
  speciality: string
  address: string
  visiting_hours: string
  hospital_name: string
  image_source: string
  number: string
  degree: string
  About: string
  latitude: string
  longitude: string
}

interface Pagination {
  currentPage: number
  totalPages: number
  totalDoctors: number
  doctorsPerPage: number
}

interface ApiResponse {
  doctors: Doctor[]
  pagination: Pagination
}

interface DoctorFormData {
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  availability: string;
  hospital: string;
  location: string;
  email: string;
  phone: string;
  status: string;
  image: string;
  education: string[];
  specializations: string[];
  languages: string[];
}

export default function DoctorsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newDoctor, setNewDoctor] = useState<DoctorFormData>({
    name: "",
    specialty: "",
    experience: "",
    rating: 5.0,
    availability: "Mon-Fri",
    hospital: "",
    location: "",
    email: "",
    phone: "",
    status: "active",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400",
    education: [""],
    specializations: [""],
    languages: [""]
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalDoctors: 0,
    doctorsPerPage: 12,
  });
  const [error, setError] = useState("")

  // Check authentication on page load
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/admin/auth");
        return;
      }
      setIsAuthenticated(true);
      setAuthLoading(false);
    };

    checkAuth();
  }, [router]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // const specialties = Array.from(new Set(doctors.map(doctor => doctor.specialty)))
  // const statuses = Array.from(new Set(doctors.map(doctor => doctor.status)))
  // const locations = Array.from(new Set(doctors.map(doctor => doctor.location)))
  // const availabilities = Array.from(new Set(doctors.map(doctor => doctor.availability)))

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.push("/admin/auth")
  }

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchDoctors = async () => {
      try {
        const response = await axios.get<ApiResponse>(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/doctors?page=${currentPage}&limit=12`
        )

        console.log("Fetched doctors:", response.data.doctors)
        setDoctors(response.data.doctors)
        setPagination(response.data.pagination)
      } catch (err) {
        console.error("Failed to fetch doctors:", err)
        setError("Failed to fetch doctors data.")
      }
    }

    fetchDoctors()
  }, [currentPage, isAuthenticated])

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
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically make an API call to add the doctor
    console.log('New doctor data:', newDoctor)
    setIsAddModalOpen(false)
  }

  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingDoctor) return

    // Here you would typically make an API call to update the doctor
    console.log('Updated doctor data:', editingDoctor)
    setIsEditModalOpen(false)
  }

  const handleArrayInputChange = (
      field: keyof Pick<DoctorFormData, 'education' | 'specializations' | 'languages'>,
      value: string,
      index: number
  ) => {
    setNewDoctor(prev => {
      const newArray = [...prev[field]]
      newArray[index] = value
      return { ...prev, [field]: newArray }
    })
  }

  const addArrayField = (field: keyof Pick<DoctorFormData, 'education' | 'specializations' | 'languages'>) => {
    setNewDoctor(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }))
  }

  const removeArrayField = (
      field: keyof Pick<DoctorFormData, 'education' | 'specializations' | 'languages'>,
      index: number
  ) => {
    setNewDoctor(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
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
            <Link href="/admin/doctors" className={`${styles.sidebarLink} ${styles.active}`}>
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
            <h1>Manage Doctors</h1>
            <button className={styles.addButton} onClick={() => setIsAddModalOpen(true)}>
              <Plus size={20} />
              Add New Doctor
            </button>
          </div>

          <div className={styles.filters}>
            <div className={styles.searchBar}>
              <Search size={20} />
              <input
                  type="text"
                  placeholder="Search doctors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className={styles.filterGroup}>
              <Filter size={20} />
              {/* <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                <option value="">All Specialties</option>
                {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select> */}

              {/* <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                {statuses.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                ))}
              </select> */}
            </div>
          </div>

          <div className={styles.doctorsGrid}>
            {doctors.map((doctor) => (
                <div key={doctor._id} className={styles.doctorCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.doctorProfile}>
                      <img src={doctor.image_source} alt={doctor.name} className={styles.doctorImage} />
                      <div className={styles.doctorInfo}>
                        <h3 className={styles.doctorName}>{doctor.name}</h3>
                        <p className={styles.doctorSpecialty}>{doctor.speciality}</p>
                      </div>
                    </div>
                    <div className={styles.headerActions}>
                      <button
                          className={styles.actionButton}
                          onClick={() => {
                            setEditingDoctor(doctor)
                            setIsEditModalOpen(true)
                          }}
                      >
                        <Edit size={16} />
                      </button>
                      <button className={styles.actionButton}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className={styles.details}>
                    <div className={styles.detail}>
                      <MapPin size={16} />
                      {doctor.address}
                    </div>
                    {/* <div className={styles.detail}>
                      <Clock size={16} />
                      {doctor.experience} experience
                    </div> */}
                    <div className={styles.detail}>
                      <Building size={16} />
                      {doctor.hospital_name}
                    </div>
                    <div className={styles.detail}>
                      <Mail size={16} />
                      {doctor.visiting_hours}
                    </div>
                    <div className={styles.detail}>
                      <Phone size={16} />
                      {doctor.number}
                    </div>
                  </div>
                  {/* <div className={`${styles.status} ${styles[doctor.status]}`}>
                    {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
                  </div> */}
                </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className={styles.paginationButton}
                >
                  Previous
                </button>
                <div className={styles.pageNumbers}>
                  {(() => {
                    const maxPageNumbers = 5
                    const pageRange = Math.floor(maxPageNumbers / 2)
                    const startPage = Math.max(1, currentPage - pageRange)
                    const endPage = Math.min(pagination.totalPages, currentPage + pageRange)

                    const pageNumbers = []

                    // Always show page 1
                    if (startPage > 1) {
                      pageNumbers.push(1)
                      if (startPage > 2) {
                        pageNumbers.push("...")
                      }
                    }

                    // Add pages around current page
                    for (let i = startPage; i <= endPage; i++) {
                      pageNumbers.push(i)
                    }

                    // Always show last page
                    if (endPage < pagination.totalPages) {
                      if (endPage < pagination.totalPages - 1) {
                        pageNumbers.push("...")
                      }
                      pageNumbers.push(pagination.totalPages)
                    }

                    return pageNumbers.map((number, index) => (
                        <span key={index}>
                      {number === "..." ? (
                          <span className={styles.ellipsis}>...</span>
                      ) : (
                          <button
                              onClick={() => handlePageChange(number as number)}
                              className={`${styles.pageNumber} ${currentPage === number ? styles.active : ''}`}
                          >
                            {number}
                          </button>
                      )}
                    </span>
                    ))
                  })()}
                </div>
                <button
                    onClick={() => handlePageChange(Math.min(currentPage + 1, pagination.totalPages))}
                    disabled={currentPage === pagination.totalPages}
                    className={styles.paginationButton}
                >
                  Next
                </button>
              </div>
          )}
        </main>

        {isEditModalOpen && editingDoctor && (
            <div className={styles.modalOverlay} onClick={() => setIsEditModalOpen(false)}>
              <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                  <h2>Edit Doctor Profile</h2>
                  <button
                      className={styles.closeButton}
                      onClick={() => setIsEditModalOpen(false)}
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSaveDoctor}>
                  <div className={styles.modalContent}>
                    <div className={styles.formGroup}>
                      <label htmlFor="name">Full Name</label>
                      <input
                          id="name"
                          type="text"
                          defaultValue={editingDoctor.name}
                          required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="specialty">Specialty</label>
                      <input
                          id="specialty"
                          type="text"
                          defaultValue={editingDoctor.speciality}
                          required
                      />
                    </div>
                    {/* <div className={styles.formGroup}>
                      <label htmlFor="experience">Experience</label>
                      <input
                          id="experience"
                          type="text"
                          defaultValue={editingDoctor.experience}
                          required
                      />
                    </div> */}

                    {/* <div className={styles.formGroup}>
                      <label htmlFor="rating">Rating</label>
                      <input
                          id="rating"
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          defaultValue={editingDoctor.rating}
                          required
                      />
                    </div> */}

                    {/* <div className={styles.formGroup}>
                      <label htmlFor="availability">Availability</label>
                      <input
                          id="availability"
                          type="text"
                          defaultValue={editingDoctor.availability}
                          required
                      />
                    </div> */}

                    <div className={styles.formGroup}>
                      <label htmlFor="hospital">Hospital</label>
                      <input
                          id="hospital"
                          type="text"
                          defaultValue={editingDoctor.hospital_name}
                          required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="location">Location</label>
                      <input
                          id="location"
                          type="text"
                          defaultValue={editingDoctor.address}
                          required
                      />
                    </div>

                    {/* <div className={styles.formGroup}>
                      <label htmlFor="email">Email</label>
                      <input
                          id="email"
                          type="email"
                          defaultValue={editingDoctor.email}
                          required
                      />
                    </div> */}

                    <div className={styles.formGroup}>
                      <label htmlFor="phone">Phone</label>
                      <input
                          id="phone"
                          type="tel"
                          defaultValue={editingDoctor.number}
                          required
                      />
                    </div>

                    {/* <div className={styles.formGroup}>
                      <label htmlFor="status">Status</label>
                      <select
                          id="status"
                          defaultValue={editingDoctor.status}
                          required
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div> */}

                    <div className={styles.formGroup}>
                      <label htmlFor="education">Education (one per line)</label>
                      <textarea
                          id="education"
                          className={styles.textarea}
                          defaultValue={editingDoctor.degree}
                          required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="specializations">Specializations (one per line)</label>
                      <textarea
                          id="specializations"
                          className={styles.textarea}
                          defaultValue={editingDoctor.speciality}
                          required
                      />
                    </div>

                    {/* <div className={styles.formGroup}>
                      <label htmlFor="languages">Languages (one per line)</label>
                      <textarea
                          id="languages"
                          className={styles.textarea}
                          defaultValue={editingDoctor.languages.join('\n')}
                          required
                      />
                    </div> */}
                  </div>

                  <div className={styles.modalActions}>
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={() => setIsEditModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className={styles.saveButton}>
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

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
                  <h2>Add New Doctor</h2>
                </div>

                <form onSubmit={handleAddDoctor}>
                  <div className={styles.modalContent}>
                    <div className={styles.formGroup}>
                      <label htmlFor="name">Full Name</label>
                      <input
                          id="name"
                          type="text"
                          value={newDoctor.name}
                          onChange={(e) => setNewDoctor(prev => ({ ...prev, name: e.target.value }))}
                          required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="specialty">Specialty</label>
                      <input
                          id="specialty"
                          type="text"
                          value={newDoctor.specialty}
                          onChange={(e) => setNewDoctor(prev => ({ ...prev, specialty: e.target.value }))}
                          required
                      />
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="experience">Experience</label>
                        <input
                            id="experience"
                            type="text"
                            value={newDoctor.experience}
                            onChange={(e) => setNewDoctor(prev => ({ ...prev, experience: e.target.value }))}
                            placeholder="e.g. 10 years"
                            required
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="rating">Rating</label>
                        <input
                            id="rating"
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            value={newDoctor.rating}
                            onChange={(e) => setNewDoctor(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
                            required
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="availability">Availability</label>
                        <input
                            id="availability"
                            type="text"
                            value={newDoctor.availability}
                            onChange={(e) => setNewDoctor(prev => ({ ...prev, availability: e.target.value }))}
                            required
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            value={newDoctor.status}
                            onChange={(e) => setNewDoctor(prev => ({ ...prev, status: e.target.value }))}
                            required
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="hospital">Hospital</label>
                      <input
                          id="hospital"
                          type="text"
                          value={newDoctor.hospital}
                          onChange={(e) => setNewDoctor(prev => ({ ...prev, hospital: e.target.value }))}
                          required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="location">Location</label>
                      <input
                          id="location"
                          type="text"
                          value={newDoctor.location}
                          onChange={(e) => setNewDoctor(prev => ({ ...prev, location: e.target.value }))}
                          required
                      />
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={newDoctor.email}
                            onChange={(e) => setNewDoctor(prev => ({ ...prev, email: e.target.value }))}
                            required
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="phone">Phone</label>
                        <input
                            id="phone"
                            type="tel"
                            value={newDoctor.phone}
                            onChange={(e) => setNewDoctor(prev => ({ ...prev, phone: e.target.value }))}
                            required
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="image">Profile Image URL</label>
                      <input
                          id="image"
                          type="url"
                          value={newDoctor.image}
                          onChange={(e) => setNewDoctor(prev => ({ ...prev, image: e.target.value }))}
                          required
                      />
                    </div>

                    <div className={styles.formSection}>
                      <label>Education</label>
                      {newDoctor.education.map((edu, index) => (
                          <div key={index} className={styles.arrayField}>
                            <input
                                type="text"
                                value={edu}
                                onChange={(e) => handleArrayInputChange('education', e.target.value, index)}
                                placeholder="e.g. MD from Harvard Medical School"
                            />
                            <button
                                type="button"
                                onClick={() => removeArrayField('education', index)}
                                className={styles.removeButton}
                            >
                              <X size={16} />
                            </button>
                          </div>
                      ))}
                      <button
                          type="button"
                          onClick={() => addArrayField('education')}
                          className={styles.addFieldButton}
                      >
                        <Plus size={16} /> Add Education
                      </button>
                    </div>

                    <div className={styles.formSection}>
                      <label>Specializations</label>
                      {newDoctor.specializations.map((spec, index) => (
                          <div key={index} className={styles.arrayField}>
                            <input
                                type="text"
                                value={spec}
                                onChange={(e) => handleArrayInputChange('specializations', e.target.value, index)}
                                placeholder="e.g. Cardiology"
                            />
                            <button
                                type="button"
                                onClick={() => removeArrayField('specializations', index)}
                                className={styles.removeButton}
                            >
                              <X size={16} />
                            </button>
                          </div>
                      ))}
                      <button
                          type="button"
                          onClick={() => addArrayField('specializations')}
                          className={styles.addFieldButton}
                      >
                        <Plus size={16} /> Add Specialization
                      </button>
                    </div>

                    <div className={styles.formSection}>
                      <label>Languages</label>
                      {newDoctor.languages.map((lang, index) => (
                          <div key={index} className={styles.arrayField}>
                            <input
                                type="text"
                                value={lang}
                                onChange={(e) => handleArrayInputChange('languages', e.target.value, index)}
                                placeholder="e.g. English"
                            />
                            <button
                                type="button"
                                onClick={() => removeArrayField('languages', index)}
                                className={styles.removeButton}
                            >
                              <X size={16} />
                            </button>
                          </div>
                      ))}
                      <button
                          type="button"
                          onClick={() => addArrayField('languages')}
                          className={styles.addFieldButton}
                      >
                        <Plus size={16} /> Add Language
                      </button>
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
                      Add Doctor
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}
      </div>
  )
}