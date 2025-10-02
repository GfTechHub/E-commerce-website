// sample product data for flash sale scroller
const products = [
  { id:1, title:"20000 Mah Ultra Powerbank", price:6908, img:"https://picsum.photos/seed/p1/400/300", left:487 },
  { id:2, title:"8L Extra Large Air Fryer", price:36500, img:"https://picsum.photos/seed/p2/400/300", left:24 },
  { id:3, title:"2.2L Electric Kettle", price:5900, img:"https://picsum.photos/seed/p3/400/300", left:50 },
  { id:4, title:"Bluetooth Speaker", price:4200, img:"https://picsum.photos/seed/p4/400/300", left:312 },
  { id:5, title:"Hair Clippers Set", price:3200, img:"https://picsum.photos/seed/p5/400/300", left:15 }
];

// initialize UI on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  renderCarouselIndicators();
  renderChips();
  renderProductScroller();
  initFlashCountdown( (60*60*8) ); // e.g. 8 hours countdown
  setupCart();
  wireCartButtons();
});

// build carousel indicators (for the carousel images)
function renderCarouselIndicators(){
  const carousel = document.querySelectorAll('#promoCarousel .carousel-item');
  const indicators = document.querySelector('.custom-indicators');
  carousel.forEach((el, idx) => {
    const btn = document.createElement('button');
    btn.className = idx===0 ? 'active' : '';
    btn.addEventListener('click', () => {
      const bs = bootstrap.Carousel.getOrCreateInstance(document.getElementById('promoCarousel'));
      bs.to(idx);
      setActiveIndicator(idx);
    });
    indicators.appendChild(btn);
  });

  function setActiveIndicator(i){
    indicators.querySelectorAll('button').forEach((b, j) => b.classList.toggle('active', i===j));
  }

  // sync when carousel slides
  const bsCarousel = document.getElementById('promoCarousel');
  bsCarousel.addEventListener('slid.bs.carousel', e => {
    setActiveIndicator(e.to);
  });
}

// render category chips
const categories = ["All","Awoof deals","Clearance","Jumia Force","Buy 2 Pay 1","Jumia Delivery"];
function renderChips(){
  const container = document.querySelector('.chips-row');
  categories.forEach(c => {
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.textContent = c;
    container.appendChild(chip);
  });
}

// render horizontally scrollable product cards
function renderProductScroller(){
  const scroller = document.querySelector('.product-scroller');
  scroller.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.img}" alt="${escapeHtml(p.title)}" />
      <div class="product-title">${escapeHtml(p.title)}</div>
      <div class="product-price">₦${numberWithCommas(p.price)}</div>
      <div class="items-left">${p.left} items left</div>
      <div class="progress mt-2">
        <div class="progress-bar" role="progressbar" style="width:${Math.min(100, Math.round((1 - p.left/600)*100))}%"></div>
      </div>
    `;
    scroller.appendChild(card);
  });
}

// flash countdown timer (seconds)
function initFlashCountdown(seconds){
  let remaining = seconds;
  const el = document.getElementById('flashCountdown');
  function tick(){
    if(remaining < 0) { el.textContent = "00:00:00"; return; }
    const h = Math.floor(remaining/3600);
    const m = Math.floor((remaining%3600)/60);
    const s = remaining%60;
    el.textContent = pad(h)+":"+pad(m)+":"+pad(s);
    remaining--;
  }
  tick();
  setInterval(tick, 1000);
}

// cart (localStorage simple)
const CART_KEY = 'jumia_clone_cart';
function setupCart(){
  updateCartCount();
  // show offcanvas on cart click
  document.getElementById('cartToggle').addEventListener('click', () => {
    const off = new bootstrap.Offcanvas(document.getElementById('miniCart'));
    off.toggle();
    renderCartOffcanvas();
  });
}

function wireCartButtons(){
  // click a product card to add (quick demo: clicking card adds)
  document.querySelector('.product-scroller').addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if(!card) return;
    // find index by image src
    const img = card.querySelector('img').src;
    const p = products.find(pp => pp.img === img);
    if(!p) return;
    addToCart(p.id, 1);
  });

  document.getElementById('checkoutBtn').addEventListener('click', ()=> {
    alert('Demo checkout - integrate payment gateway in backend.');
  });
}

function addToCart(id, qty=1){
  const cart = JSON.parse(localStorage.getItem(CART_KEY) || '{}');
  cart[id] = (cart[id] || 0) + qty;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
  renderCartOffcanvas();
}

// update bottom cart badge
function updateCartCount(){
  const cart = JSON.parse(localStorage.getItem(CART_KEY) || '{}');
  const total = Object.values(cart).reduce((s,v)=>s+v,0);
  document.getElementById('cartCount').textContent = total;
}

// render offcanvas cart content
function renderCartOffcanvas(){
  const container = document.getElementById('cartItems');
  const cart = JSON.parse(localStorage.getItem(CART_KEY) || '{}');
  const ids = Object.keys(cart);
  if(ids.length === 0){
    container.innerHTML = '<div class="text-muted">Your cart is empty.</div>';
    document.getElementById('cartTotal').textContent = '₦0';
    return;
  }
  let total = 0;
  container.innerHTML = ids.map(id => {
    const pid = Number(id);
    const p = products.find(pp => pp.id === pid) || {title:'Product', price:0, img:''};
    const qty = cart[id];
    total += p.price * qty;
    return `
      <div class="d-flex align-items-center mb-2">
        <img src="${p.img}" alt="" width="56" class="rounded me-2">
        <div class="flex-grow-1 small">
          <div class="fw-bold">${escapeHtml(p.title)}</div>
          <div class="text-muted">₦${numberWithCommas(p.price)} × ${qty}</div>
        </div>
        <button class="btn btn-sm btn-outline-danger remove-btn" data-id="${id}"><i class="fa fa-trash"></i></button>
      </div>
    `;
  }).join('');
  document.getElementById('cartTotal').textContent = '₦'+numberWithCommas(total);

  // attach remove handlers
  document.querySelectorAll('.remove-btn').forEach(b => {
    b.addEventListener('click', () => {
      const id = b.dataset.id;
      const cart = JSON.parse(localStorage.getItem(CART_KEY) || '{}');
      delete cart[id];
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      updateCartCount();
      renderCartOffcanvas();
    });
  });
}

/* small helpers */
function pad(n){ return String(n).padStart(2,'0'); }
function numberWithCommas(x){ return String(x).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
function escapeHtml(text){ return text.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }