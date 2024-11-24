import { API_AUTH_REGISTER } from "../constants.js";
import { headers } from "../headers.js";

class User {
  constructor(name, email, password, bio = "", banner = "", avatar = "") {
    this.name = name;
    this.email = email;
    this.password = password;
    this.bio = bio;
    this.banner = banner;
    this.avatar = avatar;
  }

  static validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email) && email.endsWith(".no");
  }

  static validatePassword(password) {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordPattern.test(password);
  }

  async register() {
    if (!User.validateEmail(this.email)) {
      alert("Invalid email address. Must end with .no");
      return;
    }

    if (!User.validatePassword(this.password)) {
      alert("Invalid password. Must be at least 8 characters long and include both letters and numbers");
      return;
    }

    try {
      const payload = {
        name: this.name,
        email: this.email,
        password: this.password,
        bio: this.bio || undefined,
        banner: this.banner || undefined,
        avatar: this.avatar || undefined,
        credits: 1000,
      };

      const response = await fetch(API_AUTH_REGISTER, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorResponse = await response.json();

        if (errorResponse.errors && errorResponse.errors.some((error) => error.message === "Profile already exists")) {
          alert("Username or email is already in use. Please choose another.");
        } 
        
        else {
          alert(`Registration failed: ${errorResponse.message || "Unknown error"}`);
        }

        return;
      }

      const result = await response.json();

      alert("Registration successful! Redirecting to login page.");
      window.location.href = "/auth/login.html";

      return result;
    } 
    
    catch (error) {
      alert("An unexpected error occurred during registration");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const registerButton = document.querySelector(".register-button");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  if (registerButton) {
    registerButton.addEventListener("click", async (event) => {
      event.preventDefault();

      if (!nameInput || !emailInput || !passwordInput) {
        alert("Please make sure all required fields are filled out.");
        return;
      }

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      if (!name || !email || !password) {
        alert("Please fill out all fields.");
        return;
      }

      const user = new User(name, email, password);
      await user.register();
    });
  }
});
