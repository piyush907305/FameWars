import * as THREE from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {content,type FighterDef} from '@fame/content';
import {attackbox,hurtbox,type MatchState} from '@fame/sim';
import {pose} from '../animation';
const box=new THREE.BoxGeometry(1,1,1),sphere=new THREE.SphereGeometry(1,12,10),cylinder=new THREE.CylinderGeometry(1,1,1,10);
const mat=(color:string)=>new THREE.MeshStandardMaterial({color,roughness:.8});
function piece(g:THREE.Group,geo:THREE.BufferGeometry,m:THREE.Material,pos:number[],scale:number[]){const x=new THREE.Mesh(geo,m);x.position.set(pos[0]!,pos[1]!,pos[2]!);x.scale.set(scale[0]!,scale[1]!,scale[2]!);g.add(x);return x;}
type Puppet={group:THREE.Group;body:THREE.Group;leftArm:THREE.Group;rightArm:THREE.Group;leftLeg:THREE.Group;rightLeg:THREE.Group;head:THREE.Group};
function fighter(def:FighterDef):Puppet {
 const group=new THREE.Group(),body=new THREE.Group();group.add(body);const skin=mat('#c78c63'),dark=mat('#15202b'),white=mat('#f5eee2'),outfit=mat(def.palette[0]!),pants=mat(def.palette[1]!),accent=mat(def.palette[2]!);
 piece(body,box,pants,[0,.68,0],[.45,.28,.29]);piece(body,box,outfit,[0,1.02,0],[.63,.55,.36]);piece(body,box,accent,[0,.78,.19],[.48,.09,.035]);
 const head=new THREE.Group();head.position.y=1.58;body.add(head);piece(head,sphere,skin,[0,0,0],[.31,.34,.29]);piece(head,sphere,dark,[0,.22,-.025],[.32,.16,.29]);piece(head,box,accent,[0,-.08,.27],[.16,.035,.03]);piece(head,sphere,skin,[0,0,.285],[.06,.07,.06]);
 for(const side of [-1,1]){piece(head,sphere,white,[side*.12,.07,.264],[.067,.08,.025]);piece(head,sphere,dark,[side*.12,.07,.286],[.033,.044,.01]);piece(head,box,dark,[side*.12,.18,.264],[.14,.035,.035]);}
 if(def.visual.prop==='captain'){piece(head,box,accent,[0,.28,0],[.61,.10,.48]);piece(head,box,accent,[0,.24,.32],[.57,.045,.23]);}else {piece(head,sphere,dark,[.10,.32,-.02],[.19,.15,.22]);}
 const limb=(x:number,y:number,m:THREE.Material,isArm:boolean)=>{const pivot=new THREE.Group();pivot.position.set(x,y,0);body.add(pivot);piece(pivot,cylinder,m,[0,-.21,0],[isArm?.105:.12,.42,isArm?.105:.12]);piece(pivot,sphere,isArm?skin:dark,[0,-.45,.035],isArm?[.115,.13,.12]:[.14,.10,.22]);return pivot;};
 const leftArm=limb(-.40,1.20,outfit,true),rightArm=limb(.40,1.20,outfit,true),leftLeg=limb(-.16,.61,pants,false),rightLeg=limb(.16,.61,pants,false);
 return {group,body,leftArm,rightArm,leftLeg,rightLeg,head};
}
function sign(text:string,color:string){const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;const x=canvas.getContext('2d')!;x.fillStyle='#11202b';x.fillRect(0,0,512,128);x.strokeStyle=color;x.lineWidth=8;x.strokeRect(8,8,496,112);x.fillStyle=color;x.font='bold 42px sans-serif';x.textAlign='center';x.fillText(text,256,80);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return new THREE.MeshBasicMaterial({map:texture});}
export class Renderer {
 readonly engine:THREE.WebGLRenderer;private scene=new THREE.Scene();private camera=new THREE.PerspectiveCamera(38,1,.1,60);private puppets:[Puppet,Puppet];private debugMeshes:THREE.Mesh[]=[];private observer:ResizeObserver;debug=false;reduced=false;style:'boxes'|'3d'='3d';drawCalls=0;triangles=0; // Geometry/material resources are owned by this renderer, never by sim.
 constructor(private canvas:HTMLCanvasElement,ids:[string,string]){
  this.engine=new THREE.WebGLRenderer({canvas,antialias:false,powerPreference:'low-power'});this.engine.setPixelRatio(Math.min(devicePixelRatio,1.5));this.engine.outputColorSpace=THREE.SRGBColorSpace;this.scene.background=new THREE.Color('#111f30');this.scene.fog=new THREE.Fog('#111f30',9,25);
  this.scene.add(new THREE.HemisphereLight('#c3e5ff','#6b3f4c',2.8));const key=new THREE.DirectionalLight('#fff0cf',3);key.position.set(-3,6,5);this.scene.add(key);
  const arena=new THREE.Group();const road=mat('#202e3a'),building=mat('#293b4f'),trim=mat('#f4b75a'),pink=mat('#714d71'),blue=mat('#3a6574');
  piece(arena,box,road,[0,-.13,0],[18,.2,9]);piece(arena,box,building,[0,-.005,-1.5],[18,.1,.8]);
  for(let i=-4;i<=4;i++){piece(arena,box,trim,[i*1.6,.005,.9],[.7,.015,.04]);piece(arena,box,i%2?pink:blue,[i*2.2,1.8,-3.2],[1.9,3.6,.6]);for(let row=0;row<3;row++)piece(arena,box,road,[i*2.2,.6+row*.9,-2.88],[1.35,.55,.02]);}
  for(const x of [-4.6,4.6]){piece(arena,cylinder,road,[x,1.8,-1.7],[.035,3.6,.035]);piece(arena,box,trim,[x,3.5,-1.65],[.9,.12,.45]);piece(arena,cylinder,trim,[x,.24,-1],[.17,.48,.17]);}
  piece(arena,box,trim,[0,2.8,-2.4],[7,.06,.07]);
  arena.updateMatrixWorld(true);const groups=new Map<THREE.Material,THREE.BufferGeometry[]>();arena.traverse(o=>{if(o instanceof THREE.Mesh){const m=o.material as THREE.Material;const list=groups.get(m)??[];list.push(o.geometry.clone().applyMatrix4(o.matrixWorld));groups.set(m,list);}});
  for(const [m,geos] of groups){const merged=mergeGeometries(geos);if(merged)this.scene.add(new THREE.Mesh(merged,m));geos.forEach(g=>g.dispose());}
  const title=new THREE.Mesh(new THREE.PlaneGeometry(3.2,.8),sign('FILM CITY', '#ffd35a'));title.position.set(0,2.25,-2.65);this.scene.add(title);
  this.puppets=ids.map(id=>fighter(content.fighters.find(f=>f.id===id)!)) as [Puppet,Puppet];this.puppets.forEach(p=>this.scene.add(p.group));
  for(let i=0;i<4;i++){const mesh=new THREE.Mesh(new THREE.BoxGeometry(1,1,.03),new THREE.MeshBasicMaterial({color:i%2?'#ff6b7d':'#51ffc8',wireframe:true,depthTest:false}));mesh.renderOrder=10;this.scene.add(mesh);this.debugMeshes.push(mesh);}
  this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(canvas);this.resize();
 }
 setFighters(ids:[string,string]){this.puppets.forEach(p=>{this.scene.remove(p.group);p.group.traverse(o=>{if(o instanceof THREE.Mesh)for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();});});this.puppets=ids.map(id=>fighter(content.fighters.find(f=>f.id===id)!)) as [Puppet,Puppet];this.puppets.forEach(p=>this.scene.add(p.group));}
 private resize(){const w=this.canvas.clientWidth,h=this.canvas.clientHeight;if(w&&h){this.engine.setSize(w,h,false);this.camera.aspect=w/h;this.camera.updateProjectionMatrix();}}
 draw(s:MatchState,previous:MatchState,alpha:number){
  const winner=s.winner===null?null:s.actors[s.winner];const finish=s.phase==='finisher'&&!this.reduced;
  this.camera.position.set(finish&&winner?winner.x/1000*.4:0,finish?2.7:3.6,finish?6.5:Math.max(9.8,8.5/this.camera.aspect));this.camera.lookAt(finish&&winner?winner.x/1000*.7:0,1.0,0);
  this.puppets.forEach((p,i)=>{const a=s.actors[i]!,old=previous.actors[i]!;p.group.position.set((old.x+(a.x-old.x)*alpha)/1000,(old.y+(a.y-old.y)*alpha)/1000,0);p.group.rotation.y=a.facing===1?.30:-.30;p.group.visible=true;const poseData=pose(a,s.tick);p.body.position.y=poseData.crouch+(this.reduced?0:poseData.bob);p.body.rotation.z=poseData.lean*a.facing;p.group.rotation.z=a.state==='KO'?-a.facing*1.35:0;
   p.leftLeg.rotation.x=poseData.walk;p.rightLeg.rotation.x=-poseData.walk;p.leftArm.rotation.z=.18;p.rightArm.rotation.z=-.18;
   const arm=a.facing===1?p.rightArm:p.leftArm;arm.rotation.z=-a.facing*(a.state==='block'?1.8:a.state==='finisher'?2.7:poseData.strike*1.6+.18);
   if(a.move==='kick') (a.facing===1?p.rightLeg:p.leftLeg).rotation.z=-a.facing*poseData.strike*1.3;
   p.body.visible=this.style==='3d';
   const hb=hurtbox(a,content),ab=attackbox(a,content);[hb,ab].forEach((b,k)=>{const mesh=this.debugMeshes[i*2+k]!;mesh.visible=!!b&&(this.debug||this.style==='boxes');if(b){mesh.position.set((b.x+b.w/2)/1000,(b.y+b.h/2)/1000,.4);mesh.scale.set(b.w/1000,b.h/1000,1);}});
  });
  this.engine.render(this.scene,this.camera);this.drawCalls=this.engine.info.render.calls;this.triangles=this.engine.info.render.triangles;
 }
 destroy(){this.observer.disconnect();this.scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material]){if('map' in m)(m as THREE.MeshBasicMaterial).map?.dispose();m.dispose();}}});this.engine.dispose();}
}
