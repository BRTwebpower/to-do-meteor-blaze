import { Template } from 'meteor/templating';
import { TasksCollection } from '../db/TasksCollection';
import { ReactiveDict } from 'meteor/reactive-dict';

import './App.html';
import './Task.js';
// import "./Login.js";

const HIDE_COMPLETED_STRING = "hideCompleted";
const PRIORITY_CATEGORIES = [
  { value: 0, label: "Normal Priority" },
  { value: 1, label: "Level 1 Priority" },
  { value: 2, label: "Level 2 Priority" },
  { value: 3, label: "Level 3 Priority" }
];
// const IS_LOADING_STRING = "isLoading";

Template.mainContainer.onCreated(function mainContainerOnCreated() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    priority_options: [
      { value: 0, label: "Normal Priority" },
      { value: 1, label: "Level 1 Priority" },
      { value: 2, label: "Level 2 Priority" },
      { value: 3, label: "Level 3 Priority" }
    ]
  })
  
  // const handler = Meteor.subscribe('tasks');
  // Tracker.autorun(() => {
  //   this.state.set(IS_LOADING_STRING, !handler.ready());
  // });
});

// const getUser = () => Meteor.user();
// const isUserLogged = () => !!getUser();

// const getTasksFilter = () => {
//   const user = getUser();

//   const hideCompletedFilter = { isChecked: { $ne: true } };

//   const userFilter = user ? { userId: user._id } : {};

//   const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

//   return { userFilter, pendingOnlyFilter };
// }

Template.mainContainer.events({
  "click #hide-completed-button"(event, instance) {
    const currentHideCompleted = instance.state.get(HIDE_COMPLETED_STRING);
    instance.state.set(HIDE_COMPLETED_STRING, !currentHideCompleted);
  },

  // 'click .user'() {
  //   Meteor.logout();
  // },
});

Template.mainContainer.helpers({
  tasks() {
    const instance = Template.instance();
    
    // const { pendingOnlyFilter, userFilter } = getTasksFilter();

    // if (!isUserLogged()) {
    //   return [];
    // }

    const hideCompleted = instance.state.get(HIDE_COMPLETED_STRING);

    const hideCompletedFilter = { isChecked: { $ne: true } };
    
    let taskCollection =  TasksCollection.find(hideCompleted ? hideCompletedFilter : {}, {
      sort: { priority: -1 },
    }).fetch();
    // console.log('taskCollection : ', taskCollection);

    let sortedTasks = [];
    if (taskCollection.length) {
      // transform collection result into with priority as object keys as classification 
      let taskList = Object.groupBy(taskCollection, ({ priority }) => priority);
      // console.log('tasklist : ', tasksList);

      // again re-arrange data to form {{#each}} iterable object
      sortedTasks = Object.keys(taskList).map(priority => ({
        priority,
        tasks: taskList[priority]
      }));
    }
    // console.log('sortedTasks : ', sortedTasks);
    return sortedTasks;
  },

  hideCompleted() {
    return Template.instance().state.get(HIDE_COMPLETED_STRING);
  },

  incompleteCount() {
    // if (!isUserLogged()) {
    //   return '';
    // }

    // const { pendingOnlyFilter } = getTasksFilter();

    const incompleteTasksCount = TasksCollection.find({
      isChecked: { $ne: true },
    }).count();

    return incompleteTasksCount ? `(${incompleteTasksCount})` : '';
  },

  priorityLabels(priorityVal) {
    let arrPriorites = {
      "0": "Normal Priority",
      "1": "Level 1 Priority",
      "2": "Level 2 Priority",
      "3": "Level 3 Priority",
    };

    return arrPriorites[priorityVal];
  },

  // isUserLogged() {
  //   return isUserLogged();
  // },
  // getUser() {
  //   return getUser();
  // },
  // isLoading() {
  //   const instance = Template.instance();
  //   return instance.state.get(IS_LOADING_STRING);
  // }
});

Template.form.helpers({
  priorityCategories() {
    return PRIORITY_CATEGORIES;
  }
});

Template.form.events({
  "submit .task-form"(event) {
    event.preventDefault();

    const { target } = event;
    const text = target.text.value;
    const priority = ("" === target.priority.value) ? "0" : target.priority.value;
    
    // Insert a task into the collection
    // Meteor.call('tasks.insert', text, priority);

    TasksCollection.insert({
      text,
      priority,
      // userId: getUser()._id,
      createdAt: new Date(),
    });

    target.text.value = '';
    target.priority.value = "";
  }
});
