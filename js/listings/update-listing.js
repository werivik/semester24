import { API_UPDATE_LISTING, API_LISTINGS_SINGLE, API_DELETE_LISTING } from "../constants.js";
import { headers } from "../headers.js";

const updateListingForm = document.getElementById("update-listing-form");
const updateStatus = document.getElementById("listing-status");
const previewTitle = document.querySelector(".preview-title");
const previewDescription = document.querySelector(".preview-description");
const previewTags = document.querySelector(".preview-tags");
const previewEnds = document.querySelector(".preview-ends");
const previewImage = document.querySelector(".preview-media img");

const popup = document.getElementById('confirm-delete-popup');
const confirmYes = document.getElementById('confirm-delete-yes');
const confirmNo = document.getElementById('confirm-delete-no');
const listingIdField = document.createElement("input");

listingIdField.type = "hidden";
listingIdField.id = "listingId";
updateListingForm.appendChild(listingIdField);

const getListingIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
};

const fetchListingDetails = async (listingId) => {
    try {
        const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
        const endpoint = API_LISTINGS_SINGLE.replace("<id>", listingId);

        const response = await fetch(endpoint, {
            method: "GET",
            headers: headers(token),
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(errorDetails.message || "Failed to fetch listing details");
        }

        const listingData = await response.json();
        populateForm(listingData.data);
    } 
    
    catch (error) {
        updateStatus.textContent = `Error fetching listing details: ${error.message}`;
        updateStatus.style.color = "red";
    }
};

const populateForm = (listing) => {
    listingIdField.value = listing.id;
    document.getElementById("mediaUrl").value = listing.media?.[0]?.url || "";
    document.getElementById("title").value = listing.title || "";
    document.getElementById("description").value = listing.description || "";
    document.getElementById("tags").value = listing.tags?.join(", ") || "";
    document.getElementById("endsAt").value = listing.endsAt
        ? new Date(listing.endsAt).toISOString().slice(0, 16)
        : "";

    updatePreview();
};

const updatePreview = () => {
    const title = document.getElementById("title").value || "Title";
    const description = document.getElementById("description").value || "No description provided.";
    const mediaUrl = document.getElementById("mediaUrl").value || "";
    const tags = document.getElementById("tags").value || "";
    const endsAt = document.getElementById("endsAt").value || "No end date set.";

    previewTitle.textContent = title;
    previewDescription.textContent = description;
    previewEnds.textContent = `Bidding ends: ${endsAt}`;

    previewTags.innerHTML = "";
    if (tags) {
        const tagArray = tags.split(",").map(tag => tag.trim());
        tagArray.forEach(tag => {
            const listItem = document.createElement("li");
            listItem.textContent = tag;
            previewTags.appendChild(listItem);
        });
    }

    if (mediaUrl) {
        previewImage.src = mediaUrl;
        previewImage.alt = "Preview image";
    } 

    else {
        previewImage.src = "";
    }
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
        window.location.href = '/profile/profile.html';
    } 

    catch (error) {
        console.error('Error deleting the listing:', error);
        alert('Failed to delete listing. Please try again.');
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

document.addEventListener("DOMContentLoaded", () => {
    const listingId = getListingIdFromUrl();
    
    if (listingId) {
        fetchListingDetails(listingId);

        const deleteButton = document.querySelector(".delete-button");
        if (deleteButton) {
            deleteButton.addEventListener("click", (event) => {
                event.preventDefault();

                showPopup((confirmed) => {
                    if (confirmed) {
                        deleteListing(listingId);
                    } 

                    else {
                        console.log("Deletion canceled");
                    }
                });
            });
        }
    } 

    else {
        updateStatus.textContent = "No listing ID provided in the URL.";
        updateStatus.style.color = "red";
    }
});

updateListingForm.addEventListener("input", () => {
    updatePreview();
});

updateListingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const listingId = listingIdField.value;
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const mediaUrl = document.getElementById("mediaUrl").value;
    const tags = document.getElementById("tags").value;
    const endsAt = document.getElementById("endsAt").value;

    if (!listingId) {
        updateStatus.textContent = "Listing ID is required.";
        updateStatus.style.color = "red";
        return;
    }

    updateListing(listingId, title, description, mediaUrl, tags, endsAt);
});

const updateListing = async (listingId, title, description, mediaUrl, tags, endsAt) => {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    const endpoint = API_UPDATE_LISTING.replace("<id>", listingId);

    const listingData = {
        ...(title && { title }),
        ...(description && { description }),
        ...(tags && { tags: tags.split(",").map(tag => tag.trim()) }),
        ...(mediaUrl && { media: [{ url: mediaUrl, alt: "Listing media" }] }),
        ...(endsAt && { endsAt: new Date(endsAt).toISOString() }),
    };

    try {
        const response = await fetch(endpoint, {
            method: "PUT",
            headers: headers(token),
            body: JSON.stringify(listingData),
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(errorDetails.message || "Failed to update listing");
        }

        const responseData = await response.json();
        updateStatus.textContent = `Listing "${responseData.data.title}" updated successfully!`;
        updateStatus.style.color = "green";
    } 

    catch (error) {
        updateStatus.textContent = `Error: ${error.message}`;
        updateStatus.style.color = "red";
    }
};


