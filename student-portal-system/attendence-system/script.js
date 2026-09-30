// ============================================
// Get DOM elements
// ============================================

const form =
    document.getElementById(
        "attendanceForm"
    );


const studentIdInput =
    document.getElementById(
        "studentId"
    );


const dateInput =
    document.getElementById(
        "date"
    );


const subjectInput =
    document.getElementById(
        "subject"
    );


const statusInput =
    document.getElementById(
        "status"
    );


const saveButton =
    document.getElementById(
        "saveButton"
    );


const buttonText =
    document.getElementById(
        "buttonText"
    );


const message =
    document.getElementById(
        "message"
    );


// ============================================
// Set today's date
// ============================================

function setTodayDate() {

    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    dateInput.value =
        `${year}-${month}-${day}`;
}


setTodayDate();


// ============================================
// Clear validation errors
// ============================================

function clearFieldErrors() {

    const inputs = [
        studentIdInput,
        dateInput,
        subjectInput,
        statusInput
    ];


    inputs.forEach(
        (input) => {

            input.classList.remove(
                "input-error"
            );
        }
    );


    document.getElementById(
        "studentIdError"
    ).textContent = "";


    document.getElementById(
        "dateError"
    ).textContent = "";


    document.getElementById(
        "subjectError"
    ).textContent = "";


    document.getElementById(
        "statusError"
    ).textContent = "";
}


// ============================================
// Show field error
// ============================================

function showFieldError(
    input,
    errorElementId,
    text
) {

    input.classList.add(
        "input-error"
    );


    document.getElementById(
        errorElementId
    ).textContent = text;
}


// ============================================
// Frontend validation
// ============================================

function validateForm() {

    clearFieldErrors();

    let isValid = true;


    // Student ID

    const studentId =
        studentIdInput.value.trim();


    if (!studentId) {

        showFieldError(
            studentIdInput,
            "studentIdError",
            "Student ID is required."
        );

        isValid = false;
    }


    // Date

    if (!dateInput.value) {

        showFieldError(
            dateInput,
            "dateError",
            "Date is required."
        );

        isValid = false;
    }


    // Subject

    const subject =
        subjectInput.value.trim();


    if (!subject) {

        showFieldError(
            subjectInput,
            "subjectError",
            "Subject is required."
        );

        isValid = false;
    }


    // Status

    if (!statusInput.value) {

        showFieldError(
            statusInput,
            "statusError",
            "Attendance status is required."
        );

        isValid = false;
    }


    return isValid;
}


// ============================================
// Show message
// ============================================

function showMessage(
    text,
    type
) {

    message.textContent =
        text;

    message.className =
        `message ${type}`;
}


// ============================================
// Clear message
// ============================================

function clearMessage() {

    message.textContent = "";

    message.className =
        "message";
}


// ============================================
// Loading state
// ============================================

function setLoading(
    loading
) {

    if (loading) {

        saveButton.disabled =
            true;

        saveButton.classList.add(
            "loading"
        );

        buttonText.textContent =
            "Saving...";

    } else {

        saveButton.disabled =
            false;

        saveButton.classList.remove(
            "loading"
        );

        buttonText.textContent =
            "Save Attendance";
    }
}


// ============================================
// Save attendance
// ============================================

form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        clearMessage();


        // Validate frontend

        if (!validateForm()) {

            showMessage(
                "Please fix the errors and try again.",
                "error"
            );

            return;
        }


        // Get values

        const attendanceData = {

            studentId:
                studentIdInput.value.trim(),

            date:
                dateInput.value,

            subject:
                subjectInput.value.trim(),

            status:
                statusInput.value
        };


        // Start loading

        setLoading(true);


        try {

            // ----------------------------------------
            // API request
            // ----------------------------------------

            const response =
                await fetch(
                    "/attendance/save",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                attendanceData
                            )
                    }
                );


            // Convert response to JSON

            const result =
                await response.json();


            // ----------------------------------------
            // API error
            // ----------------------------------------

            if (!response.ok) {

                showMessage(
                    result.message ||
                    "Failed to save attendance.",
                    "error"
                );

                return;
            }


            // ----------------------------------------
            // Success
            // ----------------------------------------

            showMessage(
                result.message,
                "success"
            );


            // Reset fields

            form.reset();


            // Put today's date back

            setTodayDate();


            clearFieldErrors();

        } catch (error) {

            console.error(
                "API error:",
                error
            );


            showMessage(
                "Unable to connect to the server. Please make sure the backend is running.",
                "error"
            );

        } finally {

            // Stop loading

            setLoading(false);
        }
    }
);
