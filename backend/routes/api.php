<?php

use App\Http\Middleware\ApiKeyMiddleware;
use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return response()->json(['message' => 'Data returned successfully']);
});

Route::middleware([ApiKeyMiddleware::class])->group(function () {
    Route::get('/transactions', function () {
        return response()->json(['message' => 'Data returned successfully']);
    });
});