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
