const async=require("async"),chalk=require("chalk"),createCsvWriter=require("csv-writer").createObjectCsvWriter,fs=require("fs"),npmlog=require("npmlog"),path=require("path"),streamBuffers=require("stream-buffers"),Table=require("easy-table"),util=require("util"),luna=require("./base/luna"),novacom=require("./base/novacom"),errHndl=require("./base/error-handler"),hasProperty=require("./util/property"),getConfigs=require("./base/get-configs"),createDateFileName=require("./util/createFileName").createDateFileName;
(function(){function T(a,q){a.nReplies=1;a.session?(m.info("deviceInfo#makeSession()","already exist session"),q()):(m.info("deviceInfo#makeSession()","need to make new session"),a.session=new novacom.Session(a.device,q))}function U(a,q){if(null===a.outputPath)a.fileName=createDateFileName("_","csv"),a.destinationPath=path.resolve(".");else{const w=path.dirname(a.outputPath),C=path.parse(a.outputPath).base;let c=path.parse(a.outputPath).ext;c=c.split(".").pop();m.info("deviceInfo#captureScreen()#_makeCaptureOption()dir name:"+
w+" ,file name:"+C+" ,inputFormat:"+c);if(C)if(a.fileName=C,a.destinationPath=path.resolve(w),""===c)a.fileName+=".csv";else{if("csv"!==c)return q(errHndl.getErrMsg("INVALID_CSV_FORMAT"))}else w&&(a.fileName=createDateFileName("_","csv"),a.destinationPath=path.resolve(w))}a.csvPath=path.resolve(a.destinationPath,a.fileName);m.verbose("device#makeCSVOutputPath()","csvPath:",a.csvPath);fs.open(a.csvPath,"w",function(w,C){if(w)return q(errHndl.getErrMsg(w));fs.close(C,function(c){if(c)return q(errHndl.getErrMsg(c));
m.verbose("device#makeCSVOutputPath()",a.csvPath+" is closed");fs.existsSync(a.csvPath)&&fs.unlinkSync(a.csvPath);m.verbose("device#makeCSVOutputPath()",a.csvPath+" is exist: "+fs.existsSync(a.csvPath));q()})})}const m=npmlog;m.heading="deviceInfo";m.level="warn";const Z={log:m,systemInfo:function(a,q){if("function"!==typeof q)throw errHndl.getErrMsg("MISSING_CALLBACK","next",util.inspect(q));a=a||{};async.series([function(w){T(a,w)},function(w){m.verbose("deviceInfo#systemInfo#_getSystemInfo()");
const C=a.session.getDevice().lunaAddr.deviceInfoSystem,c={keys:["modelName","sdkVersion","firmwareVersion","boardType","otaId"],subscribe:!1};luna.sendWithoutErrorHandle(a,C,c,function(f,d){m.silly("deviceInfo#systemInfo#_getSystemInfo():","luna called");if(f){var g=c.keys;let h="";for(const b in g)hasProperty(f,g[b])&&(h+=g[b]+" : "+f[g[b]]+"\n");m.verbose("deviceInfo#systemInfo#__makeReturnObj():",h);g=h.trim();0<g.length?(m.verbose("deviceInfo#systemInfo#_getSystemInfo():","success"),d(null,g)):
(m.silly("deviceInfo#systemInfo#_getSystemInfo():","resultValue is empty"),m.verbose(errHndl.getErrMsg("FAILED_CALL_LUNA",f.errorText?f.errorText:f.errorMessage?f.errorMessage:"",null,C.service)),m.verbose("deviceInfo#systemInfo#_getConfigs()"),getConfigs(a,d))}else d(errHndl.getErrMsg("INVALID_OBJECT"))},w)}],function(w,C){q(w,C[1])})},systemResource:function(a,q){function w(){m.info("deviceInfo#systemResource()#_callSystemResourceInfoCmd()");const f=new streamBuffers.WritableStreamBuffer;try{a.session.run('date "+%Y-%m-%d %H:%M:%S"; grep -c ^processor /proc/cpuinfo; grep "cpu *" /proc/stat; free -k',
null,f,null,function(d){if(d)return m.silly("deviceInfo#systemResource()#_callSystemResourceInfoCmd()","ssh call. err:"+d.toString()),q();{var g=f.getContentsAsString();m.info("deviceInfo#systemResource()#_callSystemResourceInfoCmd()");d=/\s+/;const h={},b={};let n={};try{const p=g.split("\n"),k=p[0],x=100*+p[1];let u,e;g=!1;for(u=2;u<p.length-1;u++){e=p[u].split(d);if(0===e[0].indexOf("cpu")){const E="prev"+e[0]+"Total",F="prev"+e[0]+"Idle",J="prev"+e[0]+"User",K="prev"+e[0]+"Kernel",N="prev"+e[0]+
"Other";c[E]||(c[E]=0,c[F]=0,c[J]=0,c[K]=0,c[N]=0);const L=parseInt(e[1]),G=parseInt(e[2]),D=parseInt(e[3]),B=parseInt(e[4]),v=G+parseInt(e[5])+parseInt(e[6])+parseInt(e[7])+parseInt(e[8])+parseInt(e[9])+parseInt(e[10]),y=L+G+D+B+v;if(!c.initialExecution){const P=y-c[E];let H=(L-c[J])/P*100,l=(D-c[K])/P*100,I=(v-c[N])/P*100,O=(P-(B-c[F]))/P*100;0>H?H=0:H;H>x?H=x:H;0>l?l=0:l;l>x?l=x:l;0>I?I=0:I;I>x?I=x:I;0>O?O=0:O;O>x?O=x:O;h[e[0]]={overall:+O.toFixed(2),usermode:+H.toFixed(2),kernelmode:+l.toFixed(2),
others:+I.toFixed(2)}}c[F]=B;c[J]=L;c[K]=D;c[N]=v;c[E]=y}c.initialExecution||(e[5]&&-1!==e[5].indexOf("buff/cache")&&(g=!0),0===e[0].indexOf("Mem:")&&(b.memory=g?{total:+e[1],used:+e[2],free:+e[3],shared:+e[4],buff_cache:+e[5],available:+e[6]}:{total:+e[1],used:+e[2],free:+e[3],shared:+e[4],buffers:+e[5],cached:+e[6]}),0===e[0].indexOf("-/+")&&(b.buffers={used:+e[2],free:+e[3]}),0===e[0].indexOf("Swap:")&&(b.swap={total:+e[1],used:+e[2],free:+e[3]}))}c.initialExecution||(n={date:k,cpuinfo:h,meminfo:b},
C(n))}catch(p){m.silly("deviceInfo#systemResource()#_setSystemResouceInfo()","in try-catch. err:",p.toString())}}c.initialExecution=!1})}catch(d){return m.silly("deviceInfo#systemResource()#_callSystemResourceInfoCmd()","in try-catch. err:",d.toString()),q()}}function C(f){function d(){console.log(f.date+"\n");console.log(b.toString());console.log(n.toString());console.log("=================================================================")}const g=f.cpuinfo,h=f.meminfo,b=new Table,n=new Table,p=
[];for(const k in g)b.cell("(%)",k),b.cell("overall",g[k].overall),b.cell("usermode",g[k].usermode),b.cell("kernelmode",g[k].kernelmode),b.cell("others",g[k].others),b.newRow(),p.push({time:f.date,cpu:k,overall:g[k].overall,usermode:g[k].usermode,kernelmode:g[k].kernelmode,others:g[k].others});for(const k in h)n.cell("(KB)",k),n.cell("total",h[k].total),n.cell("used",h[k].used),n.cell("free",h[k].free),n.cell("shared",h[k].shared),n.cell("buff/cache",h[k].buff_cache),n.cell("available",h[k].available),
n.newRow(),p.push({time:f.date,memory:k,total:h[k].total,used:h[k].used,free:h[k].free,shared:h[k].shared,"buff/cache":h[k].buff_cache,available:h[k].available});if(a.save&&a.csvPath){let k=!1;fs.existsSync(a.csvPath)&&(k=!0);createCsvWriter({path:a.csvPath,header:[{id:"time",title:"time"},{id:"cpu",title:"(%)"},{id:"overall",title:"overall"},{id:"usermode",title:"usermode"},{id:"kernelmode",title:"kernelmode"},{id:"others",title:"others"},{id:"memory",title:"(KB)"},{id:"total",title:"total"},{id:"used",
title:"used"},{id:"free",title:"free"},{id:"shared",title:"shared"},{id:"buff/cache",title:"buff/cache"},{id:"available",title:"available"}],append:k}).writeRecords(p).then(function(){m.silly("deviceInfo#systemResource()#_printSystemInfo()","CSV file updated");if(!1===k){const x="Create "+chalk.green(a.fileName)+" to "+a.destinationPath;console.log(x)}d()}).catch(function(x){return setImmediate(q,errHndl.getErrMsg(x))})}else d()}if("function"!==typeof q)throw errHndl.getErrMsg("MISSING_CALLBACK",
"next",util.inspect(q));const c={initialExecution:!0};a=a||{};a.destinationPath="";a.fileName="";a.csvPath="";async.series([function(f){a.save&&""===a.csvPath?U(a,f):f()},function(f){T(a,f)},function(f){m.info("deviceInfo#systemResource()#_getSystemResouceInfo()");let d;if(a.interval)try{let g=0;d=setTimeout(function b(){1>g?(w(),g++,d=setTimeout(b,1E3)):(w(),d=setTimeout(b,1E3*a.interval))},100)}catch(g){return m.silly("deviceInfo#systemResource()#_getSystemResouceInfo()","repeat timer. err:",g.toString()),
clearTimeout(d),f()}else{let g=0;try{d=setTimeout(function b(){if(2>g)w(),g++,d=setTimeout(b,1E3);else return clearTimeout(d),f()},100)}catch(h){return m.silly("deviceInfo#systemResource()#_getSystemResouceInfo()","one timer. err:",h.toString()),clearTimeout(d),f()}}}],function(f,d){m.silly("deviceInfo#systemResource()","err:",f,", results:",d);q(f)})},processResource:function(a,q){function w(){m.info("deviceInfo#processResource()#_callProcessInfoCmd()");const f=new streamBuffers.WritableStreamBuffer;
try{a.session.run("date \"+%Y-%m-%d %H:%M:%S\"; grep \"cpu *\" /proc/stat | sed \"1d\" | awk '{for (i=0;i<NR;i++){if(i==NR-1){totalSum+=$2+$3+$4+$5+$6+$7+$8+$9+$10+$11;idleSum+=$5}}} END { for (i=0;i<NR;i++){if(i==NR-1){print idleSum;print totalSum}}}'; cat /proc/[0-9]*/stat; echo 'psList' ;  ps -ax | sed \"1d\" | awk '/ /{print $1 \"\t\"$5}'; echo 'serviceStringStart'; ls /media/developer/apps/usr/palm/services ; echo 'serviceStringEnd'; luna-send-pub -n 1 -f luna://com.webos.applicationManager/dev/running '{}'; grep -c ^processor /proc/cpuinfo",
null,f,null,function(d){if(d)return m.silly("deviceInfo#processResource()#_callProcessInfoCmd()","ssh call. err:",d.toString()),q(null);a:{var g=f.getContentsAsString();m.info("deviceInfo#processResource()#_setProcessInfo()");const P=/\s+/;try{d=["Service","System"];const H=[],l={},I=[];for(var h=0;h<d.length;h++)l[d[h]]={},l[d[h]].pid=0,l[d[h]].cputime=0,l[d[h]].RSS=0,l[d[h]].pmem=0;h=[];const O=[];var b=g.split("\n");const t=[],Y=b[0];b.splice(b.length-1,1);const V=100*+b[b.length-1];g=0;const W=
+b[1],S=+b[2];var n=b.indexOf("psList",2),p=b.indexOf("serviceStringStart",2),k=b.indexOf("serviceStringEnd",2);const X=[];for(var x=p+1;x<k;x++)X[x-p-1]=b[x];k=0;for(x=n+1;x<p;x++){var u=b[x].trim().split(P);const r=parseInt(u[0]),A=u[1].trim();if(-1!==X.indexOf(A)){const z={processid:r,id:A};I[k++]=z}}var e=b.indexOf("{",2);if(0>e)m.silly("deviceInfo#processResource()#_setProcessInfo()","running app list is invalid");else{var E=b.length-1;p="";for(var F;e<E;e++)p+=b[e];try{F=JSON.parse(p)}catch(r){m.silly("deviceInfo#processResource()#_setProcessInfo()",
"active app parsing. err:",r.toString());break a}if(!1===F.returnValue)q(errHndl.getErrMsg("FAILED_CALL_LUNA",F.errorText||"running app list is invalid",null,"com.webos.applicationManager"));else{var J=F.running;E={};for(F=3;F<n;F++){const r=b[F].trim().split(P),A=r[1].trim().split(/.*\(|\)/gi)[1];e=void 0;switch(A){case "ls-hubd":e="Service";break;default:e="Other"}u=e;const z=parseInt(r[0]);e=A;const M=parseInt(r[3]),Q=parseInt(r[13])+parseInt(r[14]),R=4*parseInt(r[23]);p=100*R;g+=R;"Other"===u?
(u={},u.pid=z,u.pname=e,u.ppid=M,u.cputime=Q,u.RSS=R,u.pmem=p,t.push(u)):(l[u].pid=z,l[u].cputime+=Q,l[u].RSS+=R,l[u].pmem+=p)}for(var K in l)if(b=K,"System"!==b){var N=l[K];for(n=0;n<t.length;n++)N.pid===t[n].ppid&&(l[b].pid=t[n].pid,l[b].cputime+=t[n].cputime,l[b].RSS+=t[n].RSS,l[b].pmem+=t[n].pmem,t.splice(n,1),n--)}K=0;if(0===J.length)for(var L in c)hasProperty(c,L)&&0<=L.indexOf("prev_app_")&&(c[L]=void 0);else for(L=0;L<J.length;L++){var G=J[L],D=G.webprocessid,B=G.processid;let r;if(""!==D&&
void 0!==D&&"undefined"!==D)r=D;else if(""!==B&&void 0!==B&&"undefined"!==B)r=B;else break;N="prev_app_"+r+"cputime";const A=parseInt(r);b=0;for(n=0;n<t.length;n++){if(t[n].pid!==A)continue;b=t[n].cputime;if(!c[N]){c[N]=b;break}let z=100*(b-c[N])/(S-c.prevTotalcputime);if(0>z||void 0===z||isNaN(z))z=0;K+=z;E[G.id+"-"+A]={id:G.id,pid:A,cpu:z,memory:{size:t[n].RSS,percent:t[n].pmem.toFixed(2)}};c[N]=b;t.splice(n,1);break}}if(0===I.length)for(const r in c)hasProperty(c,r)&&0<=r.indexOf("prev_svc_")&&
(c[r]=void 0);else for(J=0;J<I.length;J++){var v=I[J],y=v.processid;G="prev_svc_"+y+"cputime";const r=parseInt(y);D=0;for(B=0;B<t.length;B++){if(t[B].pid!==r)continue;D=t[B].cputime;if(!c[G]){c[G]=D;break}let A=100*(D-c[G])/(S-c.prevTotalcputime);if(0>A||void 0===A||isNaN(A))A=0;K+=A;E[v.id]={pid:r,cpu:A,memory:{size:t[B].RSS,percent:t[B].pmem.toFixed(2)}};c[G]=D;t.splice(B,1);break}}for(v=0;v<t.length;v++)l.System.pid=t[v].pid,l.System.cputime+=t[v].cputime,l.System.RSS+=t[v].RSS,l.System.pmem+=
t[v].pmem;if(!c.initialExecution){const r=S-c.prevTotalcputime,A=(r-(W-c.prevIdlecputime))/r*100;for(const z in l){v=z;y=0;"Service"===v&&(y=100*(l[v].cputime-c.prevServicecputime)/r);if(0>y||void 0===y||isNaN(y))y=0;K+=y;"System"===v&&(y=A-K);0>y?y=0:y;y>V?y=V:y;l[v].pmem/=g;const M={pid:l[v].pid,appid:v,cpu:parseFloat(y.toFixed(2)),memory:{size:l[v].RSS,percent:l[v].pmem.toFixed(2)}};h.push(M)}for(const z in E){if(!hasProperty(E,z))continue;const M=E[z];let Q=parseFloat(M.cpu.toFixed(2));if(void 0===
Q||isNaN(Q))Q=0;M.memory.percent/=g;const R={pid:M.pid,appid:M.id||z,cpu:Q,memory:{size:M.memory.size,percent:parseFloat(M.memory.percent).toFixed(2)}};h.push(R);O.push(R);0>h.indexOf(z)&&(d.push(z),H.push(z))}}c.prevIdlecputime=W;c.prevTotalcputime=S;c.prevServicecputime=l.Service.cputime;c.initialExecution||C({date:Y,processinfo:O,processList:H})}}}catch(H){m.silly("deviceInfo#processResource()#_setProcessInfo()","in try-catch. err:",H.toString())}}c.initialExecution=!1})}catch(d){return m.silly("deviceInfo#processResource()#_callProcessInfoCmd()",
"in try-catch. err:",d.toString()),q(null)}}function C(f){function d(){console.log(f.date+"\n");console.log(h.toString());console.log("======================================================================")}m.info("deviceInfo#processResource()#_printProcessList()",JSON.stringify(f));const g=f.processinfo,h=new Table;let b=!1;if(a.id&&(g.forEach(function(p){a.id===p.appid&&(b=!0)}),!1===b)){console.log("<"+a.id+"> is not running. Please launch the app or service.");return}if(0===f.processList.length)console.log("There are no running apps or services. Please launch any app or service.");
else{var n=[];Array.isArray(g)&&g.forEach(function(p){if(!a.id||a.id===p.appid){h.cell("PID",p.pid);h.cell("ID",p.appid);h.cell("CPU(%)",p.cpu);var k=p.memory;h.cell("MEMORY(%)",k.percent);h.cell("MEMORY(KB)",k.size);h.newRow();n.push({time:f.date,pid:p.pid,id:p.appid,cpu:p.cpu,memory:k.percent,memory_size:k.size})}});if(a.save&&a.csvPath){let p=!1;fs.existsSync(a.csvPath)&&(p=!0);createCsvWriter({path:a.csvPath,header:[{id:"time",title:"TIME"},{id:"pid",title:"PID"},{id:"id",title:"ID"},{id:"cpu",
title:"CPU(%)"},{id:"memory",title:"MEMORY(%)"},{id:"memory_size",title:"MEMORY(KB)"}],append:p}).writeRecords(n).then(function(){m.silly("deviceInfo#processResource()#_printProcessList()","CSV file updated");if(!1===p){const k="Create "+chalk.green(a.fileName)+" to "+a.destinationPath;console.log(k)}d()}).catch(function(k){return setImmediate(q,errHndl.getErrMsg(k))})}else d()}}if("function"!==typeof q)throw errHndl.getErrMsg("MISSING_CALLBACK","next",util.inspect(q));const c={initialExecution:!0};
a=a||{};a.destinationPath="";a.fileName="";a.csvPath="";async.series([function(f){a.save&&""===a.csvPath?U(a,f):f()},function(f){T(a,f)},function(f){m.info("deviceInfo#processResource()#_getProcessResouceInfo()");let d;if(a.interval)try{let g=0;d=setTimeout(function b(){1>g?(w(),g++,d=setTimeout(b,1E3)):(w(),d=setTimeout(b,1E3*a.interval))},100)}catch(g){return m.silly("deviceInfo#systemResource()#_getProcessResouceInfo()","repeat timer. err:",g.toString()),clearTimeout(d),f()}else{let g=0;try{d=
setTimeout(function b(){if(2>g)w(),g++,d=setTimeout(b,1E3);else return clearTimeout(d),f()},100)}catch(h){return m.silly("deviceInfo#systemResource()#_getProcessResouceInfo()","one timer. err:",h.toString()),clearTimeout(d),f()}}}],function(f,d){m.silly("deviceInfo#processResource()","err:",f,", results:",d);q(f)})}};"undefined"!==typeof module&&module.exports&&(module.exports=Z)})();