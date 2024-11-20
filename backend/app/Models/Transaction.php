<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $primaryKey = 'transactionID';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'accountNumberFrom',
        'accountNumberTypeFrom',
        'accountNumberTo',
        'accountNumberTypeTo',
        'traceNumber',
        'amount',
        'description',
        'creationDate',
        'reference',
    ];
}
