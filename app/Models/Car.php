<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    use HasFactory;

    protected $fillable = [
        'brand', 
        'model', 
        'year', 
        'price', 
        'status'
    ];

    // A car can have one sale record
    public function sale()
    {
        return $this->hasOne(Sale::class);
    }
}
