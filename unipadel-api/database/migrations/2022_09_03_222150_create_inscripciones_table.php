<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInscripcionesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('inscripciones', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('torneo_id');
            $table->unsignedBigInteger('pareja_id');
            $table->boolean('validated')->default(0);
            $table->integer('p_jugados')->default(0);
            $table->integer('p_ganados')->default(0);
            $table->integer('p_perdidos')->default(0);
            $table->integer('s_ganados')->default(0);
            $table->integer('s_perdidos')->default(0);

            $table->foreign('torneo_id')->references('id')->on('torneos')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('pareja_id')->references('id')->on('parejas')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('inscripciones');
    }
}
