// --- DOM Elements ---
const appointmentForm = document.getElementById('appointment-form');
const appointmentTableBody = document.getElementById('appointments-table-body');
const addAppointmentBtn = document.getElementById('add-appointment-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const messageArea = document.getElementById('message-area');

// Form Inputs
const appointmentIdInput = document.getElementById('appointment-id');
const appointmentDoctorIdInput = document.getElementById('appointment-doctorId');
const appointmentPatientIdInput = document.getElementById('appointment-patientId');
const appointmentDateInput = document.getElementById('appointment-date');
const appointmentTimeInput = document.getElementById('appointment-time');
const appointmentReasonInput = document.getElementById('appointment-reason');

// --- Functions ---

// Re-use or adapt showMessage from patients.js or api.js if needed globally
function showMessage(message, isError = false) {
    messageArea.textContent = message;
    messageArea.className = 'message'; // Reset classes
    messageArea.classList.add(isError ? 'error' : 'success');
    messageArea.style.display = 'block'; // Ensure it's visible
    setTimeout(() => {
        if (messageArea.textContent === message) {
             messageArea.style.display = 'none';
             messageArea.textContent = '';
             messageArea.className = 'message';
        }
    }, 5000);
}

function resetForm() {
    appointmentForm.reset();
    appointmentIdInput.value = '';
    appointmentForm.classList.add('form-hidden');
    messageArea.style.display = 'none';
}

function populateForm(appointment) {
    appointmentIdInput.value = appointment.id;
    appointmentDoctorIdInput.value = appointment.doctorId || ''; // Use doctorId based on backend model/service
    appointmentPatientIdInput.value = appointment.patientId || ''; // Use patientId
    appointmentDateInput.value = appointment.appointmentDate || '';
    appointmentTimeInput.value = appointment.appointmentTime || ''; // Assumes HH:mm or HH:mm:ss format from backend
    appointmentReasonInput.value = appointment.reason || '';
    appointmentForm.classList.remove('form-hidden');
    appointmentDoctorIdInput.focus(); // Focus first field
}


function renderTable(appointments) {
    appointmentTableBody.innerHTML = '';

    if (!appointments || appointments.length === 0) {
        const row = appointmentTableBody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 7; // Adjusted column span
        cell.textContent = 'No appointments found.';
        cell.style.textAlign = 'center';
        return;
    }

    appointments.forEach(appointment => {
        const row = appointmentTableBody.insertRow();

        row.insertCell().textContent = appointment.id;
        row.insertCell().textContent = appointment.doctorId; // Use doctorId
        row.insertCell().textContent = appointment.patientId; // Use patientId
        row.insertCell().textContent = appointment.appointmentDate;
        row.insertCell().textContent = appointment.appointmentTime;
        row.insertCell().textContent = appointment.reason || '-';

        const actionsCell = row.insertCell();
        actionsCell.classList.add('table-actions');

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('action-button', 'edit-button');
        editBtn.dataset.id = appointment.id;
        actionsCell.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('action-button', 'delete-button');
        deleteBtn.dataset.id = appointment.id;
        actionsCell.appendChild(deleteBtn);
    });
}


async function loadAppointments() {
    try {
        const appointments = await fetchData('/appointments');
        renderTable(appointments);
    } catch (error) {
        showMessage(`Error loading appointments: ${error.message}`, true);
        renderTable([]);
    }
}


async function handleFormSubmit(event) {
    event.preventDefault();

    const appointmentId = appointmentIdInput.value;
    const isUpdating = !!appointmentId;

    // Basic Validation
    if (!appointmentDoctorIdInput.value || !appointmentPatientIdInput.value || !appointmentDateInput.value || !appointmentTimeInput.value) {
        showMessage('Doctor ID, Patient ID, Date, and Time are required.', true);
        return;
    }

    // Construct data object matching backend expectations
    const appointmentData = {
        doctorId: parseInt(appointmentDoctorIdInput.value, 10), // Ensure it's a number
        patientId: parseInt(appointmentPatientIdInput.value, 10), // Ensure it's a number
        appointmentDate: appointmentDateInput.value,
        appointmentTime: appointmentTimeInput.value,
        reason: appointmentReasonInput.value.trim() || null
    };

     // Add ID only if updating (though backend gets it from URL path)
    // if (isUpdating) {
    //     appointmentData.id = parseInt(appointmentId, 10);
    // }

    try {
        let savedAppointment;
        if (isUpdating) {
            savedAppointment = await updateData(`/appointments/${appointmentId}`, appointmentData);
            showMessage(`Appointment ID ${savedAppointment.id} updated successfully!`);
        } else {
            savedAppointment = await postData('/appointments', appointmentData);
            showMessage(`Appointment ID ${savedAppointment.id} created successfully!`);
        }
        resetForm();
        await loadAppointments();
    } catch (error) {
        showMessage(`Error saving appointment: ${error.message}`, true);
        console.error("Save/Update Error:", error);
    }
}


async function handleActionsClick(event) {
    const target = event.target;
    const appointmentId = target.dataset.id;

    if (!appointmentId) return;

    if (target.classList.contains('edit-button')) {
        try {
            const appointment = await fetchData(`/appointments/${appointmentId}`);
             if (appointment) {
                populateForm(appointment);
                 window.scrollTo(0, 0);
            } else {
                 showMessage(`Could not find appointment with ID ${appointmentId}.`, true);
            }
        } catch (error) {
            showMessage(`Error fetching appointment details: ${error.message}`, true);
        }

    } else if (target.classList.contains('delete-button')) {
        if (confirm(`Are you sure you want to delete appointment ID ${appointmentId}?`)) {
            try {
                await deleteData(`/appointments/${appointmentId}`);
                showMessage(`Appointment ID ${appointmentId} deleted successfully.`);
                await loadAppointments();
            } catch (error) {
                showMessage(`Error deleting appointment: ${error.message}`, true);
            }
        }
    }
}


// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', loadAppointments);
addAppointmentBtn.addEventListener('click', () => {
    resetForm();
    appointmentForm.classList.remove('form-hidden');
    appointmentDoctorIdInput.focus();
});
cancelEditBtn.addEventListener('click', resetForm);
appointmentForm.addEventListener('submit', handleFormSubmit);
appointmentTableBody.addEventListener('click', handleActionsClick); // Use table body for delegation