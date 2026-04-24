<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $fillable = [
        'username',
        'full_name',
        'email',
        'password',
        'role',
        'is_active',
        'must_change_password',
        'tfa_code',
        'lockout_until',
        'failed_attempts',
    ];

    protected $hidden = ['password', 'tfa_code'];
}