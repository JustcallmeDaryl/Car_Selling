import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    // CSS class for the active/inactive state in the sidebar
    const sidebarLinkClass = (active) => 
        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${
            active 
            ? 'bg-indigo-800 text-white shadow-inner' 
            : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
        }`;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* --- SIDEBAR (Desktop) --- */}
            <aside className="hidden md:flex flex-col w-64 bg-indigo-900 text-white fixed h-full shadow-xl z-20">
                <div className="p-4 flex items-center gap-3 bg-indigo-700 border-b border-indigo-800">
                    <Link href="/">
                        <ApplicationLogo className="block h-8 w-auto fill-current text-white" />
                    </Link>
                    <span className="font-bold text-lg tracking-mid">VEHICLE SYS</span>
                </div>  

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    <Link href={route('dashboard')} className={sidebarLinkClass(route().current('dashboard'))}>
                        <span className="mr-3">📊</span> Dashboard
                    </Link>
                    
                    <div className="pt-4 pb-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider px-4">
                        Management
                    </div>

                    <Link href={route('cars.index')} className={sidebarLinkClass(route().current('cars.*'))}>
                        <span className="mr-3">🚗</span> Cars
                    </Link>

                    <Link href={route('customers.index')} className={sidebarLinkClass(route().current('customers.*'))}>
                        <span className="mr-3">👥</span> Customers
                    </Link>

                    <Link href={route('sales.index')} className={sidebarLinkClass(route().current('sales.*'))}>
                        <span className="mr-3">💰</span> Sales
                    </Link>

                    <Link href={route('payments.index')} className={sidebarLinkClass(route().current('payments.*'))}>
                        <span className="mr-3">💳</span> Payments
                    </Link>
                </nav>

                <div className="p-4 border-t border-indigo-800 bg-indigo-950">
                    <div className="text-xs text-indigo-400 uppercase font-bold px-2 mb-2">System</div>
                    <Link href={route('profile.edit')} className={sidebarLinkClass(route().current('profile.edit'))}>
                        👤 Profile
                    </Link>
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
                
                {/* TOP NAVIGATION */}
                <nav className="bg-indigo-700 border-b border-indigo-800 sticky top-0 z-10 shadow-sm">
                    <div className="mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between items-center">
                            
                            {/* Mobile Toggle & Logo */}
                            <div className="flex items-center">
                                <div className="flex shrink-0 items-center md:hidden">
                                    <Link href="/">
                                        <ApplicationLogo className="block h-9 w-auto fill-current text-white" />
                                    </Link>
                                </div>
                                
                            </div>

                            {/* Right Side: User Dropdown */}
                            <div className="flex items-center">
                                <div className="ms-3 relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-800 px-4 py-2 text-sm font-medium leading-4 text-white transition duration-150 ease-in-out hover:bg-indigo-600 focus:outline-none"
                                                >
                                                    {user.name}
                                                    <svg className="-me-0.5 ms-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                            <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>

                                {/* Hamburger (Mobile only) */}
                                <div className="-me-2 flex items-center md:hidden">
                                    <button
                                        onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                        className="inline-flex items-center justify-center rounded-md p-2 text-indigo-100 hover:bg-indigo-600 hover:text-white focus:outline-none transition duration-150"
                                    >
                                        <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                            <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                            <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' md:hidden bg-indigo-800'}>
                        <div className="space-y-1 pb-3 pt-2">
                            <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>Dashboard</ResponsiveNavLink>
                            <ResponsiveNavLink href={route('cars.index')} active={route().current('cars.*')}>Cars</ResponsiveNavLink>
                            <ResponsiveNavLink href={route('customers.index')} active={route().current('customers.*')}>Customers</ResponsiveNavLink>
                        </div>
                        <div className="border-t border-indigo-700 pb-1 pt-4">
                            <div className="px-4 text-white">
                                <div className="text-base font-medium">{user.name}</div>
                                <div className="text-sm font-medium text-indigo-200">{user.email}</div>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* HEADER SECTION */}
                {header && (
                    <header className="bg-white shadow-sm border-b">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                {/* PAGE CONTENT */}
                <main className="p-6">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}