function changeTheme() {
    var themeStyle = document.getElementById('themeStyle');
    if (themeStyle.getAttribute('href') === 'standard.css') {
      themeStyle.setAttribute('href', 'second.css');
      sessionStorage.setItem('theme', 'second.css'); // Store the selection in sessionStorage
    } else {
      themeStyle.setAttribute('href', 'standard.css');
      sessionStorage.setItem('theme', 'standard.css'); // Store the selection in sessionStorage
    }
  }

  // Event listener for the theme switcher
  document.getElementById('themeSwitcher').addEventListener('click', function(e) {
    e.preventDefault();
    changeTheme();
  });

  // Apply the stored theme on page load
  window.onload = function() {
    var savedTheme = sessionStorage.getItem('theme');
    if (savedTheme) {
      document.getElementById('themeStyle').setAttribute('href', savedTheme);
    }
  };
