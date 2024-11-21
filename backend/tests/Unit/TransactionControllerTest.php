<?php

namespace Tests\Unit\Http\Controllers;

use App\Http\Controllers\TransactionController;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Tests\TestCase;

class TransactionControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $controller;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
        $this->controller = new TransactionController();
    }

    public function test_store_creates_new_transaction()
    {
        $requestData = [
            'accountNumberFrom' => '123456789',
            'accountNumberTypeFrom' => 'Savings',
            'accountNumberTo' => '987654321',
            'accountNumberTypeTo' => 'Checking',
            'amount' => 100.00,
            'description' => 'Test transaction',
            'creationDate' => '2024-03-21 10:00:00',
            'reference' => 'REF123'
        ];

        $request = Request::create('/api/transactions', 'POST', $requestData);

        $response = $this->controller->store($request);

        $this->assertEquals(201, $response->getStatusCode());
        $responseData = json_decode($response->getContent(), true);
        
        $this->assertDatabaseHas('transactions', [
            'accountNumberFrom' => $requestData['accountNumberFrom'],
            'accountNumberTypeFrom' => $requestData['accountNumberTypeFrom'],
            'amount' => $requestData['amount'],
        ]);
        
        $this->assertNotNull($responseData['traceNumber']);
    }

    public function test_index_returns_filtered_transactions()
    {
        Transaction::factory()->create([
            'accountNumberTypeFrom' => 'Savings',
            'creationDate' => '2024-11-20 10:00:00'
        ]);
        Transaction::factory()->create([
            'accountNumberTypeFrom' => 'Checking',
            'creationDate' => '2024-11-21 10:00:00'
        ]);

        $request = Request::create('/api/transactions', 'GET', [
            'account_type_from' => 'Savings',
            'start_date' => '2024-11-20',
            'end_date' => '2024-11-21 23:59:59',
            'per_page' => 10
        ]);

        $response = $this->controller->index($request);
        $responseData = json_decode($response->getContent(), true);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertCount(1, $responseData['data']);
        $this->assertEquals('Savings', $responseData['data'][0]['accountNumberTypeFrom']);
    }

    public function test_destroy_deletes_transaction()
    {
        $transaction = Transaction::factory()->create();
        
        $response = $this->controller->destroy($transaction->transactionID);

        $this->assertEquals(204, $response->getStatusCode());
        $this->assertDatabaseMissing('transactions', ['id' => $transaction->transactionID]);
    }

    public function test_store_validates_required_fields()
    {
        $this->expectException(\Illuminate\Validation\ValidationException::class);

        $requestData = [];
        $request = Request::create('/api/transactions', 'POST', $requestData);
        
        $this->controller->store($request);
    }

    public function test_index_respects_pagination_limits()
    {
        Transaction::factory()->count(20)->create();

        $request = Request::create('/api/transactions', 'GET', ['per_page' => 5]);
        $response = $this->controller->index($request);
        $responseData = json_decode($response->getContent(), true);

        $this->assertCount(5, $responseData['data']);
    }
}