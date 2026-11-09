// Regression checks on production code; run: node tests/audit-regression.cjs
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=n=>fs.readFileSync(`${__dirname}/../i/${n}.html`,'utf8');
for(const n of fs.readdirSync(`${__dirname}/../i`).filter(x=>x.endsWith('.html'))){
 for(const [i,m] of [...html(n.slice(0,-5)).matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].entries()){
  if(/\btype\s*=\s*["']application\/json["']/i.test(m[1]))JSON.parse(m[2]);
  else new vm.Script(m[2],{filename:n+':'+i});
 }
}
const oil=html('liquid');const stats=vm.runInNewContext('('+oil.match(/function stats\(a\)\{[^\n]+/)[0]+')');
assert(Math.abs(stats([52,47,55,49,44,53]).V-3.346640106)<1e-6);
assert(Math.abs(stats([42,28,51,35,22,47]).V-12.215351909)<1e-6);
assert(stats([1,1,1,1,1,100]).V>20);
assert.equal(stats([30,30,30,30,30,30]).V,0);
const av=html('avalanche');
const ions=av.match(/const ions4=U=>[^\n]+/)[0];
for(const [alpha,eta,S,expected] of [[2,0,1,Math.expm1(2)],[2,2,3,6],[2,3,1,2*(1-Math.exp(-1))]]){
 const ctx={T4:{g:'x',p:1,S,eta},alphaOf:()=>alpha};vm.createContext(ctx);
 vm.runInContext(ions+';result=ions4(1)',ctx);assert(Math.abs(ctx.result-expected)<1e-10);
}
const hoist=html('hoist');const stage=hoist.slice(hoist.indexOf('{id:"9"'),hoist.indexOf('{id:"10"'));
const valid=vm.runInNewContext('('+stage.match(/ok:(s=>\{[^\n]+?\}),h:/)[1]+')');
assert(valid({m:['brush','iso']}));assert(valid({m:['brush','cmc']}));assert(!valid({m:['brush']}));assert(!valid({m:['brush','iso','cmc']}));
const vd=html('vd6300');const d1=vd.slice(vd.indexOf('{id:"Д1"'),vd.indexOf('{id:"Д2"'));
const thickness=vm.runInNewContext('('+d1.match(/ok:(s=>[^,]+),h:/)[1]+')');assert(thickness({d:4}));assert(!thickness({d:3.5}));
assert(vd.includes('a:14.25'));assert(vd.includes('HI = 92,0 %'));
console.log('PASS: simulator scripts and JSON; oil statistics; attachment limits; bearing protection; insulation thickness');
