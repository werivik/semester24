import { API_UPDATE_PROFILE } from "../constants.js";
import { headers } from "../headers.js";

document.addEventListener("DOMContentLoaded", () => {
    const saveChangesButton = document.getElementById("saveChanges");
    const newUsernameInput = document.getElementById("newUsername");
    const newBioInput = document.getElementById("newBio");
    const newAvatarInput = document.getElementById("newAvatar");

    const updateProfile = async () => {
        try {
            const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
            if (!token) {
                alert('Authentication token is missing.');
                return;
            }

            const currentUsername = localStorage.getItem('username');
            if (!currentUsername) {
                alert('Current username is missing.');
                return;
            }

            const updatedData = {
                name: newUsernameInput.value.trim() || currentUsername,
                bio: newBioInput.value.trim() || undefined,
                avatar: newAvatarInput.value.trim() ? { url: newAvatarInput.value.trim(), alt: 'User provided avatar' } : undefined
            };

            if (!updatedData.name && !updatedData.bio && !updatedData.avatar) {
                alert('At least one property (username, bio, avatar) must be provided.');
                return;
            }

            const endpoint = API_UPDATE_PROFILE.replace('<name>', currentUsername);

            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: headers(token),
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                const responseText = await response.text();
                throw new Error(`Failed to update profile: ${responseText}`);
            }

            const data = await response.json();

            if (updatedData.name !== currentUsername) {
                localStorage.setItem('username', updatedData.name);
                sessionStorage.setItem('username', updatedData.name);
            }

            alert('Profile updated successfully! Refreshing the page to show updated information...');
            window.location.reload();
        } 
        
        catch (error) {
            console.error('Error updating profile:', error);
            alert(`Failed to update profile: ${error.message}`);
        }
    };

    if (saveChangesButton) {
        saveChangesButton.addEventListener('click', updateProfile);
    }
});
