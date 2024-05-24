<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Horario extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'horarios';

    public function cancha(){
        return $this->belongsTo(Cancha::class, 'id_cancha');
    }
}
