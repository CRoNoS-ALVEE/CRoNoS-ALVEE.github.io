"use client"

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { useState } from "react"
import axios from "axios"
import { useGoogleLogin } from "@react-oauth/google"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons"
import { faGoogle, faMicrosoft, faTwitter } from "@fortawesome/free-brands-svg-icons"
import styles from "./auth.module.css"
import { useRouter } from 'next/navigation'

config.autoAddCss = false

export default function AuthContent() {
  const [isSignUpMode, setIsSignUpMode] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("") // for sign-up form
  const [loading, setLoading] = useState(false) // to manage loading state
  const [error, setError] = useState("") // to display error messages
  const router = useRouter()

  const handleSignUpClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsSignUpMode(true)
    setError("") // clear error when switching modes
  }

  const handleSignInClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsSignUpMode(false)
    setError("") // clear error when switching modes
  }

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse)
      localStorage.setItem("token", tokenResponse.access_token)
      console.log(localStorage.getItem("token"))
      router.push("/dashboard")
      // Handle successful login here
    },
    onError: (error) => {
      console.error("Login Failed:", error)
      setError("Google login failed. Please try again.")
    },
  })

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Basic form validation for Sign In
    if (!email || !password) {
      setError("Please fill in both email and password.")
      return
    }

    setLoading(true)
    setError("") // Clear previous errors

    try {
      const result = await axios.post<{ user: { 
        email: string,
        id: string,
        name: string,
        profile_pic: string,
        token: string
      } }>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
        email,
        password,
      })

      if (result.status === 200) {
        console.log("Login successful")
        console.log(result.data.user.id)
        localStorage.setItem("id", result.data.user.id);
        localStorage.setItem("token", result.data.user.token);
        router.push("/dashboard")
      } else {
        setError("Login failed. Please check your credentials.")
      }
    } catch (err: unknown) {
      console.error("Login failed:", err)
      setError("An error occurred. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Basic form validation for Sign Up
    if (!name || !email || !password) {
      setError("Please fill in all fields.")
      return
    }

    setLoading(true)
    setError("") // Clear previous errors

    try {
      const result = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/signup`, {
        name,
        email,
        password,
      })

      if (result.status === 201) {
        console.log("Sign-up successful")
        router.push("/dashboard")
      } else {
        setError("Sign-up failed. Please try again.")
      }
    } catch (err: unknown) {
      console.error("Sign-up failed:", err)
      setError("An error occurred. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className={`${styles.container} ${isSignUpMode ? styles.signUpMode : ""}`}>
        <div className={styles.formsContainer}>
          <div className={styles.signinSignup}>
            {/* Sign-in Form */}
            <form className={`${styles.formWrapper} ${styles.signInForm}`} onSubmit={handleLogin}>
              <h2 className={styles.title}>Sign in</h2>
              <div className={styles.inputField}>
                <i>
                  <FontAwesomeIcon icon={faEnvelope} />
                </i>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className={styles.inputField}>
                <i>
                  <FontAwesomeIcon icon={faLock} />
                </i>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              {error && <p className={styles.error}>{error}</p>} {/* Error message */}
              <input type="submit" value={loading ? "Logging in..." : "Login"} className={styles.btn} disabled={loading} />
              <p className={styles.socialText}>Or Sign in with social platforms</p>
              <div className={styles.socialMedia}>
                <a href="#" className={styles.socialIcon} onClick={(e) => {
                  e.preventDefault()
                  login()
                }}>
                  <FontAwesomeIcon icon={faGoogle} />
                </a>
                <a href="#" className={styles.socialIcon}>
                  <FontAwesomeIcon icon={faMicrosoft} />
                </a>
                <a href="#" className={styles.socialIcon}>
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
              </div>
            </form>

            {/* Sign-up Form */}
            <form className={`${styles.formWrapper} ${styles.signUpForm}`} onSubmit={handleSignUp}>
              <h2 className={styles.title}>Sign up</h2>
              <div className={styles.inputField}>
                <i>
                  <FontAwesomeIcon icon={faUser} />
                </i>
                <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className={styles.inputField}>
                <i>
                  <FontAwesomeIcon icon={faEnvelope} />
                </i>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className={styles.inputField}>
                <i>
                  <FontAwesomeIcon icon={faLock} />
                </i>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              {error && <p className={styles.error}>{error}</p>} {/* Error message */}
              <input type="submit" value={loading ? "Signing up..." : "Sign up"} className={styles.btn} disabled={loading} />
              <p className={styles.socialText}>Or Sign up with social platforms</p>
              <div className={styles.socialMedia}>
                <a href="#" className={styles.socialIcon} onClick={(e) => {
                  e.preventDefault()
                  login()
                }}>
                  <FontAwesomeIcon icon={faGoogle} />
                </a>
                <a href="#" className={styles.socialIcon}>
                  <FontAwesomeIcon icon={faMicrosoft} />
                </a>
                <a href="#" className={styles.socialIcon}>
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
              </div>
            </form>
          </div>
        </div>

        {/* Panels */}
        <div className={styles.panelsContainer}>
          <div className={`${styles.panel} ${styles.leftPanel}`}>
            <div className={styles.content}>
              <h3>New here?</h3>
              <p>Join SymptoSeek to access personalized health insights and connect with our AI-powered symptom analysis.</p>
              <button className={`${styles.btn} ${styles.transparent}`} onClick={handleSignUpClick}>
                Sign up
              </button>
            </div>
            <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/log-k7snnCr50CZaS0nowddBS8zQWSl4Dd.svg"
                className={styles.image}
                alt="Sign In illustration"
                width={400}
                height={400}
                priority
            />
          </div>
          <div className={`${styles.panel} ${styles.rightPanel}`}>
            <div className={styles.content}>
              <h3>One of us?</h3>
              <p>Welcome back! Sign in to continue your health journey with SymptoSeek.</p>
              <button className={`${styles.btn} ${styles.transparent}`} onClick={handleSignInClick}>
                Sign in
              </button>
            </div>
            <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/register-0OxCKpnMUkcjl19rsUa9ymhgx8h2dU.svg"
                className={styles.image}
                alt="Sign Up illustration"
                width={400}
                height={400}
                priority
            />
          </div>
        </div>
      </div>
  )
}