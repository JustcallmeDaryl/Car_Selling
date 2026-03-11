<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        return Inertia::render('Customers/Index', [
            'customers' => Customer::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'phone' => 'required',
            'email' => 'required|email|unique:customers',
            'address' => 'nullable'
        ]);

        Customer::create($validated);
        return redirect()->back();
    }

    public function update(Request $request, Customer $customer)
{
    $validated = $request->validate([
        'name'    => 'required|string|max:255',
        'phone'   => 'required|string',
        'email'   => 'required|email|unique:customers,email,' . $customer->id,
        'address' => 'nullable|string',
    ]);

    $customer->update($validated);

    return redirect()->back()->with('message', 'Customer updated successfully!');
}

    public function destroy(Customer $customer)
    {
        $customer->delete();
        return redirect()->back();
    }
}