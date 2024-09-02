import Text "mo:base/Text";

import Array "mo:base/Array";
import Time "mo:base/Time";

actor {
  type Task = {
    title: Text;
    category: Text;
    dueDate: Text;
  };

  var tasks: [Task] = [];

  public func addTask(title: Text, category: Text, dueDate: Text): async () {
    let newTask: Task = {
      title = title;
      category = category;
      dueDate = dueDate;
    };
    tasks := Array.append(tasks, [newTask]);
  };

  public query func getTasks(): async [Task] {
    tasks
  };
}
