<?php
// Ruta donde se almacenan los archivos subidos
$uploadDir = 'expedientes/'; // Cambia esto según tu configuración

// Obtener la lista de archivos en el directorio
$archivos = array_diff(scandir($uploadDir), array('..', '.'));

// Estructura para almacenar los datos de los archivos
$resultado = [];
foreach ($archivos as $archivo) {
    $rutaArchivo = $uploadDir . $archivo;
    if (is_file($rutaArchivo)) {
        $resultado[] = [
            'nombre' => $archivo,
            'url' => $rutaArchivo,
            'tipo' => mime_content_type($rutaArchivo),
            'tamano' => filesize($rutaArchivo), // Tamaño en bytes
            'fecha' => date("Y-m-d H:i:s", filemtime($rutaArchivo)), // Fecha de última modificación
        ];
    }
}

// Devolver la respuesta en formato JSON
echo json_encode(['success' => true, 'archivos' => $resultado]);
?>
