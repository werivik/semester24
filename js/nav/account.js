import { API_PROFILES_SINGLE } from "../constants.js";
import { headers } from "../headers.js";

const loginOptions = document.querySelector('.login-options');
const userProfile = document.querySelector('.user-profile');
const creditAmount = document.querySelector('.credit-amount p');

const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

function checkLoginStatus() {
    if (token) {
        loginOptions.style.display = 'none';
        userProfile.style.display = 'flex';
        fetchUserData();
    } 
    
    else {
        loginOptions.style.display = 'flex';
        userProfile.style.display = 'none';
    }
}

async function fetchUserData() {
    try {
        const username = localStorage.getItem('username');
        if (!username) return;

        const endpoint = `${API_PROFILES_SINGLE}/${username}`;
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: headers(token),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        const credits = data.data.credits || 0;

        creditAmount.textContent = `$ ${credits} Credits`;
    } 
    
    catch (error) {
        console.error('Error Fetching user data:', error);
        creditAmount.textContent = '$ 0 Credits';
    }
}

document.addEventListener('DOMContentLoaded', checkLoginStatus);
