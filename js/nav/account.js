import { API_PROFILES_SINGLE } from "../constants.js";
import { headers } from "../headers.js";

const loginOptions = document.querySelector('.login-options');
const userProfile = document.querySelector('.user-profile');
const creditAmount = document.querySelector('.credit-amount p');

const loginOptions2 = document.querySelector('.login-options2');
const userProfile2 = document.querySelector('.user-profile2');
const creditAmount2 = document.querySelector('.credit-amount2 p');
const avatarImg = document.querySelector('.avatar img');
const avatarImg2 = document.querySelector('.avatar2 img');

const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

function checkLoginStatus() {
    if (token) {
        loginOptions.style.display = 'none';
        userProfile.style.display = 'flex';
        loginOptions2.style.display = 'none';
        userProfile2.style.display = 'flex';
        fetchUserData();
    } 
    
    else {
        loginOptions.style.display = 'flex';
        userProfile.style.display = 'none';
        loginOptions2.style.display = 'flex';
        userProfile2.style.display = 'none';
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
        const avatar = data.data.avatar?.url;

        creditAmount.textContent = `$ ${credits} Credits`;
        creditAmount2.textContent = `$ ${credits} Credits`;

        if (avatar) {
            avatarImg.src = avatar;
            avatarImg.alt = 'User Avatar';
            avatarImg2.src = avatar;
            avatarImg2.alt = 'User Avatar';
        } 
        
        else {
            avatarImg.src = '/media/default-profile.jpg';
            avatarImg.alt = 'Default Avatar';
            avatarImg2.src = '/media/default-profile.jpg';
            avatarImg2.alt = 'Default Avatar';
        }
    } 
    
    catch (error) {
        console.error('Error Fetching user data:', error);
        creditAmount.textContent = '$ 0 Credits';
    }
}

document.addEventListener('DOMContentLoaded', checkLoginStatus);
