// --- API Helper Functions ---

/**
 * Creates the Authorization header for Basic Auth.
 * @returns {Headers} Headers object with Authorization and Content-Type.
 */
function getAuthHeaders() {
    const headers = new Headers();
    // btoa() creates Base64 encoding required for Basic Auth
    headers.append('Authorization', 'Basic ' + btoa(AUTH_USERNAME + ":" + AUTH_PASSWORD));
    headers.append('Content-Type', 'application/json');
    return headers;
}

/**
 * Handles the response from fetch requests.
 * Checks for errors and parses JSON.
 * @param {Response} response - The fetch response object.
 * @returns {Promise<Object|null>} Parsed JSON data or null if no content.
 * @throws {Error} If the network response was not ok.
 */
async function handleResponse(response) {
    if (response.status === 204) { // No Content
        return null;
    }
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
        // Attempt to get error message from backend response
        const errorMessage = data?.message || data?.error || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
    }
    return data;
}

/**
 * Performs a GET request.
 * @param {string} endpoint - The API endpoint (e.g., '/patients').
 * @returns {Promise<Object|Array>} The fetched data.
 */
async function fetchData(endpoint) {
    try {
        const response = await fetch(API_BASE_URL + endpoint, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error);
        throw error; // Re-throw to be caught by calling function
    }
}

/**
 * Performs a POST request.
 * @param {string} endpoint - The API endpoint.
 * @param {Object} bodyData - The data to send in the request body.
 * @returns {Promise<Object>} The response data (usually the created resource).
 */
async function postData(endpoint, bodyData) {
    try {
        const response = await fetch(API_BASE_URL + endpoint, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(bodyData)
        });
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error posting data to ${endpoint}:`, error);
        throw error;
    }
}

/**
 * Performs a PUT request.
 * @param {string} endpoint - The API endpoint (e.g., '/patients/1').
 * @param {Object} bodyData - The data to send in the request body.
 * @returns {Promise<Object>} The response data (usually the updated resource).
 */
async function updateData(endpoint, bodyData) {
     try {
        const response = await fetch(API_BASE_URL + endpoint, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(bodyData)
        });
        return await handleResponse(response);
    } catch (error) {
        console.error(`Error updating data at ${endpoint}:`, error);
        throw error;
    }
}

/**
 * Performs a DELETE request.
 * @param {string} endpoint - The API endpoint (e.g., '/patients/1').
 * @returns {Promise<null>} Resolves when deletion is successful.
 */
async function deleteData(endpoint) {
    try {
        const response = await fetch(API_BASE_URL + endpoint, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
         // Handle response checks specifically for delete (often 204 No Content)
        if (!response.ok && response.status !== 204) {
             // Try to get error details if possible
             let errorMsg = `HTTP error! status: ${response.status}`;
             try {
                const errorData = await response.json();
                errorMsg = errorData?.message || errorData?.error || errorMsg;
             } catch(e) { /* Ignore if response is not JSON */ }
             throw new Error(errorMsg);
        }
        return null; // Indicate success
    } catch (error) {
        console.error(`Error deleting data at ${endpoint}:`, error);
        throw error;
    }
}