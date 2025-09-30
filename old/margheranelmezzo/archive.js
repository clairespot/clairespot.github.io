let archive = [];

async function loadArchive() {
  const response = await fetch('archive.json');
  archive = await response.json();
}

// Build content for detail.html
function generateContentHTML(item) {
  if (!item) {
    return '<p>Errore: Nessun contenuto trovato.</p>';
  }

  const type = item.type.trim().toLowerCase();

  if (type === 'photo' || type === 'illustration') {
    // Handle multiple or single photos
    if (Array.isArray(item.src)) {
      return item.src.map(src => `<img src="${src}" alt="Foto">`).join('');
    } else {
      return `<img src="${item.src}" alt="Foto">`;
    }
  }

  if (type === 'audio') {
    return `<iframe src="${item.src}" width="300" height="80" frameborder="0" allow="encrypted-media"></iframe>`;
  }

  if (type === 'video') {
    if (item.src.includes('youtube.com') || item.src.includes('youtu.be')) {
      return `<iframe width="560" height="315" src="${item.src}" frameborder="0" allowfullscreen></iframe>`;
    } else {
      return `<video controls src="${item.src}"></video>`;
    }
  }

  if (type === 'text') {
    return 'text'; // Will be handled separately in detail.html
  }

  return '<p>Tipo di contenuto sconosciuto.</p>';
}

// Load local text file and inject into page
function fetchTextContent(src, targetElement, author, year) {
  console.log("Trying to fetch text from:", src);

  fetch(src)
    .then(response => response.text())
    .then(text => {
      // Only inject the text, since author and year are already shown elsewhere
      targetElement.innerHTML = `<pre>${text}</pre>`;
    })
    .catch(error => {
      targetElement.innerHTML = '<p>Errore nel caricamento del testo.</p>';
      console.error("Text fetch failed:", error);
    });
}


// Define toggleMenu function
function toggleMenu() {
  const menu = document.querySelector('.menu');
  if (menu) {
    menu.classList.toggle('open');
  }
}

// Attach toggleMenu to the menu toggle button
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
  }
});
