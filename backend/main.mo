import Bool "mo:base/Bool";
import Nat "mo:base/Nat";

import Array "mo:base/Array";
import Text "mo:base/Text";

actor {
  type Task = {
    id: Nat;
    name: Text;
    dueDate: Text;
    categoryId: Nat;
  };

  type Category = {
    id: Nat;
    name: Text;
    icon: Text;
  };

  var tasks : [Task] = [];
  var categories : [Category] = [
    { id = 0; name = "GEMS"; icon = "package" },
    { id = 1; name = "Web IDE"; icon = "code" },
    { id = 2; name = "OISY"; icon = "globe" }
  ];
  var nextTaskId : Nat = 0;
  var nextCategoryId : Nat = 3;

  public func addTask(name: Text, dueDate: Text, categoryId: Nat) : async Nat {
    let id = nextTaskId;
    nextTaskId += 1;
    let newTask : Task = { id; name; dueDate; categoryId };
    tasks := Array.append(tasks, [newTask]);
    id
  };

  public func updateTask(id: Nat, name: Text, dueDate: Text, categoryId: Nat) : async Bool {
    tasks := Array.map(tasks, func (task: Task) : Task {
      if (task.id == id) {
        { id; name; dueDate; categoryId }
      } else {
        task
      }
    });
    true
  };

  public func deleteTask(id: Nat) : async Bool {
    tasks := Array.filter(tasks, func (task: Task) : Bool { task.id != id });
    true
  };

  public query func getTasks() : async [Task] {
    tasks
  };

  public func addCategory(name: Text, icon: Text) : async Nat {
    let id = nextCategoryId;
    nextCategoryId += 1;
    let newCategory : Category = { id; name; icon };
    categories := Array.append(categories, [newCategory]);
    id
  };

  public func updateCategory(id: Nat, name: Text, icon: Text) : async Bool {
    categories := Array.map(categories, func (category: Category) : Category {
      if (category.id == id) {
        { id; name; icon }
      } else {
        category
      }
    });
    true
  };

  public query func getCategories() : async [Category] {
    categories
  };
}
