"use client"

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { useState } from "react"
import axios from "axios"
import { useGoogleLogin } from "@react-oauth/google"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faLock, faEnvelope, faTimes } from "@fortawesome/free-solid-svg-icons"
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
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)
  const [otp, setOtp] = useState("")
  const [forgotEmail, setForgotEmail] = useState("")
  const [otpLoading, setOtpLoading] = useState(false)
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)
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
        setShowOtpModal(true)
        setLoading(false)
      } else {
        setError("Sign-up failed. Please try again.")
      }
    } catch (err: unknown) {
      console.error("Sign-up failed:", err)
      setError("An error occurred. Please try again later.")
    } finally {
      if (!showOtpModal) {
        setLoading(false)
      }
    }
  }

  const handleOtpVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!otp) {
      setError("Please enter the OTP.")
      return
    }

    setOtpLoading(true)
    setError("")

    try {
      // Simulate OTP verification API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // On successful verification
      setShowOtpModal(false)
      router.push("/dashboard")
    } catch (err: unknown) {
      console.error("OTP verification failed:", err)
      setError("Invalid OTP. Please try again.")
    } finally {
      setOtpLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!forgotEmail) {
      setError("Please enter your email address.")
      return
    }

    setForgotPasswordLoading(true)
    setError("")

    try {
      // Simulate forgot password API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // On successful request
      alert("Password reset link has been sent to your email!")
      setShowForgotPasswordModal(false)
      setForgotEmail("")
    } catch (err: unknown) {
      console.error("Forgot password failed:", err)
      setError("Failed to send reset email. Please try again.")
    } finally {
      setForgotPasswordLoading(false)
    }
  }

  const closeOtpModal = () => {
    setShowOtpModal(false)
    setOtp("")
    setError("")
  }

  const closeForgotPasswordModal = () => {
    setShowForgotPasswordModal(false)
    setForgotEmail("")
    setError("")
  }

  return (
    <>
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
              <div className={styles.forgotPassword}>
                <button 
                  type="button" 
                  className={styles.forgotPasswordLink}
                  onClick={() => setShowForgotPasswordModal(true)}
                >
                  Forgot Password?
                </button>
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

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeButton} onClick={closeOtpModal}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className={styles.modalContent}>
              <h2 className={styles.modalTitle}>Verify Your Email</h2>
              <p className={styles.modalDescription}>
                We've sent a verification code to your email address. Please enter the code below to complete your registration.
              </p>
              <form onSubmit={handleOtpVerification}>
                <div className={styles.inputField}>
                  <i>
                    <FontAwesomeIcon icon={faLock} />
                  </i>
                  <input 
                    type="text" 
                    placeholder="Enter OTP" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <input 
                  type="submit" 
                  value={otpLoading ? "Verifying..." : "Verify OTP"} 
                  className={styles.btn} 
                  disabled={otpLoading} 
                />
              </form>
              <div className={styles.resendSection}>
                <p>Didn't receive the code?</p>
                <button type="button" className={styles.resendButton}>
                  Resend OTP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeButton} onClick={closeForgotPasswordModal}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className={styles.modalContent}>
              <h2 className={styles.modalTitle}>Reset Password</h2>
              <p className={styles.modalDescription}>
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <form onSubmit={handleForgotPassword}>
                <div className={styles.inputField}>
                  <i>
                    <FontAwesomeIcon icon={faEnvelope} />
                  </i>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    value={forgotEmail} 
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <input 
                  type="submit" 
                  value={forgotPasswordLoading ? "Sending..." : "Send Reset Link"} 
                  className={styles.btn} 
                  disabled={forgotPasswordLoading} 
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}