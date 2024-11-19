function validarLogin() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('error-message');

  // Credenciales predeterminadas
  const usuarioValido = "gestor.udevipo@udevipo.gob.gt";
  const contrasenaValida = "12345678";

  if (email === usuarioValido && password === contrasenaValida) {
      // Almacenar que el usuario ha iniciado sesión
      sessionStorage.setItem('loggedIn', 'true');
      // Redirigir al usuario al panel de gestión de archivos
      window.location.href = "gestor.html"; // Cambia "gestor.html" por la página principal de tu aplicación
      return false; // Evita que el formulario se envíe
  } else {
      // Mostrar mensaje de error
      errorMessage.textContent = "Correo o contraseña incorrectos.";
      return false; // Evita que el formulario se envíe
  }
}
