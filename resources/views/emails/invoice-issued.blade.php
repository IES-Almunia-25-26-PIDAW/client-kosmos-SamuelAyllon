<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Factura {{ $invoice->invoice_number }}</title></head>
<body style="font-family: sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 24px;">
    <h2 style="color: #2d3748;">Hola, {{ $invoice->patient?->name }}</h2>
    <p>Adjuntamos la factura <strong>{{ $invoice->invoice_number }}</strong> correspondiente a tu sesión del {{ $invoice->issued_at?->format('d/m/Y') ?? now()->format('d/m/Y') }}.</p>
    <table style="width:100%; border-collapse:collapse; margin: 16px 0;">
        <tr style="background:#f7fafc;">
            <td style="padding:8px; border:1px solid #e2e8f0;">Profesional</td>
            <td style="padding:8px; border:1px solid #e2e8f0;">{{ $invoice->professional?->name }}</td>
        </tr>
        <tr>
            <td style="padding:8px; border:1px solid #e2e8f0;">Importe total</td>
            <td style="padding:8px; border:1px solid #e2e8f0;"><strong>{{ number_format((float)$invoice->total, 2, ',', '.') }} €</strong></td>
        </tr>
        <tr style="background:#f7fafc;">
            <td style="padding:8px; border:1px solid #e2e8f0;">Estado</td>
            <td style="padding:8px; border:1px solid #e2e8f0;">{{ ucfirst($invoice->status) }}</td>
        </tr>
    </table>
    <p style="font-size:12px; color:#718096;">
        Servicios de asistencia psicológica exentos de IVA (art. 20.Uno.3º LIVA).<br>
        Si tienes alguna duda, responde a este email.
    </p>
</body>
</html>
