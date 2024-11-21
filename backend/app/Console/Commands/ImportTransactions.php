<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use League\Csv\Reader;
use Carbon\Carbon;
use Generator;

class ImportTransactions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:import-transactions {file}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import data from CSV file to the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $filePath = $this->argument('file');

        if (!file_exists($filePath)) {
            $this->error("The file {$filePath} does not exists.");
            return 1;
        }

        $csv = Reader::createFromPath($filePath, 'r');
        $csv->setHeaderOffset(0);

        $total = iterator_count($csv->getRecords());

        $this->info("Total rows to be processed: {$total}");

        $bar = $this->output->createProgressBar($total);
        $bar->start();

        $startTime = microtime(true);
        $totalRows = 0;

        $this->info("Start: " . Carbon::now()->toDateTimeString());
        try {
            foreach ($this->getBatch($csv) as $batch) {
                DB::beginTransaction();
                try {
                    DB::table('transactions')->insert($batch);
                    DB::commit();
                    $totalRows += count($batch);
                    $bar->advance(count($batch));
                } catch (\Exception $e) {
                    DB::rollBack();
                    $this->error("Error during batch insert: " . $e->getMessage());
                    return 1;
                }
            }
            $bar->finish();

            $timeElapsed = microtime(true) - $startTime;
            $this->info("\n Finish: " . number_format($timeElapsed, 2) . " seconds");
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("Error during import data: " . $e->getMessage());
            return 1;
        }
    }

    /**
     * Process the CSV in batches using Generator to optimize memory
     */
    private function getBatch(Reader $csv): Generator
    {
        $batch = [];
        $count = 0;
        foreach ($csv->getRecords() as $record) {

            $batch[] = [
                'accountNumberFrom' => $record['accountNumberFrom'],
                'accountNumberTypeFrom' => $record['accountNumberTypeFrom'],
                'accountNumberTo' => $record['accountNumberTo'],
                'accountNumberTypeTo' => $record['accountNumberTypeTo'],
                'traceNumber' => $record['traceNumber'],
                'amount' => $record['amount'],
                'creationDate' => $record['creationDate'],
                'reference' => $record['reference'],
            ];

            $count++;
            $batch_size = (int) config('console.batch_size');

            if ($count === $batch_size) {
                yield $batch;
                $batch = [];
                $count = 0;
            }
        }

        if (!empty($batch)) {
            yield $batch;
        }
    }
}
