import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
// Import Recharts components
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, Cell, Legend 
} from 'recharts';

export default function Dashboard({ auth, stats }) {
    const isAdmin = auth.user.role === 'admin';

    // COLORS matching your Indigo System Theme
    const COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc'];

    const chartData = stats.monthly_sales_data?.length > 0 
    ? stats.monthly_sales_data 
    : [{month: 'No Data', amount: 0}];

// 2. Ensure top cars isn't empty
const topCarsData = stats.top_cars_data?.length > 0 
    ? stats.top_cars_data 
    : [{model: 'None', sold_count: 0}];
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text">
                {isAdmin ? 'Admin Dashboard' : 'Sales Agent Dashboard'}
            </h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* STAT CARDS SECTION */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-blue-500">
                            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Cars</div>
                            <div className="text-3xl font-black text-gray-800">{stats.total_cars}</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-green-500">
                            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Available</div>
                            <div className="text-3xl font-black text-gray-800">{stats.available_cars}</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-red-500">
                            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Sold</div>
                            <div className="text-3xl font-black text-gray-800">{stats.sold_cars}</div>
                        </div>

                        {isAdmin && (
                            <>
                                <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-purple-500">
                                    <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Customers</div>
                                    <div className="text-3xl font-black text-gray-800">{stats.total_customers}</div>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-yellow-500">
                                    <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Revenue</div>
                                    <div className="text-3xl font-black text-gray-800">₱{stats.total_sales.toLocaleString()}</div>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-indigo-500">
                                    <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Payments</div>
                                    <div className="text-3xl font-black text-gray-800">₱{stats.total_payments.toLocaleString()}</div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* CHARTS SECTION */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        
                        {/* 1. MONTHLY SALES GRAPH (Line/Area Chart) */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-700 mb-6 flex items-center">
                                <span className="mr-2">📈</span> Monthly Sales Performance
                            </h3>
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats.monthly_sales_data}>
                                        <defs>
                                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="amount" 
                                            stroke="#4f46e5" 
                                            strokeWidth={3}
                                            fillOpacity={1} 
                                            fill="url(#colorSales)" 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* 2. MOST SOLD CARS (Bar Chart) */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-700 flex items-center">
                                    <span className="mr-2">🏆</span> Most Sold Car Models
                                </h3>
                            </div>
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.top_cars_data} layout="vertical" margin={{ left: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                                        <XAxis type="number" hide />
                                        <YAxis 
                                            dataKey="model" 
                                            type="category" 
                                            axisLine={false} 
                                            tickLine={false}
                                            tick={{fill: '#4b5563', fontWeight: 'bold', fontSize: 12}}
                                        />
                                        <Tooltip cursor={{fill: '#f9fafb'}} />
                                        <Bar dataKey="sold_count" radius={[0, 4, 4, 0]} barSize={20}>
                                            {stats.top_cars_data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}