import { API_AUTH_LOGIN, API_PROFILES_SINGLE } from "../constants.js";
import { headers } from "../headers.js";

/**
 * Service for user authentication, providing methods for login.
 * @class
 */
export class AuthService {

    constructor() {
        this.apiUrl = API_AUTH_LOGIN;
    }

    /**
    Logs in a user with the provided email and password.
      
    @async
    @param {string} email - The email of the user.
    @param {string} password - The password of the user.
    @returns {Promise<Object>} - The user data after successful login.
    @throws {Error} - Throws an error if the login fails.
     */
    async login(email, password) {
        
        const response = await fetch(this.apiUrl, {
            method: "POST",
            headers: headers(),
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            const username = data.data.name;
            const accessToken = data.data.accessToken;

            localStorage.setItem("username", username);
            localStorage.setItem("accessToken", accessToken);

            await this.checkAndSetInitialCredits(username, accessToken);

            window.location.href = '/index.html';
           
            return data;
        } 
        
        else {
            throw new Error(data.message || "Login Failed");
        }
    }

    /**
    Checks if the user has initial credits. If not, sets them to 1000.
    @async
    @param {string} username - The user's username.
    @param {string} accessToken - The user's access token.
    */
    async checkAndSetInitialCredits(username, accessToken) {
        const endpoint = `${API_PROFILES_SINGLE}/${username}`;
        const response = await fetch(endpoint, {
            method: "GET",
            headers: headers(accessToken),
        });

        if (!response.ok) {
            console.error("Failed to fetch user profile");
            return;
        }
    }
}

/**
Adds event listeners to the login form and handles form submission for user login.
@event
 */
document.addEventListener('DOMContentLoaded', () => {
    
    const loginForm = document.getElementById('loginForm');
    const authService = new AuthService();

    if (loginForm) {

        /**
         Event listener for the login form submission.
         Calls the login method from AuthService.
         @param {Event} event - The form submission event.
         */
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                await authService.login(email, password);
            } 
            
            catch (error) {
                console.error('Login error:', error);
                alert(error.message);
            }
        });
    }
});
