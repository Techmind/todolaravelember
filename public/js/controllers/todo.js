/* global App, Ember */

App.TodoController = Ember.ObjectController.extend({
    // how much tiem should pass before item will be highlighted
    highlight_period: (3600 * 24) - 60,
    // each second redraw fillStyle property
    redraw_period: 60,
    isEditing: false,

    bufferedText: Ember.computed.oneWay('text'),

    actions: {
        deleteTodo: function () {
            var todo = this.get('model');

            todo.deleteRecord();
            todo.save();
        },

        editTodo: function () {
            this.set('isEditing', true);
        },

        cancelEditing: function() {
            this.set('bufferedText', this.get('text'));
            this.set('isEditing', false);
        },

        doneEditing: function() {
            var bufferedText = this.get('bufferedText').trim();

            if (!bufferedText) {
                this.send('deleteTodo');
            } else {
                var todo = this.get('model');
                todo.set('text', bufferedText);
                todo.save();
            }

            // Re-set newly edited title to persist it's trimmed version
            this.set('bufferedText', bufferedText);
            this.set('isEditing', false);
        }
    },

    isCompleted: function(key, value){
        var todo = this.get('model');

        if (value === undefined) {
            // property being used as a getter
            return todo.get('is_completed');
        } else {
            // property being used as a setter
            todo.set('is_completed', value);
            todo.save();
            return value;
        }
    }.property('model.is_completed'),
	
	init: function() {
		// needed to redraw each X seconds(in case enought time passes so row should be highlighted)
        this.tick();
    },
	
	// auto-save of data change realisation
	updateDate: function() {
        var todo = this.get('model');
        if (todo.get('isDirty')) {
            todo.save();
        }
    }.observes("model.date"),

	
	// free browser memory
	willDestroyElement: function() {
        var nextTick = this.get('nextTick');
        Ember.run.cancel(nextTick);
    },

	// rendering part
    fillColor: '#ff0000',
    borderColor: '#000000',

    fillStyle: function() {
        var today = new Date();
        var date = this.get('date');
        if (today.getTime() + this.get('highlight_period') * 1000 >= date.getTime()) {
          return 'border:1px solid red';
        }
        return '';
    }.property('date', 'model.date'),

	// redrawing dates in cycle
    tick: function() {
        var nextTick = Ember.run.later(this, function() {
            this.notifyPropertyChange('date');
            this.tick();
        }, 1000 * this.get('redraw_period'));
        this.set('nextTick', nextTick);
    },

});