I am considering two options:

1. Using a built-in command provided by the database engine.
    1. limitation is with privilegies in the data base
1. Implementing a script that inserts data in batches, reading the file with a yield function to avoid overwhelming memory.
    1. limitation about this script is with memory, if you incress the batch the script is going to consume more memory

```bash
docker compose exec backend php artisan app:import-transactions storage/app/private/transactions.csv

Total rows to be processed: 700000
      0/700000 [░░░░░░░░░░░░░░░░░░░░░░░░░░░░]   0%
  62000/700000 [▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░]   8%
 153000/700000 [▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░]  21%
 700000/700000 [▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓] 100%
 Finish: 62.02 seconds
```