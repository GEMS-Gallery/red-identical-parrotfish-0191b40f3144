import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Category { 'id' : bigint, 'icon' : string, 'name' : string }
export interface Task {
  'id' : bigint,
  'tag' : string,
  'categoryId' : bigint,
  'name' : string,
  'dueDate' : string,
}
export interface _SERVICE {
  'addCategory' : ActorMethod<[string, string], Category>,
  'addTask' : ActorMethod<[string, string, bigint, string], Task>,
  'deleteTask' : ActorMethod<[bigint], boolean>,
  'getCategories' : ActorMethod<[], Array<Category>>,
  'getTaskAddedNotification' : ActorMethod<[Task], string>,
  'getTasks' : ActorMethod<[], Array<Task>>,
  'updateCategory' : ActorMethod<[bigint, string, string], Category>,
  'updateTask' : ActorMethod<[bigint, string, string, bigint, string], Task>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
