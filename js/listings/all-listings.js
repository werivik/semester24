import { API_LISTINGS } from "../constants.js";
import { headers } from "../headers.js";

let sortBy = "newest";
let currentPage = 1;
const listingsPerPage = 9;
let tagFilter = null;

export async function fetchListings() {
  try {
    let url = `${API_LISTINGS}?_count=true`;

    if (tagFilter) {
      url += `&_tag=${encodeURIComponent(tagFilter)}&_active=true`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: headers(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch listings: ${response.statusText}`);
    }

    const data = await response.json();
    const sortedListings = Array.isArray(data.data) ? data.data : [];

    return { listings: sortedListings };
  } 
  
  catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
}

async function loadListings() {
  try {
    const { listings } = await fetchListings();
    const listingsContainer = document.querySelector(".all-listings");
    const popularTagsContainer = document.querySelector(".popular-tags");

    if (!listingsContainer) {
      console.error("Listings container not found.");
      return;
    }

    if (listings.length === 0) {
      listingsContainer.innerHTML = "<p>No listings available.</p>";
      return;
    }

    const sortedListings = [...listings].sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created) - new Date(a.created);
      } 

      else if (sortBy === "oldest") {
        return new Date(a.created) - new Date(b.created);
      }

      return 0;
    });

    const totalListings = sortedListings.length;
    const totalPages = Math.ceil(totalListings / listingsPerPage);

    const paginatedListings = sortedListings.slice(
      (currentPage - 1) * listingsPerPage,
      currentPage * listingsPerPage
    );

    const listingsHtml = paginatedListings
      .map((listing) => {
        const createdDate = new Date(listing.created).toLocaleString();
        const bidCount = listing._count?.bids || 0;
        return `
          <div class="listing" id="listing-${listing.id}" data-id="${listing.id}">
            <div class="listing-content">
              <div class="listing-media">
                ${
                  listing.media && listing.media.length > 0
                    ? `<img src="${listing.media[0].url}" alt="${listing.media[0].alt}"/>`
                    : ""
                }
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
                <p>${bidCount} Bids</p>
              </div>
            </div>
            <div class="see-listing" id="see-listing-${listing.id}" data-id="${listing.id}">
              <i class="fa-solid fa-arrow-right"></i>
            </div>
          </div>
        `;
      })
      .join("");

    listingsContainer.innerHTML = listingsHtml;

    const pageNumbersContainer = document.getElementById("pageNumbers");
    pageNumbersContainer.innerHTML = '';

    const pageRange = getPageRange(totalPages, currentPage);
    pageRange.forEach(pageNumber => {
      const pageButton = document.createElement("button");
      pageButton.textContent = pageNumber;
      pageButton.classList.add("page-button");

      if (pageNumber === currentPage) {
        pageButton.classList.add("active");
      }

      pageButton.addEventListener("click", () => {
        currentPage = pageNumber;
        loadListings();
      });

      pageNumbersContainer.appendChild(pageButton);
    });

    document.getElementById("prevPage").disabled = currentPage === 1;
    document.getElementById("nextPage").disabled = currentPage === totalPages;

    const tagCounts = {};
    listings.forEach((listing) => {
      if (Array.isArray(listing.tags)) {

        listing.tags.forEach((tag) => {
          const trimmedTag = tag.trim();
          if (trimmedTag) {
            tagCounts[trimmedTag] = (tagCounts[trimmedTag] || 0) + 1;
          }
        });

      }
    });

    const mostUsedTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag);

    if (popularTagsContainer) {
      popularTagsContainer.innerHTML = mostUsedTags
        .map((tag) => `<div class="tag" data-tag="${tag}"><p>${tag}</p></div>`)
        .join("");
    }

    document.querySelectorAll(".tag").forEach((tagElement) => {
      tagElement.addEventListener("click", () => {
        tagFilter = tagElement.getAttribute("data-tag");
        currentPage = 1;
        loadListings();
      });
    });

    document.querySelectorAll(".listing").forEach((listingElement) => {
      listingElement.addEventListener("click", () => {
        const listingId = listingElement.getAttribute("data-id");
        window.location.href = `single-listing.html?id=${listingId}`;
      });
    });
  } 

  catch (error) {
    console.error("Error displaying listings:", error);
    const listingsContainer = document.querySelector(".all-listings");
    if (listingsContainer) {
      listingsContainer.innerHTML = "<p>Failed to load listings. Please try again later.</p>";
    }
  }
}

document.getElementById("sort-by").addEventListener("change", (event) => {
  sortBy = event.target.value;
  loadListings();
});

document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    loadListings();
  }
});

document.getElementById("nextPage").addEventListener("click", () => {
  const totalPages = Math.ceil(totalListings / listingsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    loadListings();
  }
});

document.querySelector(".reset-tags").addEventListener("click", () => {
  tagFilter = null;
  currentPage = 1;
  loadListings();
});

document.addEventListener("DOMContentLoaded", () => {
  loadListings();
});

function getPageRange(totalPages, currentPage) {
  const range = [];
  const maxPagesToShow = 11;

  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    range.push(i);
  }

  return range;
}



