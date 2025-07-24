"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
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
    User,
    Shield
} from "lucide-react"
import styles from "./users.module.css"
import axios from "axios"

interface User {
    _id: string
    name: string
    email: string
    bio: string
    gender: string
    age: number | null
    phone: string
    address: string
    zip_code: string
    country: string
    state: string
    city: string
    profile_pic: string
    role: string
    status: string
    blood_group: string
    weight: string
    height: string
    allergies: string
    medical_conditions: string
    medications: string
    surgeries: string
    family_medical_history: string
    emergency_contact: string
    date: string
    __v: number
}

interface UserFormData {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    age: number;
    gender: string;
    status: string;
    role: string;
}

export default function UsersPage() {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [authLoading, setAuthLoading] = useState(true)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [newUser, setNewUser] = useState<UserFormData>({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "",
        age: 0,
        gender: "male",
        status: "active",
        role: "user"
    })
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedStatus, setSelectedStatus] = useState("")
    const [selectedRole, setSelectedRole] = useState("")
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [users, setUsers] = useState<User[]>([])
    const [totalPages, setTotalPages] = useState(1)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

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

    const handleLogout = () => {
        localStorage.removeItem("adminToken")
        router.push("/admin/auth")
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    useEffect(() => {
        if (!isAuthenticated) return

        const fetchUsers = async () => {
            try {
                setLoading(true)
                // Mock data for now - replace with actual API call
                const mockUsers: User[] = [
                    {
                        _id: "1",
                        name: "John Smith",
                        email: "john.smith@email.com",
                        bio: "Health enthusiast",
                        gender: "male",
                        age: 35,
                        phone: "+1234567890",
                        address: "123 Main St",
                        zip_code: "12345",
                        country: "USA",
                        state: "CA",
                        city: "Los Angeles",
                        profile_pic: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100",
                        role: "user",
                        status: "active",
                        blood_group: "O+",
                        weight: "70",
                        height: "175",
                        allergies: "None",
                        medical_conditions: "None",
                        medications: "None",
                        surgeries: "None",
                        family_medical_history: "None",
                        emergency_contact: "+1234567891",
                        date: "2024-01-15",
                        __v: 0
                    },
                    {
                        _id: "2",
                        name: "Emma Wilson",
                        email: "emma.wilson@email.com",
                        bio: "Fitness coach",
                        gender: "female",
                        age: 28,
                        phone: "+1234567892",
                        address: "456 Oak Ave",
                        zip_code: "54321",
                        country: "USA",
                        state: "NY",
                        city: "New York",
                        profile_pic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
                        role: "user",
                        status: "active",
                        blood_group: "A+",
                        weight: "60",
                        height: "165",
                        allergies: "Peanuts",
                        medical_conditions: "None",
                        medications: "Vitamins",
                        surgeries: "None",
                        family_medical_history: "Diabetes",
                        emergency_contact: "+1234567893",
                        date: "2024-02-20",
                        __v: 0
                    }
                ]
                setUsers(mockUsers)
                setTotalPages(1)
            } catch (err) {
                console.error("Failed to fetch users:", err)
                setError("Failed to fetch users data.")
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
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
        )
    }

    // Don't render if not authenticated
    if (!isAuthenticated) {
        return null
    }

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('New user data:', newUser)
        setIsAddModalOpen(false)
    }

    const handleSaveUser = (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingUser) return
        console.log('Updated user data:', editingUser)
        setIsEditModalOpen(false)
    }

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = !selectedStatus || user.status === selectedStatus
        const matchesRole = !selectedRole || user.role === selectedRole
        return matchesSearch && matchesStatus && matchesRole
    })

    const statuses = Array.from(new Set(users.map(user => user.status)))
    const roles = Array.from(new Set(users.map(user => user.role)))

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
                    <Link href="/admin/users" className={`${styles.sidebarLink} ${styles.active}`}>
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
                    <h1>Manage Users</h1>
                    <button className={styles.addButton} onClick={() => setIsAddModalOpen(true)}>
                        <Plus size={20} />
                        Add New User
                    </button>
                </div>

                <div className={styles.filters}>
                    <div className={styles.searchBar}>
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Search users..."
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

                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            <option value="">All Roles</option>
                            {roles.map(role => (
                                <option key={role} value={role}>
                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={styles.usersGrid}>
                    {filteredUsers.map((user) => (
                        <div key={user._id} className={styles.userCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.userProfile}>
                                    <img src={user.profile_pic} alt={user.name} className={styles.userImage} />
                                    <div className={styles.userInfo}>
                                        <h3 className={styles.userName}>{user.name}</h3>
                                        <p className={styles.userEmail}>{user.email}</p>
                                    </div>
                                </div>
                                <div className={styles.headerActions}>
                                    <button
                                        className={styles.actionButton}
                                        onClick={() => {
                                            setEditingUser(user)
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
                                    <Phone size={16} />
                                    {user.phone || 'Not provided'}
                                </div>
                                <div className={styles.detail}>
                                    <MapPin size={16} />
                                    {user.city}, {user.state}
                                </div>
                                <div className={styles.detail}>
                                    <User size={16} />
                                    Age: {user.age || 'Not provided'}
                                </div>
                                <div className={styles.detail}>
                                    <Shield size={16} />
                                    Role: {user.role}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        <button
                            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                            disabled={currentPage === 1}
                            className={styles.paginationButton}
                        >
                            Previous
                        </button>
                        <div className={styles.pageNumbers}>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                <button
                                    key={number}
                                    onClick={() => handlePageChange(number)}
                                    className={`${styles.pageNumber} ${currentPage === number ? styles.active : ''}`}
                                >
                                    {number}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={styles.paginationButton}
                        >
                            Next
                        </button>
                    </div>
                )}
            </main>

            {isEditModalOpen && editingUser && (
                <div className={styles.modalOverlay} onClick={() => setIsEditModalOpen(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Edit User Profile</h2>
                            <button
                                className={styles.closeButton}
                                onClick={() => setIsEditModalOpen(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveUser}>
                            <div className={styles.modalContent}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="name">Full Name</label>
                                    <input
                                        id="name"
                                        type="text"
                                        defaultValue={editingUser.name}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="email">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        defaultValue={editingUser.email}
                                        required
                                    />
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="phone">Phone</label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            defaultValue={editingUser.phone}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="age">Age</label>
                                        <input
                                            id="age"
                                            type="number"
                                            defaultValue={editingUser.age || ''}
                                            min="1"
                                            max="120"
                                        />
                                    </div>
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="gender">Gender</label>
                                        <select
                                            id="gender"
                                            defaultValue={editingUser.gender}
                                        >
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="role">Role</label>
                                        <select
                                            id="role"
                                            defaultValue={editingUser.role}
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="address">Address</label>
                                    <input
                                        id="address"
                                        type="text"
                                        defaultValue={editingUser.address}
                                    />
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="city">City</label>
                                        <input
                                            id="city"
                                            type="text"
                                            defaultValue={editingUser.city}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="state">State</label>
                                        <input
                                            id="state"
                                            type="text"
                                            defaultValue={editingUser.state}
                                        />
                                    </div>
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="country">Country</label>
                                        <input
                                            id="country"
                                            type="text"
                                            defaultValue={editingUser.country}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="status">Status</label>
                                        <select
                                            id="status"
                                            defaultValue={editingUser.status}
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="suspended">Suspended</option>
                                        </select>
                                    </div>
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
                            <h2>Add New User</h2>
                        </div>

                        <form onSubmit={handleAddUser}>
                            <div className={styles.modalContent}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="name">Full Name</label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={newUser.name}
                                        onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="email">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="phone">Phone</label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            value={newUser.phone}
                                            onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="age">Age</label>
                                        <input
                                            id="age"
                                            type="number"
                                            value={newUser.age}
                                            onChange={(e) => setNewUser(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                                            min="1"
                                            max="120"
                                        />
                                    </div>
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="gender">Gender</label>
                                        <select
                                            id="gender"
                                            value={newUser.gender}
                                            onChange={(e) => setNewUser(prev => ({ ...prev, gender: e.target.value }))}
                                        >
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="role">Role</label>
                                        <select
                                            id="role"
                                            value={newUser.role}
                                            onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="address">Address</label>
                                    <input
                                        id="address"
                                        type="text"
                                        value={newUser.address}
                                        onChange={(e) => setNewUser(prev => ({ ...prev, address: e.target.value }))}
                                    />
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="city">City</label>
                                        <input
                                            id="city"
                                            type="text"
                                            value={newUser.city}
                                            onChange={(e) => setNewUser(prev => ({ ...prev, city: e.target.value }))}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="state">State</label>
                                        <input
                                            id="state"
                                            type="text"
                                            value={newUser.state}
                                            onChange={(e) => setNewUser(prev => ({ ...prev, state: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="country">Country</label>
                                        <input
                                            id="country"
                                            type="text"
                                            value={newUser.country}
                                            onChange={(e) => setNewUser(prev => ({ ...prev, country: e.target.value }))}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="status">Status</label>
                                        <select
                                            id="status"
                                            value={newUser.status}
                                            onChange={(e) => setNewUser(prev => ({ ...prev, status: e.target.value }))}
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="suspended">Suspended</option>
                                        </select>
                                    </div>
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
                                    Add User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}