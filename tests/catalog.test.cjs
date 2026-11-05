const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const {fragrances,carouselPosition,normalizeSearch}=vm.runInNewContext(fs.readFileSync(path.join(root,'catalog.js'),'utf8')+';({fragrances,carouselPosition,normalizeSearch})');
test('all 20 reference perfumes are present once, with unique image identifiers',()=>{
 assert.equal(fragrances.length,20);
 assert.equal(new Set(fragrances.map(p=>p.id)).size,20);
 assert.equal(fragrances.filter(p=>p.group==='jpg').length,7);
 assert.equal(fragrances.filter(p=>p.group==='designer').length,4);
 assert.equal(fragrances.filter(p=>p.group==='arabian').length,9);
 assert(fragrances.some(p=>p.id==='jpg-le-beau'));
 assert(fragrances.some(p=>p.id==='jpg-le-beau-parfum'));
});
test('carousel wraps first/last and keeps exactly five unique visible positions for each of 20 slides',()=>{
 assert.equal(carouselPosition(19,0,20),-1);
 assert.equal(carouselPosition(0,19,20),1);
 for(let a=0;a<20;a++){
  const positions=Array.from({length:20},(_,i)=>carouselPosition(i,a,20)).filter(p=>Math.abs(p)<=2);
  assert.deepEqual(positions.sort((a,b)=>a-b),[-2,-1,0,1,2]);
 }
});
test('search normalizes accented letters and case',()=>{
 assert.equal(normalizeSearch('Jean Paul GAULTIER'),'jean paul gaultier');
 assert.equal(normalizeSearch('PERFUMERÍA'),'perfumeria');
});
test('each product has an optimized standalone image',()=>{
 for(const p of fragrances){const asset=path.join(root,'assets/perfumes',p.id+'.webp');assert(fs.existsSync(asset),p.id);assert(fs.statSync(asset).size>1000);}
});
