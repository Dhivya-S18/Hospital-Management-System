document.addEventListener("DOMContentLoaded", function() {
    // --- Active Navigation Link Highlighting ---
    const navLinks = document.querySelectorAll('header nav a');
    let currentPath = window.location.pathname.split('/').pop();
    if (currentPath === '' || currentPath === null) {
        currentPath = 'index.html';
    }

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // --- Footer Current Year ---
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // --- Dashboard Specific Logic ---
    if (currentPath === 'index.html') {
        const patientCountEl = document.getElementById('patient-count');
        const doctorCountEl = document.getElementById('doctor-count');
        const appointmentCountEl = document.getElementById('appointment-count');
        const messageArea = document.getElementById('message-area');

        function showDashboardMessage(message, isError = false) {
            if (!messageArea) return;
            messageArea.textContent = message;
            messageArea.className = 'message dashboard-message'; // Ensure dashboard specific class
            messageArea.classList.add(isError ? 'error' : 'success');
            messageArea.style.display = 'block';
            setTimeout(() => {
                if (messageArea.textContent === message) {
                     messageArea.style.display = 'none';
                }
            }, 7000);
        }

        // Animate number count-up
        function animateCountUp(element, endValue, duration = 1500) {
            if (!element) return;
            let startValue = 0;
            const stepTime = Math.abs(Math.floor(duration / endValue));
            const increment = endValue > 0 ? 1 : 0; // Avoid issues if endValue is 0

            if (endValue === 0) {
                element.textContent = 0;
                return;
            }

            const timer = setInterval(() => {
                startValue += increment;
                element.textContent = startValue;
                if (startValue === endValue) {
                    clearInterval(timer);
                }
            }, stepTime > 0 ? stepTime : 20); // Ensure stepTime is positive
        }


        async function loadDashboardData() {
            if (patientCountEl) patientCountEl.textContent = '...';
            if (doctorCountEl) doctorCountEl.textContent = '...';
            if (appointmentCountEl) appointmentCountEl.textContent = '...';

            try {
                if (typeof fetchData !== 'function') {
                    throw new Error("fetchData function not found. Ensure api.js is loaded.");
                }

                // Fetch all data concurrently for better performance
                const [patientsData, doctorsData, appointmentsData] = await Promise.all([
                    fetchData('/patients').catch(e => { console.error("Patient fetch error:", e); return null; }),
                    fetchData('/doctors').catch(e => { console.error("Doctor fetch error:", e); return null; }),
                    fetchData('/appointments').catch(e => { console.error("Appointment fetch error:", e); return null; })
                ]);

                if (patientCountEl) {
                    animateCountUp(patientCountEl, patientsData ? patientsData.length : 0);
                }
                if (doctorCountEl) {
                    animateCountUp(doctorCountEl, doctorsData ? doctorsData.length : 0);
                }
                if (appointmentCountEl) {
                    animateCountUp(appointmentCountEl, appointmentsData ? appointmentsData.length : 0);
                }

                // Check if any fetch failed specifically to show a general error
                if (!patientsData || !doctorsData || !appointmentsData) {
                    // Find the first error to display a more specific message if possible
                    let specificError = "Could not load some dashboard data.";
                    if (!patientsData) specificError = "Failed to load patient data.";
                    else if (!doctorsData) specificError = "Failed to load doctor data.";
                    else if (!appointmentsData) specificError = "Failed to load appointment data.";
                    showDashboardMessage(specificError, true);
                }


            } catch (error) { // Catches errors from fetchData not found or Promise.all rejection
                console.error("Error loading dashboard data:", error);
                showDashboardMessage(`Error loading dashboard data: ${error.message}`, true);
                if (patientCountEl) patientCountEl.textContent = 'Error';
                if (doctorCountEl) doctorCountEl.textContent = 'Error';
                if (appointmentCountEl) appointmentCountEl.textContent = 'Error';
            }
        }
        loadDashboardData();
    }
});