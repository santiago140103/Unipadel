<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Torneo extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'torneos';

    public function canchas(){
        return $this->hasMany(Cancha::class, 'id_torneo', 'id');
    }
}
