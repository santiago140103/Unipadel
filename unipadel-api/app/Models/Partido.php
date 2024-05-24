<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Partido extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'partidos';

    public function horario(){
        return $this->belongsTo(Horario::class);
    }

    public function pareja1(){
        return $this->belongsTo(Pareja::class, 'p1');
    }

    public function pareja2(){
        return $this->belongsTo(Pareja::class, 'p2');
    }

    public function torneo(){
        return $this->belongsTo(Torneo::class);
    }

    public function jornada(){
        return $this->belongsTo(Jornada::class);
    }
}
