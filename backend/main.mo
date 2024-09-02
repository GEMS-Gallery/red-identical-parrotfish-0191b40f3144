import Text "mo:base/Text";

import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Time "mo:base/Time";

actor {
  type Task = {
    title: Text;
    category: Text;
    dueDate: Text;
  };

  stable var tasks : [Task] = [
    { title = "Implement generous freemium model"; category = "GEMS"; dueDate = "Sep 15, 2024" },
    { title = "Complete Web IDE integration"; category = "GEMS"; dueDate = "Oct 1, 2024" },
    { title = "Develop build & debug features"; category = "Web IDE"; dueDate = "Sep 20, 2024" },
    { title = "Create Sample App Carousel"; category = "Web IDE"; dueDate = "Sep 30, 2024" },
    { title = "Advertise on every technical documentation page"; category = "Web IDE"; dueDate = "Oct 10, 2024" },
    { title = "Launch Airdrop campaign"; category = "OISY"; dueDate = "Aug 31, 2024" },
    { title = "Implement Signer Standard"; category = "OISY"; dueDate = "Sep 25, 2024" },
    { title = "Ensure destination compatibility"; category = "OISY"; dueDate = "Oct 5, 2024" },
    { title = "Optimize DEX Liquidity"; category = "OISY"; dueDate = "Oct 15, 2024" },
    { title = "Implement Subsidized DEX Yield"; category = "OISY"; dueDate = "Oct 30, 2024" }
  ];

  public query func getTasks() : async [Task] {
    return tasks;
  };
}
