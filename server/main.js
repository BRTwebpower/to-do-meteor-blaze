import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '../imports/db/TasksCollection';
// import { Accounts } from 'meteor/accounts-base';
// import '../imports/api/tasksMethods';
// import '../imports/api/tasksPublications';

const insertTask = taskText => TasksCollection.insertAsync({
  text: taskText,
  // userId: user._id,
  // createdAt: new Date(),
});


// const SEED_USERNAME = 'meteorite';
// const SEED_PASSWORD = 'password';

Meteor.startup(() => {
  // if (!Accounts.findUserByUsername(SEED_USERNAME)) {
  //   Accounts.createUser({
  //     username: SEED_USERNAME,
  //     password: SEED_PASSWORD,
  //   });
  // }

  // const user = Accounts.findUserByUsername(SEED_USERNAME);

  if (TasksCollection.find().countAsync() === 0) {
    [
      'First Task',
      'Second Task',
      'Third Task',
      'Fourth Task',
      'Fifth Task',
      'Sixth Task',
      'Seventh Task',
    ].forEach(insertTask);
  }
});