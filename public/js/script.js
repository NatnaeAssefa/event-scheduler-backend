const password = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");
const errorMessage = document.getElementById("errorMessage");
const errorAlert = document.getElementById("errorAlert");
const form = document.getElementById("passwordRecoveryForm");

// Function to toggle password visibility for any field
function togglePasswordVisibility(fieldId) {
  console.log("hey");
  const input = document.getElementById(fieldId);
  const toggleButton =
    fieldId === "newPassword"
      ? document.getElementById("toggleNewPassword")
      : document.getElementById("toggleConfirmPassword");
  if (input.type === "password") {
    input.type = "text";
    toggleButton.classList.remove("fa-eye");
    toggleButton.classList.add("fa-eye-slash");
  } else {
    input.type = "password";
    toggleButton.classList.remove("fa-eye-slash");
    toggleButton.classList.add("fa-eye");
  }
}

// Add event listeners for the toggle buttons
document.getElementById("toggleNewPassword").addEventListener("click", () => {
  togglePasswordVisibility("newPassword", "toggleNewPassword");
});

document.getElementById("toggleConfirmPassword").addEventListener("click", () => {
  togglePasswordVisibility("confirmPassword", "toggleConfirmPassword");
});

// Function to check if passwords match
function checkPasswords() {
  errorAlert.classList.remove("displayBlock");
  errorAlert.classList.add("displayNone");
  if (password.value !== confirmPassword.value) {
    errorMessage.classList.remove("displayNone");
    return false;
  }
  errorMessage.classList.add("displayNone");
  return true;
}

// Add form submit event listener
form.addEventListener("submit", function (event) {
  if (!checkPasswords()) {
    event.preventDefault(); // Prevent form submission if passwords don't match
  }
});
