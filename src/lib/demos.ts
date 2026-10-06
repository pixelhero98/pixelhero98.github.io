/** Deterministic toy systems; these are not trained models or benchmark results. */
export type DemoId='transport'|'laplace'|'capacity'|'relations'|'optimization'|'decoupled';
export type Values=Record<string,number>;
type Control={key:string;label:string;min:number;max:number;step:number;value:number;checkbox?:boolean};
type Spec={title:string;lead:string;legend:string;controls:Control[];formula:string;limitation:string};
export const specs:Record<DemoId,Spec>={
transport:{title:'A correction changes the path',lead:'Adjust the correction strength and Euler budget. Both paths start from the same particles and share a fixed base field.',legend:'Gray: base endpoints · Blue: corrected paths · Hollow circles: analytic reference',
controls:[{key:'steps',label:'Euler steps',min:1,max:32,step:1,value:8},{key:'strength',label:'Correction strength',min:0,max:1.5,step:.05,value:1}],
formula:'b = (1, 0); m(t) = (−1.2 + 2.4t, 0.6t); r = (1.4, 0.6) − 0.8(z − m). Euler update: z ← z + (b + αr)/N. At α = 1 the analytic endpoint is m(1) + exp(−0.8)(z₀ − m(0)).',
limitation:'The corrective field is hand-specified, not learned. Endpoint distance measures this toy system, not generation quality or the paper’s optimization results.'},
laplace:{title:'One trajectory, arbitrary query times',lead:'Remove irregular observations, move the query timestamp, or change damping. The known signal is evaluated directly at the query.',legend:'Gray: known signal · Blue dots: observations · Blue line and hollow dot: query',
controls:[{key:'missing',label:'Missing observations (%)',min:0,max:90,step:10,value:40},{key:'query',label:'Query time',min:0,max:12,step:.1,value:8},{key:'damping',label:'Damping',min:.05,max:.35,step:.01,value:.12}],
formula:'y(t) = exp(−dt)[sin(1.5t) + 0.35 cos(3.4t)]. Twenty-four irregular observation times span 0 to 6; queries extend to 12.',
limitation:'The signal is supplied analytically. Removing observations does not fit a model or produce a posterior. This illustrates stable modes and timestamp queries, not forecasting accuracy.'},
capacity:{title:'Width, depth, and information capacity',lead:'Increase propagation depth to attenuate graph modes, or increase width to retain more channels.',legend:'Blue: retained spectral channels · Gray outlines: discarded channels',
controls:[{key:'width',label:'Retained channels (width)',min:1,max:8,step:1,value:4},{key:'depth',label:'Propagation depth',min:0,max:16,step:1,value:3}],
formula:'On an eight-node path, symmetric lazy diffusion has λₖ = 0.5 + 0.5 cos(πk/8). Mode gain after L steps is λₖᴸ. Capacity proxy C = ½ Σ log₂(1 + 10 λₖ²ᴸ), summed over retained channels.',
limitation:'This Gaussian-channel toy is not the complete C3E estimator. It shows attenuation and dimensional truncation; it does not equate over-squashing with over-smoothing or predict task accuracy.'},
relations:{title:'Separate relations, retained features',lead:'Enable the relation graphs, then change how much of each original node feature is retained.',legend:'Gray: input · Light blue: relation A · Hatched: relation B · Dark blue: combined',
controls:[{key:'a',label:'Relation A: ring neighbors',min:0,max:1,step:1,value:1,checkbox:true},{key:'b',label:'Relation B: opposite pairs',min:0,max:1,step:1,value:1,checkbox:true},{key:'retain',label:'Original-feature weight',min:0,max:1,step:.05,value:.35}],
formula:'Each relation averages a node with its neighbors. Let d be the mean of enabled relation outputs, or zero if both are off. The output is h = ρx + (1 − ρ)d.',
limitation:'The scalar blend illustrates the separate branches. The learned parallel-retention operator instead uses projections and interactions. Features and graphs are synthetic, not financial predictions.'},
optimization:{title:'A high score can also be a noisy score',lead:'Move through the budget schedule to rerank the same candidates. Change noise or seed to inspect different observations.',legend:'Gray line: true mean · Blue dots: sample mean · Dashed: penalized score · Ring: selected',
controls:[{key:'progress',label:'Budget used (%)',min:0,max:100,step:5,value:50},{key:'noise',label:'Noise scale',min:0,max:2,step:.1,value:1},{key:'seed',label:'Random seed',min:1,max:9,step:1,value:3}],
formula:'25 fixed candidates receive 5 Gaussian observations each. Score = sample mean − λ × sample variance, with λ = [1 − cos(π × budget fraction)]/2. Select the largest current score.',
limitation:'This isolates adaptive scoring. It omits Parzen proposals and importance correction, and is not the complete optimizer or a portfolio backtest.'},
decoupled:{title:'Encode once. Then diffuse.',lead:'Set the encoder gain and step through graph propagation. The encoded features stay fixed while their mixture changes.',legend:'Gray: raw input · Light blue: encoded once · Dark blue: diffused representation',
controls:[{key:'gain',label:'Encoder gain',min:.5,max:3,step:.1,value:1.5},{key:'steps',label:'Diffusion steps',min:0,max:12,step:1,value:2}],
formula:'Encode hᵢ = tanh(gxᵢ) once. Each step uses hᵢ ← 0.5hᵢ + 0.25hᵢ₋₁ + 0.25hᵢ₊₁ on a six-node ring.',
limitation:'This fixed encoder and graph isolate decoupling. They do not reproduce entropy-driven graph construction, learned features, or the full DGDNN operator.'},
};
export const defaults=(id:DemoId):Values=>Object.fromEntries(specs[id].controls.map(c=>[c.key,c.value]));
export function rng(seed:number){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
export type Point=[number,number];
export function transport(steps:number,strength:number){
const starts:Point[]=Array.from({length:36},(_,i)=>{const a=i*2.39996,r=.72*Math.sqrt((i+.5)/36);return[-1.2+r*Math.cos(a),r*Math.sin(a)];});
const rollout=(p:Point,alpha:number)=>{const path:Point[]=[[...p]];let[x,y]=p;for(let k=0;k<steps;k++){const t=k/steps,dx=1+alpha*(1.4-.8*(x-(-1.2+2.4*t))),dy=alpha*(.6-.8*(y-.6*t));x+=dx/steps;y+=dy/steps;path.push([x,y]);}return path;};
const corrected=starts.map(p=>rollout(p,strength)),base=starts.map(p=>rollout(p,0));
const reference:Point[]=starts.map(([x,y])=>[1.2+Math.exp(-.8)*(x+1.2),.6+Math.exp(-.8)*y]);
const error=Math.sqrt(corrected.reduce((sum,p,i)=>sum+(p[steps][0]-reference[i][0])**2+(p[steps][1]-reference[i][1])**2,0)/starts.length);
return{starts,corrected,base,reference,error};
}
export const signal=(t:number,d:number)=>Math.exp(-d*t)*(Math.sin(1.5*t)+.35*Math.cos(3.4*t));
export function observations(missing:number,d:number){
const random=rng(17),ranked=Array.from({length:24},(_,i)=>({i,rank:random()})).sort((a,b)=>a.rank-b.rank);
const keep=new Set(ranked.slice(0,Math.round(24*(1-missing/100))).map(p=>p.i));
return Array.from({length:24},(_,i)=>i).filter(i=>keep.has(i)).map(i=>{const t=6*(i/23)**1.35;return[t,signal(t,d)] as Point;});
}
export function capacity(width:number,depth:number){const gains=Array.from({length:8},(_,k)=>(.5+.5*Math.cos(Math.PI*k/8))**depth);return{gains,bits:.5*gains.slice(0,width).reduce((s,g)=>s+Math.log2(1+10*g*g),0)};}
export const relationInput=[.9,.2,.65,.1,.85,.3];
export function relations(a:number,b:number,retain:number){
const x=relationInput,first=x.map((v,i)=>(v+x[(i+5)%6]+x[(i+1)%6])/3),second=x.map((v,i)=>(v+x[(i+3)%6])/2);
return{first,second,mixed:x.map((v,i)=>retain*v+(1-retain)*(a+b?(a*first[i]+b*second[i])/(a+b):0))};
}
export const objectiveMean=(x:number)=>.6+1.15*Math.exp(-(((x-.28)/.16)**2))+1.9*Math.exp(-(((x-.76)/.09)**2));
export function optimization(progress:number,noise:number,seed:number){
const random=rng(seed),lambda=(1-Math.cos(Math.PI*progress/100))/2;
const normal=()=>Math.sqrt(-2*Math.log(Math.max(1e-12,random())))*Math.cos(2*Math.PI*random());
const candidates=Array.from({length:25},(_,i)=>{const x=(i+.5)/25,mu=objectiveMean(x),sigma=noise*(.06+.85*Math.exp(-(((x-.76)/.13)**2))),samples=Array.from({length:5},()=>mu+sigma*normal()),mean=samples.reduce((a,b)=>a+b,0)/5,variance=samples.reduce((s,v)=>s+(v-mean)**2,0)/4;return{x,mean,variance,score:mean-lambda*variance};});
return{candidates,best:candidates.reduce((a,b)=>b.score>a.score?b:a),lambda};
}
export const rawFeatures=[-.9,.8,.1,-.3,.65,-.55];
export function decoupled(gain:number,steps:number){const encoded=rawFeatures.map(x=>Math.tanh(gain*x));let diffused=[...encoded];for(let k=0;k<steps;k++)diffused=diffused.map((v,i)=>.5*v+.25*diffused[(i+5)%6]+.25*diffused[(i+1)%6]);return{encoded,diffused};}
const esc=(s:string)=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const f=(n:number)=>Number(n.toFixed(3)),blue='#245f91',gray='#8e9aa5',light='#91b7d4';
export function renderDemo(id:DemoId,v:Values){
const parts:string[]=[];let summary='';
const line=(x:number,y:number,X:number,Y:number,c=gray,d='')=>parts.push(`<line x1="${f(x)}" y1="${f(y)}" x2="${f(X)}" y2="${f(Y)}" stroke="${c}" stroke-width="1.4" stroke-dasharray="${d}"/>`);
const text=(x:number,y:number,s:string,a='start')=>parts.push(`<text x="${f(x)}" y="${f(y)}" text-anchor="${a}" fill="#59636d" font-size="14" font-family="Inter,system-ui,sans-serif">${esc(s)}</text>`);
const dot=(x:number,y:number,r:number,c=blue,hollow=false)=>parts.push(`<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${hollow?'white':c}" stroke="${c}" stroke-width="1.5"/>`);
const path=(p:Point[],c=blue,d='')=>parts.push(`<path d="${p.map(([x,y],i)=>(i?'L':'M')+f(x)+','+f(y)).join(' ')}" fill="none" stroke="${c}" stroke-width="2" stroke-dasharray="${d}"/>`);
const rect=(x:number,y:number,w:number,h:number,c=blue,hollow=false)=>parts.push(`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="2" fill="${hollow?'none':c}" stroke="${c}"/>`);
const ring=(cx:number,cy:number,r:number,kind:'ring'|'pairs',values?:number[],active=true)=>{
 const points=Array.from({length:6},(_,i)=>[cx+r*Math.cos(i*Math.PI/3-Math.PI/2),cy+r*Math.sin(i*Math.PI/3-Math.PI/2)] as Point);
 points.forEach(([x,y],i)=>{const j=kind==='ring'?(i+1)%6:(i+3)%6;if(kind==='ring'||i<3)line(x,y,points[j][0],points[j][1],active?light:'#dfe5ea',active?'':'3 3');});
 points.forEach(([x,y],i)=>{dot(x,y,13,active?blue:gray,true);text(x,y+5,String.fromCharCode(65+i),'middle');if(values)text(x,y+(y<cy?-20:30),values[i].toFixed(2),'middle');});
};
const axes=(xmin:number,xmax:number,ymin:number,ymax:number,label:string)=>{
const X=(x:number)=>50+(x-xmin)/(xmax-xmin)*555,Y=(y:number)=>265-(y-ymin)/(ymax-ymin)*230;
[0,.5,1].forEach(t=>{const y=ymin+t*(ymax-ymin);line(50,Y(y),605,Y(y),'#e0e6eb');text(41,Y(y)+5,y.toFixed(1),'end');const x=xmin+t*(xmax-xmin);text(X(x),288,x.toFixed(1),'middle');});text(330,312,label,'middle');return{X,Y};};
if(id==='transport'){
const d=transport(v.steps,v.strength),{X,Y}=axes(-2.1,2.3,-1.2,1.5,'State x');
d.corrected.filter((_,i)=>i%4===0).forEach(p=>path(p.map(([x,y])=>[X(x),Y(y)]),light));
d.base.forEach(p=>dot(X(p[v.steps][0]),Y(p[v.steps][1]),2.5,gray));d.reference.forEach(([x,y])=>dot(X(x),Y(y),4,gray,true));d.corrected.forEach(p=>dot(X(p[v.steps][0]),Y(p[v.steps][1]),2.8));d.starts.forEach(([x,y])=>dot(X(x),Y(y),2,light));
summary=`36 particles · ${v.steps} Euler steps · RMS endpoint distance to analytic reference: ${d.error.toFixed(4)}. At zero correction, both endpoints coincide.`;
}else if(id==='laplace'){
const{X,Y}=axes(0,12,-1,1.3,'Time'),obs=observations(v.missing,v.damping);
path(Array.from({length:241},(_,i)=>[X(i/20),Y(signal(i/20,v.damping))]),gray);line(X(6),35,X(6),265,gray,'4 5');text(X(3),23,'Observations','middle');text(X(9),23,'Query region','middle');obs.forEach(([t,y])=>dot(X(t),Y(y),4));line(X(v.query),35,X(v.query),265,blue,'3 4');dot(X(v.query),Y(signal(v.query,v.damping)),6,blue,true);
summary=`${obs.length} of 24 observations retained · y(${v.query.toFixed(1)}) = ${signal(v.query,v.damping).toFixed(4)}. Missingness does not refit this known signal.`;
}else if(id==='capacity'){
const d=capacity(v.width,v.depth);text(320,24,'Fixed eight-node path','middle');line(78,59,561,59,light);for(let i=0;i<8;i++){dot(78+i*69,59,12,blue,true);text(78+i*69,64,String(i+1),'middle');}
line(45,345,610,345);d.gains.forEach((g,i)=>{const x=58+i*69;rect(x,345-g*205,38,Math.max(.5,g*205),i<v.width?blue:gray,i>=v.width);text(x+19,369,String(i+1),'middle');});text(45,113,'Spectral amplitude after propagation');text(330,403,'Graph mode','middle');
summary=`${v.width} of 8 modes retained · ${v.depth} propagation steps · Gaussian-channel capacity proxy: ${d.bits.toFixed(3)} bits.`;
}else if(id==='relations'){
const d=relations(v.a,v.b,v.retain);text(170,24,`A · ring neighbors${v.a?'':' (off)'}`,'middle');text(470,24,`B · opposite pairs${v.b?'':' (off)'}`,'middle');ring(170,100,48,'ring',undefined,Boolean(v.a));ring(470,100,48,'pairs',undefined,Boolean(v.b));
line(45,350,610,350);relationInput.forEach((x,i)=>{const bx=53+i*94;[x,d.first[i]*v.a,d.second[i]*v.b,d.mixed[i]].forEach((z,j)=>rect(bx+j*16,350-z*135,12,Math.max(.5,z*135),[gray,light,'url(#hatch-relations)',blue][j]));text(bx+29,377,String.fromCharCode(65+i),'middle');});text(45,196,'Synthetic node signal · each average includes the node itself');text(330,403,'Node','middle');
summary=`${v.a+v.b} relations enabled · Original-feature weight ${v.retain.toFixed(2)} · Node A output ${d.mixed[0].toFixed(3)}. Weight 1 retains every original feature.`;
}else if(id==='optimization'){
const d=optimization(v.progress,v.noise,v.seed),min=Math.min(0,...d.candidates.map(c=>c.score))-.2,max=Math.max(3,...d.candidates.map(c=>c.mean))+.2,{X,Y}=axes(0,1,min,max,'Candidate parameter x');
path(Array.from({length:101},(_,i)=>[X(i/100),Y(objectiveMean(i/100))]),gray);path(d.candidates.map(c=>[X(c.x),Y(c.score)]),blue,'5 4');d.candidates.forEach(c=>dot(X(c.x),Y(c.mean),3.3));dot(X(d.best.x),Y(d.best.score),8,blue,true);
summary=`Variance penalty λ = ${d.lambda.toFixed(3)} · Selected x = ${d.best.x.toFixed(2)} · Mean ${d.best.mean.toFixed(3)}, variance ${d.best.variance.toFixed(3)}, score ${d.best.score.toFixed(3)}. 25 candidates; 5 observations each.`;
}else{
const d=decoupled(v.gain,v.steps),y0=312,s=59;[rawFeatures,d.encoded,d.diffused].forEach((values,i)=>ring(115+i*205,124,54,'ring',values));text(115,24,'Raw input','middle');text(320,24,'Encode once','middle');text(525,24,`Diffuse × ${v.steps}`,'middle');text(218,128,'→','middle');text(423,128,'→','middle');
line(45,y0,610,y0);rawFeatures.forEach((x,i)=>{const bx=60+i*92;[x,d.encoded[i],d.diffused[i]].forEach((z,j)=>rect(bx+j*20,y0-Math.max(z,0)*s,15,Math.max(.5,Math.abs(z)*s),[gray,light,blue][j]));text(bx+26,389,String.fromCharCode(65+i),'middle');});text(45,233,'Signed node features');text(330,417,'Node','middle');
summary=`Encoder gain ${v.gain.toFixed(1)} · ${v.steps} diffusion steps · Node A: ${rawFeatures[0].toFixed(2)} → ${d.encoded[0].toFixed(3)} → ${d.diffused[0].toFixed(3)}. Zero steps preserves the encoded features.`;
}
const height=['capacity','relations','decoupled'].includes(id)?430:330;
return{summary,svg:`<svg viewBox="0 0 640 ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(summary)}"><title>${esc(specs[id].title)}</title><defs><pattern id="hatch-${id}" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#d4e3ee"/><path d="M0 5L5 0" stroke="#527f9f"/></pattern></defs>${parts.join('')}</svg>`};
}
