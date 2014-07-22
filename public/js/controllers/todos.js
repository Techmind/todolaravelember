/* global App, Ember */

App.TodosController = Ember.ArrayController.extend({
    orderAsc: false,
    sortProperties: ['date'],
    source: null,

    actions: {
        createTodo: function () {
            var todoText, todo;

            todoText = this.get('todoText').trim();

            if (!todoText) {
                return;
            }

            var obj = jsParseDate(todoText);

            todo = this.store.createRecord('todo', {
                text: obj.rest,
                date: obj.date,
                is_completed: false
            });

            todo.save();

            this.set('todoText', '');
        },

        orderToggle: function () {
            this.set('sortProperties', ['date']);
            this.set('sortAscending', this.get('orderAsc'));

            this.set('orderAsc', !this.get('orderAsc'));
        }
    },

    remaining: Ember.computed.filterBy('content', 'is_completed', false),


    init: function() {
        var that = this;
        this._super();
        if(typeof(EventSource)!=="undefined"){
            this.source = new EventSource("/listen/" + es_id);
            this.source.onmessage=function(event){
                var data = $.parseJSON(event.data);
                for (var i = 0; i < data.length; i++) {
                    that.replaceTodo(data[i][0], data[i][1]);
                }
            }
        }
    },

    replaceTodo: function (todo_cmd, todo_id) {
        var cmd = todo_cmd;
        var updated = this.store.find('todo', todo_id);
        updated.then(function(todo) {
            if (cmd == 'upd') {
                todo.reload();
            } else if (cmd == 'del') {
                todo.deleteRecord();
            }
        });
    }

});