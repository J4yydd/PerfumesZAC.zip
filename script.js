// ============================================
// CARRITO DE COMPRAS - PERFUMES ZACATECAS
// ============================================

// Inicializar AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

// Estado del carrito
let cart = [];
const CART_STORAGE_KEY = 'perfumesZacatecas_cart';

// Cargar carrito desde localStorage si existe
function loadCart() {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Guardar carrito en localStorage
function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// Inicializar selectores de tamaño y actualizar precios
function initializeSizeSelectors() {
    const sizeSelects = document.querySelectorAll('.size-select');
    
    sizeSelects.forEach(select => {
        select.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const price = selectedOption.dataset.price;
            const productCard = this.closest('.product-card');
            const priceElement = productCard.querySelector('.product-price');
            const addButton = productCard.querySelector('.btn-add');
            
            if (price && !selectedOption.disabled) {
                priceElement.textContent = `$${price}`;
                addButton.dataset.price = price;
                
                // Obtener el tamaño del valor seleccionado
                const value = this.value;
                const size = value.split('-')[0];
                addButton.dataset.size = size;
                
                // Habilitar botón si estaba deshabilitado
                addButton.disabled = false;
            } else if (selectedOption.disabled) {
                // Deshabilitar botón si la opción no está disponible
                addButton.disabled = true;
                priceElement.textContent = 'No disponible';
            }
        });
    });
}

// Agregar producto al carrito
function addToCart(productId, productName, price, size, quantity = 1) {
    // Convertir cantidad a número entero
    quantity = parseInt(quantity) || 1;
    
    // Validar que la cantidad sea mayor a 0
    if (quantity <= 0) {
        alert('La cantidad debe ser mayor a 0');
        return;
    }
    
    // Verificar si el producto ya está en el carrito
    const existingItemIndex = cart.findIndex(
        item => item.id === productId && item.size === size
    );
    
    if (existingItemIndex > -1) {
        // Si ya existe, sumar la cantidad seleccionada
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Si no existe, agregarlo con la cantidad seleccionada
        cart.push({
            id: productId,
            name: productName,
            price: parseFloat(price),
            size: size,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartUI();
    showAddToCartFeedback(quantity);
}

// Actualizar UI del carrito
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartFloat = document.getElementById('cartFloat');
    
    // Calcular total
    const total = cart.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);
    
    // Actualizar contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartTotal.textContent = total.toFixed(2);
    
    // Actualizar lista de items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
    } else {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.size} - Cantidad: ${item.quantity}</p>
                </div>
                <div class="cart-item-right">
                    <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="cart-item-remove" onclick="removeFromCart(${index})">×</button>
                </div>
            </div>
        `).join('');
    }
    
    // Mostrar/ocultar botón flotante
    if (cart.length > 0) {
        cartFloat.style.display = 'flex';
    } else {
        cartFloat.style.display = 'none';
    }
}

// Eliminar producto del carrito (función global)
window.removeFromCart = function(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
};

// Mostrar feedback al agregar producto
function showAddToCartFeedback(quantity = 1) {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: linear-gradient(135deg, #d4af37 0%, #b8941d 100%);
        color: #0a0a0a;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        z-index: 3000;
        font-weight: 600;
        animation: slideInRight 0.3s ease;
    `;
    const quantityText = quantity > 1 ? ` (x${quantity})` : '';
    notification.textContent = `✓ Producto${quantityText} agregado al carrito`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 2000);
}

// Generar mensaje de WhatsApp
function generateWhatsAppMessage() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    let message = 'Hola, me interesa realizar el siguiente pedido:\n\n';
    
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} - ${item.size} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\nTotal: $${total.toFixed(2)}`;
    
    return encodeURIComponent(message);
}

// Abrir WhatsApp con mensaje
function openWhatsApp() {
    const message = generateWhatsAppMessage();
    const phoneNumber = '524941125352';
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Cargar carrito
    loadCart();
    
    // Inicializar selectores de tamaño
    initializeSizeSelectors();
    
    // Validar inputs de cantidad en tiempo real
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('input', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            } else if (value > 99) {
                this.value = 99;
            }
        });
        
        input.addEventListener('blur', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            } else if (value > 99) {
                this.value = 99;
            }
        });
    });
    
    // Botones "Agregar al Carrito"
    const addButtons = document.querySelectorAll('.btn-add');
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Verificar que el botón no esté deshabilitado
            if (this.disabled) {
                alert('Esta opción no está disponible');
                return;
            }
            
            // Obtener datos actualizados del selector de tamaño
            const sizeSelect = this.closest('.product-card').querySelector('.size-select');
            const selectedOption = sizeSelect.options[sizeSelect.selectedIndex];
            
            if (selectedOption.disabled) {
                alert('Esta opción no está disponible');
                return;
            }
            
            // Obtener cantidad del input
            const quantityInput = this.closest('.product-card').querySelector('.quantity-input');
            const quantity = parseInt(quantityInput.value) || 1;
            
            // Validar cantidad
            if (quantity < 1) {
                alert('La cantidad debe ser mayor a 0');
                quantityInput.value = 1;
                return;
            }
            
            if (quantity > 99) {
                alert('La cantidad máxima es 99');
                quantityInput.value = 99;
                return;
            }
            
            // Actualizar datos del botón con los valores actuales
            const productId = this.dataset.productId;
            const productName = this.dataset.productName;
            const price = selectedOption.dataset.price;
            const value = sizeSelect.value;
            const size = value.split('-')[0];
            
            addToCart(productId, productName, price, size, quantity);
        });
    });
    
    // Botón flotante del carrito
    const cartFloat = document.getElementById('cartFloat');
    const cartModal = document.getElementById('cartModal');
    const cartClose = document.getElementById('cartClose');
    
    cartFloat.addEventListener('click', function() {
        cartModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    cartClose.addEventListener('click', function() {
        cartModal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Cerrar modal al hacer clic fuera
    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Botón "Realizar Pedido"
    const checkoutBtn = document.getElementById('checkoutBtn');
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        openWhatsApp();
    });
    
    // Smooth scroll para enlaces de navegación
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Ocultar botón flotante inicialmente si el carrito está vacío
    if (cart.length === 0) {
        cartFloat.style.display = 'none';
    }
});

// Agregar estilos de animación para notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .cart-item-right {
        display: flex;
        align-items: center;
        gap: 12px;
    }
`;
document.head.appendChild(style);
