function validarLogin() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('error-message');

  // Lista de usuarios válidos
  const usuariosValidos = [
    { email: "gestor.udevipo@udevipo.gob.gt", password: "19735.@" },
    { email: "carteraudevipo@udevipo.gob.gt", password: "Cartera2025@" },
    { email: "coorgeneral@udevipo.gob.gt", password: "Coorgeneral25@" },
    { email: "juridico@udevipo.gob.gt", password: "Juridico25@" }
  ];

  // Verificar si las credenciales ingresadas coinciden con algún usuario
  const usuarioValido = usuariosValidos.some(user => user.email === email && user.password === password);

  if (usuarioValido) {
    sessionStorage.setItem('loggedIn', 'true');
    window.location.href = "gestor.html"; // Cambia "gestor.html" por la página principal de tu aplicación
    return false; // Evita que el formulario se envíe
  } else {
    errorMessage.textContent = "Correo o contraseña incorrectos.";
    return false; // Evita que el formulario se envíe
  }
}