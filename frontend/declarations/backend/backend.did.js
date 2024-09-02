export const idlFactory = ({ IDL }) => {
  const Task = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'lead' : IDL.Text,
    'completed' : IDL.Opt(IDL.Bool),
    'dueDate' : IDL.Opt(IDL.Text),
    'project' : IDL.Text,
  });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Category = IDL.Record({ 'icon' : IDL.Text, 'name' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'addTask' : IDL.Func([IDL.Text, Task], [Result_1], []),
    'filterTasks' : IDL.Func([IDL.Text], [IDL.Vec(Task)], ['query']),
    'getCategories' : IDL.Func([], [IDL.Vec(Category)], ['query']),
    'getTasks' : IDL.Func([IDL.Text], [IDL.Vec(Task)], ['query']),
    'updateTaskStatus' : IDL.Func([IDL.Nat, IDL.Bool], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
