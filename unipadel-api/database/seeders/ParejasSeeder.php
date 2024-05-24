<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ParejasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('parejas')->insert([
            [
                "nombre" => "Los Pollos Hermanos"
            ]
        ]);
        DB::table('parejas')->insert([
            [
                "nombre" => "Cracks"
            ]
        ]);
        DB::table('parejas')->insert([
            [
                "nombre" => "Los Pepes"
            ]
        ]);
        DB::table('parejas')->insert([
            [
                "nombre" => "D"
            ]
        ]);
        DB::table('parejas')->insert([
            [
                "nombre" => "E"
            ]
        ]);
        DB::table('parejas')->insert([
            [
                "nombre" => "F"
            ]
        ]);
        DB::table('parejas')->insert([
            [
                "nombre" => "G"
            ]
        ]);
        DB::table('parejas')->insert([
            [
                "nombre" => "H"
            ]
        ]);
        DB::table('parejas')->insert([
            [
                "nombre" => "I"
            ]
        ]);
        DB::table('parejas')->insert([
            [
                "nombre" => "J"
            ]
        ]);
        DB::table('parejas')->insert([
            [
                "nombre" => "K"
            ]
        ]);
        DB::table('parejas')->insert([
            [
                "nombre" => "L"
            ]
        ]);

        DB::table('integrantes')->insert([
            [
                "id_pareja" => "1",
                "id_jugador" => "3",
            ]
        ]);
    }
}
