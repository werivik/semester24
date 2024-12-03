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
    if (loginOptions && loginOptions2 && userProfile && userProfile2) {
        if (token) {
            loginOptions.classList.add('hidden');
            loginOptions.classList.remove('flex');
            loginOptions2.classList.add('hidden');
            loginOptions2.classList.remove('flex');
            userProfile.classList.add('flex');
            userProfile.classList.remove('hidden');
            userProfile2.classList.add('flex');
            userProfile2.classList.remove('hidden');
            fetchUserData();
        } 
        
        else {
            loginOptions.classList.remove('hidden');
            loginOptions.classList.add('flex');
            loginOptions2.classList.remove('hidden');
            loginOptions2.classList.add('flex');
            userProfile.classList.add('hidden');
            userProfile.classList.remove('flex');
            userProfile2.classList.add('hidden');
            userProfile2.classList.remove('flex');
        }
    } 
    
    else {
        console.error('One or more required elements are missing in the DOM.');
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

        if (creditAmount) {
            creditAmount.textContent = `$ ${credits} Credits`;
        }

        if (creditAmount2) {
            creditAmount2.textContent = `$ ${credits} Credits`;
        }

        if (avatar) {
            if (avatarImg) {
                avatarImg.src = avatar;
                avatarImg.alt = 'User Avatar';
            }
            if (avatarImg2) {
                avatarImg2.src = avatar;
                avatarImg2.alt = 'User Avatar';
            }
        } 
        
        else {
            if (avatarImg) {
                avatarImg.src = '/media/default-profile.jpg';
                avatarImg.alt = 'Default Avatar';
            }
            if (avatarImg2) {
                avatarImg2.src = '/media/default-profile.jpg';
                avatarImg2.alt = 'Default Avatar';
            }
        }
    } 
    
    catch (error) {
        console.error('Error fetching user data:', error);

        if (creditAmount) {
            creditAmount.textContent = '$ 0 Credits';
        }
        if (creditAmount2) {
            creditAmount2.textContent = '$ 0 Credits';
        }
    }
}

document.addEventListener('DOMContentLoaded', checkLoginStatus);
