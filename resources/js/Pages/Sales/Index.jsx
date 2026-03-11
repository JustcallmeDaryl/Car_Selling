import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, sales, customers, availableCars }) {
    const isAdmin = auth.user.role === 'admin';
    const [search, setSearch] = useState('');

    const { data, setData, post, delete: destroy, reset } = useForm({
        customer_id: '',
        car_id: '',
        sale_date: '',
        total_price: ''
    });

    // --- NEW LOGIC: Auto-populate Price ---
    const handleCarChange = (e) => {
        const selectedCarId = e.target.value;
        
        // Find the car object from the availableCars list
        const selectedCar = availableCars.find(car => car.id == selectedCarId);

        if (selectedCar) {
            // Update both ID and Price simultaneously
            setData({
                ...data,
                car_id: selectedCarId,
                total_price: selectedCar.price
            });
        } else {
            setData('car_id', '');
            setData('total_price', '');
        }
    };

    const filteredSales = sales.filter(s =>
        s.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        s.car.brand.toLowerCase().includes(search.toLowerCase())
    );

    const submit = (e) => {
        e.preventDefault();
        post(route('sales.store'), { onSuccess: () => reset() });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl">Sales History</h2>}>
            <Head title="Sales" />
            <div className="py-12 px-4 max-w-7xl mx-auto space-y-6">
                
                {/* Record Sale Form */}
                <div className="bg-white p-6 rounded shadow border-t-4 border-green-500">
                    <h3 className="text-lg font-bold mb-4">Record New Sale</h3>
                    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        
                        {/* Customer Select */}
                        <select className="border p-2 rounded" value={data.customer_id} onChange={e => setData('customer_id', e.target.value)} required>
                            <option value="">Customer</option>
                            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>

                        {/* Car Select - Now uses handleCarChange */}
                        <select className="border p-2 rounded" value={data.car_id} onChange={handleCarChange} required>
                            <option value="">Car</option>
                            {availableCars.map(car => (
                                <option key={car.id} value={car.id}>
                                    {car.brand} {car.model}
                                </option>
                            ))}
                        </select>

                        {/* Date Input */}
                        <input type="date" className="border p-2 rounded" value={data.sale_date} onChange={e => setData('sale_date', e.target.value)} required />

                        {/* Price Input - Now automatically updated when Car is selected */}
                        <input 
                            type="number" 
                            placeholder="Price" 
                            className="border p-2 rounded bg-gray-50" 
                            value={data.total_price} 
                            onChange={e => setData('total_price', e.target.value)} 
                            required 
                        />

                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
                    </form>
                </div>

                {/* Search Bar */}
                <input type="text" placeholder="Search by customer or car..." className="w-full md:w-1/3 border p-2 rounded shadow-sm" value={search} onChange={(e) => setSearch(e.target.value)} />

                {/* Sales Table */}
                <div className="bg-white shadow rounded overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Car</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSales.map(sale => (
                                <tr key={sale.id} className="border-b">
                                    <td className="p-4">{sale.customer.name}</td>
                                    <td className="p-4">{sale.car.brand} {sale.car.model}</td>
                                    <td className="p-4">{sale.sale_date}</td>
                                    <td className="p-4 font-bold text-green-700">₱{parseFloat(sale.total_price).toLocaleString()}</td>
                                    <td className="p-4">
                                        {isAdmin ? (
                                            <button onClick={() => confirm('Void Sale?') && destroy(route('sales.destroy', sale.id))} className="text-red-500 font-bold">Void Sale</button>
                                        ) : <span className="text-gray-400 text-sm">No Permissions</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}