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
  Building
} from "lucide-react"
import styles from "./doctors.module.css"

interface Doctor {
  id: string
  name: string
  specialty: string
  experience: string
  rating: number
  availability: string
  hospital: string
  location: string
  email: string
  phone: string
  status: string
  image: string
  education: string[]
  specializations: string[]
  languages: string[]
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

const doctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. John Smith',
    specialty: 'Cardiologist',
    experience: '15 years',
    rating: 4.8,
    availability: 'Mon-Fri',
    hospital: 'Heart Care Center',
    location: 'New York',
    email: 'john.smith@example.com',
    phone: '123-456-7890',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
    education: ['MD from Harvard Medical School', 'Cardiology Fellowship at Mayo Clinic'],
    specializations: ['Interventional Cardiology', 'Heart Failure Management', 'Preventive Cardiology'],
    languages: ['English', 'Spanish']
  },
  {
    id: '2',
    name: 'Dr. Sarah Wilson',
    specialty: 'Pediatrician',
    experience: '12 years',
    rating: 4.9,
    availability: 'Mon-Thu',
    hospital: 'Children\'s Medical Center',
    location: 'Los Angeles',
    email: 'sarah.wilson@example.com',
    phone: '987-654-3210',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
    education: ['MD from UCLA', 'Pediatrics Residency at Boston Children\'s Hospital'],
    specializations: ['General Pediatrics', 'Developmental Pediatrics', 'Adolescent Medicine'],
    languages: ['English', 'Spanish']
  },
  {
    id: '3',
    name: 'Dr. Michael Chen',
    specialty: 'Neurologist',
    experience: '10 years',
    rating: 4.7,
    availability: 'Mon-Sat',
    hospital: 'Brain & Spine Institute',
    location: 'Chicago',
    email: 'michael.chen@example.com',
    phone: '555-123-4567',
    status: 'inactive',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop',
    education: ['MD from Stanford University', 'Neurology Residency at Johns Hopkins'],
    specializations: ['General Neurology', 'Stroke Care', 'Headache Management'],
    languages: ['English', 'Mandarin']
  }
];

export default function DoctorsPage() {
  const router = useRouter()
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

  const specialties = Array.from(new Set(doctors.map(doctor => doctor.specialty)))
  const statuses = Array.from(new Set(doctors.map(doctor => doctor.status)))
  const locations = Array.from(new Set(doctors.map(doctor => doctor.location)))
  const availabilities = Array.from(new Set(doctors.map(doctor => doctor.availability)))

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.push("/admin/auth")
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
              <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                <option value="">All Specialties</option>
                {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
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

          <div className={styles.doctorsGrid}>
            {doctors.map((doctor) => (
                <div key={doctor.id} className={styles.doctorCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.doctorProfile}>
                      <img src={doctor.image} alt={doctor.name} className={styles.doctorImage} />
                      <div className={styles.doctorInfo}>
                        <h3 className={styles.doctorName}>{doctor.name}</h3>
                        <p className={styles.doctorSpecialty}>{doctor.specialty}</p>
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
                      {doctor.location}
                    </div>
                    <div className={styles.detail}>
                      <Clock size={16} />
                      {doctor.experience} experience
                    </div>
                    <div className={styles.detail}>
                      <Building size={16} />
                      {doctor.hospital}
                    </div>
                    <div className={styles.detail}>
                      <Mail size={16} />
                      {doctor.email}
                    </div>
                    <div className={styles.detail}>
                      <Phone size={16} />
                      {doctor.phone}
                    </div>
                  </div>
                  <div className={`${styles.status} ${styles[doctor.status]}`}>
                    {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
                  </div>
                </div>
            ))}
          </div>
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
                          defaultValue={editingDoctor.specialty}
                          required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="experience">Experience</label>
                      <input
                          id="experience"
                          type="text"
                          defaultValue={editingDoctor.experience}
                          required
                      />
                    </div>

                    <div className={styles.formGroup}>
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
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="availability">Availability</label>
                      <input
                          id="availability"
                          type="text"
                          defaultValue={editingDoctor.availability}
                          required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="hospital">Hospital</label>
                      <input
                          id="hospital"
                          type="text"
                          defaultValue={editingDoctor.hospital}
                          required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="location">Location</label>
                      <input
                          id="location"
                          type="text"
                          defaultValue={editingDoctor.location}
                          required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="email">Email</label>
                      <input
                          id="email"
                          type="email"
                          defaultValue={editingDoctor.email}
                          required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="phone">Phone</label>
                      <input
                          id="phone"
                          type="tel"
                          defaultValue={editingDoctor.phone}
                          required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="status">Status</label>
                      <select
                          id="status"
                          defaultValue={editingDoctor.status}
                          required
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="education">Education (one per line)</label>
                      <textarea
                          id="education"
                          className={styles.textarea}
                          defaultValue={editingDoctor.education.join('\n')}
                          required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="specializations">Specializations (one per line)</label>
                      <textarea
                          id="specializations"
                          className={styles.textarea}
                          defaultValue={editingDoctor.specializations.join('\n')}
                          required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="languages">Languages (one per line)</label>
                      <textarea
                          id="languages"
                          className={styles.textarea}
                          defaultValue={editingDoctor.languages.join('\n')}
                          required
                      />
                    </div>
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