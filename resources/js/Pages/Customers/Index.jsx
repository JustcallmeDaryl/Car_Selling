import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, customers }) {
    const isAdmin = auth.user.role === 'admin';
    const [search, setSearch] = useState('');
    const [editId, setEditId] = useState(null);

    const { data, setData, post, put, delete: destroy, reset } = useForm({
        name: '', phone: '', email: '', address: ''
    });

    // Updated search to include address filtering as well
    const filteredCustomers = customers.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase()) || 
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        (c.address && c.address.toLowerCase().includes(search.toLowerCase()))
    );

    const startEdit = (customer) => {
        setEditId(customer.id);
        setData({ 
            name: customer.name, 
            phone: customer.phone, 
            email: customer.email, 
            address: customer.address 
        });
    };

    const submit = (e) => {
        e.preventDefault();
        if (editId) {
            put(route('customers.update', editId), { onSuccess: () => { setEditId(null); reset(); } });
        } else {
            post(route('customers.store'), { onSuccess: () => reset() });
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl">Customer Management</h2>}>
            <Head title="Customers" />
            <div className="py-12 px-4 max-w-7xl mx-auto space-y-6">
                
                {/* Registration/Edit Form */}
                <div className="p-6 bg-white shadow rounded-lg">
                    <h3 className="text-lg font-medium mb-4">{editId ? 'Edit Customer' : 'Add New Customer'}</h3>
                    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <input type="text" placeholder="Name" className="border p-2 rounded" value={data.name} onChange={e => setData('name', e.target.value)} required />
                        <input type="text" placeholder="Phone" className="border p-2 rounded" value={data.phone} onChange={e => setData('phone', e.target.value)} required />
                        
                        {/* Address moved before Email */}
                        <input type="text" placeholder="Address" className="border p-2 rounded" value={data.address} onChange={e => setData('address', e.target.value)} />
                        
                        <input type="email" placeholder="Email" className="border p-2 rounded" value={data.email} onChange={e => setData('email', e.target.value)} required />
                        
                        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
                            {editId ? 'Update' : 'Save'}
                        </button>
                    </form>
                </div>

                {/* Search Input */}
                <input type="text" placeholder="Search by name, address, or email..." className="w-full md:w-1/3 border p-2 rounded shadow-sm" 
                    value={search} onChange={(e) => setSearch(e.target.value)} />

                {/* Customer Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 font-semibold">Name</th>
                                <th className="p-4 font-semibold">Phone</th>
                                <th className="p-4 font-semibold">Address</th> {/* Column Added */}
                                <th className="p-4 font-semibold">Email</th>
                                <th className="p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map(customer => (
                                <tr key={customer.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-4 font-medium">{customer.name}</td>
                                    <td className="p-4">{customer.phone}</td>
                                    <td className="p-4 text-gray-600">{customer.address || 'N/A'}</td> {/* Data Added */}
                                    <td className="p-4">{customer.email}</td>
                                    <td className="p-4 flex gap-4">
                                        <button onClick={() => startEdit(customer)} className="text-blue-600 hover:underline">Edit</button>
                                        
                                        {isAdmin ? (
                                            <button 
                                                onClick={() => confirm('Delete this customer?') && destroy(route('customers.destroy', customer.id))} 
                                                className="text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        ) : (
                                            <span className="text-gray-400 text-xs italic">Protected</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredCustomers.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-4 text-center text-gray-500">No customers found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}