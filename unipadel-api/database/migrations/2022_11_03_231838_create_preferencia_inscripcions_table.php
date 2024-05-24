<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePreferenciaInscripcionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('inscripciones_preferencias', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('inscripcion_id');
            $table->integer('mon')->default(0);
            $table->integer('tue')->default(0);
            $table->integer('wed')->default(0);
            $table->integer('thu')->default(0);
            $table->integer('fri')->default(0);
            $table->integer('sat')->default(0);
            $table->integer('sun')->default(0);
            $table->time('inicio')->nullable();
            $table->time('fin')->nullable();
            $table->integer('todo_dia')->default(0);

            $table->foreign('inscripcion_id')->references('id')->on('inscripciones')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('inscripciones_preferencias');
    }
}
