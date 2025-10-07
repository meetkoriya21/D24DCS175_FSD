document.getElementById('contact-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  const responseMessage = document.getElementById('response-message');
  responseMessage.style.display = 'none';
  responseMessage.textContent = '';
  responseMessage.className = '';

  const name = this.name.value.trim();
  const email = this.email.value.trim();
  const message = this.message.value.trim();

  if (!name || !email || !message) {
    responseMessage.textContent = 'Please fill in all fields.';
    responseMessage.className = 'error';
    responseMessage.style.display = 'block';
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    responseMessage.textContent = 'Please enter a valid email address.';
    responseMessage.className = 'error';
    responseMessage.style.display = 'block';
    return;
  }

  try {
    const response = await fetch('/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ name, email, message }),
    });

    const result = await response.json();

    if (result.success) {
      responseMessage.textContent = result.message;
      responseMessage.className = 'success';
      this.reset();
    } else {
      responseMessage.textContent = result.message || 'Failed to send message.';
      responseMessage.className = 'error';
    }
  } catch (error) {
    responseMessage.textContent = 'An error occurred. Please try again later.';
    responseMessage.className = 'error';
  }

  responseMessage.style.display = 'block';
});
