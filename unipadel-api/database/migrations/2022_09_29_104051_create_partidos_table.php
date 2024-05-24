<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePartidosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('partidos', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('p1');
            $table->unsignedBigInteger('p2');
            $table->unsignedBigInteger('torneo_id');
            $table->unsignedBigInteger('jornada_id')->nullable();
            $table->unsignedBigInteger('horario_id')->nullable();
            $table->integer('estado')->default(0);
            $table->integer('puntos_p1')->default(0);
            $table->integer('puntos_p2')->default(0);
            $table->integer('pareja_propuesta_resultado')->nullable();
            $table->integer('propuesta')->nullable();
            //$table->unsignedBigInteger('horario_propuesto')->nullable();

            $table->timestamps();

            $table->foreign('p1')->references('id')->on('parejas')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('p2')->references('id')->on('parejas')->onUpdate('no action')->onDelete('no action');
            $table->foreign('torneo_id')->references('id')->on('torneos')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('horario_id')->references('id')->on('horarios')->onUpdate('no action')->onDelete('no action');
            $table->foreign('jornada_id')->references('id')->on('jornadas')->onUpdate('no action')->onDelete('no action');
            //$table->foreign('horario_propuesto')->references('id')->on('horarios')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('partidos');
    }
}
