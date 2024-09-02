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
    tag: Text;
  };

  type Category = {
    id: Nat;
    name: Text;
    icon: Text;
  };

  var tasks : [Task] = [
    { id = 0; name = "Implement generous freemium model"; dueDate = "2024-09-15"; categoryId = 0; tag = "product" },
    { id = 1; name = "Complete Web IDE integration"; dueDate = "2024-10-01"; categoryId = 0; tag = "product" },
    { id = 2; name = "Develop build & debug features"; dueDate = "2024-09-20"; categoryId = 1; tag = "product" },
    { id = 3; name = "Create Sample App Carousel"; dueDate = "2024-09-30"; categoryId = 1; tag = "marketing" },
    { id = 4; name = "Advertise on every technical documentation page"; dueDate = "2024-10-10"; categoryId = 1; tag = "marketing" },
    { id = 5; name = "Launch Airdrop campaign"; dueDate = "2024-08-31"; categoryId = 2; tag = "marketing" },
    { id = 6; name = "Implement Signer Standard"; dueDate = "2024-09-25"; categoryId = 2; tag = "security" },
    { id = 7; name = "Ensure destination compatibility"; dueDate = "2024-10-05"; categoryId = 2; tag = "product" },
    { id = 8; name = "Optimize DEX Liquidity"; dueDate = "2024-10-15"; categoryId = 2; tag = "product" },
    { id = 9; name = "Implement Subsidized DEX Yield"; dueDate = "2024-10-30"; categoryId = 2; tag = "product" }
  ];
  var categories : [Category] = [
    { id = 0; name = "GEMS"; icon = "package" },
    { id = 1; name = "Web IDE"; icon = "code" },
    { id = 2; name = "OISY"; icon = "globe" }
  ];
  var nextTaskId : Nat = 10;
  var nextCategoryId : Nat = 3;

  public func addTask(name: Text, dueDate: Text, categoryId: Nat, tag: Text) : async Task {
    let id = nextTaskId;
    nextTaskId += 1;
    let newTask : Task = { id; name; dueDate; categoryId; tag };
    tasks := Array.append(tasks, [newTask]);
    Debug.print("Task added: " # debug_show(newTask));
    newTask
  };

  public func updateTask(id: Nat, name: Text, dueDate: Text, categoryId: Nat, tag: Text) : async Task {
    Debug.print("Updating task: " # debug_show({ id; name; dueDate; categoryId; tag }));
    var updatedTask : Task = { id = 0; name = ""; dueDate = ""; categoryId = 0; tag = "" };
    tasks := Array.map(tasks, func (task: Task) : Task {
      if (task.id == id) {
        updatedTask := { id; name; dueDate; categoryId; tag };
        updatedTask
      } else {
        task
      }
    });
    updatedTask
  };

  public func deleteTask(id: Nat) : async Bool {
    Debug.print("Deleting task: " # debug_show(id));
    tasks := Array.filter(tasks, func (task: Task) : Bool { task.id != id });
    true
  };

  public query func getTasks() : async [Task] {
    tasks
  };

  public func addCategory(name: Text, icon: Text) : async Category {
    let id = nextCategoryId;
    nextCategoryId += 1;
    let newCategory : Category = { id; name; icon };
    categories := Array.append(categories, [newCategory]);
    Debug.print("Category added: " # debug_show(newCategory));
    newCategory
  };

  public func updateCategory(id: Nat, name: Text, icon: Text) : async Category {
    Debug.print("Updating category: " # debug_show({ id; name; icon }));
    var updatedCategory : Category = { id = 0; name = ""; icon = "" };
    categories := Array.map(categories, func (category: Category) : Category {
      if (category.id == id) {
        updatedCategory := { id; name; icon };
        updatedCategory
      } else {
        category
      }
    });
    updatedCategory
  };

  public query func getCategories() : async [Category] {
    categories
  };
}
