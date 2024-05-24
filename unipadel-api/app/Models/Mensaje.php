<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mensaje extends Model
{
    use HasFactory;

    public $timestamps = false;

    public function idPartido(){
        return $this->belongsTo(Partido::class);
    }
    public function uidSender(){
        return $this->belongsTo(User::class);
    }
}
