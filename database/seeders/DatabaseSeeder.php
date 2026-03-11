<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::create([
        'name' => 'System Admin',
        'email' => 'admin@system.com',
        'password' => Hash::make('admin123'),
        'role' => 'admin',
    ]);

    // Sales Agent Account
    User::create([
        'name' => 'Staff Agent',
        'email' => 'agent@system.com',
        'password' => Hash::make('agent123'),
        'role' => 'sales_agent',
    ]);
    }
}
