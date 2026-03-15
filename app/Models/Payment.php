<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'sale_id', 
        'payment_amount', 
        'payment_date', 
        'payment_type', 
        'payment_status'
    ];

    // A payment belongs to a specific sale
    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }
}
