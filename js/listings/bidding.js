import { API_LISTINGS_BIDS, API_PROFILES_SINGLE } from "../constants.js";
import { headers } from "../headers.js";
import { listingId } from './single-listing.js';

const username = localStorage.getItem("username");

async function fetchUserCredits() {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

    try {
        const response = await fetch(`${API_PROFILES_SINGLE}/${username}`, {
            method: "GET",
            headers: headers(token),
        });

        if (!response.ok) {
            throw new Error(`Error fetching user profile: ${response.statusText}`);
        }

        const data = await response.json();
        const credits = data?.data?.credits || 0;
        return credits;
    } 
    catch (error) {
        console.error("Error fetching user credits:", error);
        return 0;
    }
}

async function placeBid(bidAmount) {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

    if (!token) {
        alert("You must be logged in to place a bid.");
        return;
    }

    const bidData = { amount: bidAmount };

    try {
        const headersObj = headers(token);
        const response = await fetch(API_LISTINGS_BIDS.replace("<id>", listingId), {
            method: "POST",
            headers: headersObj,
            body: JSON.stringify(bidData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to place bid: ${errorData.errors ? errorData.errors.map(e => e.message).join(", ") : response.statusText}`);
        }

        const data = await response.json();
        alert(`Bid placed successfully!`);
        window.location.reload();
        return data;

    } 
    catch (error) {
        console.error("Error placing bid:", error);
        alert("Failed to place bid. Please try again.");
    }
}

async function handlePlaceBid() {
    const bidAmountInput = document.getElementById("bidAmount");
    let bidAmount = parseFloat(bidAmountInput.value);

    if (isNaN(bidAmount) || bidAmount <= 0) {
        alert("Please enter a valid bid amount (greater than zero).");
        return;
    }

    const userCredits = await fetchUserCredits();

    if (bidAmount > Number(userCredits)) {
        alert("You don't have enough credits to place this bid.");
        return;
    }

    const result = await placeBid(bidAmount);

    if (result) {
        bidAmountInput.value = "";
    }
}

document.getElementById("placeBid").addEventListener("click", handlePlaceBid);

document.getElementById("bidAmount").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        handlePlaceBid();
    }
});

document.getElementById("bidAmount").addEventListener("input", (event) => {
    const bidAmountInput = document.getElementById("bidAmount");
    const value = bidAmountInput.value;

    if (!/^\d*\.?\d*$/.test(value)) {
        bidAmountInput.setCustomValidity("Please enter a valid number.");
    } 
    
    else {
        bidAmountInput.setCustomValidity("");
    }
});


