<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTorneosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('torneos', function (Blueprint $table) {
            $table->id();

            $table->string('nombre');
            $table->date('fecha_inicio');
            $table->date('fecha_fin');
            $table->date('fecha_limite');
            $table->integer('formato')->default(1);
            $table->string('ciudad')->nullable();
            $table->string('club')->nullable();
            $table->integer('max_parejas');
            $table->float('precio')->nullable();
            $table->string('descripcion')->nullable();
            $table->integer('estado')->default(0);
            // $table->integer('en_juego')->default(0);
            $table->integer('calendario_generado')->default(0);

            $table->unsignedBigInteger('organizador_id');

            $table->foreign('organizador_id')->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('torneos');
    }
}
