<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'project_id',
        'project_name',
        'project_start',
        'project_end',
        'project_location',
        'project_duration',
        'project_services',
        'project_description',
        'created_by',
    ];
}