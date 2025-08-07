// Mobile menu toggle
function toggleMenu() {
  const nav = document.querySelector('.nav-links');
  const btn = document.querySelector('.hamburger');
  nav.classList.toggle('show');
  const expanded = nav.classList.contains('show');
  btn.setAttribute('aria-expanded', expanded);
}

// Close nav when link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.remove('show');
    document.querySelector('.hamburger').setAttribute('aria-expanded', false);
  });
});


// Carousels
function startCarousel(id) {
  const images = document.querySelectorAll(`#${id} img`);
  let index = 0;
  setInterval(() => {
    images.forEach(img => img.classList.remove('active'));
    index = (index + 1) % images.length;
    images[index].classList.add('active');
  }, 3000);
}
['carousel1'].forEach(startCarousel);
['carousel2'].forEach(startCarousel);

// Star Rating Logic
let selectedRating = 0;
const stars = document.querySelectorAll('.star');
stars.forEach(star => {
  star.addEventListener('click', () => {
    selectedRating = parseInt(star.dataset.value);
    highlightStars(selectedRating);
  });
});
function highlightStars(rating) {
  stars.forEach(star => {
    const val = parseInt(star.dataset.value);
    star.classList.toggle('filled', val <= rating);
  });
}

// Review submission
function submitReview(e) {
  e.preventDefault();
  const name = document.getElementById('reviewerName').value.trim() || 'Anonymous';
  const text = document.getElementById('reviewText').value.trim();

  if (!text || selectedRating === 0) return alert('Please enter a review and select stars.');

  const previewText = text.length > 150 ? text.substring(0, 150) + '...' : text;
  const readMore = text.length > 150 ? `<span class='read-more' onclick='this.previousElementSibling.textContent = "${text}"; this.remove();'>Read more</span>` : '';

  const reviewHTML = `
    <div class='card review-card'>
      <strong>${name}</strong>
      <p>${'★'.repeat(selectedRating)}${'☆'.repeat(5 - selectedRating)}</p>
      <p><span class='review-text'>${previewText}</span> ${readMore}</p>
    </div>`;

  document.getElementById('reviewList').innerHTML += reviewHTML;
  document.getElementById('reviewerName').value = '';
  document.getElementById('reviewText').value = '';
  highlightStars(0);
  selectedRating = 0;
  showToast('✅ Review submitted successfully!');
}

// Contact form toast
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    this.reset();
    showToast('📨 Message sent successfully!');
  });
}

// Toast function
function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '30px';
  toast.style.right = '30px';
  toast.style.padding = '15px 20px';
  toast.style.background = '#4caf50';
  toast.style.color = 'white';
  toast.style.borderRadius = '8px';
  toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
  toast.style.zIndex = '10000';
  toast.style.opacity = '0';
  toast.style.transition = 'opacity 0.5s ease';
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.addEventListener('transitionend', () => toast.remove());
  }, 3000);
}

// Page fade in
window.addEventListener("load", () => {
  document.body.style.opacity = 0;
  document.body.style.transition = "opacity 0.8s ease";
  requestAnimationFrame(() => {
    document.body.style.opacity = 1;
  });
});
