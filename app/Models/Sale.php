<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id', 
        'car_id', 
        'sale_date', 
        'total_price'
    ];

    // A sale belongs to one customer
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    // A sale belongs to one specific car
    public function car()
    {
        return $this->belongsTo(Car::class);
    }

    // A sale can have multiple payment installments
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
