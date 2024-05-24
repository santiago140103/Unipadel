<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateIntegrantesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('integrantes', function (Blueprint $table) {
            $table->id();
                
            $table->unsignedBigInteger('id_pareja');
            $table->unsignedBigInteger('id_jugador');
            
            $table->foreign('id_pareja')->references('id')->on('parejas')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('id_jugador')->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('integrantes');
    }
}
