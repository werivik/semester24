import { API_LISTINGS_SINGLE } from "../constants.js";
import { headers } from "../headers.js";

const urlParams = new URLSearchParams(window.location.search);
const listingId = urlParams.get("id");

export { listingId };

if (!listingId) {
    console.error("No listing ID found in the URL");

    const productDetailsContainer = document.querySelector(".listing-right-side");

    if (productDetailsContainer) {
        productDetailsContainer.innerHTML = "<p>Invalid listing ID.</p>";
    }
}

async function fetchListingDetails(id) {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

    try {
        const url = `${API_LISTINGS_SINGLE.replace("<id>", id)}`;
        const response = await fetch(url, {
            method: "GET",
            headers: headers(token),
        });

        if (!response.ok) {
            throw new Error(`Error fetching listing details: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } 
    
    catch (error) {
        console.error("Error fetching listing details:", error);
        return null;
    }
}

async function loadListingDetails() {
    const listingDetails = await fetchListingDetails(listingId);

    if (!listingDetails) {
        const mediaContainer = document.querySelector(".listing-left-side");
        const detailContainer = document.querySelector(".listing-right-side");

        if (mediaContainer && detailContainer) {
            mediaContainer.innerHTML = "<p>Failed to load listing media. Please try again later.</p>";
            detailContainer.innerHTML = "<p>Failed to load listing details. Please try again later.</p>";
        }
        return;
    
    }

    console.log(listingDetails);

    const { title, description, media, created, updated, endsAt, _count } = listingDetails.data;
    const { bids } = _count;

    const mediaContainer = document.querySelector(".listing-left-side .listing-media");
    const titleElement = document.querySelector(".listing-right-side h1");
    const descriptionElement = document.querySelector(".listing-right-side .description");
    const endsAtElement = document.querySelector(".listing-right-side .ends");
    const bidsElement = document.querySelector(".listing-right-side .total-bids");
    const createdElement = document.querySelector("#createdListing");
    const updatedElement = document.querySelector("#updatedListing");

    if (!mediaContainer || !titleElement || !descriptionElement || !endsAtElement || !bidsElement || !createdElement || !updatedElement) {
        console.error("Some elements are missing in the HTML structure.");
        return;
    }

    if (media && media.length > 0) {
        const mediaHtml = `<img src="${media[0].url}" alt="${media[0].alt}" />`;
        mediaContainer.innerHTML = mediaHtml;
    }

    titleElement.textContent = title;

    descriptionElement.textContent = description;

    endsAtElement.textContent = `Ends at: ${new Date(endsAt).toLocaleString()}`;

    bidsElement.textContent = `Total Bids: ${bids}`;

    createdElement.textContent = `Created: ${new Date(created).toLocaleDateString()}`;

    updatedElement.textContent = `Updated: ${new Date(updated).toLocaleDateString()}`;

}

document.addEventListener("DOMContentLoaded", () => {
    loadListingDetails();
});
