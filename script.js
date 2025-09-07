// Mobile menu toggle
function toggleMenu(){
  const nav = document.querySelector('.nav-links');
  if(nav.style.display==='flex'){nav.style.display='none'} else {nav.style.display='flex'; nav.style.flexDirection='column'; nav.style.position='absolute'; nav.style.right='20px'; nav.style.top='56px'; nav.style.background='white'; nav.style.padding='10px'; nav.style.borderRadius='10px';}
}

// --- Reviews: frontend + backend integration ---
const API_BASE = '/api'; // backend expected to be same origin

async function loadReviews(){
  const container = document.getElementById('reviewGrid');
  container.innerHTML = '<p style="padding:12px;color:#666">Loading reviews…</p>';
  try{
    const res = await fetch(API_BASE + '/reviews');
    if(!res.ok) throw new Error('No reviews');
    const data = await res.json();
    if(!data || !data.length){ container.innerHTML = '<p style="padding:12px;color:#666">No reviews yet — be the first!</p>'; return }
    container.innerHTML = '';
    data.slice().reverse().forEach(r => {
      const el = document.createElement('div'); el.className='review-card';
      el.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><strong>${escapeHtml(r.name||'Anonymous')}</strong><div>${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div></div><div style="font-size:13px;color:#444">${escapeHtml(r.message)}</div><div style="font-size:12px;color:#777;margin-top:8px">${new Date(r.createdAt).toLocaleString()}</div>`;
      container.appendChild(el);
    })
  }catch(err){
    console.error(err);
    container.innerHTML = '<p style="padding:12px;color:#666">Could not load reviews (offline)</p>';
  }
}

// submit review -> POST /api/reviews
document.getElementById('reviewForm').addEventListener('submit', async function(e){
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const rating = parseInt(document.getElementById('rating').value,10);
  const message = document.getElementById('message').value.trim();
  if(!email || !message) return alert('Please add an email and message.');
  const payload = {name,email,rating,message};
  try{
    const res = await fetch(API_BASE + '/reviews',{
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)
    });
    if(!res.ok) throw new Error('Submit failed');
    // optimistic: reload reviews
    document.getElementById('reviewForm').reset();
    await loadReviews();
    alert('Thanks! Your review was received and will appear after moderation.');
  }catch(err){
    console.error(err);
    // fallback: store in localStorage so the parent knows submission attempted
    const pending = JSON.parse(localStorage.getItem('bricks_pending_reviews')||'[]');
    pending.push({name,email,rating,message,createdAt:new Date().toISOString()});
    localStorage.setItem('bricks_pending_reviews', JSON.stringify(pending));
    alert('Saved locally — we will retry when online.');
  }
});

// contact form submit -> POST /api/contact (simple)
document.getElementById('contactForm').addEventListener('submit', async function(e){
  e.preventDefault();
  const formData = new FormData(e.target);
  const payload = Object.fromEntries(formData.entries());
  try{
    const res = await fetch(API_BASE + '/contact', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)});
    if(!res.ok) throw new Error('send failed');
    e.target.reset();
    alert('Thanks — we received your enquiry. We will contact you shortly.');
  }catch(err){
    console.error(err);
    alert('Could not send — please email hello@bricks.example');
  }
});

function escapeHtml(s){ if(!s) return ''; return s.replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c]); }

// try to resend pending local reviews when online
window.addEventListener('online', async ()=>{
  const pending = JSON.parse(localStorage.getItem('bricks_pending_reviews')||'[]');
  if(!pending.length) return;
  for(const r of pending){
    try{ await fetch(API_BASE + '/reviews',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(r)}); }
    catch(e){ console.warn('retry failed',e); }
  }
  localStorage.removeItem('bricks_pending_reviews');
  loadReviews();
});

// Smooth scroll with offset for nav links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const target = document.getElementById(targetId);
    const navHeight = document.querySelector('nav').offsetHeight;

    if (target) {
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: targetPosition - navHeight - 10, // 10px gap
        behavior: 'smooth'
      });
    }
  });
});
section, header.hero {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}
section.visible, header.hero.visible {
  opacity: 1;
  transform: translateY(0);
}


// initial load
loadReviews();

