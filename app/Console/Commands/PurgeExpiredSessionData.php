<?php

namespace App\Console\Commands;

use App\Models\Invoice;
use App\Models\SessionRecording;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Spatie\Activitylog\Models\Activity;

class PurgeExpiredSessionData extends Command
{
    protected $signature = 'purge:expired-session-data
        {--dry-run : Mostrar lo que se borraría sin ejecutar}
        {--invoice-pdf-years=5 : Antigüedad para borrar PDFs de factura}
        {--activity-log-years=2 : Antigüedad para purgar audit logs}';

    protected $description = 'Aplica la política de retención (PDFs caducados, transcripciones revocadas, audit logs antiguos)';

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');
        $invoicePdfCutoff = Carbon::now()->subYears((int) $this->option('invoice-pdf-years'));
        $activityCutoff = Carbon::now()->subYears((int) $this->option('activity-log-years'));

        $purgedPdfs = $this->purgeInvoicePdfs($invoicePdfCutoff, $dryRun);
        $purgedTranscriptions = $this->purgeRevokedTranscriptions($dryRun);
        $purgedActivity = $this->purgeStaleActivityLog($activityCutoff, $dryRun);

        $this->info(sprintf(
            'purge:expired-session-data → %d PDFs, %d transcripciones revocadas, %d entradas activity_log (%s).',
            $purgedPdfs,
            $purgedTranscriptions,
            $purgedActivity,
            $dryRun ? 'dry-run' : 'aplicado',
        ));

        return self::SUCCESS;
    }

    private function purgeInvoicePdfs(Carbon $cutoff, bool $dryRun): int
    {
        $invoices = Invoice::query()
            ->whereNotNull('pdf_path')
            ->where('updated_at', '<', $cutoff)
            ->get();

        $count = 0;

        foreach ($invoices as $invoice) {
            $path = (string) $invoice->pdf_path;

            if ($path === '') {
                continue;
            }

            if (! $dryRun) {
                Storage::disk('private')->delete($path);
                $invoice->forceFill(['pdf_path' => null])->save();
            }

            $count++;
        }

        return $count;
    }

    private function purgeRevokedTranscriptions(bool $dryRun): int
    {
        $recordings = SessionRecording::query()
            ->where('transcription_status', 'rejected_no_consent')
            ->whereNotNull('transcription')
            ->get();

        $count = 0;

        foreach ($recordings as $recording) {
            if (! $dryRun) {
                $recording->forceFill([
                    'transcription' => null,
                    'ai_summary' => null,
                ])->save();
            }
            $count++;
        }

        return $count;
    }

    private function purgeStaleActivityLog(Carbon $cutoff, bool $dryRun): int
    {
        $query = Activity::query()->where('created_at', '<', $cutoff);

        if ($dryRun) {
            return $query->count();
        }

        return DB::transaction(fn (): int => $query->delete());
    }
}
