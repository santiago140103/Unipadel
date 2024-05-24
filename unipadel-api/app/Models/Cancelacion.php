<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cancelacion extends Model
{
    use HasFactory;

    public $timestamps = false;

    public function idPartido(){
        return $this->belongsTo(Partido::class);
    }
    public function idPareja(){
        return $this->belongsTo(Pareja::class);
    }
}
