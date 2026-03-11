<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Sale;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        return Inertia::render('Payments/Index', [
            'payments' => Payment::with('sale.customer', 'sale.car')->get(),
            'sales' => Sale::with('customer', 'car')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sale_id' => 'required',
            'payment_amount' => 'required|numeric',
            'payment_date' => 'required|date',
            'payment_type' => 'required',
            'payment_status' => 'required'
        ]);

        Payment::create($validated);
        return redirect()->back();
    }

    public function update(Request $request, Payment $payment)
{
    $validated = $request->validate([
        'sale_id' => 'required|exists:sales,id',
        'payment_amount' => 'required|numeric',
        'payment_date' => 'required|date',
        'payment_status' => 'required|in:Paid,Pending',
    ]);

    $payment->update($validated);

    return redirect()->back()->with('message', 'Payment updated.');
}

    public function destroy(Payment $payment)
    {
        $payment->delete();
        return redirect()->back()->with('message', 'Payment deleted');
    }
}