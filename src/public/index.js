const socket = io();

// Manejar el envío del formulario y emitir el evento 'new-product'
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

// Manejar el envío del formulario y emitir el evento 'delete-product'
document.getElementById("delete-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const productId = parseInt(
    document.getElementById("productIdToDelete").value
  );

  if (isNaN(productId) || productId <= 0) {
    alert("Por favor ingrese un ID válido.");
    return;
  }

  console.log("Emitiendo ID del producto a eliminar :", productId);

  // Emitir el ID del producto a eliminar al servidor
  socket.emit("delete-product", productId);

  // Limpiar el formulario después del envío
  document.getElementById("productIdToDelete").value = "";
});

// Escuchar el evento 'update-products' para actualizar la lista de productos
/* socket.on("update-products", (productos) => {
  const productList = document.getElementById("product-list");
  productList.innerHTML = ""; // Limpiar la lista existente

  // Añadir cada producto recibido del servidor a la lista
  productos.forEach((product) => {
    productList.innerHTML += `<li>${product.name} - $${product.price.toFixed(
      2
    )} - ID:${product.id}</li>`;
  });
}); */
