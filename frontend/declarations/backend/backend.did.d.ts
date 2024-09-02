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
  'addCategory' : ActorMethod<[string, string], bigint>,
  'addTask' : ActorMethod<[string, string, bigint, string], bigint>,
  'deleteTask' : ActorMethod<[bigint], boolean>,
  'getCategories' : ActorMethod<[], Array<Category>>,
  'getTasks' : ActorMethod<[], Array<Task>>,
  'updateCategory' : ActorMethod<[bigint, string, string], boolean>,
  'updateTask' : ActorMethod<[bigint, string, string, bigint, string], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
