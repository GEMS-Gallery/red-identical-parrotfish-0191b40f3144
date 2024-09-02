import Bool "mo:base/Bool";
import Hash "mo:base/Hash";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor {
  type Task = {
    id: Nat;
    title: Text;
    lead: Text;
    project: Text;
    dueDate: ?Text;
    completed: ?Bool;
  };

  type Category = {
    name: Text;
    icon: Text;
  };

  stable var categories : [Category] = [
    { name = "GEMS"; icon = "package" },
    { name = "Web IDE"; icon = "code" },
    { name = "OISY"; icon = "globe" }
  ];

  stable var tasksEntries : [(Nat, Task)] = [];
  var tasks = HashMap.fromIter<Nat, Task>(tasksEntries.vals(), 0, Nat.equal, Hash.hash);
  var nextTaskId : Nat = 1;

  public query func getCategories() : async [Category] {
    return categories;
  };

  public query func getTasks(category: Text) : async [Task] {
    return Iter.toArray(tasks.vals());
  };

  public func addTask(category: Text, task: Task) : async Result.Result<Nat, Text> {
    let id = nextTaskId;
    nextTaskId += 1;
    let newTask : Task = {
      id = id;
      title = task.title;
      lead = task.lead;
      project = task.project;
      dueDate = task.dueDate;
      completed = ?false;
    };
    tasks.put(id, newTask);
    #ok(id)
  };

  public func updateTaskStatus(taskId: Nat, completed: Bool) : async Result.Result<(), Text> {
    switch (tasks.get(taskId)) {
      case (null) { #err("Task not found") };
      case (?task) {
        let updatedTask : Task = {
          id = task.id;
          title = task.title;
          lead = task.lead;
          project = task.project;
          dueDate = task.dueDate;
          completed = ?completed;
        };
        tasks.put(taskId, updatedTask);
        #ok()
      };
    }
  };

  public query func filterTasks(category: Text) : async [Task] {
    Iter.toArray(Iter.filter(tasks.vals(), func (task: Task) : Bool {
      task.project == category
    }))
  };

  system func preupgrade() {
    tasksEntries := Iter.toArray(tasks.entries());
  };

  system func postupgrade() {
    tasks := HashMap.fromIter<Nat, Task>(tasksEntries.vals(), 0, Nat.equal, Hash.hash);
  };
}
