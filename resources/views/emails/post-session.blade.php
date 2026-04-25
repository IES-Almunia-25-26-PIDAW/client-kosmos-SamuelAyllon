<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Gracias por tu sesión</title></head>
<body style="font-family: sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 24px;">
    <h2 style="color: #2d3748;">Hola, {{ $appointment->patient?->name }}</h2>
    <p>Gracias por tu sesión del {{ $appointment->starts_at?->format('d/m/Y H:i') }} con {{ $appointment->professional?->name }}.</p>
    <p>Puedes consultar el resumen, los acuerdos y la factura desde tu portal:</p>
    <p style="margin: 24px 0;">
        <a href="{{ url('/patient/appointments/'.$appointment->id.'/post-session') }}"
           style="display:inline-block; background:#4c51bf; color:white; padding:10px 20px; border-radius:6px; text-decoration:none;">
            Abrir mi portal
        </a>
    </p>
    <p style="font-size:12px; color:#718096; margin-top: 24px;">
        Cualquier duda, responde a este email.
    </p>
</body>
</html>
