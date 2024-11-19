<?php
// Desactivar la caché del navegador para la respuesta de subida de archivos
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

// Ruta donde se almacenarán los archivos subidos
$uploadDir = 'expedientes/'; // Cambiar a la ruta en el servidor

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['files'])) {
        $response = []; // Para almacenar las respuestas

        foreach ($_FILES['files']['tmp_name'] as $key => $tmpName) {
            $fileName = basename($_FILES['files']['name'][$key]);
            $fileSize = $_FILES['files']['size'][$key];
            $fileTmpName = $_FILES['files']['tmp_name'][$key];
            $fileType = $_FILES['files']['type'][$key];

            // Validar tamaño y tipo de archivo (opcional)
            if ($fileSize > 60000000) { // Limitar tamaño a 60MB
                $response[] = ["success" => false, "message" => "El archivo $fileName es demasiado grande."];
                continue;
            }

            // Mover archivo a la carpeta especificada
            $uploadFilePath = $uploadDir . $fileName;

            if (move_uploaded_file($fileTmpName, $uploadFilePath)) {
                $response[] = ["success" => true, "message" => "El archivo $fileName se ha subido correctamente."];
            } else {
                $response[] = ["success" => false, "message" => "Error al subir el archivo $fileName."];
            }
        }
        
        echo json_encode($response); // Retornar la respuesta en formato JSON
    } else {
        echo json_encode(["success" => false, "message" => "No se han seleccionado archivos para subir."]);
    }
}
?>
