/* global App, DS */

App.Todo = DS.Model.extend({
    text: DS.attr('string'),
    date: DS.attr('date'),
    is_completed: DS.attr('boolean'),
});