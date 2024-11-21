
# Code Review for TransactionExportService

## Issues and Suggestions

### 1. Security Concerns

#### a. SQL Injection Vulnerability
- **Issue:** Directly concatenating `$userId` in the SQL query is vulnerable to SQL injection.
- **Suggestion:** Use parameterized queries with prepared statements to mitigate this risk.
```php
$stmt = $this->dbConnection->prepare("SELECT * FROM transactions WHERE user_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();
```

---

### 2. File Handling

#### a. Handling File Open Errors
- **Issue:** File opening errors are not detailed.
- **Suggestion:** Provide detailed error information.
```php
if (!$fileHandle) {
    throw new Exception("Error opening file: " . error_get_last()['message']);
}
```

### b. Name of file
- **Issue:** use time() function to build the name of file is not human readible.
- **Suggestion:** Other option is use a simple format YYYY_MM_DD.


---

### 3. Data Handling

#### a. Specifying Columns and sorting
- **Issue:** `SELECT *` is used in the query, which is inefficient and without sort by id is difficult to retake if the process fail.
- **Suggestion:** Specify required columns explicitly and add sort.
```php
$query = "SELECT id, amount, type, description, date FROM transactions WHERE user_id = ? ORDER BY id ";
```

---

### 4. Resource Management

#### a. Closing Database Resources
- **Issue:** Prepared statements and database connections are not explicitly closed.
- **Suggestion:** Close prepared statements after execution.
```php
$stmt->close();
```

#### b. Exception Safety
- **Issue:** Open file handles might remain open if an exception is thrown.
- **Suggestion:** Use `try...finally` blocks to ensure resources are closed.
```php
try {
    // File operations
} finally {
    fclose($fileHandle);
}
```

---

### 5. Code Organization and Readability

#### a. Method Extraction
- **Issue:** The method `exportToCSV` is too large and does multiple things.
- **Suggestion:** Extract functionality into smaller methods, e.g., `fetchTransactions` and `writeTransactionsToCSV`.

#### b. Use of SOLID Principles
- **Issue:** The method `exportToCSV` define type export in the name, better set o inject type of export method.
- **Suggestion:** Create a interface to define contract to export data and that allow extract logic to an other class with a single responsability (save data in a CSV file).

#### c. Comments and Documentation
- **Suggestion:** Add docblocks to methods for better maintainability.
```php
/**
 * Exports user transactions to a CSV file.
 *
 * @param int $userId The ID of the user whose transactions are to be exported.
 * @throws Exception If an error occurs during export.
 * @return string The path to the generated CSV file.
 */
public function exportToCSV($userId) { /* ... */ }
```


### 6. Improve Logging
- **Suggestion:** Use a logging library like Monolog to record errors and events.
```php
$this->logger->error("Error fetching transactions for user ID {$userId}.");
```
