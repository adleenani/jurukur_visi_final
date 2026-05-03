<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// Model for consultation bookings.
class ConsultationBooking extends Model
{
    protected $fillable = [
        'reference_number',
        'name',
        'company_name',
        'email',
        'phone',
        'service_type',
        'preferred_date',
        'preferred_time',
        'consultation_type',
        'message',
        'status',
        'admin_response',
        'confirmed_date',
        'confirmed_time',
        'created_by',
    ];
}