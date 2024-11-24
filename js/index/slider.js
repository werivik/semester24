import { API_LISTINGS } from "../constants.js";
import { headers } from "../headers.js";

function parseEuropeanDate(dateString) {
  const [day, month, year] = dateString.split('.').map(num => parseInt(num, 10));
  return new Date(year, month - 1, day);
}

export async function fetchNewestListings() {
  try {
    const response = await fetch(`${API_LISTINGS}?limit=7&_count=true`, {
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
    const sliderContainer = document.querySelector(".newest-listings");
    const nextButton = document.querySelector(".next-right");
    const prevButton = document.querySelector(".next-left");

    if (!sliderContainer) {
      console.error("Newest listings container not found.");
      return;
    }

    if (listings.length === 0) {
      sliderContainer.innerHTML = "<p>No newest listings available.</p>";
      return;
    }

    let currentIndex = 0;

    function displaySliderListings() {
      const indexes = [
        currentIndex,
        (currentIndex + 1) % listings.length,
        (currentIndex + 2) % listings.length,
      ];

      sliderContainer.innerHTML = indexes
        .map((index) => {
          const listing = listings[index];
          const bidCount = listing._count?.bids || 0;
          return `
            <div class="listing" id="newest-listing-${listing.id}" data-id="${listing.id}">
              <div class="listing-content">
                <div class="listing-media">
                  ${listing.media && listing.media.length > 0
                    ? `<img src="${listing.media[0].url}" alt="${listing.media[0].alt}"/>`
                    : ""}
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
                  <p>${bidCount} Biddings</p>
                </div>
              </div>
              <div class="see-listing" data-id="${listing.id}">
                <i class="fa-solid fa-arrow-right"></i>
              </div>
            </div>
          `;
        })
        .join("");
    }

    function moveToNextSlide() {
      currentIndex = (currentIndex + 1) % listings.length;
      displaySliderListings();
    }

    function moveToPreviousSlide() {
      currentIndex = (currentIndex - 1 + listings.length) % listings.length;
      displaySliderListings();
    }

    nextButton.addEventListener("click", moveToNextSlide);
    prevButton.addEventListener("click", moveToPreviousSlide);

    displaySliderListings();

    sliderContainer.addEventListener("click", (event) => {
      const listingElement = event.target.closest(".listing");
      
      if (listingElement) {
        const listingId = listingElement.getAttribute("data-id");
        window.location.href = `listings/single-listing.html?id=${listingId}`;
      }
    });
  } 
  
  catch (error) {
    console.error("Error displaying newest listings:", error);
    const sliderContainer = document.querySelector(".newest-listings");
    
    if (sliderContainer) {
      sliderContainer.innerHTML = "<p>Failed to load newest listings. Please try again later.</p>";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadNewestListings();
});


