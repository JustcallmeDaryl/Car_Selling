<?php
namespace App\Http\Controllers;

use App\Models\Car;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CarController extends Controller
{
    public function index()
    {
        return Inertia::render('Cars/Index', [
            'cars' => Car::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'brand' => 'required|string',
            'model' => 'required|string',
            'year' => 'required|integer',
            'price' => 'required|numeric',
        ]);

        Car::create($validated + ['status' => 'Available']);
        return redirect()->back()->with('message', 'Car added successfully');
    }

    public function update(Request $request, Car $car)
{
    // Validation
    $validated = $request->validate([
        'brand'  => 'required|string|max:255',
        'model'  => 'required|string|max:255',
        'year'   => 'required|integer|min:1900',
        'price'  => 'required|numeric',
        'status' => 'required|in:Available,Sold',
    ]);

    // Update the record
    $car->update($validated);

    // Redirect back to the same page with a success message
    return redirect()->back()->with('message', 'Car updated successfully!');
}

    public function destroy(Car $car)
    {
        $car->delete();
        return redirect()->back()->with('message', 'Car deleted');
    }
}