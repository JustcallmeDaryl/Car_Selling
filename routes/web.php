<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Route
Route::get('/', function () {
    return Inertia::render('Welcome');
});

// Authenticated Routes (Both Admin and Sales Agent)
Route::middleware(['auth', 'verified'])->group(function () {
    
    // 1. Dashboard - Controller handles different views based on role
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // 2. Car Inventory - Both can VIEW, but only Admin can MANAGE (see admin group below)
    Route::get('/cars', [CarController::class, 'index'])->name('cars.index');

    // 3. Customers - Both can View, Add, and Edit
    Route::resource('customers', CustomerController::class)->except(['destroy']);

    // 4. Sales - Both can View and Record Transactions
    Route::resource('sales', SaleController::class)->except(['destroy']);

    // 5. Payments - Both can View and Record Payments
    Route::resource('payments', PaymentController::class)->except(['destroy']);

    // 6. Profile (Default Laravel Breeze)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // --- ADMIN ONLY ROUTES ---
    // These routes are protected by the 'admin' middleware
    Route::middleware(['admin'])->group(function () {
        
        // Full Car Management (Add, Update, Delete)
        Route::post('/cars', [CarController::class, 'store'])->name('cars.store');
        Route::put('/cars/{car}', [CarController::class, 'update'])->name('cars.update');
        Route::delete('/cars/{car}', [CarController::class, 'destroy'])->name('cars.destroy');

        // Delete Permissions for other modules
        Route::delete('/customers/{customer}', [CustomerController::class, 'destroy'])->name('customers.destroy');
        Route::delete('/sales/{sale}', [SaleController::class, 'destroy'])->name('sales.destroy');
        Route::delete('/payments/{payment}', [PaymentController::class, 'destroy'])->name('payments.destroy');

        // Optional: User Management (If you want Admin to create new Agents)
        // Route::resource('users', UserController::class);
    });
});

require __DIR__.'/auth.php';