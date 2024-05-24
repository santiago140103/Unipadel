<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        DB::table('users')->insert(
            [
                [
                    'name' => 'Organizador 1',
                    'email' => 'o@o.com',
                    'tipo' => 1
                ],
                [
                    'name' => 'Organizador 2',
                    'email' => 'o1@o.com',
                    'tipo' => 1
                ],
                [
                    'name' => 'Jugador 1',
                    'email' => 'j@j.com',
                    'tipo' => 0
                ],
                [
                    'name' => 'Jugador 2',
                    'email' => 'j1@j.com',
                    'tipo' => 0
                ],
                [
                    'name' => 'Jugador 3',
                    'email' => 'j2@j.com',
                    'tipo' => 0
                ]
            ]
        );

        // DB::table('users')->insert([
        //     'name' => 'Organizador 2',
        //     'email' => 'o1@o.com',
        //     'tipo' => 1
        // ]);
    }
}
