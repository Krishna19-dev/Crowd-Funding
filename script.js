/* MOBILE NAVBAR TOGGLE */

// Get the hamburger button and nav links
var hamburger = document.getElementById("hamburger");
var navLinks = document.getElementById("navLinks");

// Toggle mobile menu when hamburger is clicked
if (hamburger) {
    hamburger.addEventListener("click", function () {
        navLinks.classList.toggle("open");
    });
}

// Close mobile menu when a link is clicked
if (navLinks) {
    var links = navLinks.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener("click", function () {
            navLinks.classList.remove("open");
        });
    }
}

/* CREATE CAMPAIGN FORM */

var campaignForm = document.getElementById("campaignForm");

if (campaignForm) {
    campaignForm.addEventListener("submit", function (e) {
        // Prevent the form from submitting
        e.preventDefault();

        // Clear old error messages
        clearErrors();

        // Get form values
        var title = document.getElementById("campaignTitle").value.trim();
        var category = document.getElementById("campaignCategory").value;
        var goal = document.getElementById("campaignGoal").value.trim();
        var description = document.getElementById("campaignDescription").value.trim();

        var isValid = true;

        // Validate Title
        if (title === "") {
            showError("campaignTitle", "Please enter a campaign title.");
            isValid = false;
        }

        // Validate Category
        if (category === "") {
            showError("campaignCategory", "Please select a category.");
            isValid = false;
        }

        // Validate Goal Amount
        if (goal === "" || isNaN(goal) || Number(goal) <= 0) {
            showError("campaignGoal", "Please enter a valid goal amount.");
            isValid = false;
        }

        // Validate Description
        if (description === "") {
            showError("campaignDescription", "Please enter a description.");
            isValid = false;
        }

        // If all fields are valid, show success message
        if (isValid) {
            document.getElementById("campaignForm").style.display = "none";
            document.getElementById("successMessage").style.display = "block";
        }
    });
}

/* LOGIN FORM */

var loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        // Prevent the form from submitting
        e.preventDefault();

        // Clear old error messages
        clearErrors();

        // Get form values
        var email = document.getElementById("loginEmail").value.trim();
        var password = document.getElementById("loginPassword").value.trim();

        var isValid = true;

        // Validate Email
        if (email === "") {
            showError("loginEmail", "Please enter your email.");
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError("loginEmail", "Please enter a valid email address.");
            isValid = false;
        }

        // Validate Password
        if (password === "") {
            showError("loginPassword", "Please enter your password.");
            isValid = false;
        } else if (password.length < 6) {
            showError("loginPassword", "Password must be at least 6 characters.");
            isValid = false;
        }

        // If valid, redirect to dashboard
        if (isValid) {
            window.location.href = "dashboard.html";
        }
    });
}

/* HELPER FUNCTIONS */

// Show error message below a field
function showError(fieldId, message) {
    var field = document.getElementById(fieldId);
    field.classList.add("error");

    // Create error message element
    var errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;

    // Add error message after the input field
    field.parentNode.appendChild(errorDiv);
}

// Clear all error messages
function clearErrors() {
    // Remove all error messages
    var errors = document.querySelectorAll(".error-message");
    for (var i = 0; i < errors.length; i++) {
        errors[i].remove();
    }

    // Remove error class from inputs
    var inputs = document.querySelectorAll(".error");
    for (var j = 0; j < inputs.length; j++) {
        inputs[j].classList.remove("error");
    }
}

// Check if email is valid
function isValidEmail(email) {
    var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}
