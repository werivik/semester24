import { API_PROFILES_SINGLE } from "../constants.js";
import { headers } from "../headers.js";

document.addEventListener("DOMContentLoaded", () => {
    const acceptGiftButton = document.getElementById("acceptGift");

    const fetchUserProfile = async (username, token) => {
        try {
            const endpoint = `${API_PROFILES_SINGLE}/${username}`;
            const response = await fetch(endpoint, {
                method: "GET",
                headers: headers(token),
            });
            if (!response.ok) throw new Error("Failed to fetch user profile.");
            return await response.json();
        } 
        
        catch (error) {
            console.error("Error fetching user profile:", error);
            return null;
        }
    };

    const updateUserProfile = async (username, token, updatedData) => {
        try {
            const endpoint = `${API_PROFILES_SINGLE}/${username}`;
            const response = await fetch(endpoint, {
                method: "PUT",
                headers: headers(token),
                body: JSON.stringify(updatedData),
            });
            if (!response.ok) throw new Error("Failed to update user profile.");
            return await response.json();
        } 
        
        catch (error) {
            console.error("Error updating user profile:", error);
            return null;
        }
    };

    const handleAcceptGift = async () => {
        try {
            const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
            const username = localStorage.getItem("username");
            if (!token || !username) {
                alert("User is not logged in.");
                return;
            }

            const profileData = await fetchUserProfile(username, token);
            if (!profileData || !profileData.data) {
                alert("Failed to fetch profile data.");
                return;
            }

            const currentCredits = profileData.data.credits || 0;
            const updatedCredits = currentCredits + 1000;

            const updatedProfile = await updateUserProfile(username, token, { credits: updatedCredits });
            if (updatedProfile && updatedProfile.data) {
                alert(`Gift accepted! Your credits have been updated to ${updatedCredits}.`);
                const creditDiv = document.getElementById("userCredit");
                if (creditDiv) {
                    creditDiv.textContent = `${updatedCredits} ${updatedCredits === 1 ? "Credit" : "Credits"}`;
                }
            } 
            
            else {
                alert("Failed to update profile.");
            }
        } 
        
        catch (error) {
            console.error("Error accepting gift:", error);
            alert("An error occurred while accepting the gift. Please try again.");
        }
    };

    if (acceptGiftButton) {
        acceptGiftButton.addEventListener("click", handleAcceptGift);
    }
});
