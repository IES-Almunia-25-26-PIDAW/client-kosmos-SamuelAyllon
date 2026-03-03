<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminPaymentController;
use App\Http\Controllers\Admin\AdminSubscriptionController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\AiChatController;
use App\Http\Controllers\BoxController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\IdeaController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TutorialController;
use App\Http\Controllers\VoiceRecordingController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn() => inertia('welcome'))->name('home');

// ==================== RUTAS AUTENTICADAS (todos los roles) ====================
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('tutorial/complete', [TutorialController::class, 'complete'])->name('tutorial.complete');

    Route::resource('tasks', TaskController::class)->except(['show']);
    Route::patch('tasks/{task}/complete', [TaskController::class, 'complete'])->name('tasks.complete');
    Route::patch('tasks/{task}/reopen', [TaskController::class, 'reopen'])->name('tasks.reopen');

    Route::resource('ideas', IdeaController::class)->except(['show']);
    Route::patch('ideas/{idea}/resolve', [IdeaController::class, 'resolve'])->name('ideas.resolve');
    Route::patch('ideas/{idea}/reactivate', [IdeaController::class, 'reactivate'])->name('ideas.reactivate');

    Route::get('subscription', [SubscriptionController::class, 'index'])->name('subscription.index');
    Route::get('checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('checkout', [CheckoutController::class, 'store'])->name('checkout.store');
});

// ==================== RUTAS PREMIUM (premium_user) ====================
Route::middleware(['auth', 'verified', 'role:premium_user'])->group(function () {
    Route::resource('projects', ProjectController::class);
    Route::patch('projects/{project}/complete', [ProjectController::class, 'complete'])->name('projects.complete');

    Route::resource('boxes', BoxController::class);

    // Resources anidados bajo boxes para create/store, standalone para edit/update/destroy
    Route::get('boxes/{box}/resources/create', [ResourceController::class, 'create'])->name('resources.create');
    Route::post('boxes/{box}/resources', [ResourceController::class, 'store'])->name('resources.store');
    Route::get('resources/{resource}/edit', [ResourceController::class, 'edit'])->name('resources.edit');
    Route::put('resources/{resource}', [ResourceController::class, 'update'])->name('resources.update');
    Route::patch('resources/{resource}', [ResourceController::class, 'update']);
    Route::delete('resources/{resource}', [ResourceController::class, 'destroy'])->name('resources.destroy');

    Route::post('voice/transcribe', [VoiceRecordingController::class, 'transcribe'])->name('voice.transcribe');

    Route::get('ai-chats', [AiChatController::class, 'index'])->name('ai-chats.index');
    Route::post('ai-chats', [AiChatController::class, 'store'])->name('ai-chats.store');
    Route::delete('ai-chats', [AiChatController::class, 'destroy'])->name('ai-chats.destroy');
});

// ==================== RUTAS ADMIN ====================
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::resource('users', AdminUserController::class)->only(['index', 'show', 'destroy']);
    Route::get('payments', [AdminPaymentController::class, 'index'])->name('payments.index');
    Route::get('subscriptions', [AdminSubscriptionController::class, 'index'])->name('subscriptions.index');
});

require __DIR__.'/settings.php';
