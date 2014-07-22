<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::resource('todos', 'TodosController');

// aren`t worth it`s own controller
Route::get('/listen/{id}', function ($id) {
    // async nobody will notice small delay anyway, garbage collecy dead queues
    // this should be cron-worker, but seems to much for simple test app
    if (rand(0, 10) == 0) {
        $upd = new TodoUpdate();
        $upd->cleanup();
    }
    $response = new Symfony\Component\HttpFoundation\StreamedResponse(function() use ($id) {
        $upd = new TodoUpdate();
        $timeout = $real_timeout = 20;
        $start = time();

        while ($timeout && $res = $upd->listen($id, $timeout)) {
            $timeout = $start + $real_timeout - time();

            if (count($res)) {
                echo 'data: ' . json_encode($res) . "\n\n";
                ob_flush();
                flush();
                // poor man`s event sourcing, actullay long polling
                return;
            }
        }
    });

    $response->headers->set('Content-Type', 'text/event-stream');
    return $response;

});

Route::get('/', function()
{
    $upd = new TodoUpdate();
    $id = $upd->getQueueId();
	return View::make('home', array('id' => $id));
});