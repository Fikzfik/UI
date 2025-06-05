// Login Page JavaScript
document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const loginForm = document.getElementById("loginForm")
  const emailInput = document.getElementById("email")
  const passwordInput = document.getElementById("password")
  const togglePassword = document.getElementById("togglePassword")
  const loginBtn = document.getElementById("loginBtn")
  const successModal = document.getElementById("successModal")
  const closeModal = document.getElementById("closeModal")

  // Sample users for demo (in real app, this would be handled by backend)
  const sampleUsers = [
    { email: "admin@gamertech.com", password: "admin123", name: "Admin GamerTech" },
    { email: "user@gamertech.com", password: "user123", name: "User Demo" },
    { email: "gamer@gamertech.com", password: "gamer123", name: "Pro Gamer" },
  ]

  // Initialize
  init()

  function init() {
    setupEventListeners()
    loadSavedCredentials()
    addInputAnimations()
  }

  function setupEventListeners() {
    // Form submission
    loginForm.addEventListener("submit", handleLogin)

    // Password toggle
    togglePassword.addEventListener("click", togglePasswordVisibility)

    // Input validation
    emailInput.addEventListener("blur", validateEmail)
    passwordInput.addEventListener("blur", validatePassword)
    emailInput.addEventListener("input", clearError)
    passwordInput.addEventListener("input", clearError)

    // Modal
    closeModal.addEventListener("click", closeSuccessModal)

    // Social login buttons
    document.querySelectorAll(".social-btn").forEach((btn) => {
      btn.addEventListener("click", handleSocialLogin)
    })
  }

  function addInputAnimations() {
    // Add focus animations to inputs
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

  function handleLogin(e) {
    e.preventDefault()

    const email = emailInput.value.trim()
    const password = passwordInput.value.trim()
    const remember = document.getElementById("remember").checked

    // Validate inputs
    if (!validateForm(email, password)) {
      return
    }

    // Show loading state
    showLoading(true)

    // Simulate API call
    setTimeout(() => {
      const user = authenticateUser(email, password)

      if (user) {
        handleLoginSuccess(user, remember)
      } else {
        handleLoginError()
      }

      showLoading(false)
    }, 1500)
  }

  function validateForm(email, password) {
    let isValid = true

    // Validate email
    if (!email) {
      showError(emailInput, "Email harus diisi")
      isValid = false
    } else if (!isValidEmail(email)) {
      showError(emailInput, "Format email tidak valid")
      isValid = false
    }

    // Validate password
    if (!password) {
      showError(passwordInput, "Password harus diisi")
      isValid = false
    } else if (password.length < 6) {
      showError(passwordInput, "Password minimal 6 karakter")
      isValid = false
    }

    return isValid
  }

  function validateEmail() {
    const email = emailInput.value.trim()
    if (email && !isValidEmail(email)) {
      showError(emailInput, "Format email tidak valid")
    } else {
      clearError(emailInput)
    }
  }

  function validatePassword() {
    const password = passwordInput.value.trim()
    if (password && password.length < 6) {
      showError(passwordInput, "Password minimal 6 karakter")
    } else {
      clearError(passwordInput)
    }
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
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

  function clearError(input) {
    const formGroup = input.closest(".form-group")
    const errorElement = formGroup.querySelector(".error-message")

    formGroup.classList.remove("error")
    errorElement.classList.add("hidden")

    // Add success state if input has value
    if (input.value.trim()) {
      formGroup.classList.add("success")
    } else {
      formGroup.classList.remove("success")
    }
  }

  function authenticateUser(email, password) {
    return sampleUsers.find((user) => user.email === email && user.password === password)
  }

  function handleLoginSuccess(user, remember) {
    // Save user data
    const userData = {
      id: Date.now(),
      email: user.email,
      name: user.name,
      loginTime: new Date().toISOString(),
    }

    localStorage.setItem("currentUser", JSON.stringify(userData))

    // Save credentials if remember me is checked
    if (remember) {
      localStorage.setItem("rememberedEmail", user.email)
    } else {
      localStorage.removeItem("rememberedEmail")
    }

    // Show success animation
    showSuccessAnimation()

    // Show success modal
    setTimeout(() => {
      showSuccessModal()
    }, 1000)
  }

  function handleLoginError() {
    showError(passwordInput, "Email atau password salah")

    // Add error animation to form
    loginForm.style.animation = "shake 0.5s ease-in-out"
    setTimeout(() => {
      loginForm.style.animation = ""
    }, 500)
  }

  function showLoading(show) {
    const btnText = loginBtn.querySelector(".btn-text")
    const spinner = loginBtn.querySelector(".fa-spinner")

    if (show) {
      loginBtn.classList.add("loading")
      loginBtn.disabled = true
      btnText.textContent = "Memproses..."
      spinner.classList.remove("hidden")
    } else {
      loginBtn.classList.remove("loading")
      loginBtn.disabled = false
      btnText.textContent = "Masuk"
      spinner.classList.add("hidden")
    }
  }

  function showSuccessAnimation() {
    // Add success class to all form groups
    document.querySelectorAll(".form-group").forEach((group) => {
      group.classList.add("success")
      group.classList.remove("error")
    })

    // Change button to success state
    const btnText = loginBtn.querySelector(".btn-text")
    btnText.textContent = "Berhasil!"
    loginBtn.style.background = "linear-gradient(to right, #10b981, #059669)"
  }

  function showSuccessModal() {
    successModal.classList.remove("hidden")
    successModal.classList.add("flex")
  }

  function closeSuccessModal() {
    successModal.classList.add("hidden")
    successModal.classList.remove("flex")

    // Redirect to dashboard or home
    setTimeout(() => {
      window.location.href = "index.html"
    }, 300)
  }

  function togglePasswordVisibility() {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
    passwordInput.setAttribute("type", type)

    const icon = togglePassword.querySelector("i")
    icon.classList.toggle("fa-eye")
    icon.classList.toggle("fa-eye-slash")
  }

  function loadSavedCredentials() {
    const rememberedEmail = localStorage.getItem("rememberedEmail")
    if (rememberedEmail) {
      emailInput.value = rememberedEmail
      document.getElementById("remember").checked = true
    }
  }

  function handleSocialLogin(e) {
    const provider = e.currentTarget.textContent.trim()

    // Show loading state
    e.currentTarget.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>Connecting...`
    e.currentTarget.disabled = true

    // Simulate social login
    setTimeout(() => {
      alert(`Login dengan ${provider} akan segera tersedia!`)

      // Reset button
      const originalContent =
        provider === "Google"
          ? '<i class="fab fa-google text-red-400 mr-2"></i>Google'
          : '<i class="fab fa-facebook text-blue-400 mr-2"></i>Facebook'

      e.currentTarget.innerHTML = originalContent
      e.currentTarget.disabled = false
    }, 2000)
  }

  // Demo credentials info
  console.log("Demo Login Credentials:")
  console.log("Email: admin@gamertech.com, Password: admin123")
  console.log("Email: user@gamertech.com, Password: user123")
  console.log("Email: gamer@gamertech.com, Password: gamer123")
})
