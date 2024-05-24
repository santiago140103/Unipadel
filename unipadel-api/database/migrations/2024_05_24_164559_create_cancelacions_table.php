<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCancelacionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cancelacions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('idPareja')->default(0);
            $table->unsignedBigInteger('idPartido')->default(0);
            $table->text('date');
            $table->integer('estado')->default(0);

            $table->foreign('idPareja')->references('id')->on('parejas')->onUpdate('no action')->onDelete('no action');
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
        Schema::dropIfExists('cancelacions');
    }
}
