import { Template } from 'meteor/templating';
import { TasksCollection } from '../db/TasksCollection';

import './Task.html';
Template.task.onCreated(function TaskOnCreated() {
    const instance = Template.instance();
});

Template.task.events({
    'click .toggle-checked'() {
        TasksCollection.update(this._id, {
            $set: { isChecked: !this.isChecked },
        });
    },
    'click .delete'() {
        TasksCollection.remove(this._id);
    },
    'click .edit'(e,t) {
        t.$('#edit-' + this._id).toggle("slide");
    },
    'click .cancel'(e,t) {
        t.$('#edit-' + this._id).toggle("slide");
    },
    // edit task and update
    "submit .listtask-form"(event,t) {
        event.preventDefault();
        
        const { target } = event;
        const text = target.text.value;
        const priority = ("" === target.priority.value) ? "0" : target.priority.value;
        
        // Insert a task into the collection
        // Meteor.call('tasks.insert', text, priority);

        TasksCollection.update(this._id, {
            text,
            priority,
            createdAt: new Date(),
        });
        t.$('#edit-' + this._id).toggle("slide");
    }
});

Template.task.helpers({
    isSelected(optionValue) {
        return (optionValue == Template.instance().data.priority) ? "selected" : "";
    },

    taskPriorityCategories() {
        return [
            { value: 0, label: "Normal Priority" },
            { value: 1, label: "Level 1 Priority" },
            { value: 2, label: "Level 2 Priority" },
            { value: 3, label: "Level 3 Priority" }
        ];
    }
});