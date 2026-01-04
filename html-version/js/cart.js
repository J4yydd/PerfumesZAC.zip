class Cart {
  constructor() {
    this.items = this.loadCart()
    this.updateCartCount()
  }

  loadCart() {
    const saved = localStorage.getItem("parfum-zip-cart")
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error("Error loading cart:", e)
        return []
      }
    }
    return []
  }

  saveCart() {
    localStorage.setItem("parfum-zip-cart", JSON.stringify(this.items))
    this.updateCartCount()
  }

  addToCart(productId, sizeMl, quantity) {
    const existing = this.items.find(
      (item) => item.productId === productId && item.sizeMl === sizeMl
    )
    if (existing) {
      existing.quantity += quantity
    } else {
      this.items.push({ productId, sizeMl, quantity })
    }
    this.saveCart()
  }

  removeFromCart(productId, sizeMl) {
    this.items = this.items.filter(
      (item) => !(item.productId === productId && item.sizeMl === sizeMl)
    )
    this.saveCart()
  }

  updateQuantity(productId, sizeMl, quantity) {
    if (quantity <= 0) {
      this.removeFromCart(productId, sizeMl)
      return
    }
    const item = this.items.find(
      (item) => item.productId === productId && item.sizeMl === sizeMl
    )
    if (item) {
      item.quantity = quantity
      this.saveCart()
    }
  }

  clearCart() {
    this.items = []
    this.saveCart()
  }

  getCartItems() {
    return this.items
      .map((item) => {
        const product = products.find((p) => p.id === item.productId)
        if (!product) return null
        const size = product.sizes.find((s) => s.ml === item.sizeMl)
        if (!size) return null
        return { product, sizeMl: item.sizeMl, quantity: item.quantity }
      })
      .filter((item) => item !== null)
  }

  getTotal() {
    return this.getCartItems().reduce((total, { product, sizeMl, quantity }) => {
      const size = product.sizes.find((s) => s.ml === sizeMl)
      if (!size) return total
      const price = product.discountPercent
        ? size.price * (1 - product.discountPercent / 100)
        : size.price
      return total + price * quantity
    }, 0)
  }

  getItemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0)
  }

  updateCartCount() {
    const count = this.getItemCount()
    const cartBadge = document.getElementById("cart-badge")
    if (cartBadge) {
      if (count > 0) {
        cartBadge.textContent = count
        cartBadge.style.display = "flex"
      } else {
        cartBadge.style.display = "none"
      }
    }
  }
}

const cart = new Cart()

