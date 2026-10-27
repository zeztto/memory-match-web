import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {create,act} from 'react-test-renderer';
import {generateCards,shuffleArray,checkCardsMatch,formatTime} from '../src/lib/gameUtils.ts';
import {useGameState} from '../src/hooks/useGameState.ts';
import {useTimer} from '../src/hooks/useTimer.ts';
import {GameBoard} from '../src/components/GameBoard.tsx';

test('every difficulty/theme generates exactly two cards per icon and shuffle preserves source',()=>{
 for(const difficulty of ['easy','medium','hard'] as const) for(const theme of ['animals','fruits','emoji','tech'] as const){
  const cards=generateCards(difficulty,theme);assert.equal(cards.length,{easy:12,medium:16,hard:24}[difficulty]);
  assert.equal(new Set(cards.map(c=>c.id)).size,cards.length);
  for(const pair of new Set(cards.map(c=>c.pairId))) assert.equal(cards.filter(c=>c.pairId===pair).length,2);
  assert.ok(cards.every(c=>!c.isFlipped&&!c.isMatched));
 }
 const input=[1,2,3,4];assert.deepEqual(shuffleArray(input).sort(),input);assert.deepEqual(input,[1,2,3,4]);assert.equal(formatTime(65),'01:05');
});

test('reducer blocks duplicate flips and counts a mismatched turn only once',()=>{
 let api:ReturnType<typeof useGameState>;
 function Harness(){api=useGameState();return null;}
 let tree:ReturnType<typeof create>;act(()=>{tree=create(React.createElement(Harness));});
 try{
  const a=api.state.cards[0],b=api.state.cards.find(c=>c.pairId!==a.pairId)!;
  act(()=>{api.flipCard(a.id);api.flipCard(a.id);});assert.equal(api.state.flippedCards.length,1);
  act(()=>api.flipCard(b.id));assert.equal(checkCardsMatch(api.state.cards,api.state.flippedCards),false);
  act(()=>api.checkMatch());act(()=>api.checkMatch());assert.equal(api.state.moves,1);
  act(()=>api.resetFlipped());assert.equal(api.state.flippedCards.length,0);
 }finally{act(()=>tree.unmount());}
});

test('new game ignores reset callbacks captured from the previous game',()=>{
 let api:ReturnType<typeof useGameState>;function Harness(){api=useGameState();return null;}
 let tree:ReturnType<typeof create>;act(()=>{tree=create(React.createElement(Harness));});
 try{
  const staleReset=api.resetFlipped;
  act(()=>api.startNewGame('easy','animals'));
  act(()=>api.flipCard(api.state.cards[0].id));
  act(()=>staleReset());assert.equal(api.state.flippedCards.length,1);assert.equal(api.state.moves,0);
 }finally{act(()=>tree.unmount());}
});

test('matching all pairs completes the actual reducer game',()=>{
 let api:ReturnType<typeof useGameState>;function Harness(){api=useGameState();return null;}
 let tree:ReturnType<typeof create>;act(()=>{tree=create(React.createElement(Harness));});
 try{
  act(()=>api.startNewGame('easy','emoji'));
  const pairs=[...new Set(api.state.cards.map(c=>c.pairId))].map(p=>api.state.cards.filter(c=>c.pairId===p).map(c=>c.id));
  for(const [a,b] of pairs){act(()=>{api.flipCard(a);api.flipCard(b);});act(()=>api.checkMatch());}
  assert.equal(api.state.isGameOver,true);assert.equal(api.state.matches,6);assert.equal(api.state.moves,6);
 }finally{act(()=>tree.unmount());}
});

test('mismatch timeout is cancelled when the board is replaced',t=>{
 t.mock.timers.enable({apis:['setTimeout']});const previous=globalThis.window;globalThis.window=globalThis as unknown as Window & typeof globalThis;
 let resets=0;const cards=generateCards('easy','emoji');const a=cards[0],b=cards.find(c=>c.pairId!==a.pairId)!;
 const props={cards,theme:'emoji' as const,difficulty:'easy' as const,flippedCards:[a.id,b.id],onCardClick:()=>{},onMatchCheck:()=>false,onResetFlipped:()=>{resets++;},playSound:()=>{},isGameOver:false};
 let tree:ReturnType<typeof create>;
 try{
  act(()=>{tree=create(React.createElement(GameBoard,props));});act(()=>t.mock.timers.tick(500));
  act(()=>tree.update(React.createElement(GameBoard,{...props,cards:generateCards('easy','emoji'),flippedCards:[]})));
  act(()=>t.mock.timers.tick(1000));assert.equal(resets,0);
 }finally{act(()=>tree?.unmount());globalThis.window=previous;t.mock.timers.reset();}
});

test('timer starts explicitly and stops/resets without later increments',t=>{
 t.mock.timers.enable({apis:['setInterval']});const previous=globalThis.window;globalThis.window=globalThis as unknown as Window & typeof globalThis;
 let api:ReturnType<typeof useTimer>;function Harness(){api=useTimer();return null;}
 let tree:ReturnType<typeof create>;
 try{
  act(()=>{tree=create(React.createElement(Harness));});act(()=>t.mock.timers.tick(2000));assert.equal(api.time,0);
  act(()=>api.start());act(()=>t.mock.timers.tick(2000));assert.equal(api.time,2);
  act(()=>api.stop());act(()=>t.mock.timers.tick(2000));assert.equal(api.time,2);
  act(()=>api.reset());act(()=>t.mock.timers.tick(2000));assert.equal(api.time,0);
 }finally{act(()=>tree?.unmount());globalThis.window=previous;t.mock.timers.reset();}
});
