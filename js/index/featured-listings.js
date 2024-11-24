import { API_LISTINGS } from "../constants.js";
import { headers } from "../headers.js";

function parseEuropeanDate(dateString) {
    const [day, month, year] = dateString.split('.').map(num => parseInt(num, 10));
    return new Date(year, month - 1, day); 
}

export async function fetchNewestListings() {
    try {
      const response = await fetch(`${API_LISTINGS}?limit=7`, {
        method: "GET",
        headers: headers(),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch newest listings: ${response.statusText}`);
      }
  
      const data = await response.json();
      const listings = Array.isArray(data.data) ? data.data : [];
  
      listings.sort((a, b) => {
        const dateA = parseEuropeanDate(a.created);
        const dateB = parseEuropeanDate(b.created);
        return dateB - dateA; 
      });
  
      return listings.slice(0, 7);
    } 
    
    catch (error) {
      console.error("Error fetching newest listings:", error);
      
      throw error;
    }
  }

export async function loadNewestListings() {
  try {
    const listings = await fetchNewestListings();
    const newestListingsContainer = document.querySelector(".newest-listings");

    if (!newestListingsContainer) {
      console.error("Newest listings container not found.");
      return;
    }

    if (listings.length === 0) {
      newestListingsContainer.innerHTML = "<p>No newest listings available.</p>";
      return;
    }

    const listingsHtml = listings
      .map((listing, index) => {
        return `
                      <div class="listing" id="newest-listing-${listing.id}" data-id="${listing.id}">

                        <div class="listing-content">
                            <div class="listing-media">
                                ${listing.media && listing.media.length > 0 ? `<img src="${listing.media[0].url}" alt="${listing.media[0].alt}"/>` : ""}
                            </div>

                            <div class="listing-details">
                      
                                <div class="listing-title">
                                    <h3>${listing.title}</h3>
                                </div>
                          
                                <div class="description">
                                    <p>${listing.description}</p>
                                </div>
                          
                            </div>

                            <div class="total-bids">
                                <p>11 Biddings</p>
                             </div>

                        </div>

                        <div class="see-listing" id="newest-listing-${listing.id}" data-id="${listing.id}">
                        <i class="fa-solid fa-arrow-right"></i>
                        </div>

                      </div>
        `;
      })
      .join("");

    newestListingsContainer.innerHTML = listingsHtml;

    document.querySelectorAll(".newest-listing").forEach((listingElement) => {
      listingElement.addEventListener("click", () => {
        const listingId = listingElement.getAttribute("data-id");
        window.location.href = `listings/single-listing.html?id=${listingId}`;
      });
    });

    document.querySelectorAll(".see-listing").forEach((listingElement) => {
      listingElement.addEventListener("click", () => {
        const listingId = listingElement.getAttribute("data-id");
        window.location.href = `listings/single-listing.html?id=${listingId}`;
      });
    });
  } 
  
  catch (error) {
    console.error("Error displaying newest listings:", error);
    const newestListingsContainer = document.querySelector(".newest-listings");
    if (newestListingsContainer) {
      newestListingsContainer.innerHTML = "<p>Failed to load newest listings. Please try again later.</p>";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadNewestListings();
});
