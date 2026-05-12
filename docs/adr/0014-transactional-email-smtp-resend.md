---
adr: "0014"
title: Envío de email transaccional (SMTP / Resend)
date: 2026-04-24
status: Aceptado
---

# ADR-0014 — Envío de email transaccional (SMTP / Resend)

## Contexto

El MVP debe enviar facturas y acuerdos al paciente por email después de cada sesión.

## Decisión

- En desarrollo: driver `log` (Mailpit para inspección visual).
- En producción: Resend (o Postmark como alternativa) configurado vía `MAIL_MAILER=smtp` + credenciales en `.env`.
- Las clases mailable (`InvoiceIssuedMail`, `AgreementsSentMail`, `PostSessionMail`) extienden `Mailable` de Laravel con `envelope()` + `content()` (API fluida Laravel 10+).
- Los jobs de envío (`SendInvoiceEmailJob`, `SendAgreementsEmailJob`, `SendPostSessionEmailJob`) usan la cola `default` para no bloquear la petición HTTP.

## Consecuencias

**Positivas**
- Desacoplado del proveedor SMTP; cambiar a Postmark es solo cambiar la variable de entorno.

**Negativas**
- Requiere verificar el dominio del remitente en producción (SPF, DKIM). Documentar en deploy guide.
