const socket = io();

// Seleccionar el contenedor en el DOM donde se mostrarán los productos.
const contenedorProductos = document.querySelector(".products-container");

// Escuchar el evento 'update-products' enviado por el servidor para mostrar los productos.
socket.on("home", (data) => {
  contenedorProductos.innerHTML = "";

  data.forEach((product) => {
    // Crear el contenedor de cada producto
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    // Crear el contenedor para la imagen y detalles del producto
    const productDetails = document.createElement("div");
    productDetails.classList.add("product-details");

    // Crear y añadir el ID del producto
    const id = document.createElement("p");
    id.classList.add("product-id");
    id.innerText = `ID: ${product._id}`;

    // Crear y añadir el título del producto
    const title = document.createElement("h2");
    title.classList.add("product-title");
    title.innerText = product.title;

    // Crear y añadir la descripción del producto
    const description = document.createElement("p");
    description.classList.add("product-description");
    description.innerText = product.description;

    // Crear y añadir el precio del producto
    const price = document.createElement("p");
    price.classList.add("product-price");
    price.innerText = `$ ${product.price}`;

    // Crear y añadir el código del producto
    const code = document.createElement("p");
    code.classList.add("product-code");
    code.innerText = `Código: ${product.code}`;

    // Crear y añadir el stock del producto
    const stock = document.createElement("p");
    stock.classList.add("product-stock");
    stock.innerText = `Stock disponible: ${product.stock}`;

    // Crear y añadir la categoría del producto
    const category = document.createElement("p");
    category.classList.add("product-category");
    category.innerText = `Categoría: ${product.category}`;

    // Crear y añadir el botón para agregar al carrito
    const btnAddCart = document.createElement("button");
    btnAddCart.classList.add("btn-add-cart");
    btnAddCart.innerText = "Agregar al carrito";
    btnAddCart.onclick = () => {
      socket.emit("agregar-a-carrito", product._id);
    };

    // Añadir los detalles del producto al contenedor de detalles
    productDetails.appendChild(id);
    productDetails.appendChild(title);
    productDetails.appendChild(description);
    productDetails.appendChild(price);
    productDetails.appendChild(code);
    productDetails.appendChild(stock);
    productDetails.appendChild(category);
    productDetails.appendChild(btnAddCart);

    // Añadir el contenedor de detalles al contenedor del producto
    productCard.appendChild(productDetails);

    // Añadir la tarjeta del producto al contenedor principal
    contenedorProductos.appendChild(productCard);
  });
});
