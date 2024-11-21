<?php

class TransactionExportService
{
    private $dbConnection;

    public function __construct($dbConnection)
    {
        $this->dbConnection = $dbConnection;
    }

    public function exportToCSV($userId)
    {
        // Fetch transactions from the database
        $query = "SELECT * FROM transactions WHERE user_id = " . $userId;
        $result = $this->dbConnection->query($query);
        
        if (!$result) {
            echo "Error fetching transactions";
            return;
        }

        $fileName = "transactions_" . $userId . "_" . time() . ".csv";
        $fileHandle = fopen($fileName, 'w');
        
        if (!$fileHandle) {
            echo "Error opening file";
            return;
        }

        // Write CSV headers
        fputcsv($fileHandle, ['Transaction ID', 'Amount', 'Type', 'Description', 'Date']);

        // Write transaction data
        while ($transaction = $result->fetch_assoc()) {
            fputcsv($fileHandle, [
                $transaction['id'],
                $transaction['amount'],
                $transaction['type'],
                $transaction['description'],
                $transaction['date']
            ]);
        }

        fclose($fileHandle);
        echo "Export completed. File: " . $fileName;
    }
}