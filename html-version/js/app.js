// Funciones comunes para todas las páginas

function renderProductCard(product) {
  const minPrice = Math.min(...product.sizes.map(s => s.price))
  const maxPrice = Math.max(...product.sizes.map(s => s.price))
  const minSize = Math.min(...product.sizes.map(s => s.ml))
  const maxSize = Math.max(...product.sizes.map(s => s.ml))
  
  return `
    <div class="group overflow-hidden hover:shadow-glow transition-all duration-300 hover-lift border-0 shadow-soft rounded-lg bg-white">
      <a href="product.html?id=${product.id}">
        <div class="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
          <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          ${product.isNew ? `<span class="absolute top-3 left-3 bg-gradient-to-r from-black to-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">✨ Nuevo</span>` : ''}
          ${product.isBestSeller ? `<span class="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-black text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-gray-200">⭐ Más vendido</span>` : ''}
        </div>
      </a>
      <div class="p-6">
        <a href="product.html?id=${product.id}">
          <p class="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">${product.brand}</p>
          <h3 class="font-bold text-xl mb-3 line-clamp-2 group-hover:text-gray-600 transition-colors min-h-[3rem]">${product.name}</h3>
        </a>
        <div class="flex items-end justify-between mb-4">
          <div>
            ${minPrice === maxPrice ? `<p class="text-2xl font-bold text-black">${formatCurrency(minPrice)}</p>` : `<p class="text-2xl font-bold text-black">${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}</p>`}
            <p class="text-xs text-gray-500 mt-1 font-semibold">Decant ${minSize}ml / ${maxSize}ml</p>
          </div>
        </div>
        <a href="product.html?id=${product.id}" class="w-full gap-2 bg-black hover:bg-gray-800 text-white font-semibold h-11 transition-all hover:scale-105 shadow-lg hover:shadow-xl rounded-lg flex items-center justify-center">
          Ver detalles
        </a>
      </div>
    </div>
  `
}

function getUrlParams() {
  const params = new URLSearchParams(window.location.search)
  return {
    filter: params.get('filter'),
    id: params.get('id')
  }
}

// Navbar común (se puede incluir en cada página)
function initNavbar() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn')
  const mobileMenu = document.getElementById('mobile-menu')
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden')
    })
  }
  
  // Set current year
  const yearEl = document.getElementById('current-year')
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear()
  }
}

