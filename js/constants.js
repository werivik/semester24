import { headers } from "../js/headers.js";

const NOROFF_API_URL = "https://v2.api.noroff.dev";

export async function readPosts(accessToken) {
  const options = {
    method: 'GET',
    headers: headers(accessToken)
  };

  try {
    const response = await fetch(`${NOROFF_API_URL}`, options);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } 
  
  catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

export const API_KEY = "f7d9660d-4dba-4b16-82c6-1a4669e99612";

export const API_BASE = "https://v2.api.noroff.dev";

export const API_AUTH = `${API_BASE}/auth`;

export const API_AUTH_LOGIN = `${API_AUTH}/login`;

export const API_AUTH_REGISTER = `${API_AUTH}/register`;

export const API_AUTH_KEY = `${API_AUTH}/f7d9660d-4dba-4b16-82c6-1a4669e99612`;

export const API_LISTINGS = `${API_BASE}/auction/listings`

export const API_LISTINGS_SINGLE = `${API_BASE}/auction/listings/<id>`

export const API_LISTINGS_BIDS = `${API_BASE}/auction/listings/<id>/bids`

export const API_PROFILES_SINGLE = `${API_BASE}/auction/profiles`;

export const API_PROFILES_LISTINGS = `${API_BASE}/auction/profiles/<name>/listings`;

export const API_CREATE_LISTING = `${API_BASE}/auction/listings`;

export const API_DELETE_LISTING = `${API_BASE}/auction/listings/<id>`;

export const API_UPDATE_LISTING = `${API_BASE}/auction/listings/<id>`;

export const API_UPDATE_PROFILE = `${API_BASE}/auction/profiles/<name>`;

export const API_LISTINGS_BY_PROFILE = `${API_BASE}/auction/profiles/<name>/listings`; /**/

