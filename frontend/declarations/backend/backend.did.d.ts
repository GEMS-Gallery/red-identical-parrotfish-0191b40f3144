import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Category { 'icon' : string, 'name' : string }
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : bigint } |
  { 'err' : string };
export interface Task {
  'id' : bigint,
  'title' : string,
  'lead' : string,
  'completed' : [] | [boolean],
  'dueDate' : [] | [string],
  'project' : string,
}
export interface _SERVICE {
  'addTask' : ActorMethod<[string, Task], Result_1>,
  'filterTasks' : ActorMethod<[string], Array<Task>>,
  'getCategories' : ActorMethod<[], Array<Category>>,
  'getTasks' : ActorMethod<[string], Array<Task>>,
  'updateTaskStatus' : ActorMethod<[bigint, boolean], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
