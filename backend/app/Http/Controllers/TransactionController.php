<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Http\Response;

class TransactionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'accountNumberFrom' => 'required|string|max:255',
            'accountNumberTypeFrom' => 'required|in:Credit,Checking,Savings',
            'accountNumberTo' => 'required|string|max:255',
            'accountNumberTypeTo' => 'required|in:Credit,Checking,Savings',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'creationDate' => 'required|date',
            'reference' => 'nullable|string',
        ]);

        $validated['traceNumber'] = Str::uuid()->toString();
        $validated['creationDate'] = Carbon::parse($validated['creationDate'])->format('Y-m-d H:i:s');

        $transaction = Transaction::create($validated);

        return response()->json($transaction, Response::HTTP_CREATED);
    }

    public function index(Request $request)
    {
        $query = Transaction::query();

        if ($request->has('accountNumberTypeFrom')) {
            $query->where('accountNumberTypeFrom', $request->accountNumberTypeFrom);
        }

        if ($request->has('accountNumberTypeTo')) {
            $query->where('accountNumberTypeTo', $request->accountNumberTypeTo);
        }

        if ($request->has(['startDate', 'endDate'])) {
            $query->whereBetween('creationDate', [$request->startDate, $request->endDate]);
        }

        $transactions = $query->paginate(10);

        return response()->json($transactions);
    }

    public function destroy($id)
    {
        $transaction = Transaction::findOrFail($id);
        $transaction->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
