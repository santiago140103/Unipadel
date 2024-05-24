<?php

use Illuminate\Support\Facades\DB;

Route::get('/test-connection', function () {
    try {
        DB::connection()->getPdo();
        return 'Connection successful';
    } catch (\Exception $e) {
        return 'Connection failed: ' . $e->getMessage();
    }
});
