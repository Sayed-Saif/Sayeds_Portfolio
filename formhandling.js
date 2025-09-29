// ------------------- Form Handling JS -------------------
const contactFormEl = document.getElementById('contactForm');
// const formStatus = document.getElementById('formStatus');


const scriptURL = "https://script.google.com/macros/s/AKfycbyzrPfOxbf2JgN44u8e9DdeRjam3PMMuj5ijpPa5D5GCZZpS9SpCgN2VCEH9VPtFI5k/exec"; // Paste Apps Script Web App URL


contactFormEl.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Check if user is offline
  if (!navigator.onLine) {
    Notiflix.Notify.warning('You are offline. Please check your internet connection.');
    return;
  }

  const formData = new FormData(contactFormEl);

  // Show submitting loader
  Notiflix.Loading.standard('Submitting your message...');

  const fileInput = document.getElementById('file');
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = async function() {
      const base64Data = reader.result;
      formData.set("file", base64Data);
      formData.set("filename", file.name);
      formData.set("filetype", file.type);
      await submitForm(formData);
    };
    reader.readAsDataURL(file);
  } else {
    await submitForm(formData);
  }
});

async function submitForm(formData) {
  try {
    const response = await fetch(scriptURL, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    // Remove loader
    Notiflix.Loading.remove();

    if (data.result === "success") {
      Notiflix.Notify.success('Message Sent Successfully!');
      contactFormEl.reset();
    } else {
      Notiflix.Notify.failure('Failed to send message! ' + data.error);
    }
  } catch (error) {
    // Remove loader
    Notiflix.Loading.remove();

    Notiflix.Notify.failure('Error! Please try again.');
    console.error(error);
  }
}

// Optional: Listen for offline/online events and notify
window.addEventListener('offline', () => {
  Notiflix.Notify.warning('You are offline.');
});

window.addEventListener('online', () => {
  Notiflix.Notify.success('You are back online.');
});