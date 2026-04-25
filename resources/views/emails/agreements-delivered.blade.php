<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Acuerdos de la sesión</title></head>
<body style="font-family: sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 24px;">
    <h2 style="color: #2d3748;">Hola, {{ $appointment->patient?->name }}</h2>
    <p>Te compartimos los acuerdos recogidos en tu sesión del {{ $appointment->starts_at?->format('d/m/Y H:i') }} con {{ $appointment->professional?->name }}:</p>
    <ul style="padding-left: 20px;">
        @foreach ($agreements as $agreement)
            <li style="margin-bottom: 12px; line-height: 1.5;">{{ $agreement->content }}</li>
        @endforeach
    </ul>
    <p style="font-size:12px; color:#718096; margin-top: 24px;">
        Si tienes dudas sobre alguno de los acuerdos, responde a este email y tu profesional te contestará.
    </p>
</body>
</html>
