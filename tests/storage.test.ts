import test from 'node:test';import assert from 'node:assert/strict';import React from 'react';import {act,create} from 'react-test-renderer';
import {useLocalStorage} from '../src/hooks/useLocalStorage.ts';

test('malformed records including JSON null never reach the visible record shape',()=>{
 const storageDescriptor=Object.getOwnPropertyDescriptor(globalThis,'localStorage');const previous=globalThis.window;globalThis.window=globalThis as unknown as Window & typeof globalThis;
 try{for(const raw of ['null','[]','{"easy":{"time":"bad","moves":-1}}','not-json']){
  Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:()=>raw,setItem:()=>{},removeItem:()=>{}}});
  let api:ReturnType<typeof useLocalStorage>;function Harness(){api=useLocalStorage();return null;}
  let tree:ReturnType<typeof create>;act(()=>{tree=create(React.createElement(Harness));});
  try{assert.equal(api.getBestRecord('easy'),undefined);}finally{act(()=>tree.unmount());}
 }}finally{globalThis.window=previous;if(storageDescriptor)Object.defineProperty(globalThis,'localStorage',storageDescriptor);else Reflect.deleteProperty(globalThis,'localStorage');}
});

test('denied storage supports in-session best records and safe clearing',()=>{
 const storageDescriptor=Object.getOwnPropertyDescriptor(globalThis,'localStorage');const previous=globalThis.window;globalThis.window=globalThis as unknown as Window & typeof globalThis;
 Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:()=>{throw Error('denied')},setItem:()=>{throw Error('denied')},removeItem:()=>{throw Error('denied')}}});
 let api:ReturnType<typeof useLocalStorage>;function Harness(){api=useLocalStorage();return null;}
 let tree:ReturnType<typeof create>;
 try{act(()=>{tree=create(React.createElement(Harness));});act(()=>api.saveBestRecord('easy',30,8));assert.equal(api.getBestRecord('easy')?.time,30);act(()=>api.saveBestRecord('easy',40,6));assert.equal(api.getBestRecord('easy')?.time,30);act(()=>api.clearRecords());assert.equal(api.getBestRecord('easy'),undefined);}
 finally{act(()=>tree?.unmount());globalThis.window=previous;if(storageDescriptor)Object.defineProperty(globalThis,'localStorage',storageDescriptor);else Reflect.deleteProperty(globalThis,'localStorage');}
});

test('unreadable or corrupt saved data is never overwritten or removed on mount/save/clear',()=>{
 const descriptor=Object.getOwnPropertyDescriptor(globalThis,'localStorage');const previous=globalThis.window;globalThis.window=globalThis as unknown as Window & typeof globalThis;
 try{for(const corrupt of ['read-denied','null','{"easy":{"time":"bad"}}']){
  let writes=0,removes=0;
  Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:()=>{if(corrupt==='read-denied')throw Error('read denied');return corrupt;},setItem:()=>{writes++;},removeItem:()=>{removes++;}}});
  let api:ReturnType<typeof useLocalStorage>;function Harness(){api=useLocalStorage();return null;}
  let tree:ReturnType<typeof create>;act(()=>{tree=create(React.createElement(Harness));});
  try{assert.equal(api.storageAvailable,false);act(()=>api.saveBestRecord('easy',20,6));assert.equal(api.getBestRecord('easy')?.time,20);act(()=>api.clearRecords());assert.equal(writes,0);assert.equal(removes,0);}finally{act(()=>tree.unmount());}
 }}finally{globalThis.window=previous;if(descriptor)Object.defineProperty(globalThis,'localStorage',descriptor);else Reflect.deleteProperty(globalThis,'localStorage');}
});
