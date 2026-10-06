import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {resolve,join,extname} from 'node:path';
const root=resolve('dist');
const siteOrigin=new URL(process.env.PUBLIC_SITE_URL??'https://pixelhero98.github.io').origin;
const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):[join(dir,e.name)]);
const files=walk(root),html=files.filter(f=>extname(f)==='.html');
const banned=/gico|genode|refractive|ICLR|Inference Clocks/i;
for(const file of files.filter(f=>/\.(html|js|json|xml|txt|svg|css)$/.test(f))){
 const content=readFileSync(file,'utf8');
 assert.ok(!banned.test(content),`Excluded content in ${file}`);
}
const demoPages=['corrective-transport','llapdiffusion','c3e','mgdpr','tpe-as','dgdnn'];
for(const slug of demoPages){
 const file=join(root,'work',slug,'index.html'),text=readFileSync(file,'utf8');
 assert.match(text,/id="demo"/);assert.match(text,/data-chart/);assert.match(text,/Synthetic illustration/);assert.match(text,/<noscript>/);
}
for(const file of html){
 const content=readFileSync(file,'utf8');
 assert.equal((content.match(/<h1[ >]/g)??[]).length,1,`Exactly one h1: ${file}`);
 const ids=[...content.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(ids).size,ids.length,`Duplicate IDs in ${file}`);
 const canonical=content.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/)?.[1];
 assert.ok(canonical?.startsWith(siteOrigin+'/'),`Canonical URL: ${file}`);
 assert.match(content,/<meta[^>]+name="description"[^>]+content="[^"]+"/,`Description: ${file}`);
 for(const match of content.matchAll(/(?:href|src)="([^"]+)"/g)){
  const href=match[1].replaceAll('&amp;','&');
  if(!href.startsWith('/')||href.startsWith('//'))continue;
  const [pathname,fragment]=href.split('#'),decoded=decodeURIComponent(pathname.split('?')[0]);
  let target=join(root,decoded);
  if(decoded.endsWith('/'))target=join(target,'index.html');
  assert.ok(existsSync(target),`Missing ${href} in ${file}`);
  if(fragment&&extname(target)==='.html')assert.ok(readFileSync(target,'utf8').includes(`id="${fragment}"`),`Missing anchor ${href}`);
 }
}
const homepage=readFileSync(join(root,'index.html'),'utf8');
assert.ok(homepage.indexOf('id="featured"')<homepage.indexOf('id="papers"'));
assert.ok(homepage.indexOf('id="papers"')<homepage.indexOf('id="projects"'));
assert.ok(homepage.indexOf('id="projects"')<homepage.indexOf('id="background"'));
assert.equal((homepage.match(/class="research-row/g)??[]).length,9);
assert.ok(!/<script[^>]*type="module"/.test(homepage),'Homepage should not load demo JavaScript');
const sitemap=readFileSync(join(root,'sitemap-0.xml'),'utf8');
for(const slug of [...demoPages,'causal-video-world-models','lobiflow','audit-agents'])assert.ok(sitemap.includes(`/work/${slug}/`),`Missing sitemap route ${slug}`);
assert.ok(existsSync(join(root,'resume','Zinuo_You_EN.pdf')),'Public CV missing from retained URL');
console.log(`Validated ${html.length} HTML pages, six static demo fallbacks, all local links and anchors, homepage order, and excluded content.`);
