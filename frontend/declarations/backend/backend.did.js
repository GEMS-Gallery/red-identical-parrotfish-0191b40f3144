export const idlFactory = ({ IDL }) => {
  const Category = IDL.Record({
    'id' : IDL.Nat,
    'icon' : IDL.Text,
    'name' : IDL.Text,
  });
  const Task = IDL.Record({
    'id' : IDL.Nat,
    'tag' : IDL.Text,
    'categoryId' : IDL.Nat,
    'name' : IDL.Text,
    'dueDate' : IDL.Text,
  });
  return IDL.Service({
    'addCategory' : IDL.Func([IDL.Text, IDL.Text], [Category], []),
    'addTask' : IDL.Func([IDL.Text, IDL.Text, IDL.Nat, IDL.Text], [Task], []),
    'deleteTask' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'getCategories' : IDL.Func([], [IDL.Vec(Category)], ['query']),
    'getTaskAddedNotification' : IDL.Func([Task], [IDL.Text], ['query']),
    'getTasks' : IDL.Func([], [IDL.Vec(Task)], ['query']),
    'updateCategory' : IDL.Func([IDL.Nat, IDL.Text, IDL.Text], [Category], []),
    'updateTask' : IDL.Func(
        [IDL.Nat, IDL.Text, IDL.Text, IDL.Nat, IDL.Text],
        [Task],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
