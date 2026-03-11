import { Link } from '@inertiajs/react';

export default function Sidebar() {
    return (
        <div className="w-64 bg-gray-900 min-h-screen text-white p-4 hidden md:block">
            <div className="text-2xl font-bold mb-8 p-2 border-b border-gray-700">Car System</div>
            <nav className="space-y-2">
                <Link href={route('dashboard')} className="block p-3 hover:bg-gray-800 rounded">Dashboard</Link>
                <Link href={route('cars.index')} className="block p-3 hover:bg-gray-800 rounded">Cars Inventory</Link>
                <Link href={route('customers.index')} className="block p-3 hover:bg-gray-800 rounded">Customers List</Link>
                <Link href={route('sales.index')} className="block p-3 hover:bg-gray-800 rounded">Sales Records</Link>
                <Link href={route('payments.index')} className="block p-3 hover:bg-gray-800 rounded">Payments</Link>
            </nav>
        </div>
    );
}