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

// Make the function globally accessible for Blazor
window.updateThemeIcon = updateThemeIcon;

// Load saved theme on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    updateThemeIcon(savedTheme);
});

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('themeDropdown');
    const button = document.querySelector('.theme-switch-btn');
    
    if (dropdown && button && !button.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});
