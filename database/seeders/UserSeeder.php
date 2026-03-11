<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
{
    // Admin Account
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
