import { API_CREATE_LISTING } from "../constants.js";
import { headers } from "../headers.js";

const createListingForm = document.getElementById("create-listing-form");
const listingStatus = document.getElementById("listing-status");
const previewSection = document.querySelector(".preview-section");
const previewTitle = document.querySelector(".preview-title");
const previewDescription = document.querySelector(".preview-description"); 
const previewTags = document.querySelector(".preview-tags");
const previewEnds = document.querySelector(".preview-ends"); 
const previewImage = document.querySelector(".preview-media img");

const createListing = async (title, description, mediaUrl, tags, endsAt) => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    const endpoint = API_CREATE_LISTING;

    const listingData = {
        title,
        description,
        tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
        media: mediaUrl ? [{ url: mediaUrl, alt: "Listing media" }] : [],
        endsAt: new Date(endsAt).toISOString(),
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: headers(token),
            body: JSON.stringify(listingData),
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(errorDetails.message || 'Failed to create listing');
        }

        const responseData = await response.json();

        listingStatus.textContent = `Listing "${responseData.data.title}" created successfully!`;
        listingStatus.style.color = "green";

        createListingForm.reset();
        updatePreview();
    } 
    
    catch (error) {
        listingStatus.textContent = `Error: ${error.message}`;
        listingStatus.style.color = "red";
    }
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

createListingForm.addEventListener("input", () => {
    updatePreview();
});

createListingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const mediaUrl = document.getElementById("mediaUrl").value;
    const tags = document.getElementById("tags").value;
    const endsAt = document.getElementById("endsAt").value;

    if (!title || !endsAt) {
        listingStatus.textContent = "Title and Ends At fields are required.";
        listingStatus.style.color = "red";
        return;
    }

    createListing(title, description, mediaUrl, tags, endsAt);
});
