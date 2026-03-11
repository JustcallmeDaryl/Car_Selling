<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Car;

class CarsSeeder extends Seeder
{
    public function run()
    {
        $cars = [
            ['brand' => 'Toyota', 'model' => 'Corolla', 'year' => 2020, 'price' => 20000, 'status' => 'Available'],
            ['brand' => 'Honda', 'model' => 'Civic', 'year' => 2019, 'price' => 22000, 'status' => 'Available'],
            ['brand' => 'Ford', 'model' => 'Mustang', 'year' => 2021, 'price' => 35000, 'status' => 'Available'],
            ['brand' => 'Chevrolet', 'model' => 'Camaro', 'year' => 2020, 'price' => 33000, 'status' => 'Available'],
            ['brand' => 'Nissan', 'model' => 'Altima', 'year' => 2018, 'price' => 18000, 'status' => 'Available'],
        ];

        foreach ($cars as $car) {
            Car::create($car);
        }
    }
}