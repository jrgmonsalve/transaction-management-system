<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id('transactionID');
            $table->string('accountNumberFrom');
            $table->string('accountNumberTypeFrom');
            $table->string('accountNumberTo');
            $table->string('accountNumberTypeTo');
            $table->string('traceNumber')->unique();
            $table->decimal('amount', 15, 2);
            $table->string('type'); // 'credit' or 'debit'
            $table->text('description')->nullable();
            $table->date('creationDate');
            $table->string('reference')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
