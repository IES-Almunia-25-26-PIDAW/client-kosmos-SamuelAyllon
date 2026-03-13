<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminPaymentController;
use App\Http\Controllers\Admin\AdminSubscriptionController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\IdeaController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TutorialController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn() => inertia('welcome'))->name('home');

// ==================== RUTAS AUTENTICADAS (todos los roles) ====================
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('tutorial/complete', [TutorialController::class, 'complete'])->name('tutorial.complete');

    // Clientes — accesibles por TODOS (límite 1 para free en controlador)
    Route::resource('clients', ProjectController::class)
        ->parameters(['clients' => 'project']);
    Route::patch('clients/{project}/complete', [ProjectController::class, 'complete'])->name('clients.complete');

    // Tasks — SIN show
    Route::resource('tasks', TaskController::class)->except(['show']);
    Route::patch('tasks/{task}/complete', [TaskController::class, 'complete'])->name('tasks.complete');
    Route::patch('tasks/{task}/reopen', [TaskController::class, 'reopen'])->name('tasks.reopen');

    // Notes (antes Ideas) — SIN show
    Route::resource('notes', IdeaController::class)
        ->parameters(['notes' => 'idea'])
        ->except(['show']);
    Route::patch('notes/{idea}/resolve', [IdeaController::class, 'resolve'])->name('notes.resolve');
    Route::patch('notes/{idea}/reactivate', [IdeaController::class, 'reactivate'])->name('notes.reactivate');

    // Suscripción y checkout
    Route::get('subscription', [SubscriptionController::class, 'index'])->name('subscription.index');
    Route::get('checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('checkout', [CheckoutController::class, 'store'])->name('checkout.store');
});

// ==================== RUTAS PREMIUM (premium_user) — IA + Recursos ====================
Route::middleware(['auth', 'verified', 'role:premium_user'])->group(function () {
    // Recursos anidados bajo clientes
    Route::get('clients/{project}/resources/create', [ResourceController::class, 'create'])->name('resources.create');
    Route::post('clients/{project}/resources', [ResourceController::class, 'store'])->name('resources.store');
    Route::put('resources/{resource}', [ResourceController::class, 'update'])->name('resources.update');
    Route::patch('resources/{resource}', [ResourceController::class, 'update']);
    Route::delete('resources/{resource}', [ResourceController::class, 'destroy'])->name('resources.destroy');
});

// ==================== RUTAS ADMIN ====================
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::resource('users', AdminUserController::class)->only(['index', 'show', 'destroy']);
    Route::get('payments', [AdminPaymentController::class, 'index'])->name('payments.index');
    Route::get('subscriptions', [AdminSubscriptionController::class, 'index'])->name('subscriptions.index');
});

require __DIR__.'/settings.php';
