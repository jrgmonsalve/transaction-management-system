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

        if ($request->filled('account_type_from')) {
            $query->where('accountNumberTypeFrom', $request->account_type_from);
        }

        if ($request->filled('account_type_to')) {
            $query->where('accountNumberTypeTo', $request->account_type_to);
        }

        if ($request->filled(['start_date', 'end_date'])) {
            $query->whereBetween('creationDate', [
                Carbon::parse($request->start_date)->startOfDay(),
                Carbon::parse($request->end_date)->endOfDay()
            ]);
        }

        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy('creationDate', $sortDirection);

        $defaultPerPage = (int) config('api.per_page');
        $maxPerPage = (int) config('api.per_page_max');
        
        $perPage = $request->input('per_page', $defaultPerPage);
        $perPage = min(max($perPage, 1), $maxPerPage);

        $transactions = $query->paginate($perPage);
        
        return response()->json($transactions);
    }

    public function destroy($id)
    {
        $transaction = Transaction::findOrFail($id);
        $transaction->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
