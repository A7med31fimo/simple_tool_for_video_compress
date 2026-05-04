<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Force JSON responses for API requests to prevent HTML error pages
        \Illuminate\Support\Facades\Request::macro('wantsJson', function () {
            return true;
        });
    }
}
