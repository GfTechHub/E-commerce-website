// Sample product data
const products = [
  { id: 1, title: "Smart LED TV 43\"", price: 139000, category: "Electronics", img: "https://picsum.photos/seed/tv/400/300", rating: 4.3, desc: "43 inch smart LED TV – great colors." },
  { id: 2, title: "Men's Sneakers", price: 22000, category: "Fashion", img: "https://picsum.photos/seed/shoe/400/300", rating: 4.1, desc: "Comfortable running sneakers." },
  { id: 3, title: "Wireless Earbuds", price: 8500, category: "Electronics", img: "https://picsum.photos/seed/earbuds/400/300", rating: 4.6, desc: "Battery long life, small case." },
  { id: 4, title: "Smartphone 8GB/128GB", price: 98000, category: "Phones", img: "https://picsum.photos/seed/phone/400/300", rating: 4.4, desc: "Fast CPU and good camera." },
  { id: 5, title: "Kitchen Blender", price: 15000, category: "Home", img: "https://picsum.photos/seed/blender/400/300", rating: 4.0, desc: "Powerful, easy to clean." },
  { id: 6, title: "Kids Toy Car", price: 6500, category: "Toys", img: "https://picsum.photos/seed/toy/400/300", rating: 3.9, desc: "Fun and safe." },
  { id: 7, title: "Office Chair", price: 42000, category: "Home", img: "https://picsum.photos/seed/chair/400/300", rating: 4.2, desc: "Ergonomic with lumbar support." },
  { id: 8, title: "Women's Handbag", price: 27000, category: "Fashion", img: "https://picsum.photos/seed/bag/400/300", rating: 4.5, desc: "Stylish leather bag." }
];

// Helpers
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

// Render categories
function renderCategories() {
  const cats = [...new Set(products.map(p => p.category))].sort();
  const list = $('#categoryList');
  list.innerHTML = `<li><a href="#" class="text-decoration-none category-item" data-cat="All">All</a></li>`;
  cats.forEach(cat => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="#" class="text-decoration-none category-item d-block py-1" data-cat="${cat}">${cat}</a>`;
    list.appendChild(li);
  });
}

// Render products
function renderProducts(productList = products) {
  const grid = $('#productGrid');
  grid.innerHTML = '';
  productList.forEach(p => {
    const col = document.createElement('div');
    col.className = 'col-6 col-md-4 col-lg-3';
    col.innerHTML = `
      <div class="card h-100">
        <img src="${p.img}" class="card-img-top" alt="${p.title}">
        <div class="card-body d-flex flex-column">
          <h6 class="card-title mb-1"><a href="#" class="product-link" data-id="${p.id}">${p.title}</a></h6>
          <p class="text-muted mb-2">₦${p.price.toLocaleString()}</p>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <button class="btn btn-sm btn-primary add-to-cart" data-id="${p.id}">Add</button>
            <small class="text-warning"><i class="fa fa-star"></i> ${p.rating}</small>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(col);
  });
}

// Search & category filter
function attachFilters() {
  $('#searchBtn').addEventListener('click', () => {
    const q = $('#searchInput').value.trim().toLowerCase();
    const filtered = products.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    renderProducts(filtered);
  });
  
  $('#searchInput').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') $('#searchBtn').click();
  });
  
  document.addEventListener('click', (e) => {
    if (e.target.matches('.category-item')) {
      e.preventDefault();
      const cat = e.target.dataset.cat;
      if (cat === 'All') renderProducts(products);
      else renderProducts(products.filter(p => p.category === cat));
    }
  });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderProducts();
  attachFilters();
});