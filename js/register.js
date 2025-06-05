// Register Page JavaScript
document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const registerForm = document.getElementById("registerForm")
  const steps = document.querySelectorAll(".form-step")
  const stepItems = document.querySelectorAll(".step-item")
  const nextBtn = document.querySelector(".next-btn")
  const prevBtn = document.querySelector(".prev-btn")
  const registerBtn = document.querySelector(".register-btn")
  const goToLoginBtn = document.getElementById("goToLogin")

  // Form inputs
  const fullNameInput = document.getElementById("fullName")
  const emailInput = document.getElementById("email")
  const phoneInput = document.getElementById("phone")
  const passwordInput = document.getElementById("password")
  const confirmPasswordInput = document.getElementById("confirmPassword")
  const termsCheckbox = document.getElementById("terms")
  const togglePassword = document.getElementById("togglePassword")

  // Current step
  let currentStep = 1

  // Initialize
  init()

  function init() {
    setupEventListeners()
    addInputAnimations()
    updateStepDisplay()
  }

  function setupEventListeners() {
    // Step navigation
    nextBtn.addEventListener("click", nextStep)
    prevBtn.addEventListener("click", prevStep)
    registerBtn.addEventListener("click", handleRegister)
    goToLoginBtn.addEventListener("click", () => (window.location.href = "login.html"))

    // Password toggle
    togglePassword.addEventListener("click", togglePasswordVisibility)

    // Input validation
    fullNameInput.addEventListener("blur", validateFullName)
    emailInput.addEventListener("blur", validateEmail)
    phoneInput.addEventListener("blur", validatePhone)
    passwordInput.addEventListener("input", validatePassword)
    confirmPasswordInput.addEventListener("input", validateConfirmPassword)
    termsCheckbox.addEventListener("change", validateTerms)

    // Clear errors on input
    ;[fullNameInput, emailInput, phoneInput, passwordInput, confirmPasswordInput].forEach((input) => {
      input.addEventListener("input", () => clearError(input))
    })

    // Social register buttons
    document.querySelectorAll(".social-btn").forEach((btn) => {
      btn.addEventListener("click", handleSocialRegister)
    })

    // Phone number formatting
    phoneInput.addEventListener("input", formatPhoneNumber)
  }

  function addInputAnimations() {
    const inputs = document.querySelectorAll(".input-field")
    inputs.forEach((input) => {
      input.addEventListener("focus", function () {
        this.parentElement.classList.add("focused")
      })

      input.addEventListener("blur", function () {
        this.parentElement.classList.remove("focused")
      })
    })
  }

  function nextStep() {
    if (validateCurrentStep()) {
      if (currentStep < 3) {
        currentStep++
        updateStepDisplay()
        animateStepTransition()
      }
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      currentStep--
      updateStepDisplay()
      animateStepTransition()
    }
  }

  function updateStepDisplay() {
    // Update step items
    stepItems.forEach((item, index) => {
      const stepNumber = index + 1
      item.classList.remove("active", "completed")

      if (stepNumber === currentStep) {
        item.classList.add("active")
      } else if (stepNumber < currentStep) {
        item.classList.add("completed")
        item.querySelector(".step-circle").innerHTML = '<i class="fas fa-check"></i>'
      } else {
        item.querySelector(".step-circle").textContent = stepNumber
      }
    })

    // Update step lines
    document.querySelectorAll(".step-line").forEach((line, index) => {
      if (index + 1 < currentStep) {
        line.classList.add("completed")
      } else {
        line.classList.remove("completed")
      }
    })

    // Update form steps
    steps.forEach((step, index) => {
      step.classList.remove("active")
      if (index + 1 === currentStep) {
        step.classList.add("active")
      }
    })
  }

  function animateStepTransition() {
    const activeStep = document.querySelector(".form-step.active")
    activeStep.style.animation = "none"
    setTimeout(() => {
      activeStep.style.animation = "fadeIn 0.5s ease-in-out"
    }, 10)
  }

  function validateCurrentStep() {
    if (currentStep === 1) {
      return validateStep1()
    } else if (currentStep === 2) {
      return validateStep2()
    }
    return true
  }

  function validateStep1() {
    let isValid = true

    if (!validateFullName()) isValid = false
    if (!validateEmail()) isValid = false
    if (!validatePhone()) isValid = false

    return isValid
  }

  function validateStep2() {
    let isValid = true

    if (!validatePassword()) isValid = false
    if (!validateConfirmPassword()) isValid = false
    if (!validateTerms()) isValid = false

    return isValid
  }

  function validateFullName() {
    const name = fullNameInput.value.trim()

    if (!name) {
      showError(fullNameInput, "Nama lengkap harus diisi")
      return false
    } else if (name.length < 2) {
      showError(fullNameInput, "Nama minimal 2 karakter")
      return false
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
      showError(fullNameInput, "Nama hanya boleh berisi huruf dan spasi")
      return false
    }

    showSuccess(fullNameInput)
    return true
  }

  function validateEmail() {
    const email = emailInput.value.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email) {
      showError(emailInput, "Email harus diisi")
      return false
    } else if (!emailRegex.test(email)) {
      showError(emailInput, "Format email tidak valid")
      return false
    } else if (isEmailExists(email)) {
      showError(emailInput, "Email sudah terdaftar")
      return false
    }

    showSuccess(emailInput)
    return true
  }

  function validatePhone() {
    const phone = phoneInput.value.trim()
    const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/

    if (!phone) {
      showError(phoneInput, "Nomor telepon harus diisi")
      return false
    } else if (!phoneRegex.test(phone.replace(/\s|-/g, ""))) {
      showError(phoneInput, "Format nomor telepon tidak valid")
      return false
    }

    showSuccess(phoneInput)
    return true
  }

  function validatePassword() {
    const password = passwordInput.value
    const strength = calculatePasswordStrength(password)

    updatePasswordStrength(strength)

    if (!password) {
      showError(passwordInput, "Password harus diisi")
      return false
    } else if (password.length < 8) {
      showError(passwordInput, "Password minimal 8 karakter")
      return false
    } else if (strength.score < 2) {
      showError(passwordInput, "Password terlalu lemah")
      return false
    }

    showSuccess(passwordInput)
    return true
  }

  function validateConfirmPassword() {
    const password = passwordInput.value
    const confirmPassword = confirmPasswordInput.value

    if (!confirmPassword) {
      showError(confirmPasswordInput, "Konfirmasi password harus diisi")
      return false
    } else if (password !== confirmPassword) {
      showError(confirmPasswordInput, "Password tidak cocok")
      return false
    }

    showSuccess(confirmPasswordInput)
    return true
  }

  function validateTerms() {
    if (!termsCheckbox.checked) {
      showError(termsCheckbox, "Anda harus menyetujui syarat dan ketentuan")
      return false
    }

    clearError(termsCheckbox)
    return true
  }

  function calculatePasswordStrength(password) {
    let score = 0
    const feedback = []

    // Length check
    if (password.length >= 8) score++
    if (password.length >= 12) score++

    // Character variety
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    // Determine strength level
    let level = "weak"
    let text = "Lemah"

    if (score >= 2 && score < 4) {
      level = "fair"
      text = "Cukup"
    } else if (score >= 4 && score < 6) {
      level = "good"
      text = "Baik"
    } else if (score >= 6) {
      level = "strong"
      text = "Kuat"
    }

    return { score, level, text }
  }

  function updatePasswordStrength(strength) {
    const strengthFill = document.querySelector(".strength-fill")
    const strengthText = document.querySelector(".strength-text")

    strengthFill.className = `strength-fill ${strength.level}`
    strengthText.textContent = `Kekuatan password: ${strength.text}`
  }

  function formatPhoneNumber() {
    let value = phoneInput.value.replace(/\D/g, "")

    // Add country code if not present
    if (value.startsWith("8")) {
      value = "62" + value
    } else if (value.startsWith("0")) {
      value = "62" + value.substring(1)
    }

    // Format the number
    if (value.startsWith("62")) {
      value = value.replace(/^62/, "+62 ")
      if (value.length > 7) {
        value = value.replace(/(\+62 \d{3})(\d{4})(\d{4})/, "$1-$2-$3")
      }
    }

    phoneInput.value = value
  }

  function isEmailExists(email) {
    // In real app, this would check against database
    const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    return existingUsers.some((user) => user.email === email)
  }

  function showError(input, message) {
    const formGroup = input.closest(".form-group")
    const errorElement = formGroup.querySelector(".error-message")

    formGroup.classList.add("error")
    formGroup.classList.remove("success")
    errorElement.textContent = message
    errorElement.classList.remove("hidden")

    // Add shake animation
    input.style.animation = "shake 0.5s ease-in-out"
    setTimeout(() => {
      input.style.animation = ""
    }, 500)
  }

  function showSuccess(input) {
    const formGroup = input.closest(".form-group")
    const errorElement = formGroup.querySelector(".error-message")

    formGroup.classList.remove("error")
    formGroup.classList.add("success")
    errorElement.classList.add("hidden")

    // Show check icon for confirm password
    if (input === confirmPasswordInput) {
      const checkIcon = formGroup.querySelector(".fa-check-circle")
      if (checkIcon) {
        checkIcon.classList.remove("hidden")
      }
    }
  }

  function clearError(input) {
    const formGroup = input.closest(".form-group")
    const errorElement = formGroup.querySelector(".error-message")

    formGroup.classList.remove("error")
    errorElement.classList.add("hidden")

    if (input.value.trim()) {
      formGroup.classList.add("success")
    } else {
      formGroup.classList.remove("success")
    }
  }

  function handleRegister(e) {
    e.preventDefault()

    if (!validateStep2()) {
      return
    }

    // Show loading state
    showLoading(true)

    // Simulate API call
    setTimeout(() => {
      const userData = {
        id: Date.now(),
        fullName: fullNameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        registrationDate: new Date().toISOString(),
      }

      // Save user data
      const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
      existingUsers.push(userData)
      localStorage.setItem("registeredUsers", JSON.stringify(existingUsers))

      // Show success step
      currentStep = 3
      updateStepDisplay()
      showLoading(false)

      // Hide social and login sections
      document.getElementById("socialSection").style.display = "none"
      document.getElementById("loginSection").style.display = "none"
    }, 2000)
  }

  function showLoading(show) {
    const btnText = registerBtn.querySelector(".btn-text")
    const spinner = registerBtn.querySelector(".fa-spinner")

    if (show) {
      registerBtn.classList.add("loading")
      registerBtn.disabled = true
      btnText.textContent = "Mendaftar..."
      spinner.classList.remove("hidden")
    } else {
      registerBtn.classList.remove("loading")
      registerBtn.disabled = false
      btnText.textContent = "Daftar"
      spinner.classList.add("hidden")
    }
  }

  function togglePasswordVisibility() {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
    passwordInput.setAttribute("type", type)

    const icon = togglePassword.querySelector("i")
    icon.classList.toggle("fa-eye")
    icon.classList.toggle("fa-eye-slash")
  }

  function handleSocialRegister(e) {
    const provider = e.currentTarget.textContent.trim()

    // Show loading state
    e.currentTarget.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>Connecting...`
    e.currentTarget.disabled = true

    // Simulate social register
    setTimeout(() => {
      alert(`Pendaftaran dengan ${provider} akan segera tersedia!`)

      // Reset button
      const originalContent =
        provider === "Google"
          ? '<i class="fab fa-google text-red-400 mr-2"></i>Google'
          : '<i class="fab fa-facebook text-blue-400 mr-2"></i>Facebook'

      e.currentTarget.innerHTML = originalContent
      e.currentTarget.disabled = false
    }, 2000)
  }

  // Demo info
  console.log("Register Page Loaded")
  console.log("Form validation includes:")
  console.log("- Name: minimum 2 characters, letters only")
  console.log("- Email: valid format, unique check")
  console.log("- Phone: Indonesian format (+62)")
  console.log("- Password: minimum 8 characters, strength meter")
  console.log("- Terms: must be accepted")
})
