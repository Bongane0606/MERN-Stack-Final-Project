// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const darkModeCSS = document.getElementById('dark-mode-css');
const html = document.documentElement;

// Check for saved user preference or use system preference
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    enableDarkMode();
}

darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
});

function enableDarkMode() {
    html.setAttribute('data-theme', 'dark');
    darkModeCSS.disabled = false;
    darkModeToggle.checked = true;
    localStorage.setItem('theme', 'dark');
}

function disableDarkMode() {
    html.setAttribute('data-theme', 'light');
    darkModeCSS.disabled = true;
    darkModeToggle.checked = false;
    localStorage.setItem('theme', 'light');
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
        if (e.matches) {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    }
});