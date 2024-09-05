// Conectar al servidor mediante WebSocket utilizando la librería Socket.IO.
const socket = io();

// Seleccionar el contenedor en el DOM donde se mostrarán los productos.
const contenedorProductos = document.querySelector(".products-container");

// Escuchar el evento 'home' enviado por el servidor para mostrar los productos.
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

// Manejar el envío del formulario para agregar un nuevo producto
document.getElementById("product-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("productName").value;
  const price = parseFloat(document.getElementById("productPrice").value);
  const description = document.getElementById("productDescription").value;
  const title = document.getElementById("productTitle").value;
  const code = document.getElementById("productCode").value;
  const stock = parseInt(document.getElementById("productStock").value);
  const category = document.getElementById("productCategory").value;
  const thumbnail = document.getElementById("productThumbnail").value;

  if (!name || isNaN(price) || price <= 0 || isNaN(stock) || stock <= 0) {
    alert("Por favor ingrese todos los datos correctamente.");
    return;
  }

  const newProduct = {
    name,
    price,
    description,
    title,
    code,
    stock,
    category,
    thumbnail,
    status: true,
  };

  console.log("Emitiendo nuevo producto:", newProduct);

  // Emitir el producto nuevo al servidor
  socket.emit("new-product", newProduct);

  // Limpiar el formulario después del envío
  document.getElementById("product-form").reset();
});

// Manejar el envío del formulario para eliminar un producto
document.getElementById("delete-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const productId = parseInt(
    document.getElementById("productIdToDelete").value
  );

  if (isNaN(productId) || productId <= 0) {
    alert("Por favor ingrese un ID válido.");
    return;
  }

  console.log("Emitiendo ID del producto a eliminar:", productId);

  // Emitir el ID del producto a eliminar al servidor
  socket.emit("delete-product", productId);

  // Limpiar el formulario después del envío
  document.getElementById("productIdToDelete").value = "";
});

// Manejar el envío del formulario para actualizar un producto
const updateProduct = () => {
  const id = document.querySelector("#update-id").value;
  const title = document.querySelector("#update-title").value;
  const description = document.querySelector("#update-description").value;
  const price = document.querySelector("#update-price").value;
  const code = document.querySelector("#update-code").value;
  const stock = document.querySelector("#update-stock").value;
  const category = document.querySelector("#update-category").value;

  const info = { title, description, price, code, stock, category };
  socket.emit("modificar-producto", { info, id });

  document.querySelector("#update-id").value = "";
  document.querySelector("#update-title").value = "";
  document.querySelector("#update-description").value = "";
  document.querySelector("#update-price").value = "";
  document.querySelector("#update-code").value = "";
  document.querySelector("#update-stock").value = "";
  document.querySelector("#update-category").value = "";
};
