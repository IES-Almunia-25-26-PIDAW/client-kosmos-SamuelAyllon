<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 12px; color: #1a1a1a; margin: 0; padding: 24px; }
        h1 { font-size: 20px; margin: 0 0 4px; }
        .subtitle { color: #555; margin: 0 0 24px; font-size: 11px; }
        .section { margin-bottom: 20px; }
        .label { font-weight: bold; font-size: 11px; text-transform: uppercase; color: #555; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        thead th { background: #f4f4f4; border-bottom: 2px solid #ccc; padding: 6px 8px; text-align: left; font-size: 11px; }
        tbody td { padding: 6px 8px; border-bottom: 1px solid #eee; }
        tfoot td { padding: 6px 8px; font-weight: bold; border-top: 2px solid #ccc; }
        .right { text-align: right; }
        .exempt-notice { background: #fffbe6; border: 1px solid #f0c040; padding: 10px 12px; margin-top: 24px; font-size: 10px; line-height: 1.5; }
        .footer { margin-top: 32px; font-size: 10px; color: #888; border-top: 1px solid #eee; padding-top: 8px; }
        .header-row { display: table; width: 100%; }
        .header-left { display: table-cell; width: 50%; vertical-align: top; }
        .header-right { display: table-cell; width: 50%; vertical-align: top; text-align: right; }
    </style>
</head>
<body>

<div class="header-row">
    <div class="header-left">
        <h1>FACTURA</h1>
        <p class="subtitle">Nº {{ $invoice->invoice_number }}</p>
    </div>
    <div class="header-right">
        <div class="label">Fecha de emisión</div>
        <div>{{ $invoice->issued_at?->format('d/m/Y') ?? now()->format('d/m/Y') }}</div>
        @if($invoice->due_at)
        <div class="label" style="margin-top:6px;">Vencimiento</div>
        <div>{{ $invoice->due_at->format('d/m/Y') }}</div>
        @endif
    </div>
</div>

<table style="margin-top: 24px; border: none;">
    <tr>
        <td style="width: 50%; vertical-align: top; padding: 0 16px 0 0; border: none;">
            <div class="label">Emisor (Profesional)</div>
            <div>{{ $invoice->professional?->name }}</div>
            <div>{{ $invoice->professional?->email }}</div>
            @php $prof = $invoice->professional?->professionalProfile; @endphp
            @if($prof?->collegiate_number)
            <div>Nº Colegiado: {{ $prof->collegiate_number }}</div>
            @endif
        </td>
        <td style="width: 50%; vertical-align: top; padding: 0; border: none;">
            <div class="label">Receptor (Paciente)</div>
            <div>{{ $invoice->patient?->name }}</div>
            <div>{{ $invoice->patient?->email }}</div>
        </td>
    </tr>
</table>

<div class="section" style="margin-top: 24px;">
    <table>
        <thead>
            <tr>
                <th style="width: 55%;">Descripción</th>
                <th class="right" style="width: 15%;">Unidades</th>
                <th class="right" style="width: 15%;">Precio ud.</th>
                <th class="right" style="width: 15%;">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->items as $item)
            <tr>
                <td>{{ $item->description }}</td>
                <td class="right">{{ $item->quantity }}</td>
                <td class="right">{{ number_format((float)$item->unit_price, 2, ',', '.') }} €</td>
                <td class="right">{{ number_format((float)$item->total, 2, ',', '.') }} €</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td colspan="3" class="right">Base imponible</td>
                <td class="right">{{ number_format((float)$invoice->subtotal, 2, ',', '.') }} €</td>
            </tr>
            <tr>
                <td colspan="3" class="right">IVA ({{ number_format((float)$invoice->tax_rate, 0) }}%)</td>
                <td class="right">{{ number_format((float)$invoice->tax_amount, 2, ',', '.') }} €</td>
            </tr>
            <tr>
                <td colspan="3" class="right" style="font-size: 13px;">TOTAL</td>
                <td class="right" style="font-size: 13px;">{{ number_format((float)$invoice->total, 2, ',', '.') }} €</td>
            </tr>
        </tfoot>
    </table>
</div>

<div class="exempt-notice">
    <strong>Operación exenta de IVA</strong> — Servicios de asistencia psicológica prestados por profesional colegiado.
    Exención aplicada conforme al artículo 20.Uno.3º de la Ley 37/1992 del Impuesto sobre el Valor Añadido (LIVA).
</div>

<div class="footer">
    Factura emitida en cumplimiento del Real Decreto 1619/2012 sobre facturación.
    @if($invoice->notes) — {{ $invoice->notes }} @endif
</div>

</body>
</html>
