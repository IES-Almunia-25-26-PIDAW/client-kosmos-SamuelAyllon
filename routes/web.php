<?php

use App\Http\Controllers\Ai\ClientSummaryAction;
use App\Http\Controllers\Ai\ClientUpdateAction;
use App\Http\Controllers\Ai\PlanDayAction;
use App\Http\Controllers\Admin\AdminDashboard\IndexAction as AdminDashboardIndexAction;
use App\Http\Controllers\Admin\AdminPayment\IndexAction as AdminPaymentIndexAction;
use App\Http\Controllers\Admin\AdminSubscription\IndexAction as AdminSubscriptionIndexAction;
use App\Http\Controllers\Admin\AdminUser\DestroyAction as AdminUserDestroyAction;
use App\Http\Controllers\Admin\AdminUser\IndexAction as AdminUserIndexAction;
use App\Http\Controllers\Admin\AdminUser\ShowAction as AdminUserShowAction;
use App\Http\Controllers\Checkout\IndexAction as CheckoutIndexAction;
use App\Http\Controllers\Checkout\StoreAction as CheckoutStoreAction;
use App\Http\Controllers\Dashboard\IndexAction as DashboardIndexAction;
use App\Http\Controllers\Idea\CreateAction as IdeaCreateAction;
use App\Http\Controllers\Idea\DestroyAction as IdeaDestroyAction;
use App\Http\Controllers\Idea\EditAction as IdeaEditAction;
use App\Http\Controllers\Idea\IndexAction as IdeaIndexAction;
use App\Http\Controllers\Idea\ReactivateAction as IdeaReactivateAction;
use App\Http\Controllers\Idea\ResolveAction as IdeaResolveAction;
use App\Http\Controllers\Idea\StoreAction as IdeaStoreAction;
use App\Http\Controllers\Idea\UpdateAction as IdeaUpdateAction;
use App\Http\Controllers\Project\CompleteAction as ProjectCompleteAction;
use App\Http\Controllers\Project\CreateAction as ProjectCreateAction;
use App\Http\Controllers\Project\DestroyAction as ProjectDestroyAction;
use App\Http\Controllers\Project\EditAction as ProjectEditAction;
use App\Http\Controllers\Project\IndexAction as ProjectIndexAction;
use App\Http\Controllers\Project\ShowAction as ProjectShowAction;
use App\Http\Controllers\Project\StoreAction as ProjectStoreAction;
use App\Http\Controllers\Project\UpdateAction as ProjectUpdateAction;
use App\Http\Controllers\Resource\CreateAction as ResourceCreateAction;
use App\Http\Controllers\Resource\DestroyAction as ResourceDestroyAction;
use App\Http\Controllers\Resource\StoreAction as ResourceStoreAction;
use App\Http\Controllers\Resource\UpdateAction as ResourceUpdateAction;
use App\Http\Controllers\Subscription\IndexAction as SubscriptionIndexAction;
use App\Http\Controllers\Task\CompleteAction as TaskCompleteAction;
use App\Http\Controllers\Task\CreateAction as TaskCreateAction;
use App\Http\Controllers\Task\DestroyAction as TaskDestroyAction;
use App\Http\Controllers\Task\EditAction as TaskEditAction;
use App\Http\Controllers\Task\IndexAction as TaskIndexAction;
use App\Http\Controllers\Task\ReopenAction as TaskReopenAction;
use App\Http\Controllers\Task\StoreAction as TaskStoreAction;
use App\Http\Controllers\Task\UpdateAction as TaskUpdateAction;
use App\Http\Controllers\Tutorial\CompleteAction as TutorialCompleteAction;
use Illuminate\Support\Facades\Route;

Route::get('/', fn() => inertia('welcome'))->name('home');

// GET /logout redirige amigablemente en lugar de lanzar 405
Route::get('logout', fn() => redirect('/login'));

