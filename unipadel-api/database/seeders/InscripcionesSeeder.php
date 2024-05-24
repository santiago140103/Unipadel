<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InscripcionesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('inscripciones')->insert([
            [
                "pareja_id" => 1,
                "torneo_id" => 1,
            ]
        ]);
        DB::table('inscripciones')->insert([
            [
                "pareja_id" => 2,
                "torneo_id" => 1,
            ]
        ]);
        DB::table('inscripciones')->insert([
            [
                "pareja_id" => 3,
                "torneo_id" => 1,
            ]
        ]);
        DB::table('inscripciones')->insert([
            [
                "pareja_id" => 4,
                "torneo_id" => 1,
            ]
        ]);
        DB::table('inscripciones')->insert([
            [
                "pareja_id" => 5,
                "torneo_id" => 1,
            ]
        ]);
        DB::table('inscripciones')->insert([
            [
                "pareja_id" => 6,
                "torneo_id" => 1,
            ]
        ]);
        DB::table('inscripciones')->insert([
            [
                "pareja_id" => 7,
                "torneo_id" => 1,
            ]
        ]);
        DB::table('inscripciones')->insert([
            [
                "pareja_id" => 8,
                "torneo_id" => 1,
            ]
        ]);
    }
}
