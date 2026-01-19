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

// Estado del historial de pedidos
let orderHistory = [];
const ORDER_HISTORY_STORAGE_KEY = 'perfumesZacatecas_orderHistory';

// ============================================
// FUNCIONES DE SEGURIDAD Y SANITIZACIÓN
// ============================================

/**
 * Sanitiza una cadena de texto para prevenir ataques XSS
 * Escapa caracteres HTML peligrosos
 * @param {string} str - Cadena a sanitizar
 * @returns {string} - Cadena sanitizada
 */
function sanitizeString(str) {
    if (typeof str !== 'string') {
        return String(str || '');
    }
    
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Valida que un valor sea un número positivo
 * @param {number} value - Valor a validar
 * @param {number} min - Valor mínimo permitido (default: 0)
 * @param {number} max - Valor máximo permitido (default: Infinity)
 * @returns {number|null} - Número validado o null si es inválido
 */
function validatePositiveNumber(value, min = 0, max = Infinity) {
    const num = parseFloat(value);
    if (isNaN(num) || num < min || num > max) {
        return null;
    }
    return num;
}

/**
 * Valida que un valor sea un entero positivo
 * @param {number} value - Valor a validar
 * @param {number} min - Valor mínimo permitido (default: 1)
 * @param {number} max - Valor máximo permitido (default: 99)
 * @returns {number|null} - Entero validado o null si es inválido
 */
function validatePositiveInteger(value, min = 1, max = 99) {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < min || num > max || !Number.isInteger(parseFloat(value))) {
        return null;
    }
    return num;
}

// Cargar carrito desde localStorage si existe
function loadCart() {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
        try {
            const parsedCart = JSON.parse(savedCart);
            // Validar y sanitizar datos del carrito al cargar
            cart = parsedCart.filter(item => {
                return item && 
                       item.id && 
                       item.name && 
                       validatePositiveNumber(item.price, 0) !== null &&
                       validatePositiveInteger(item.quantity, 1) !== null &&
                       item.size;
            }).map(item => ({
                id: sanitizeString(item.id),
                name: sanitizeString(item.name),
                price: validatePositiveNumber(item.price, 0) || 0,
                size: sanitizeString(item.size),
                quantity: validatePositiveInteger(item.quantity, 1) || 1
            }));
            saveCart();
            updateCartUI();
        } catch (error) {
            console.error('Error al cargar el carrito:', error);
            cart = [];
            localStorage.removeItem(CART_STORAGE_KEY);
        }
    }
}

// Cargar historial de pedidos desde localStorage
function loadOrderHistory() {
    const savedHistory = localStorage.getItem(ORDER_HISTORY_STORAGE_KEY);
    if (savedHistory) {
        try {
            orderHistory = JSON.parse(savedHistory);
            updateOrderHistoryUI();
        } catch (error) {
            console.error('Error al cargar el historial:', error);
            orderHistory = [];
            localStorage.removeItem(ORDER_HISTORY_STORAGE_KEY);
        }
    }
}

// Guardar historial de pedidos en localStorage
function saveOrderHistory() {
    localStorage.setItem(ORDER_HISTORY_STORAGE_KEY, JSON.stringify(orderHistory));
}

// Agregar pedido al historial
function addToOrderHistory(cartItems, total) {
    const order = {
        id: Date.now(), // ID único basado en timestamp
        date: new Date().toISOString(),
        items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            size: item.size,
            quantity: item.quantity
        })),
        total: total
    };
    
    orderHistory.unshift(order); // Agregar al inicio del array
    saveOrderHistory();
    updateOrderHistoryUI();
}

// Eliminar pedido del historial
function removeFromOrderHistory(orderId) {
    orderHistory = orderHistory.filter(order => order.id !== orderId);
    saveOrderHistory();
    updateOrderHistoryUI();
}

