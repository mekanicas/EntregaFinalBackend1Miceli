const socket = io()

const contenedorCarrito = document.querySelector('.cart-container')

const cargarDatos = (data) => {
    contenedorCarrito.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos productos
    data.products.forEach(product => {
        const div = document.createElement('div')
        div.classList.add('cart-item')

        const title = document.createElement('p')
        title.classList.add('cart-item-title')
        title.innerText = product.product.title

        const quantity = document.createElement('p')
        quantity.classList.add('cart-item-quantity')
        quantity.innerText = `Cantidad: ${product.quantity}`

        const price = document.createElement('p')
        price.classList.add('cart-item-price')
        price.innerText = `Precio: $${product.product.price}`

        div.appendChild(title)
        div.appendChild(quantity)
        div.appendChild(price)

        contenedorCarrito.appendChild(div)
    })
}

socket.on('cart', (data) => {
    cargarDatos(data)
})