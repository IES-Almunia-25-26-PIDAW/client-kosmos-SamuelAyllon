<?php

namespace App\Mail\Transport;

use Illuminate\Http\Client\Factory as HttpFactory;
use Symfony\Component\Mailer\Exception\TransportException;
use Symfony\Component\Mailer\SentMessage;
use Symfony\Component\Mailer\Transport\AbstractTransport;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mime\Message;
use Symfony\Component\Mime\MessageConverter;

/**
 * Transport HTTP de Brevo (antes Sendinblue).
 *
 * Por qué existe: Railway bloquea egress SMTP (puertos 25/465/587/2525 son
 * QDISC_DROP en su red, anti-abuse). La API HTTPS de Brevo va por puerto 443
 * que no está filtrado.
 *
 * Endpoint: POST https://api.brevo.com/v3/smtp/email
 * Docs: https://developers.brevo.com/reference/sendtransacemail
 */
class BrevoApiTransport extends AbstractTransport
{
    public function __construct(
        private readonly HttpFactory $http,
        private readonly string $apiKey,
        private readonly string $baseUrl = 'https://api.brevo.com/v3',
    ) {
        parent::__construct();
    }

    protected function doSend(SentMessage $message): void
    {
        if ($this->apiKey === '') {
            throw new TransportException(
                'Brevo API transport: BREVO_API_KEY is empty. Set it in your environment '.
                'and make sure the queue/worker container also receives the variable.'
            );
        }

        $original = $message->getOriginalMessage();

        if (! $original instanceof Message) {
            throw new TransportException('Brevo API transport: expected a MIME Message, got '.$original::class);
        }

        $email = MessageConverter::toEmail($original);

        $payload = [
            'sender' => $this->addressToArray($this->resolveSender($email)),
            'to' => $this->addressesToArray($email->getTo()),
            'subject' => $email->getSubject() ?? '',
        ];

        if ($html = $email->getHtmlBody()) {
            $payload['htmlContent'] = (string) $html;
        }
        if ($text = $email->getTextBody()) {
            $payload['textContent'] = (string) $text;
        }

        if (! empty($email->getCc())) {
            $payload['cc'] = $this->addressesToArray($email->getCc());
        }
        if (! empty($email->getBcc())) {
            $payload['bcc'] = $this->addressesToArray($email->getBcc());
        }
        if (! empty($email->getReplyTo())) {
            $payload['replyTo'] = $this->addressToArray($email->getReplyTo()[0]);
        }

        $response = $this->http
            ->withHeaders([
                'api-key' => $this->apiKey,
                'accept' => 'application/json',
            ])
            ->acceptJson()
            ->asJson()
            ->timeout(15)
            ->post($this->baseUrl.'/smtp/email', $payload);

        if ($response->failed()) {
            throw new TransportException(sprintf(
                'Brevo API rejected the email (HTTP %d): %s',
                $response->status(),
                $response->body(),
            ));
        }

        if ($messageId = $response->json('messageId')) {
            $message->setMessageId((string) $messageId);
        }
    }

    public function __toString(): string
    {
        return 'brevo+api://';
    }

    private function resolveSender(Email $email): Address
    {
        $from = $email->getFrom();
        if (! empty($from)) {
            return $from[0];
        }

        $sender = $email->getSender();
        if ($sender !== null) {
            return $sender;
        }

        throw new TransportException('Brevo API transport: no sender address available on the message.');
    }

    /**
     * @param  array<int, Address>  $addresses
     * @return list<array{email: string, name?: string}>
     */
    private function addressesToArray(array $addresses): array
    {
        return array_values(array_map(fn (Address $a) => $this->addressToArray($a), $addresses));
    }

    /**
     * @return array{email: string, name?: string}
     */
    private function addressToArray(Address $address): array
    {
        $out = ['email' => $address->getAddress()];
        if ($name = $address->getName()) {
            $out['name'] = $name;
        }

        return $out;
    }
}
