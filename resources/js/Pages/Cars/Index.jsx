import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, cars }) {
    const isAdmin = auth.user.role === 'admin';
    const [search, setSearch] = useState('');
    const [editId, setEditId] = useState(null);

    const { data, setData, post, put, delete: destroy, reset } = useForm({
        brand: '', model: '', year: '', price: '', status: 'Available'
    });

    // Filter Logic
    const filteredCars = cars.filter(car => 
        car.brand.toLowerCase().includes(search.toLowerCase()) || 
        car.model.toLowerCase().includes(search.toLowerCase())
    );

    const startEdit = (car) => {
        setEditId(car.id);
        setData({ brand: car.brand, model: car.model, year: car.year, price: car.price, status: car.status });
    };

    const cancelEdit = () => {
        setEditId(null);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editId) {
            put(route('cars.update', editId), { onSuccess: () => cancelEdit() });
        } else {
            post(route('cars.store'), { onSuccess: () => reset() });
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl">Car Inventory</h2>}>
            <Head title="Cars" />
            <div className="py-12 px-4 max-w-7xl mx-auto">
                
                {isAdmin && (
                    <div className="bg-white p-6 rounded shadow mb-6">
                        <h3 className="text-lg font-bold mb-4">{editId ? 'Update Car' : 'Add New Car'}</h3>
                        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-6 gap-4">
                            <input type="text" placeholder="Brand" className="border p-2 rounded" value={data.brand} onChange={e => setData('brand', e.target.value)} required />
                            <input type="text" placeholder="Model" className="border p-2 rounded" value={data.model} onChange={e => setData('model', e.target.value)} required />
                            <input type="number" placeholder="Year" className="border p-2 rounded" value={data.year} onChange={e => setData('year', e.target.value)} required />
                            <input type="number" placeholder="Price" className="border p-2 rounded" value={data.price} onChange={e => setData('price', e.target.value)} required />
                            {editId && (
                                <select className="border p-2 rounded" value={data.status} onChange={e => setData('status', e.target.value)}>
                                    <option value="Available">Available</option>
                                    <option value="Sold">Sold</option>
                                </select>
                            )}
                            <div className="flex gap-2">
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">{editId ? 'Update' : 'Save'}</button>
                                {editId && <button type="button" onClick={cancelEdit} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>}
                            </div>
                        </form>
                    </div>
                )}

                {/* Search Bar */}
                <div className="mb-4">
                    <input type="text" placeholder="Search by brand or model..." className="w-full md:w-1/3 border p-2 rounded shadow-sm" 
                        value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>

                <div className="bg-white shadow rounded overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="p-4">Brand & Model</th>
                                <th className="p-4">Year</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCars.map(car => (
                                <tr key={car.id} className="border-b">
                                    <td className="p-4">{car.brand} {car.model}</td>
                                    <td className="p-4">{car.year}</td>
                                    <td className="p-4 font-semibold">₱{car.price}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs ${car.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {car.status}
                                        </span>
                                    </td>
                                    <td className="p-4 flex gap-3">
                                        {isAdmin ? (
                                            <>
                                                <button onClick={() => startEdit(car)} className="text-blue-600 hover:underline">Edit</button>
                                                <button onClick={() => confirm('Delete?') && destroy(route('cars.destroy', car.id))} className="text-red-600 hover:underline">Delete</button>
                                            </>
                                        ) : <span className="text-gray-400">View Only</span>}
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