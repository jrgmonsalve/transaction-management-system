<?php

use App\Http\Controllers\TransactionController;
use App\Http\Middleware\ApiKeyMiddleware;
use Illuminate\Support\Facades\Route;


Route::middleware([ApiKeyMiddleware::class])->group(function () {
    Route::post('/transactions', [TransactionController::class, 'store']);
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::delete('/transactions/{id}', [TransactionController::class, 'destroy']);
});