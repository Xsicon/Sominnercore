// Theme Switcher JavaScript Functions

function toggleThemeDropdown() {
    const dropdown = document.getElementById('themeDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

function setTheme(theme) {
    // Store theme preference
    localStorage.setItem('theme', theme);
    
    // Update the theme icon
    updateThemeIcon(theme);
    
    // Update body class for CSS variables
    updateBodyTheme(theme);
    
    // Close dropdown
    const dropdown = document.getElementById('themeDropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
    
    // Reload the page to apply the new theme
    window.location.reload();
}

function updateThemeIcon(theme) {
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');
    
    if (theme === 'light') {
        if (sunIcon) sunIcon.style.display = 'block';
        if (moonIcon) moonIcon.style.display = 'none';
    } else {
        if (sunIcon) sunIcon.style.display = 'none';
        if (moonIcon) moonIcon.style.display = 'block';
    }
}

function updateBodyTheme(theme) {
    const body = document.body;
    if (theme === 'light') {
        body.classList.remove('dark-theme');
    } else {
        body.classList.add('dark-theme');
    }
}

// Make the functions globally accessible for Blazor
window.updateThemeIcon = updateThemeIcon;
window.updateBodyTheme = updateBodyTheme;

// Scroll to bottom function for chat window
window.scrollToBottom = function(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollTop = element.scrollHeight;
    }
};

// Function to open chat from JavaScript
window.openChatFromJS = function() {
    DotNet.invokeMethodAsync('Sominnercore', 'OpenChat');
};

// Load saved theme on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    updateThemeIcon(savedTheme);
    updateBodyTheme(savedTheme);

    // Setup chat button click handler
    const chatButton = document.querySelector('[data-chat-button]');
    if (chatButton) {
        chatButton.addEventListener('click', function() {
            if (window.openChatGlobal) {
                window.openChatGlobal();
            } else {
                console.log('OpenChat function not available yet');
            }
        });
    }
});

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('themeDropdown');
    const button = document.querySelector('.theme-switch-btn');
    
    if (dropdown && button && !button.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});