// Limpiar todo el historial
function clearOrderHistory() {
    if (orderHistory.length === 0) {
        return;
    }
    
    if (confirm('¿Estás seguro de que quieres borrar todo el historial de pedidos?')) {
        orderHistory = [];
        saveOrderHistory();
        updateOrderHistoryUI();
        showNotification('Historial borrado', 'success');
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
    // Sanitizar y validar entradas
    const sanitizedId = sanitizeString(productId || '');
    const sanitizedName = sanitizeString(productName || '');
    const sanitizedSize = sanitizeString(size || '');
    
    // Validar cantidad
    const validatedQuantity = validatePositiveInteger(quantity, 1, 99);
    if (!validatedQuantity) {
        alert('La cantidad debe ser un número entero entre 1 y 99');
        return;
    }
    
    // Validar precio
    const validatedPrice = validatePositiveNumber(price, 0);
    if (!validatedPrice) {
        alert('El precio debe ser un número positivo válido');
        return;
    }
    
    // Validar que todos los campos requeridos estén presentes
    if (!sanitizedId || !sanitizedName || !sanitizedSize) {
        alert('Error: Faltan datos del producto');
        return;
    }
    
    // Verificar si el producto ya está en el carrito
    const existingItemIndex = cart.findIndex(
        item => item.id === sanitizedId && item.size === sanitizedSize
    );
    
    if (existingItemIndex > -1) {
        // Si ya existe, sumar la cantidad seleccionada (con validación)
        const newQuantity = cart[existingItemIndex].quantity + validatedQuantity;
        const finalQuantity = validatePositiveInteger(newQuantity, 1, 99);
        if (!finalQuantity) {
            alert('La cantidad total no puede exceder 99 unidades');
            return;
        }
        cart[existingItemIndex].quantity = finalQuantity;
    } else {
        // Si no existe, agregarlo con la cantidad seleccionada
        cart.push({
            id: sanitizedId,
            name: sanitizedName,
            price: validatedPrice,
            size: sanitizedSize,
            quantity: validatedQuantity
        });
    }
    
    saveCart();
    updateCartUI();
    showAddToCartFeedback(validatedQuantity);
}

// Actualizar UI del carrito
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartFloat = document.getElementById('cartFloat');
    
    if (!cartCount || !cartItems || !cartTotal || !cartFloat) {
        console.error('Elementos del carrito no encontrados');
        return;
    }
    
    // Validar y calcular total con seguridad
    let total = 0;
    let totalItems = 0;
    const originalLength = cart.length;
    
    // Filtrar items inválidos y calcular total
    cart = cart.filter(item => {
        // Validar cada item antes de calcular
        const validPrice = validatePositiveNumber(item.price, 0);
        const validQuantity = validatePositiveInteger(item.quantity, 1);
        
        if (!validPrice || !validQuantity) {
            return false; // Remover items inválidos
        }
        
        const itemTotal = validPrice * validQuantity;
        if (isNaN(itemTotal) || !isFinite(itemTotal)) {
            return false;
        }
        
        total += itemTotal;
        totalItems += validQuantity;
        return true;
    });
    
    // Si se removieron items inválidos, guardar carrito limpio
    if (cart.length !== originalLength) {
        saveCart();
    }
    
    // Actualizar contador (sanitizado)
    cartCount.textContent = totalItems || 0;
    cartTotal.textContent = (total || 0).toFixed(2);
    
    // Actualizar lista de items con sanitización
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
    } else {
        // Usar createElement y textContent para prevenir XSS en lugar de innerHTML
        cartItems.innerHTML = ''; // Limpiar primero
        
        cart.forEach((item, index) => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.className = 'cart-item';
            
            // Sanitizar todos los valores antes de mostrarlos
            const sanitizedName = sanitizeString(item.name || '');
            const sanitizedSize = sanitizeString(item.size || '');
            const validQuantity = validatePositiveInteger(item.quantity, 1) || 0;
            const validPrice = validatePositiveNumber(item.price, 0) || 0;
            const itemTotal = (validPrice * validQuantity).toFixed(2);
            
            cartItemDiv.innerHTML = `
                <div class="cart-item-info">
                    <h4>${sanitizedName}</h4>
                    <p>${sanitizedSize} - Cantidad: ${validQuantity}</p>
                </div>
                <div class="cart-item-right">
                    <span class="cart-item-price">$${itemTotal}</span>
                    <button class="cart-item-remove" data-index="${index}">×</button>
                </div>
            `;
            
            // Agregar event listener de forma segura (no usar onclick en HTML)
            const removeBtn = cartItemDiv.querySelector('.cart-item-remove');
            removeBtn.addEventListener('click', function() {
                removeFromCart(index);
            });
            
            cartItems.appendChild(cartItemDiv);
        });
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
    // Validar índice
    const validIndex = parseInt(index, 10);
    if (isNaN(validIndex) || validIndex < 0 || validIndex >= cart.length) {
        console.error('Índice inválido para eliminar del carrito');
        return;
    }
    
    cart.splice(validIndex, 1);
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

// Mostrar notificación genérica
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' 
        ? 'linear-gradient(135deg, #d4af37 0%, #b8941d 100%)' 
        : 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: ${bgColor};
        color: #0a0a0a;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        z-index: 3000;
        font-weight: 600;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Actualizar UI del historial de pedidos
