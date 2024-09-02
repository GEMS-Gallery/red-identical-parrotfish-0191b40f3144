import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Task {
  'title' : string,
  'dueDate' : string,
  'category' : string,
}
export interface _SERVICE { 'getTasks' : ActorMethod<[], Array<Task>> }
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
