import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, payments, sales }) {
    const isAdmin = auth.user.role === 'admin';
    const [search, setSearch] = useState('');
    const [editId, setEditId] = useState(null);

    const { data, setData, post, put, delete: destroy, reset } = useForm({
        sale_id: '', 
        payment_amount: '', 
        payment_date: '', 
        payment_type: 'Full', 
        payment_status: 'Paid'
    });

    const filteredPayments = payments.filter(p => 
        p.sale.customer.name.toLowerCase().includes(search.toLowerCase())
    );

    const startEdit = (p) => {
        setEditId(p.id);
        setData({
            sale_id: p.sale_id,
            payment_amount: p.payment_amount,
            payment_date: p.payment_date,
            payment_type: p.payment_type || 'Full',
            payment_status: p.payment_status
        });
    };

    const cancelEdit = () => {
        setEditId(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editId) {
            put(route('payments.update', editId), { 
                onSuccess: () => { setEditId(null); reset(); } 
            });
        } else {
            post(route('payments.store'), { 
                onSuccess: () => reset() 
            });
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl">Payment Tracking</h2>}>
            <Head title="Payments" />
            <div className="py-12 px-4 max-w-7xl mx-auto space-y-6">
                
                {/* Add / Edit Form */}
                <div className="bg-white p-6 rounded shadow border-t-4 border-yellow-500">
                    <h3 className="text-lg font-bold mb-4">
                        {editId ? 'Edit Payment Record' : 'Add New Payment'}
                    </h3>
                    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-6 gap-3">
                        <select className="border p-2 rounded col-span-2" value={data.sale_id} onChange={e => setData('sale_id', e.target.value)} required>
                            <option value="">Select Sale</option>
                            {sales.map(s => <option key={s.id} value={s.id}>{s.customer.name} - {s.car.brand} (₱{parseFloat(s.total_price).toLocaleString()})</option>)}
                        </select>
                        
                        <input type="number" placeholder="Amount" className="border p-2 rounded" 
                            value={data.payment_amount} onChange={e => setData('payment_amount', e.target.value)} required />
                        
                        <input type="date" className="border p-2 rounded" 
                            value={data.payment_date} onChange={e => setData('payment_date', e.target.value)} required />
                        
                        <select className="border p-2 rounded" value={data.payment_status} onChange={e => setData('payment_status', e.target.value)}>
                            <option value="Paid">Paid</option>
                            <option value="Pending">Pending / Installment</option>
                        </select>
                        
                        <div className="flex gap-2">
                            <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded font-bold hover:bg-yellow-700 w-full">
                                {editId ? 'Update' : 'Save'}
                            </button>
                            {editId && (
                                <button type="button" onClick={cancelEdit} className="bg-gray-500 text-white px-4 py-2 rounded">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Search Bar */}
                <input type="text" placeholder="Search by customer name..." className="w-full md:w-1/3 border p-2 rounded shadow-sm" 
                    value={search} onChange={(e) => setSearch(e.target.value)} />

                {/* Table */}
                <div className="bg-white shadow rounded overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Car Details</th>
                                <th className="p-4">Amount Paid / Total Price</th> {/* Updated Header */}
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.map(p => (
                                <tr key={p.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4">{p.sale.customer.name}</td>
                                    <td className="p-4 text-sm text-gray-600">{p.sale.car.brand} {p.sale.car.model}</td>
                                    
                                    {/* Updated Amount Column */}
                                    <td className="p-4">
                                        <span className="font-bold text-blue-600">
                                            ₱{parseFloat(p.payment_amount).toLocaleString()}
                                        </span>
                                        <span className="text-gray-400 mx-1">/</span>
                                        <span className="text-gray-500 text-sm">
                                            ₱{parseFloat(p.sale.total_price).toLocaleString()}
                                        </span>
                                    </td>

                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${p.payment_status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {p.payment_status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-3">
                                        <button onClick={() => startEdit(p)} className="text-blue-600 hover:underline">Edit</button>
                                        
                                        {isAdmin ? (
                                            <button 
                                                onClick={() => confirm('Delete this record?') && destroy(route('payments.destroy', p.id))} 
                                                className="text-red-500 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        ) : (
                                            <span className="text-gray-300 text-xs">Protected</span>
                                        )}
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