function updateOrderHistoryUI() {
    const historyContainer = document.getElementById('orderHistoryItems');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    
    if (!historyContainer) {
        return;
    }
    
    // Mostrar/ocultar botón de limpiar historial
    if (clearHistoryBtn) {
        clearHistoryBtn.style.display = orderHistory.length > 0 ? 'block' : 'none';
    }
    
    if (orderHistory.length === 0) {
        historyContainer.innerHTML = '<p class="history-empty">No hay pedidos en el historial</p>';
        return;
    }
    
    historyContainer.innerHTML = orderHistory.map(order => {
        const orderDate = new Date(order.date);
        const formattedDate = orderDate.toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const itemsList = order.items.map(item => {
            const itemTotal = (item.price * item.quantity).toFixed(2);
            return `
                <div class="history-item-detail">
                    <span>${sanitizeString(item.name)} - ${sanitizeString(item.size)} (x${item.quantity})</span>
                    <span class="history-item-price">$${itemTotal}</span>
                </div>
            `;
        }).join('');
        
        return `
            <div class="history-order-card">
                <div class="history-order-header">
                    <div class="history-order-info">
                        <h4>Pedido #${order.id.toString().slice(-6)}</h4>
                        <p class="history-order-date">${sanitizeString(formattedDate)}</p>
                    </div>
                    <button class="history-order-delete" data-order-id="${order.id}" aria-label="Eliminar pedido">
                        ×
                    </button>
                </div>
                <div class="history-order-items">
                    ${itemsList}
                </div>
                <div class="history-order-total">
                    <strong>Total: $${order.total.toFixed(2)}</strong>
                </div>
            </div>
        `;
    }).join('');
    
    // Agregar event listeners a los botones de eliminar
    const deleteButtons = historyContainer.querySelectorAll('.history-order-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const orderId = parseInt(this.getAttribute('data-order-id'), 10);
            if (!isNaN(orderId)) {
                removeFromOrderHistory(orderId);
                showNotification('Pedido eliminado del historial', 'success');
            }
        });
    });
}

// Generar mensaje de WhatsApp
function generateWhatsAppMessage() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return '';
    }
    
    let message = 'Hola, me interesa realizar el siguiente pedido:\n\n';
    
    // Validar y sanitizar cada item antes de agregarlo al mensaje
    cart.forEach((item, index) => {
        const validPrice = validatePositiveNumber(item.price, 0) || 0;
        const validQuantity = validatePositiveInteger(item.quantity, 1) || 0;
        const itemTotal = (validPrice * validQuantity).toFixed(2);
        
        // Sanitizar nombre y tamaño para el mensaje (solo texto, sin HTML)
        const sanitizedName = sanitizeString(item.name || '');
        const sanitizedSize = sanitizeString(item.size || '');
        
        message += `${index + 1}. ${sanitizedName} - ${sanitizedSize} (x${validQuantity}) - $${itemTotal}\n`;
    });
    
    // Calcular total con validación
    const total = cart.reduce((sum, item) => {
        const validPrice = validatePositiveNumber(item.price, 0) || 0;
        const validQuantity = validatePositiveInteger(item.quantity, 1) || 0;
        const itemTotal = validPrice * validQuantity;
        return sum + (isNaN(itemTotal) || !isFinite(itemTotal) ? 0 : itemTotal);
    }, 0);
    
    message += `\nTotal: $${total.toFixed(2)}`;
    
    // Usar encodeURIComponent para seguridad en la URL de WhatsApp
    return encodeURIComponent(message);
}

// Abrir WhatsApp con mensaje
function openWhatsApp() {
    const message = generateWhatsAppMessage();
    if (!message) {
        return; // Si el mensaje está vacío, no continuar
    }
    
    // Validar y sanitizar número de teléfono
    const phoneNumber = '524941125352';
    const sanitizedPhone = phoneNumber.replace(/[^\d]/g, ''); // Solo números
    
    if (!sanitizedPhone || sanitizedPhone.length < 10) {
        console.error('Número de teléfono inválido');
        return;
    }
    
    // Calcular total antes de limpiar el carrito
    const total = cart.reduce((sum, item) => {
        const validPrice = validatePositiveNumber(item.price, 0) || 0;
        const validQuantity = validatePositiveInteger(item.quantity, 1) || 0;
        const itemTotal = validPrice * validQuantity;
        return sum + (isNaN(itemTotal) || !isFinite(itemTotal) ? 0 : itemTotal);
    }, 0);
    
    // Guardar una copia del carrito antes de limpiarlo
    const cartCopy = JSON.parse(JSON.stringify(cart));
    
    // Agregar pedido al historial
    addToOrderHistory(cartCopy, total);
    
    // Limpiar el carrito
    cart = [];
    saveCart();
    updateCartUI();
    
    // Cerrar el modal del carrito
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Mostrar notificación de éxito
    showNotification('¡Pedido realizado! El carrito se ha vaciado.', 'success');
    
    // Construir URL de forma segura con encodeURIComponent
    const baseUrl = 'https://wa.me/';
    const url = `${baseUrl}${sanitizedPhone}?text=${message}`;
    
    // Abrir con seguridad (rel="noopener noreferrer" se maneja en HTML, pero aquí también aplicamos medidas)
    const whatsappWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (!whatsappWindow) {
        alert('Por favor, permite las ventanas emergentes para abrir WhatsApp');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Cargar carrito
    loadCart();
    
    // Cargar historial de pedidos
    loadOrderHistory();
    
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