// ==================== RUTAS AUTENTICADAS (todos los roles) ====================
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardIndexAction::class)->name('dashboard');
    Route::post('tutorial/complete', TutorialCompleteAction::class)->name('tutorial.complete');

    // Kosmo — Inteligencia Artificial
    Route::get('kosmo', fn() => inertia('kosmo/index'))->name('kosmo.index');

    // Cobros — Billing
    Route::get('billing', fn() => inertia('billing/index'))->name('billing.index');

    // Ajustes — Settings
    Route::get('settings', fn() => inertia('settings/index'))->name('settings.index');

    // Clientes — accesibles por TODOS (límite 1 para free en controlador)
    Route::get('clients', ProjectIndexAction::class)->name('clients.index');
    Route::get('clients/create', ProjectCreateAction::class)->name('clients.create');
    Route::post('clients', ProjectStoreAction::class)->name('clients.store');
    Route::get('clients/{project}', ProjectShowAction::class)->name('clients.show');
    Route::get('clients/{project}/edit', ProjectEditAction::class)->name('clients.edit');
    Route::put('clients/{project}', ProjectUpdateAction::class)->name('clients.update');
    Route::patch('clients/{project}', ProjectUpdateAction::class);
    Route::delete('clients/{project}', ProjectDestroyAction::class)->name('clients.destroy');
    Route::patch('clients/{project}/complete', ProjectCompleteAction::class)->name('clients.complete');

    // Tasks — SIN show
    Route::get('tasks', TaskIndexAction::class)->name('tasks.index');
    Route::get('tasks/create', TaskCreateAction::class)->name('tasks.create');
    Route::post('tasks', TaskStoreAction::class)->name('tasks.store');
    Route::get('tasks/{task}/edit', TaskEditAction::class)->name('tasks.edit');
    Route::put('tasks/{task}', TaskUpdateAction::class)->name('tasks.update');
    Route::patch('tasks/{task}', TaskUpdateAction::class);
    Route::delete('tasks/{task}', TaskDestroyAction::class)->name('tasks.destroy');
    Route::patch('tasks/{task}/complete', TaskCompleteAction::class)->name('tasks.complete');
    Route::patch('tasks/{task}/reopen', TaskReopenAction::class)->name('tasks.reopen');

    // Ideas — SIN show
    Route::get('ideas', IdeaIndexAction::class)->name('ideas.index');
    Route::get('ideas/create', IdeaCreateAction::class)->name('ideas.create');
    Route::post('ideas', IdeaStoreAction::class)->name('ideas.store');
    Route::get('ideas/{idea}/edit', IdeaEditAction::class)->name('ideas.edit');
    Route::put('ideas/{idea}', IdeaUpdateAction::class)->name('ideas.update');
    Route::patch('ideas/{idea}', IdeaUpdateAction::class);
    Route::delete('ideas/{idea}', IdeaDestroyAction::class)->name('ideas.destroy');
    Route::patch('ideas/{idea}/resolve', IdeaResolveAction::class)->name('ideas.resolve');
    Route::patch('ideas/{idea}/reactivate', IdeaReactivateAction::class)->name('ideas.reactivate');

    // Suscripción y checkout
    Route::get('subscription', SubscriptionIndexAction::class)->name('subscription.index');
    Route::get('checkout', CheckoutIndexAction::class)->name('checkout.index');
    Route::post('checkout', CheckoutStoreAction::class)->name('checkout.store');
});

// ==================== RUTAS PREMIUM (premium_user) — IA + Recursos ====================
Route::middleware(['auth', 'verified', 'role:premium_user'])->group(function () {
    // IA contextual
    Route::post('ai/plan-day', PlanDayAction::class)->name('ai.plan-day');
    Route::post('ai/client-summary/{project}', ClientSummaryAction::class)->name('ai.client-summary');
    Route::post('ai/client-update/{project}', ClientUpdateAction::class)->name('ai.client-update');

    // Recursos anidados bajo clientes
    Route::get('clients/{project}/resources/create', ResourceCreateAction::class)->name('resources.create');
    Route::post('clients/{project}/resources', ResourceStoreAction::class)->name('resources.store');
    Route::put('resources/{resource}', ResourceUpdateAction::class)->name('resources.update');
    Route::patch('resources/{resource}', ResourceUpdateAction::class);
    Route::delete('resources/{resource}', ResourceDestroyAction::class)->name('resources.destroy');
});

// ==================== RUTAS ADMIN ====================
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', AdminDashboardIndexAction::class)->name('dashboard');
    Route::get('users', AdminUserIndexAction::class)->name('users.index');
    Route::get('users/{user}', AdminUserShowAction::class)->name('users.show');
    Route::delete('users/{user}', AdminUserDestroyAction::class)->name('users.destroy');
    Route::get('payments', AdminPaymentIndexAction::class)->name('payments.index');
    Route::get('subscriptions', AdminSubscriptionIndexAction::class)->name('subscriptions.index');
});

require __DIR__.'/settings.php';
