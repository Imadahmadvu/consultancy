const inquiryForm = document.getElementById('inquiryForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

inquiryForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Page reload hone se rokne ke liye

  const formData = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    topic: document.getElementById('topic').value,
    message: document.getElementById('message').value.trim()
  };

  submitBtn.disabled = true;
  formStatus.textContent = 'Submitting...';

  try {
    const response = await fetch('http://localhost:5000/api/inquiries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (response.ok) {
      formStatus.textContent = result.message || 'Inquiry submitted successfully!';
      inquiryForm.reset(); // Form fields clear karne ke liye
    } else {
      formStatus.textContent = result.message || 'Please check your inputs.';
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    formStatus.textContent = 'Server se rabta nahi ho saka. Check karein ke backend chal raha hai.';
  } finally {
    submitBtn.disabled = false;
  }
});
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Yeh line zaroori hai
  // yahan fetch ka code aayega
});