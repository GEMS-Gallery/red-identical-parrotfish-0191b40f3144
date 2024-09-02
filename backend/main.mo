import Bool "mo:base/Bool";
import Nat "mo:base/Nat";

import Array "mo:base/Array";
import Text "mo:base/Text";
import Debug "mo:base/Debug";

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

  var tasks : [Task] = [
    { id = 0; name = "Implement generous freemium model"; dueDate = "Sep 15, 2024"; categoryId = 0 },
    { id = 1; name = "Complete Web IDE integration"; dueDate = "Oct 1, 2024"; categoryId = 0 },
    { id = 2; name = "Develop build & debug features"; dueDate = "Sep 20, 2024"; categoryId = 1 },
    { id = 3; name = "Create Sample App Carousel"; dueDate = "Sep 30, 2024"; categoryId = 1 },
    { id = 4; name = "Advertise on every technical documentation page"; dueDate = "Oct 10, 2024"; categoryId = 1 },
    { id = 5; name = "Launch Airdrop campaign"; dueDate = "Aug 31, 2024"; categoryId = 2 },
    { id = 6; name = "Implement Signer Standard"; dueDate = "Sep 25, 2024"; categoryId = 2 },
    { id = 7; name = "Ensure destination compatibility"; dueDate = "Oct 5, 2024"; categoryId = 2 },
    { id = 8; name = "Optimize DEX Liquidity"; dueDate = "Oct 15, 2024"; categoryId = 2 },
    { id = 9; name = "Implement Subsidized DEX Yield"; dueDate = "Oct 30, 2024"; categoryId = 2 }
  ];
  var categories : [Category] = [
    { id = 0; name = "GEMS"; icon = "package" },
    { id = 1; name = "Web IDE"; icon = "code" },
    { id = 2; name = "OISY"; icon = "globe" }
  ];
  var nextTaskId : Nat = 10;
  var nextCategoryId : Nat = 3;

  public func addTask(name: Text, dueDate: Text, categoryId: Nat) : async Nat {
    let id = nextTaskId;
    nextTaskId += 1;
    let newTask : Task = { id; name; dueDate; categoryId };
    tasks := Array.append(tasks, [newTask]);
    Debug.print("Task added: " # debug_show(newTask));
    id
  };

  public func updateTask(id: Nat, name: Text, dueDate: Text, categoryId: Nat) : async Bool {
    Debug.print("Updating task: " # debug_show({ id; name; dueDate; categoryId }));
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
    Debug.print("Deleting task: " # debug_show(id));
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
    Debug.print("Category added: " # debug_show(newCategory));
    id
  };

  public func updateCategory(id: Nat, name: Text, icon: Text) : async Bool {
    Debug.print("Updating category: " # debug_show({ id; name; icon }));
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
