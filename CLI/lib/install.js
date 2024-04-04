const fs=require("fs"),path=require("path"),util=require("util"),npmlog=require("npmlog"),async=require("async"),streamBuffers=require("stream-buffers"),crypto=require("crypto"),luna=require("./base/luna"),novacom=require("./base/novacom"),Appdata=require("./base/cli-appdata"),errHndl=require("./base/error-handler"),hasProperty=require("./util/property");
(function(){const k=npmlog;k.heading="installer";k.level="warn";const B=new Appdata,C={log:k,install:function(a,n,p){if("function"!==typeof p)throw errHndl.getErrMsg("MISSING_CALLBACK","next",util.inspect(p));if(!n)return p(errHndl.getErrMsg("EMPTY_VALUE","PACKAGE_FILE"));const l=path.basename(n),m={tempDirForIpk:"/media/developer/temp",removeIpkAfterInst:!0};var u=B.getConfig(!0);if(u.install){u=u.install;for(const b in u)hasProperty(m,b)&&(m[b]=u[b])}const g=path.join(m.tempDirForIpk,l).replace(/\\/g,
"/"),q=new streamBuffers.WritableStreamBuffer,d=a.appId;let c,e,v=200;a=a||{};k.info("installer#install():","installing "+n);async.waterfall([function(b){a.nReplies=0;a.session=new novacom.Session(a.device,b)},function(b,f){a.session=b;setImmediate(f)},function(b){if(a.opkg&&"root"!==a.session.getDevice().username)return setImmediate(b,errHndl.getErrMsg("NEED_ROOT_PERMISSION","opkg install"));let f="/usr/bin/test -d "+m.tempDirForIpk+" || /bin/mkdir -p "+m.tempDirForIpk;"root"===a.session.getDevice().username&&
(f+=" && /bin/chmod 777 "+m.tempDirForIpk);a.op=(a.session.target.files||"stream")+"Put";a.session.run(f,null,null,null,b)},function(b){console.log("Installing package "+n);a.session.put(n,g,b)},function(b){a.session.run('/bin/ls -l "'+g+'"',null,q,null,b)},function(b){k.verbose("installer#install():","ls -l:",q.getContents().toString());b()},function(b){const f=crypto.createHash("md5"),y=Buffer.alloc(v);let h=0;async.waterfall([fs.lstat.bind(fs,n),function(r,w){r.size>v?h=r.size-v:(h=0,v=r.size);
w()},fs.open.bind(fs,n,"r"),function(r,w){fs.read(r,y,0,v,h,function(){f.update(y);w()})},function(){(c=f.digest("hex"))||k.warn("installer#install():","Failed to get md5sum from the ipk file");k.verbose("installer#install():","srcMd5:",c);b()}],function(r){b(r)})},function(b){function f(h){if(h=Buffer.isBuffer(h)?h.toString().trim():h.trim())e=h.split("-")[0].trim(),k.verbose("installer#install():","dstMd5:",e);e||k.warn("installer#install():","Failed to get md5sum from the transmitted file");b()}
const y="/usr/bin/tail -c "+v+' "'+g+'" | /usr/bin/md5sum';async.series([function(h){a.session.run(y,null,f,null,h)}],function(h){if(h)return b(h)})},function(b){if(!c||!e)k.warn("installer#install():","Cannot verify transmitted file");else if(c!==e)return b(errHndl.getErrMsg("FAILED_TRANSMIT_FILE"));b()},function(b){function f(h){function r(t){t=Buffer.isBuffer(t)?t.toString():t;console.log(t)}let w='/usr/bin/opkg install "'+g+'"';w=w.concat(a.opkg_param?" "+a.opkg_param:"");async.series([a.session.run.bind(a.session,
w,null,r,r),a.session.run.bind(a.session,"/usr/sbin/ls-control scan-services ",null,null,r)],function(t){if(t)return h(t);h(null,null)})}function y(h){const r=a.session.getDevice().lunaAddr.install,w=r.returnValue.split(".");luna.send(a,r,{id:d,ipkUrl:g,subscribe:!0},function(t,z){let x=t;for(let A=1;A<w.length;A++)x=x[w[A]];x.match(/FAILED/i)?(k.verbose("installer#install():","failure"),z(errHndl.getErrMsg("FAILED_CALL_LUNA",t.details&&t.details.reason?t.details.reason:x?x:"",null,r.service))):x.match(/installed|^SUCCESS/i)?
(k.verbose("installer#install():","success"),z(null,x)):(k.verbose("installer#install():","waiting"),z(null,null))},h)}(a.opkg?f:y)(b)},function(b,f){"function"===typeof b&&(f=b);m.removeIpkAfterInst?a.session.run('/bin/rm -f "'+g+'"',null,null,null,f):f()},function(b){a.session.end();a.session=null;b(null,{msg:"Success"})}],function(b,f){p(b,f)})},remove:function(a,n,p){if("function"!==typeof p)throw errHndl.getErrMsg("MISSING_CALLBACK","next",util.inspect(p));a=a||{};async.waterfall([function(l){a.nReplies=
void 0;a.session=new novacom.Session(a.device,l)},function(l,m){a.session=l;if(a.opkg&&"root"!==a.session.getDevice().username)return setImmediate(m,errHndl.getErrMsg("NEED_ROOT_PERMISSION","opkg remove"));setImmediate(m)},function(l){function m(g){function q(c){c=Buffer.isBuffer(c)?c.toString():c;return g(Error(c))}let d="/usr/bin/opkg remove "+n;d=d.concat(a.opkg_param?" "+a.opkg_param:"");async.series([a.session.run.bind(a.session,d,null,function(c){c=Buffer.isBuffer(c)?c.toString():c;console.log(c);
if(c.match(/No packages removed/g))return g(errHndl.getErrMsg("FAILED_REMOVE_PACKAGE",n));console.log(c.trim())},q),a.session.run.bind(a.session,"/usr/sbin/ls-control scan-services ",null,null,q)],function(c){if(c)return g(c);g(null,{})})}function u(g){const q=a.session.getDevice().lunaAddr.remove,d=q.returnValue.split(".");let c=0;luna.send(a,q,{id:n,subscribe:!0},function(e,v){k.silly("installer#remove():","lineObj: %j",e);let b=e;for(let f=1;f<d.length;f++)b=b[d[f]];b.match(/FAILED/i)?(k.verbose("installer#remove():",
"failure"),c||(c++,v(errHndl.getErrMsg("FAILED_CALL_LUNA",e.details&&e.details.reason?e.details.reason:b?b:"",null,q.service)))):b.match(/removed|^SUCCESS/i)?(k.verbose("installer#remove():","success"),v(null,{status:b})):v()},g)}(a.opkg?m:u)(l)}],function(l,m){l||(m.msg="Removed package "+n);p(l,m)})},list:function(a,n){if("function"!==typeof n)throw errHndl.getErrMsg("MISSING_CALLBACK","next",util.inspect(n));a=a||{};async.waterfall([function(p){a.nReplies=1;a.session=new novacom.Session(a.device,
p)},function(p,l){a.session=p;if(a.opkg&&"root"!==a.session.getDevice().username)return setImmediate(l,errHndl.getErrMsg("NEED_ROOT_PERMISSION","opkg list"));setImmediate(l)},function(p){function l(u){function g(d){d=Buffer.isBuffer(d)?d.toString():d;console.log(d)}let q;q="/usr/bin/opkg list".concat(a.opkg_param?" "+a.opkg_param:"");async.series([a.session.run.bind(a.session,q,null,g,g)],function(d){if(d)return u(d);u(null,{})})}function m(u){const g=a.session.getDevice().lunaAddr.list,q=g.returnValue.split(".");
luna.send(a,g,{subscribe:!1},function(d,c){for(var e=1;e<q.length;e++)d=d[q[e]];if(Array.isArray(d)){for(e=0;e<d.length;e++)d[e].visible||(d.splice(e,1),e--);k.verbose("installer#list():","success");c(null,d)}else k.verbose("installer#list():","failure"),c(errHndl.getErrMsg("INVALID_OBJECT"))},u)}(a.opkg?l:m)(p)}],function(p,l){n(p,l)})}};"undefined"!==typeof module&&module.exports&&(module.exports=C)})();