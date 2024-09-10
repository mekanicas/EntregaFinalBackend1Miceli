const socket = io()

const contenedorCarrito = document.querySelector('.cart-container')

const cargarDatos = (data) => {
    data.products.forEach(product => {
        const div = document.createElement('div')
        div.classList.add('cart')

        const title = document.createElement('p')
        title.innerText = product.product.title

        const quantity = document.createElement('p')
        quantity.innerText = product.quantity

        div.appendChild(title)
        div.appendChild(quantity)

        contenedorCarrito.appendChild(div)
    })
}

socket.on('cart', (data) => {
    cargarDatos(data)
})