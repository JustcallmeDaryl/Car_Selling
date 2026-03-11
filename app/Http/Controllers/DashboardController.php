<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Customer;
use App\Models\Sale;
use App\Models\Payment;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB; // Required for charts logic

class DashboardController extends Controller
{
    public function index()
    {
        $role = auth()->user()->role;
        $isAdmin = ($role === 'admin');

        // 1. DATA FOR GRAPHS (Used by both Admin and Agent)
        
        // Fetch Monthly Sales (Revenue per month for the current year)
        $monthlySalesData = Sale::select(
            DB::raw("SUM(total_price) as amount"),
            DB::raw("DATE_FORMAT(created_at, '%b') as month"),
            DB::raw("MONTH(created_at) as month_num")
        )
        ->whereYear('created_at', date('Y'))
        ->groupBy('month', 'month_num')
        ->orderBy('month_num')
        ->get()
        ->map(fn($item) => [
            'month' => $item->month,
            'amount' => (float) $item->amount
        ]);

        // Fetch Top Selling Car Models
        $topCarsData = Car::select('model', DB::raw('count(*) as sold_count'))
            ->where('status', 'Sold')
            ->groupBy('model')
            ->orderBy('sold_count', 'desc')
            ->take(5)
            ->get();

        // 2. PREPARE THE STATS OBJECT
        $stats = [
            'total_cars' => Car::count(),
            'available_cars' => Car::where('status', 'Available')->count(),
            'sold_cars' => Car::where('status', 'Sold')->count(),
            'monthly_sales_data' => $monthlySalesData,
            'top_cars_data' => $topCarsData,
        ];

        // 3. ADMIN-ONLY FINANCIAL DATA
        if ($isAdmin) {
            $stats['total_customers'] = Customer::count();
            $stats['total_sales'] = Sale::sum('total_price') ?? 0;
            $stats['total_payments'] = Payment::sum('payment_amount') ?? 0;
        } else {
            // For Sales Agents, we might want to hide totals or show 0
            $stats['total_customers'] = Customer::count(); 
            $stats['total_sales'] = 0; 
            $stats['total_payments'] = 0;
        }

        return Inertia::render('Dashboard', [
            'stats' => $stats
        ]);
    }
}