<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

require 'vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $mail = new PHPMailer();
    $mail->isSMTP();
    $mail->SMTPDebug = SMTP::DEBUG_OFF;
    $mail->Host = 'smtp.gmail.com';
    $mail->Port = 465;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->SMTPAuth = true;
    $mail->Username = 'margheranelmezzo@gmail.com';
    $mail->Password = 'dsrinckcaworqxqy';

    $mail->setFrom($_POST["email"], $_POST["name"]);
    $mail->addAddress('margheranelmezzo@gmail.com', 'Marghera nel mezzo');
    $mail->Subject = 'Nuovo contenuto per "Marghera nel mezzo"';
    $mail->Body = "Anno di produzione: " . $_POST["year"];
    
    // Attach the file if provided
    if (isset($_FILES["attachment"]) && $_FILES["attachment"]["error"] == UPLOAD_ERR_OK) {
        $ext = PHPMailer::mb_pathinfo($_FILES['attachment']['name'], PATHINFO_EXTENSION);
        // Define a safe location to move the uploaded file to, preserving the extension
        $uploadfile = tempnam(sys_get_temp_dir(), hash('sha256', $_FILES['attachment']['name'])) . '.' . $ext;

        if (move_uploaded_file($_FILES['attachment']['tmp_name'], $uploadfile)) {
            // Attach the uploaded file
            if (!$mail->addAttachment($uploadfile, 'upload')) {
                $msg .= 'Failed to attach file ' . $_FILES['attachment']['name'];
            }
        } else {
            $msg .= 'Failed to move file to ' . $uploadfile;
        }
    }

    // Send email
    if (!$mail->send()) {
        $msg .= 'Mailer Error: ' . $mail->ErrorInfo;
    } else {
        $msg .= 'Message sent!';
    }
}

// Redirect after sending email
header("Location: index.html");

?>
