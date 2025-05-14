// --- DOM Elements ---
const doctorForm = document.getElementById('doctor-form');
const doctorTableBody = document.getElementById('doctors-table-body');
const addDoctorBtn = document.getElementById('add-doctor-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const messageArea = document.getElementById('message-area');

// Form Inputs
const doctorIdInput = document.getElementById('doctor-id');
const doctorNameInput = document.getElementById('doctor-name');
const doctorSpecializationInput = document.getElementById('doctor-specialization');
const doctorDepartmentInput = document.getElementById('doctor-department');
const doctorContactNumberInput = document.getElementById('doctor-contactNumber');
const doctorEmailInput = document.getElementById('doctor-email');
const doctorPasswordInput = document.getElementById('doctor-password');


// --- Functions --- (showMessage is assumed to exist in api.js or globally if using main.js)

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
    doctorForm.reset();
    doctorIdInput.value = '';
    doctorForm.classList.add('form-hidden');
    messageArea.style.display = 'none';
}


function populateForm(doctor) {
    doctorIdInput.value = doctor.id;
    doctorNameInput.value = doctor.name || '';
    doctorSpecializationInput.value = doctor.specialization || '';
    doctorDepartmentInput.value = doctor.department || '';
    doctorContactNumberInput.value = doctor.contactNumber || '';
    doctorEmailInput.value = doctor.email || '';
    doctorPasswordInput.value = ''; // Don't populate password
    doctorPasswordInput.placeholder = 'Leave blank to keep current password';
    doctorForm.classList.remove('form-hidden');
    doctorNameInput.focus();
}


function renderTable(doctors) {
    doctorTableBody.innerHTML = '';

    if (!doctors || doctors.length === 0) {
        const row = doctorTableBody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 7; // Adjusted column span
        cell.textContent = 'No doctors found.';
        cell.style.textAlign = 'center';
        return;
    }

    doctors.forEach(doctor => {
        const row = doctorTableBody.insertRow();

        row.insertCell().textContent = doctor.id;
        row.insertCell().textContent = doctor.name;
        row.insertCell().textContent = doctor.specialization;
        row.insertCell().textContent = doctor.department;
        row.insertCell().textContent = doctor.contactNumber || '-';
        row.insertCell().textContent = doctor.email;

        const actionsCell = row.insertCell();
        actionsCell.classList.add('table-actions');

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('action-button', 'edit-button');
        editBtn.dataset.id = doctor.id;
        actionsCell.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('action-button', 'delete-button');
        deleteBtn.dataset.id = doctor.id;
        actionsCell.appendChild(deleteBtn);
    });
}


async function loadDoctors() {
    try {
        const doctors = await fetchData('/doctors');
        renderTable(doctors);
    } catch (error) {
        showMessage(`Error loading doctors: ${error.message}`, true);
        renderTable([]);
    }
}


async function handleFormSubmit(event) {
    event.preventDefault();

    const doctorId = doctorIdInput.value;
    const isUpdating = !!doctorId;

    // Basic Validation
    if (!doctorNameInput.value || !doctorSpecializationInput.value || !doctorDepartmentInput.value || !doctorEmailInput.value) {
        showMessage('Name, Specialization, Department, and Email are required.', true);
        return;
    }
    if (!isUpdating && !doctorPasswordInput.value) {
        showMessage('Password is required for new doctors.', true);
        return;
    }

    const doctorData = {
        name: doctorNameInput.value.trim(),
        specialization: doctorSpecializationInput.value.trim(),
        department: doctorDepartmentInput.value.trim(),
        contactNumber: doctorContactNumberInput.value.trim() || null,
        email: doctorEmailInput.value.trim(),
        ...(doctorPasswordInput.value && { password: doctorPasswordInput.value })
    };

    try {
        let savedDoctor;
        if (isUpdating) {
            savedDoctor = await updateData(`/doctors/${doctorId}`, doctorData);
            showMessage(`Doctor ${savedDoctor.name} (ID: ${savedDoctor.id}) updated successfully!`);
        } else {
            savedDoctor = await postData('/doctors', doctorData);
            showMessage(`Doctor ${savedDoctor.name} (ID: ${savedDoctor.id}) created successfully!`);
        }
        resetForm();
        await loadDoctors();
    } catch (error) {
        showMessage(`Error saving doctor: ${error.message}`, true);
        console.error("Save/Update Error:", error);
    }
}


async function handleActionsClick(event) {
    const target = event.target;
    const doctorId = target.dataset.id;

    if (!doctorId) return;

    if (target.classList.contains('edit-button')) {
        try {
            const doctor = await fetchData(`/doctors/${doctorId}`);
            if (doctor) {
                populateForm(doctor);
                window.scrollTo(0, 0);
            } else {
                 showMessage(`Could not find doctor with ID ${doctorId}.`, true);
            }
        } catch (error) {
            showMessage(`Error fetching doctor details: ${error.message}`, true);
        }

    } else if (target.classList.contains('delete-button')) {
        if (confirm(`Are you sure you want to delete doctor ID ${doctorId}?`)) {
            try {
                await deleteData(`/doctors/${doctorId}`);
                showMessage(`Doctor ID ${doctorId} deleted successfully.`);
                await loadDoctors();
            } catch (error) {
                showMessage(`Error deleting doctor: ${error.message}`, true);
            }
        }
    }
}


// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', loadDoctors);
addDoctorBtn.addEventListener('click', () => {
    resetForm();
    doctorPasswordInput.placeholder = 'Required for new doctor';
    doctorForm.classList.remove('form-hidden');
    doctorNameInput.focus();
});
cancelEditBtn.addEventListener('click', resetForm);
doctorForm.addEventListener('submit', handleFormSubmit);
doctorTableBody.addEventListener('click', handleActionsClick);