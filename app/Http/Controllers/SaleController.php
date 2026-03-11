<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Car;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    public function index()
    {
        return Inertia::render('Sales/Index', [
            'sales' => Sale::with(['customer', 'car'])->get(),
            'customers' => Customer::all(),
            'availableCars' => Car::where('status', 'Available')->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required',
            'car_id' => 'required',
            'sale_date' => 'required|date',
            'total_price' => 'required|numeric'
        ]);

        DB::transaction(function () use ($request) {
            Sale::create($request->all());
            Car::where('id', $request->car_id)->update(['status' => 'Sold']);
        });

        return redirect()->back();
    }

    public function destroy(Sale $sale)
    {
        // Mark car available again if sale is cancelled/deleted
        Car::where('id', $sale->car_id)->update(['status' => 'Available']);
        $sale->delete();
        return redirect()->back();
    }
}