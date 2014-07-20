/* global App, Ember */

App.TodosController = Ember.ArrayController.extend({
    orderAsc: false,
    sortProperties: ['date'],

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

    remaining: Ember.computed.filterBy('content', 'is_completed', false)

});