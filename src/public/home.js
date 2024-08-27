const socket = io();

const contenedorProductos = document.querySelector(".products-container");

socket.on("home", (data) => {
  contenedorProductos.innerHTML = "";

  data.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    // Imagen del producto
    const img = document.createElement("img");
    img.src = `/images/${product.thumbnail}`;
    img.alt = product.title;
    img.classList.add("product-image");

    // Detalles del producto
    const productDetails = document.createElement("div");
    productDetails.classList.add("product-details");

    // Título del producto
    const title = document.createElement("h2");
    title.classList.add("product-title");
    title.innerText = product.title;

    // Descripción del producto
    const description = document.createElement("p");
    description.classList.add("product-description");
    description.innerText = product.description;

    // Stock del producto
    const stock = document.createElement("p");
    stock.classList.add("product-stock");
    stock.innerText = `Stock disponible: ${product.stock}`;

    // Categoría del producto
    const category = document.createElement("p");
    category.classList.add("product-category");
    category.innerText = `Categoría: ${product.category}`;

    // Precio del producto
    const price = document.createElement("h3");
    price.classList.add("product-price");
    price.innerText = `$ ${product.price}`;

    // Agregar los elementos a los detalles del producto
    productDetails.appendChild(title);
    productDetails.appendChild(description);
    productDetails.appendChild(stock);
    productDetails.appendChild(category);
    productDetails.appendChild(price);

    // Agregar la imagen y los detalles al contenedor de la tarjeta del producto
    productCard.appendChild(img);
    productCard.appendChild(productDetails);

    // Agregar la tarjeta del producto al contenedor principal
    contenedorProductos.appendChild(productCard);
  });
});
