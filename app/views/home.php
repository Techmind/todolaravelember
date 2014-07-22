<!DOCTYPE html>
<html class="no-js">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>Laravel 4 + EmberJS Todo</title>
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.1/css/bootstrap.min.css">
    <link rel="stylesheet" href="/css/styles.css">
    <link rel="stylesheet" href="http://dbushell.github.io/Pikaday/css/pikaday.css">
</head>
<body>

    <script type="text/x-handlebars">
        <div class="container">
            <div class="row">
                <div class="span6 offset3">
                    <header class="app-header">
                        <h1 class="app-title">todo</h1>
                    </header>
                    {{outlet}}
                </div>
                <div class="span6 offset3">
                    <div class="info">
                        <p>Кликни два раза для редактирования</p>
                    </div>
                </div>
            </div>
        </div>
    </script>

    <script type="text/x-handlebars" id="todos">
        <div class="main">
            <form {{action "createTodo" on="submit"}}>
                {{input id="new-todo" class="input-todo input-block-level" placeholder="'Сделать завтра в 5:20', enter" value=todoText}}
            </form>
            <ul class="todo-list unstyled">
            {{#each controller itemController="todo"}}
                <li {{bind-attr class=":clearfix isCompleted:completed"}} {{bind-attr style=fillStyle}}>
                {{#if isEditing}}
                    {{edit-todo class="input-block-level" value=bufferedText insert-newline="doneEditing" focus-out="cancelEditing" escape-press="cancelEditing"}}
                {{else}}
                    {{input type="checkbox" class="todo-checkbox" checked=isCompleted}}
                    <span class="todo" {{action "editTodo" on="doubleClick"}}>{{text}}</span>
                    {{view App.DateField date=date class="todo-date"}}
                    <button class="delete" {{action "deleteTodo"}}><i class="icon-trash"></i></button>
                {{/if}}
                </li>
            {{else}}
                <p>Добавь себе todo сверху!</p>
            {{/each}}
            </ul>
        </div>
        <footer class="details clearfix">
            <span class="remaining pull-left">
                <strong>{{remaining.length}}</strong> осталось
            </span>
            <ul class="filters unstyled pull-right">
                <li>
                    {{#link-to "todos.index"}}Все{{/link-to}}
                </li>
                <li>
                    {{#link-to "todos.completed"}}Выполненные{{/link-to}}
                </li>
                <li>
                    {{#link-to "todos.remaining"}}Оставшиеся{{/link-to}}
                </li>
            </ul>
            <span class="order pull-right">
                Порядок <a href="#" {{bind-attr class=":order-direction orderAsc:ascending"}} {{action "orderToggle"}}></a>
            </span>
        </footer>
    </script>

    <script>
        var es_id = <?php echo $id;?>;
    </script>

    <script src="//momentjs.com/downloads/moment-with-langs.min.js"></script>
    <script src="//code.jquery.com/jquery-1.10.2.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.3.0/handlebars.min.js"></script>
    <script src="//builds.emberjs.com/tags/v1.3.1/ember.min.js"></script>
    <script src="//builds.emberjs.com/tags/v1.0.0-beta.6/ember-data.min.js"></script>
    <script src="/js/vendor/eventsource.min.js"></script>
    <script src="/js/app.js"></script>
    <script src="/js/router.js"></script>
    <script src="/js/models/todo.js"></script>
    <script src="/js/controllers/todo.js"></script>
    <script src="/js/controllers/todos.js"></script>
    <script src="/js/views/edit_todo.js"></script>
    <script src="/js/views/todos_view.js"></script>
    <script src="/js/helpers/helpers.js"></script>
    <script src="//dbushell.github.io/Pikaday/pikaday.js"></script>

</body>
</html>
