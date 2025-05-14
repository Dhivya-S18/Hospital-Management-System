// --- DOM Elements ---
const patientForm = document.getElementById('patient-form');
const patientTableBody = document.getElementById('patients-table-body');
const addPatientBtn = document.getElementById('add-patient-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const messageArea = document.getElementById('message-area');

// Form Inputs
const patientIdInput = document.getElementById('patient-id');
const patientNameInput = document.getElementById('patient-name');
const patientEmailInput = document.getElementById('patient-email');
const patientPasswordInput = document.getElementById('patient-password');
const patientPhoneInput = document.getElementById('patient-phone');
const patientAddressInput = document.getElementById('patient-address');

// --- Functions ---

/**
 * Displays a success or error message.
 * @param {string} message - The message to display.
 * @param {boolean} isError - True for error styling, false for success.
 */
function showMessage(message, isError = false) {
    messageArea.textContent = message;
    messageArea.className = 'message'; // Reset classes
    messageArea.classList.add(isError ? 'error' : 'success');
    messageArea.style.display = 'block'; // Ensure it's visible

    // Optional: Hide message after some time
    setTimeout(() => {
        if (messageArea.textContent === message) { // Only hide if it's still the same message
             messageArea.style.display = 'none';
             messageArea.textContent = '';
             messageArea.className = 'message';
        }
    }, 5000); // Hide after 5 seconds
}

/**
 * Resets the form to its initial state (clears inputs, hides).
 */
function resetForm() {
    patientForm.reset(); // Clears all input fields
    patientIdInput.value = ''; // Ensure hidden ID is cleared
    patientForm.classList.add('form-hidden');
    messageArea.style.display = 'none'; // Hide any previous messages
}

/**
 * Populates the form with patient data for editing.
 * @param {Object} patient - The patient object.
 */
function populateForm(patient) {
    patientIdInput.value = patient.id;
    patientNameInput.value = patient.name || '';
    patientEmailInput.value = patient.email || '';
    patientPhoneInput.value = patient.phone || '';
    patientAddressInput.value = patient.address || '';
    // IMPORTANT: Do NOT populate the password field for editing for security.
    patientPasswordInput.value = '';
    patientPasswordInput.placeholder = 'Leave blank to keep current password'; // Update placeholder
    patientForm.classList.remove('form-hidden'); // Show the form
    patientNameInput.focus(); // Focus the first field
}

/**
 * Renders the patient data into the HTML table.
 * @param {Array<Object>} patients - Array of patient objects.
 */
function renderTable(patients) {
    patientTableBody.innerHTML = ''; // Clear existing rows

    if (!patients || patients.length === 0) {
        const row = patientTableBody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 6; // Span all columns
        cell.textContent = 'No patients found.';
        cell.style.textAlign = 'center';
        return;
    }

    patients.forEach(patient => {
        const row = patientTableBody.insertRow();

        row.insertCell().textContent = patient.id;
        row.insertCell().textContent = patient.name;
        row.insertCell().textContent = patient.email;
        row.insertCell().textContent = patient.phone || '-'; // Display dash if null/empty
        row.insertCell().textContent = patient.address || '-';

        // Actions cell
        const actionsCell = row.insertCell();
        actionsCell.classList.add('table-actions'); // For styling

        // Edit Button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('action-button', 'edit-button');
        editBtn.dataset.id = patient.id; // Store ID for easy access
        actionsCell.appendChild(editBtn);

        // Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('action-button', 'delete-button');
        deleteBtn.dataset.id = patient.id; // Store ID
        actionsCell.appendChild(deleteBtn);
    });
}

/**
 * Fetches patient data from the API and renders the table.
 */
async function loadPatients() {
    try {
        const patients = await fetchData('/patients');
        renderTable(patients);
    } catch (error) {
        showMessage(`Error loading patients: ${error.message}`, true);
        renderTable([]); // Render empty table on error
    }
}

/**
 * Handles the form submission for both creating and updating patients.
 * @param {Event} event - The form submission event.
 */
async function handleFormSubmit(event) {
    event.preventDefault(); // Prevent default browser submission

    const patientId = patientIdInput.value;
    const isUpdating = !!patientId; // True if patientId has a value

    // Basic frontend validation (can be more sophisticated)
    if (!patientNameInput.value || !patientEmailInput.value) {
        showMessage('Name and Email are required.', true);
        return;
    }
    // Require password only when creating (not updating, unless field is filled)
     if (!isUpdating && !patientPasswordInput.value) {
        showMessage('Password is required for new patients.', true);
        return;
    }

    const patientData = {
        name: patientNameInput.value.trim(),
        email: patientEmailInput.value.trim(),
        phone: patientPhoneInput.value.trim() || null, // Send null if empty
        address: patientAddressInput.value.trim() || null,
        // Only include password if it's being set/changed
        ...(patientPasswordInput.value && { password: patientPasswordInput.value })
    };

    try {
        let savedPatient;
        if (isUpdating) {
            // Update existing patient
            savedPatient = await updateData(`/patients/${patientId}`, patientData);
            showMessage(`Patient ${savedPatient.name} (ID: ${savedPatient.id}) updated successfully!`);
        } else {
            // Create new patient
            savedPatient = await postData('/patients', patientData);
            showMessage(`Patient ${savedPatient.name} (ID: ${savedPatient.id}) created successfully!`);
        }
        resetForm();
        await loadPatients(); // Reload table data
    } catch (error) {
        showMessage(`Error saving patient: ${error.message}`, true);
        console.error("Save/Update Error:", error);
    }
}

/**
 * Handles clicks on the Edit and Delete buttons within the table body (using event delegation).
 * @param {Event} event - The click event.
 */
async function handleActionsClick(event) {
    const target = event.target;
    const patientId = target.dataset.id;

    if (!patientId) return; // Clicked somewhere else

    if (target.classList.contains('edit-button')) {
        // --- Handle Edit ---
        try {
            // Fetch the specific patient's data to ensure form has latest info
            const patient = await fetchData(`/patients/${patientId}`);
            if (patient) {
                populateForm(patient);
                window.scrollTo(0, 0); // Scroll to top to see the form
            } else {
                 showMessage(`Could not find patient with ID ${patientId}.`, true);
            }
        } catch (error) {
            showMessage(`Error fetching patient details: ${error.message}`, true);
        }

    } else if (target.classList.contains('delete-button')) {
        // --- Handle Delete ---
        if (confirm(`Are you sure you want to delete patient ID ${patientId}?`)) {
            try {
                await deleteData(`/patients/${patientId}`);
                showMessage(`Patient ID ${patientId} deleted successfully.`);
                await loadPatients(); // Refresh the table
            } catch (error) {
                showMessage(`Error deleting patient: ${error.message}`, true);
            }
        }
    }
}


// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', loadPatients); // Load data when page loads
addPatientBtn.addEventListener('click', () => {
    resetForm(); // Clear form for adding
    patientPasswordInput.placeholder = 'Required for new patient'; // Reset placeholder
    patientForm.classList.remove('form-hidden'); // Show the form
    patientNameInput.focus();
});
cancelEditBtn.addEventListener('click', resetForm); // Handle cancel button
patientForm.addEventListener('submit', handleFormSubmit); // Handle form submission
patientTableBody.addEventListener('click', handleActionsClick); // Handle clicks within the table body for Edit/Delete