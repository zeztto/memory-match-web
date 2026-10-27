import test from 'node:test';import assert from 'node:assert/strict';import React from 'react';import {create,act} from 'react-test-renderer';
import {Card} from '../src/components/Card.tsx';
import {copyShareText,shareGame} from '../src/lib/share.ts';
test('native card button exposes Korean identity only on its front or matched face',()=>{
 const card={id:0,pairId:0,iconName:'Cat',isFlipped:false,isMatched:false};let tree:ReturnType<typeof create>;let clicks=0;
 act(()=>{tree=create(React.createElement(Card,{card,theme:'animals',disabled:false,onClick:()=>{clicks++;}}));});
 try{
  let button=tree.root.findByType('button');assert.equal(button.props.type,'button');assert.doesNotMatch(button.props['aria-label'],/고양이/);
  act(()=>button.props.onClick());assert.equal(clicks,1);
  act(()=>tree.update(React.createElement(Card,{card:{...card,isFlipped:true},theme:'animals',disabled:false,onClick:()=>{clicks++;}})));
  button=tree.root.findByType('button');assert.match(button.props['aria-label'],/고양이/);assert.equal(button.props['aria-pressed'],true);
  act(()=>tree.update(React.createElement(Card,{card:{...card,isMatched:true},theme:'animals',disabled:true,onClick:()=>{clicks++;}})));
  assert.match(tree.root.findByType('button').props['aria-label'],/짝 맞춤, 고양이/);
 }finally{act(()=>tree.unmount());}
});
test('clipboard share reports denial and native cancellation does not copy',async()=>{
 const descriptor=Object.getOwnPropertyDescriptor(globalThis,'navigator');let copies=0;
 Object.defineProperty(globalThis,'navigator',{configurable:true,value:{clipboard:{writeText:async()=>{copies++;throw Error('denied');}},share:async()=>{const e=new Error('cancel');e.name='AbortError';throw e;}}});
 try{const denied=await copyShareText('synthetic-test-url');assert.equal(denied.ok,false);assert.match(denied.message,/못했습니다/);assert.equal(await shareGame({url:'https://example.invalid/test'}),'');assert.equal(copies,1);}
 finally{if(descriptor)Object.defineProperty(globalThis,'navigator',descriptor);else Reflect.deleteProperty(globalThis,'navigator');}
});
