// Theme Switcher JavaScript Functions

function toggleThemeDropdown() {
    const dropdown = document.getElementById('themeDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

function setTheme(theme) {
    // Remove existing theme classes
    document.body.classList.remove('light-theme', 'dark-theme', 'system-theme');
    
    // Apply new theme
    if (theme === 'light') {
        document.body.classList.add('light-theme');
    } else if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else if (theme === 'system') {
        document.body.classList.add('system-theme');
    }
    
    // Store theme preference
    localStorage.setItem('theme', theme);
    
    // Close dropdown
    const dropdown = document.getElementById('themeDropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
}

// Load saved theme on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
});

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('themeDropdown');
    const button = document.querySelector('.theme-switch-btn');
    
    if (dropdown && button && !button.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});
