"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Calendar as CalendarIcon, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import axios from "axios"
import styles from "./book.module.css"

interface Doctor {
  _id: string
  name: string
  speciality: string
  hospital_name: string
  image_source: string
  visiting_hours: string
  degree: string
  address: string
  number: string
  About: string
  latitude: string
  longitude: string
}

interface TimeSlot {
  time: string
  available: boolean
}

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

export default function BookAppointmentPage() {
  const router = useRouter()
  const params = useParams()
  const doctorId = params.id as string
  console.log(doctorId)

  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [appointmentType, setAppointmentType] = useState("consultation")
  const [notes, setNotes] = useState("")
  const [submitLoading, setSubmitLoading] = useState(false)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])

  // Fetch user data and check authentication
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setLoggedIn(false)
        setLoading(false)
        router.push("/auth")
        return
      }
      try {
        const userId = localStorage.getItem("id")
        const response = await axios.get(`http://localhost:5000/api/auth/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUser(response.data)
        setLoggedIn(true)
      } catch (err) {
        console.error("Failed to fetch user data:", err)
        setError("Failed to fetch user data.")
        setLoggedIn(false)
        router.push("/auth")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  // Fetch doctor data
  useEffect(() => {
    const fetchDoctor = async () => {
      if (!doctorId) return
      try {
        const response = await axios.get<Doctor>(`http://localhost:5000/api/doctors/${doctorId}`)
        setDoctor(response.data)
        // Generate time slots from visiting_hours
        const slots = generateTimeSlots(response.data.visiting_hours)
        setTimeSlots(slots)
      } catch (err) {
        console.error("Failed to fetch doctor data:", err)
        setError("Failed to fetch doctor data.")
      }
    }

    fetchDoctor()
  }, [doctorId])

  // Function to parse visiting_hours and generate time slots
  const generateTimeSlots = (visitingHours: string): TimeSlot[] => {
    // Example: "4pm to 9pm (Sat, Mon, Wed & Fri)"
    const match = visitingHours.match(/(\d+)(?::\d+)?\s*(am|pm)\s*to\s*(\d+)(?::\d+)?\s*(am|pm)\s*\(([^)]+)\)/i)
    if (!match) return []

    const [, startHour, startPeriod, endHour, endPeriod, days] = match
    const start = parseInt(startHour) + (startPeriod.toLowerCase() === "pm" && startHour !== "12" ? 12 : 0)
    const end = parseInt(endHour) + (endPeriod.toLowerCase() === "pm" && endHour !== "12" ? 12 : 0)

    const slots: TimeSlot[] = []
    for (let hour = start; hour < end; hour++) {
      const time = `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour < 12 || hour === 24 ? "AM" : "PM"}`
      slots.push({ time, available: true })
      // Add 30-minute slot if not at the end
      if (hour < end - 0.5) {
        const halfTime = `${hour % 12 === 0 ? 12 : hour % 12}:30 ${hour < 12 || hour === 24 ? "AM" : "PM"}`
        slots.push({ time: halfTime, available: true })
      }
    }

    return slots
  }

  // Validate selected date against visiting days
  const isValidDate = (date: string): boolean => {
    if (!doctor || !date) return false
    const match = doctor.visiting_hours.match(/\(([^)]+)\)/)
    if (!match) return true // If no days specified, assume all days are valid
    const days = match[1].split(",").map(day => day.trim().toLowerCase())
    const selectedDay = new Date(date).toLocaleString("en-US", { weekday: "short" }).toLowerCase()
    return days.includes(selectedDay) || days.includes(selectedDay + "s") // Handle "Sat" or "Sats"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidDate(selectedDate)) {
      alert("Selected date is not within the doctor's visiting days.")
      return
    }
    setSubmitLoading(true)

    try {
      // Simulated API call to book appointment
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Example API call (uncomment and modify as needed):
      /*
      await axios.post(
        "http://localhost:5000/api/appointments",
        {
          doctorId: doctor?._id,
          userId: user?._id,
          date: selectedDate,
          time: selectedTime,
          type: appointmentType,
          notes,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      )
      */
      router.push("/appointments")
    } catch (error) {
      console.error("Error booking appointment:", error)
      setError("Failed to book appointment.")
    } finally {
      setSubmitLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!doctor) {
    return <div>Error loading doctor data.</div>
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/doctors" className={styles.backButton}>
          <ArrowLeft size={20} />
          Back to Doctors
        </Link>
        <h1>Book Appointment</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.doctorInfo}>
          <img
            src={doctor.image_source}
            alt={doctor.name}
            className={styles.doctorImage}
          />
          <div>
            <h2>{doctor.name}</h2>
            <p>{doctor.speciality}</p>
            <p className={styles.hospital}>{doctor.hospital_name}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.bookingForm}>
          <div className={styles.formSection}>
            <h3>
              <CalendarIcon size={20} />
              Select Date & Time
            </h3>
            <div className={styles.dateTimeSelection}>
              <div className={styles.formGroup}>
                <label htmlFor="date">Appointment Date</label>
                <input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className={styles.timeSlots}>
                <label>Available Time Slots</label>
                <div className={styles.timeSlotsGrid}>
                  {timeSlots.length > 0 ? (
                    timeSlots.map((slot, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`${styles.timeSlot} ${!slot.available ? styles.unavailable : ""} ${
                          selectedTime === slot.time ? styles.selected : ""
                        }`}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                      >
                        <Clock size={16} />
                        {slot.time}
                      </button>
                    ))
                  ) : (
                    <p>No available time slots.</p>
                  )}
                </div>
              </div>
            <div className={styles.formSection}>
              <h3>Appointment Details</h3>
              <div className={styles.formGroup}>
                <label htmlFor="type">Appointment Type</label>
                <select
                  id="type"
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                  required
                >
                  <option value="consultation">Consultation</option>
                  <option value="followup">Follow-up</option>
                  <option value="checkup">General Check-up</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="notes">Additional Notes</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any specific concerns or information you'd like to share..."
                  rows={4}
                />
              </div>
            </div>

            <div className={styles.summary}>
              <h3>Appointment Summary</h3>
              <div className={styles.summaryDetails}>
                <div className={styles.summaryItem}>
                  <span>Doctor:</span>
                  <span>{doctor.name}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span>Date:</span>
                  <span>{selectedDate || "Not selected"}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span>Time:</span>
                  <span>{selectedTime || "Not selected"}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span>Type:</span>
                  <span>{appointmentType.charAt(0).toUpperCase() + appointmentType.slice(1)}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={submitLoading || !selectedDate || !selectedTime || !isValidDate(selectedDate)}
            >
              {submitLoading ? "Booking..." : "Confirm Booking"}
            </button>
          
        </div>
        </div>
        </form>
      </div>
    </div>
  )
}