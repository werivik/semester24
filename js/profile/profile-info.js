import { API_PROFILES_SINGLE, API_PROFILES_LISTINGS, API_DELETE_LISTING } from "../constants.js";
import { headers } from "../headers.js";

document.addEventListener("DOMContentLoaded", () => {
    const nameDiv = document.getElementById("name");
    const emailDiv = document.getElementById("email");
    const bioDiv = document.getElementById("bio");
    const avatarImg = document.getElementById("avatar");
    const listingsContainer = document.getElementById('user-listings');
    const logoutButton = document.getElementById('logoutButton');

    const popup = document.getElementById('confirm-delete-popup');
    const confirmYes = document.getElementById('confirm-delete-yes');
    const confirmNo = document.getElementById('confirm-delete-no');

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
            if (!token) return null;

            const username = localStorage.getItem('username');
            if (!username) return null;

            const endpoint = `${API_PROFILES_SINGLE}/${username}`;
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: headers(token),
            });

            if (!response.ok) throw new Error('Failed to fetch user information');
            return await response.json();
        } 
        
        catch (error) {
            console.error('Error fetching user information:', error);
            return null;
        }
    };

    const fetchUserListings = async (username, token) => {
        try {
            const endpoint = API_PROFILES_LISTINGS.replace('<name>', username);
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: headers(token),
            });

            if (!response.ok) throw new Error('Failed to fetch user listings');
            const data = await response.json();
            return data?.data || [];
        } 
        
        catch (error) {
            console.error('Error fetching user listings:', error);
            return [];
        }
    };

    const showPopup = (callback) => {
        popup.classList.remove('hidden');

        confirmYes.onclick = () => {
            popup.classList.add('hidden');
            callback(true);
        };

        confirmNo.onclick = () => {
            popup.classList.add('hidden');
            callback(false);
        };
    };

    const deleteListing = async (listingId) => {
        try {
            const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
            const deleteEndpoint = API_DELETE_LISTING.replace('<id>', listingId);

            const response = await fetch(deleteEndpoint, {
                method: 'DELETE',
                headers: headers(token),
            });

            if (!response.ok) throw new Error('Failed to delete the listing');
            
            alert('Listing deleted successfully.');
            updateUserInfo();
        } 
        
        catch (error) {
            console.error('Error deleting the listing:', error);
            alert('Failed to delete listing. Please try again.');
        }
    };

    const displayListings = (listings = []) => {
        if (listings.length === 0) {
            listingsContainer.innerHTML = '<p>No listings made yet.</p>';
            return;
        }

        const listingsHtml = listings.map(listing => {
            const listingMedia = listing.media && listing.media.length > 0 
                ? `<img src="${listing.media[0].url}" alt="${listing.media[0].alt}">` 
                : '';

            return `
            <a href="/listings/update-listing.html?id=${listing.id}" class="listing" data-id="${listing.id}">
                <div class="listing-image">
                    ${listingMedia}    
                </div>

                <div class="listing-content"> 
                    <h3 class="title">${listing.title}</h3>
                    <p class="description">${listing.description}</p>
                    <div class="lower-content">
                        <p class="tags">${listing.tags.join('    ')}</p>
                        <p class="bidding-end">Ends at: ${new Date(listing.endsAt).toLocaleString()}</p>
                        <p class="total-bids">Bids: ${listing._count.bids}</p>
                     </div>
                </div>

                <div class="edit-buttons">
                    <button data-id="${listing.id}" class="edit-listing-button" id="editButton">EDIT</button>
                    <button data-id="${listing.id}" data-title="${listing.title}" class="delete-listing-button" id="deleteButton">DELETE</button>
                </div>
            </a>
            `;
        }).join('');

        listingsContainer.innerHTML = listingsHtml;

        document.querySelectorAll('.delete-listing-button').forEach((button) => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                const listingId = button.getAttribute('data-id');
                showPopup((confirmed) => {
                    if (confirmed) {
                        deleteListing(listingId);
                    } 
                    
                    else {
                        console.log('Deletion canceled');
                    }
                });
            });
        });

        document.querySelectorAll(".edit-listing-button").forEach((button) => {
            button.addEventListener("click", (event) => {
                event.stopPropagation();
                const listingId = button.getAttribute("data-id");
                window.location.href = `listings/update-listing.html?id=${listingId}`;
            });
        });
    };

    const updateUserInfo = async () => {
        try {
            const data = await fetchUserData();

            if (data && data.data) {
                const userData = data.data;

                const { name, email, bio, avatar, credits } = userData;

                nameDiv.textContent = name || 'No name available';
                emailDiv.textContent = email || 'No email available';
                bioDiv.textContent = bio || 'No bio yet...';

                if (avatar && avatar.url) {
                    avatarImg.src = avatar.url;
                    avatarImg.alt = avatar.alt || 'User avatar';
                    avatarImg.style.display = 'block';
                } 
                
                else {
                    avatarImg.style.display = 'none';
                }

                const creditDiv = document.getElementById('userCredit');

                if (creditDiv) {
                    creditDiv.textContent = `${credits || 0} ${credits === 1 ? 'Credit' : 'Credits'}`;
                } 
                
                else {
                    console.warn('Credit div not found in the DOM');
                }

                const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
                const username = localStorage.getItem('username');
                const listings = await fetchUserListings(username, token);

                displayListings(listings);
            } 
            
            else {
                console.error('No user data returned from the API');
            }
        } 
        
        catch (error) {
            console.error('Error updating user info:', error);
        }
    };

    const logoutUser = () => {
        localStorage.clear();
        sessionStorage.clear();

        alert('You have been logged out.');
        window.location.href = '../auth/login.html';
    };

    if (logoutButton) {
        logoutButton.addEventListener('click', logoutUser);
    }

    (async () => {
        try {
            const data = await fetchUserData();
            console.log('Fetched user data:', data);
           
            if (data) {
                await updateUserInfo(); 
            }
        } 
        
        catch (error) {
            console.error('Error in fetching or updating user data:', error);
        }
    })();

});
