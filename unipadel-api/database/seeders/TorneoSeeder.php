<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TorneoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('torneos')->insert([
            [
                "estado" => 1,
                "ciudad" => "Las Palmas de Gran Canaria",
                "club" => "Club Sánchez",
                "descripcion" => "Descripción de prueba del torneo",
                "fecha_fin" => "2022-12-23",
                "fecha_inicio" => "2022-11-19",
                "fecha_limite" => "2022-11-15",
                "formato" => 1,
                "max_parejas" => "12",
                "nombre" => "Torneo del Rector 2022",
                "organizador_id" => "1",
                "precio" => "12",
            ]
        ]);
        DB::table('torneos')->insert([
            [
                "estado" => 0,
                "ciudad" => "Las Palmas de Gran Canaria",
                "club" => "Club Sánchez",
                "descripcion" => "Descripción de prueba del torneo",
                "fecha_fin" => "2022-12-30",
                "fecha_inicio" => "2022-11-20",
                "fecha_limite" => "2022-11-15",
                "formato" => 1,
                "max_parejas" => "12",
                "nombre" => "Triangular Doble FFP",
                "organizador_id" => "1",
                "precio" => "12",
                // "en_juego" => "1"
            ]
        ]);
    }
}
