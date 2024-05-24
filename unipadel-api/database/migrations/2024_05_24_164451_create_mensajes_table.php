<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMensajesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('mensajes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('uidSender')->default(0);
            $table->unsignedBigInteger('idPartido')->default(0);
            $table->text('content');
            $table->text('date');

            $table->foreign('uidSender')->references('id')->on('users')->onUpdate('no action')->onDelete('no action');
            $table->foreign('idPartido')->references('id')->on('partidos')->onUpdate('no action')->onDelete('no action');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('mensajes');
    }
}
