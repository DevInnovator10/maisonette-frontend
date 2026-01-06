/* eslint-disable react/no-danger */

import React from 'react';
import Document, {
  Html, Head, Main, NextScript
} from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* VWO sync smartcode */}
          <script src="https://dev.visualwebsiteoptimizer.com/lib/612230.js" />

          <script
            dangerouslySetInnerHTML={{
              __html: `
                  performance.mark('HEAD Start');
                `
            }}
          />

          {/* Preloading woff2 */}

          <link
            rel="preload"
            href="/fonts/328A02_0_0.woff2"
            as="font"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/GT-Pressura-Regular.woff2"
            as="font"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/GT-Walsheim-Pro-Regular.woff2"
            as="font"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/Canela-Light-Web.woff2"
            as="font"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/neuzeit.woff2"
            as="font"
            crossOrigin="anonymous"
          />

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/images/favicon/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/images/favicon/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/images/favicon/favicon-16x16.png"
          />
          <link rel="manifest" href="/images/favicon/site.webmanifest" />
          <link
            rel="mask-icon"
            href="/images/favicon/safari-pinned-tab.svg"
            color="#3150A2"
          />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#2A4BA2" />

          {/* Performance Enhancing Tags */}
          <link
            rel="preconnect"
            href={`${process.env.NEXT_PUBLIC_ASSET_HOST}`}
          />
          <link rel="preconnect" href={`${process.env.SLI_HOST}`} />
          <link rel="preconnect" href={`${process.env.SOLIDUS_HOST}`} />
          <link rel="preconnect" href={`${process.env.CMS_HOST}`} />

          <link rel="preconnect" href="https://ekr.zdassets.com" />
          <link rel="preconnect" href="https://fast.a.klaviyo.com" />
          <link
            rel="preconnect"
            href="https://rum-http-intake.logs.datadoghq.com"
          />
          <link rel="preconnect" href="https://t.paypal.com" />
          <link rel="preconnect" href="https://www.paypal.com" />
          <link rel="preconnect" href="https://www.google.com" />
          <link rel="preconnect" href="https://www.googleadservices.com" />
          <link rel="preconnect" href="https://www.google-analytics.com" />
          <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
          <link
            rel="preconnect"
            href="https://dev.visualwebsiteoptimizer.com"
          />

          {/* Start WKND tag. Deploy at the beginning of document head. --> */}
          {process.env.NEXT_PUBLIC_LOAD_WUNDERKIND === 'true' && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                    (function(d) {
                      var e = d.createElement('script');
                      e.src = d.location.protocol + '//tag.wknd.ai/4822/i.js';
                      e.async = true;
                      d.getElementsByTagName("head")[0].appendChild(e);
                    }(document));
                  `
              }}
            />
          )}
          {/* !-- End WKND tag --> /*}

          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtm.js?id=${process.env.GA_TRACKING_ID}`}
          />

          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                  originalLocation: document.location.protocol + '//' +
                                    document.location.hostname +
                                    document.location.pathname +
                                    document.location.search
                });
                window.dataLayer.push({
                  pageName: document.location.pathname + document.location.search
                });
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.GA_TRACKING_ID}');
              `
            }}
          />

          <script
            dangerouslySetInnerHTML={{
              __html: `
                LUX=(function(){var a=("undefined"!==typeof(LUX)&&"undefined"!==typeof(LUX.gaMarks)?LUX.gaMarks:[]);var d=("undefined"!==typeof(LUX)&&"undefined"!==typeof(LUX.gaMeasures)?LUX.gaMeasures:[]);var j="LUX_start";var k=window.performance;var l=("undefined"!==typeof(LUX)&&LUX.ns?LUX.ns:(Date.now?Date.now():+(new Date())));if(k&&k.timing&&k.timing.navigationStart){l=k.timing.navigationStart}function f(){if(k&&k.now){return k.now()}var o=Date.now?Date.now():+(new Date());return o-l}function b(n){if(k){if(k.mark){return k.mark(n)}else{if(k.webkitMark){return k.webkitMark(n)}}}a.push({name:n,entryType:"mark",startTime:f(),duration:0});return}function m(p,t,n){if("undefined"===typeof(t)&&h(j)){t=j}if(k){if(k.measure){if(t){if(n){return k.measure(p,t,n)}else{return k.measure(p,t)}}else{return k.measure(p)}}else{if(k.webkitMeasure){return k.webkitMeasure(p,t,n)}}}var r=0,o=f();if(t){var s=h(t);if(s){r=s.startTime}else{if(k&&k.timing&&k.timing[t]){r=k.timing[t]-k.timing.navigationStart}else{return}}}if(n){var q=h(n);if(q){o=q.startTime}else{if(k&&k.timing&&k.timing[n]){o=k.timing[n]-k.timing.navigationStart}else{return}}}d.push({name:p,entryType:"measure",startTime:r,duration:(o-r)});return}function h(n){return c(n,g())}function c(p,o){for(i=o.length-1;i>=0;i--){var n=o[i];if(p===n.name){return n}}return undefined}function g(){if(k){if(k.getEntriesByType){return k.getEntriesByType("mark")}else{if(k.webkitGetEntriesByType){return k.webkitGetEntriesByType("mark")}}}return a}return{mark:b,measure:m,gaMarks:a,gaMeasures:d}})();LUX.ns=(Date.now?Date.now():+(new Date()));LUX.ac=[];LUX.cmd=function(a){LUX.ac.push(a)};LUX.init=function(){LUX.cmd(["init"])};LUX.send=function(){LUX.cmd(["send"])};LUX.addData=function(a,b){LUX.cmd(["addData",a,b])};LUX_ae=[];window.addEventListener("error",function(a){LUX_ae.push(a)});LUX_al=[];if("function"===typeof(PerformanceObserver)&&"function"===typeof(PerformanceLongTaskTiming)){var LongTaskObserver=new PerformanceObserver(function(c){var b=c.getEntries();for(var a=0;a<b.length;a++){var d=b[a];LUX_al.push(d)}});try{LongTaskObserver.observe({type:["longtask"]})}catch(e){}};
              `
            }}
          />

          <script
            async
            crossOrigin="anonymous"
            src={`https://cdn.speedcurve.com/js/lux.js?id=${process.env.SPEED_CURVE_ID}`}
          />

          {/* Kustomer */}
          {process.env.NEXT_PUBLIC_KUSTOMER_ACTIVE === 'true' && (
            <script
              defer
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: `
                !function(a,b,c,d){a.Kustomer=c,c._q=[],c._i=[],c.init=function(a){function b(a,b){a[b]=function(){a._q.push([b].concat(Array.prototype.slice.call(arguments,0)))}}for(var d="init clear identify track start describe on".split(" "),e=0;e<d.length;e++)b(c,d[e]);c._i.push(a)};var e=b.createElement("script");e.type="text/javascript",e.async=!0,e.src="https://cdn.kustomerapp.com/cw/sdk.v1.1.min.js";var f=b.getElementsByTagName("script")[0];f.parentNode.insertBefore(e,f)}(this,document,window.Kustomer||{});
                Kustomer.init('${process.env.KUSTOMER_API_KEY}');
              `
              }}
            />
          )}

          <script
            dangerouslySetInnerHTML={{
              __html: `
                  performance.mark('HEAD End')
                  performance.measure('HEAD Time', 'HEAD Start', 'HEAD End')
                `
            }}
          />

          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
              (function(a,b,c,d,e,f,g){e['ire_o']=c;e[c]=e[c]||function(){(e[c].a=e[c].a||[]).push(arguments)};f=d.createElement(b);g=d.getElementsByTagName(b)[0];f.async=1;f.src=a;g.parentNode.insertBefore(f,g);})('https://d.impactradius-event.com/A2737899-4dc0-4af5-b2b2-dbd8248b1a3d1.js','script','ire',document,window);
                `
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />

          <script
            src={`https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${process.env.KLAVIYO_COMPANY_ID}`}
          />

          <script
            defer
            src={`https://www.paypal.com/sdk/js?client-id=${process.env.PAYPAL_CLIENT_ID}&commit=true&locale=en_US&components=messages,buttons,funding-eligibility`}
            data-namespace="PayPalSDK"
          />

          <script
            defer
            src="https://js.afterpay.com/afterpay-1.x.js"
            data-analytics-enabled
            data-max="3000.00"
          />

          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  perfEntries = performance.getEntries();
                  for (i = 0; i < perfEntries.length; i++) {
                    if (perfEntries[i].entryType == 'mark' || perfEntries[i].entryType == 'measure') {
                      var timingType = perfEntries[i].entryType == 'mark' ? perfEntries[i].startTime : perfEntries[i].duration;
                      console.log(perfEntries[i].name + ': ' + timingType);
                    }
                  }
                }());
              `
            }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              document.addEventListener('ftr:tokenReady', function(evt) {
                window.forterToken = evt.detail;
                // Retrieve the token to be sent to your back-end
              });
              `
            }}
          />
          <script
            type="text/javascript"
            id={`${process.env.FORTER_SITE_ID}`}
            dangerouslySetInnerHTML={{
              __html: `
                  (function () {
                    var eu = "22g4zl{5jf5fjtlv1forxgiurqw1qhw2vwdwxv";
                    var siteId = "${process.env.FORTER_SITE_ID}";
              function t(t,e){for(var n=t.split(""),r=0;r<n.length;++r)n[r]=String.fromCharCode(n[r].charCodeAt(0)+e);return n.join("")}function e(e){return t(e,-_).replace(/%SN%/g,siteId)}function n(){var t="no"+"op"+"fn",e="g"+"a",n="n"+"ame";return window[e]&&window[e][n]===t}function r(){return!(!navigator.brave||"function"!=typeof navigator.brave.isBrave)}function o(){return document.currentScript&&document.currentScript.src}function i(t){try{F.ex=t,n()&&F.ex.indexOf(V.uB)===-1&&(F.ex+=V.uB),r()&&F.ex.indexOf(V.uBr)===-1&&(F.ex+=V.uBr),o()&&F.ex.indexOf(V.nIL)===-1&&(F.ex+=V.nIL),window.ftr__snp_cwc||(F.ex+=V.s),C(F)}catch(e){}}function a(t,e){function n(o){try{o.blockedURI===t&&(e(),document.removeEventListener(r,n))}catch(i){document.removeEventListener(r,n)}}var r="securitypolicyviolation";document.addEventListener(r,n),setTimeout(function(){document.removeEventListener(r,n)},2*60*1e3)}function c(t,e,n,r){var o=!1;t="https://"+t,a(t,function(){r(!0),o=!0});var i=document.createElement("script");i.onerror=function(){if(!o)try{r(!1),o=!0}catch(t){}},i.onload=n,i.type="text/javascript",i.id="ftr__script",i.async=!0,i.src=t;var c=document.getElementsByTagName("script")[0];c.parentNode.insertBefore(i,c)}function u(t,e,n){var r=new XMLHttpRequest;if(a(t,function(){n(new Error("CSP Violation"),!0),isErrorEventCalled=!0}),"withCredentials"in r)r.open("GET",t,!0);else{if("undefined"==typeof XDomainRequest)return;r=new XDomainRequest,r.open("GET",t)}r.onload=function(){"function"==typeof e&&e(r)},r.onerror=function(t){if("function"==typeof n&&!isErrorEventCalled)try{n(t,!1),isErrorEventCalled=!0}catch(e){}},r.onprogress=function(){},r.ontimeout=function(){"function"==typeof n&&n("tim"+"eo"+"ut",!1)},setTimeout(function(){r.send()},0)}function d(){u(y,function(n){try{var r=n.getAllResponseHeaders().toLowerCase();if(r.indexOf(x.toLowerCase())<0)return;var o=n.getResponseHeader(x),i=t(o,-_-1);if(i){var a=i.split(":");if(a&&3===a.length){var c=a[0],u=a[1],d=a[2];switch(u){case"none":A=c+T;break;case"res":A=c+T+d;break;case"enc":A=c+e("1forxgiurqw1qhw2vq2(VQ(2vfulsw1mv");break;case"enc-res":for(var s="",v=0,l=0;v<20;++v)s+=v%3>0&&l<12?siteId.charAt(l++):F.id.charAt(v);var m=d.split(".");if(m.length>1){var h=m[0],w=m[1];A=c+T+h+"."+s+"."+w}}if(r.indexOf(S.toLowerCase())>=0){var p=n.getResponseHeader(S),g=t(p,-_-1);window.ftr__altd=g}j(V.dUAL),setTimeout(f,k,V.dUAL)}}}catch(y){}},function(t,e){i(e?V.uAS+V.cP:V.uAS)})}function f(t){try{var e=t===V.uDF?L:A;if(!e)return;var n=function(){try{Q(),i(t+V.uS)}catch(e){}},r=function(e){try{Q(),F.td=1*new Date-F.ts,i(e?t+V.uF+V.cP:t+V.uF),t===V.uDF&&d()}catch(n){i(V.eUoe)}};c(e,void 0,n,r)}catch(o){i(t+V.eTlu)}}var s="fort",v="erTo",l="ken",m=s+v+l,h=10,w={write:function(t,e,n,r){void 0===r&&(r=!0);var o,i;if(n?(o=new Date,o.setTime(o.getTime()+24*n*60*60*1e3),i="; expires="+o.toGMTString()):i="",!r)return void(document.cookie=escape(t)+"="+escape(e)+i+"; path=/");for(var a=1,c=document.domain.split("."),u=h,d=!0;d&&c.length>=a&&u>0;){var f=c.slice(-a).join(".");document.cookie=escape(t)+"="+escape(e)+i+"; path=/; domain="+f;var s=w.read(t);null!=s&&s==e||(f="."+f,document.cookie=escape(t)+"="+escape(e)+i+"; path=/; domain="+f),d=document.cookie.indexOf(t+"="+e)===-1,a++,u--}},read:function(t){var e=null;try{for(var n=escape(t)+"=",r=document.cookie.split(";"),o=32,i=0;i<r.length;i++){for(var a=r[i];a.charCodeAt(0)===o;)a=a.substring(1,a.length);0===a.indexOf(n)&&(e=unescape(a.substring(n.length,a.length)))}}finally{return e}}},p="13";p+="ck";var g=function(t){var e=function(){var e=document.createElement("link");return e.setAttribute("rel","pre"+"con"+"nect"),e.setAttribute("cros"+"sori"+"gin","anonymous"),e.onload=function(){document.head.removeChild(e)},e.onerror=function(t){document.head.removeChild(e)},e.setAttribute("href",t),document.head.appendChild(e),e};if(document.head){var n=e();setTimeout(function(){document.head.removeChild(n)},3e3)}},_=3,y=e(eu||"22g4zl{5jf5fjtlv1forxgiurqw1qhw2vwdwxv"),T=t("1forxgiurqw1qhw2",-_),x=t("[0Uhtxhvw0LG",-_),S=t("[0Fruuhodwlrq0LG",-_),A,L=e("(VQ(1fgq71iruwhu1frp2vq2(VQ(2vfulsw1mv"),E=e("(VQ(1fgq71iruwhu1frp2vqV2(VQ(2vfulsw1mv"),k=10;window.ftr__startScriptLoad=1*new Date;var U=function(t){var e=1e3,n="ft"+"r:tok"+"enR"+"eady";window.ftr__tt&&clearTimeout(window.ftr__tt),window.ftr__tt=setTimeout(function(){try{delete window.ftr__tt,t+="_tt";var e=document.createEvent("Event");e.initEvent(n,!1,!1),e.detail=t,document.dispatchEvent(e)}catch(r){}},e)},C=function(t){var e=function(t){return t||""},n=e(t.id)+"_"+e(t.ts)+"_"+e(t.td)+"_"+e(t.ex)+"_"+e(p);w.write(m,n,1825,!0),U(n),window.ftr__gt=n},D=function(){var t=w.read(m)||"",e=t.split("_"),n=function(t){return e[t]||void 0};return{id:n(0),ts:n(1),td:n(2),ex:n(3),vr:n(4)}},q=function(){for(var t={},e="fgu",n=[],r=0;r<256;r++)n[r]=(r<16?"0":"")+r.toString(16);var o=function(t,e,r,o,i){var a=i?"-":"";return n[255&t]+n[t>>8&255]+n[t>>16&255]+n[t>>24&255]+a+n[255&e]+n[e>>8&255]+a+n[e>>16&15|64]+n[e>>24&255]+a+n[63&r|128]+n[r>>8&255]+a+n[r>>16&255]+n[r>>24&255]+n[255&o]+n[o>>8&255]+n[o>>16&255]+n[o>>24&255]},i=function(){if(window.Uint32Array&&window.crypto&&window.crypto.getRandomValues){var t=new window.Uint32Array(4);return window.crypto.getRandomValues(t),{d0:t[0],d1:t[1],d2:t[2],d3:t[3]}}return{d0:4294967296*Math.random()>>>0,d1:4294967296*Math.random()>>>0,d2:4294967296*Math.random()>>>0,d3:4294967296*Math.random()>>>0}},a=function(){var t="",e=function(t,e){for(var n="",r=t;r>0;--r)n+=e.charAt(1e3*Math.random()%e.length);return n};return t+=e(2,"0123456789"),t+=e(1,"123456789"),t+=e(8,"0123456789")};return t.safeGenerateNoDash=function(){try{var t=i();return o(t.d0,t.d1,t.d2,t.d3,!1)}catch(n){try{return e+a()}catch(n){}}},t.isValidNumericalToken=function(t){return t&&t.toString().length<=11&&t.length>=9&&parseInt(t,10).toString().length<=11&&parseInt(t,10).toString().length>=9},t.isValidUUIDToken=function(t){return t&&32===t.toString().length&&/^[a-z0-9]+$/.test(t)},t.isValidFGUToken=function(t){return 0==t.indexOf(e)&&t.length>=12},t}(),V={uDF:"UDF",dUAL:"dUAL",uAS:"UAS",mLd:"1",eTlu:"2",eUoe:"3",uS:"4",uF:"9",tmos:["T5","T10","T15","T30","T60"],tmosSecs:[5,10,15,30,60],bIR:"43",uB:"u",uBr:"b",cP:"c",nIL:"i",s:"s"},b=function(t,e){for(var n=V.tmos,r=0;r<n.length;r++)if(t+n[r]===e)return!0;return!1};try{var F=D();try{F.id&&(q.isValidNumericalToken(F.id)||q.isValidUUIDToken(F.id)||q.isValidFGUToken(F.id))?window.ftr__ncd=!1:(F.id=q.safeGenerateNoDash(),window.ftr__ncd=!0),F.ts=window.ftr__startScriptLoad,C(F),window.ftr__snp_cwc=!!w.read(m),window.ftr__snp_cwc||(L=E);for(var I="for"+"ter"+".co"+"m",R="ht"+"tps://c"+"dn9."+I,B="ht"+"tps://"+F.id+"-"+siteId+".cd"+"n."+I,G="http"+"s://cd"+"n3."+I,O=[R,B,G],M=0;M<O.length;M++)g(O[M]);var N=new Array(V.tmosSecs.length),j=function(t){for(var e=0;e<V.tmosSecs.length;e++)N[e]=setTimeout(i,1e3*V.tmosSecs[e],t+V.tmos[e])},Q=function(){for(var t=0;t<V.tmosSecs.length;t++)clearTimeout(N[t])};b(V.uDF,F.ex)?loadAlternate():(j(V.uDF),setTimeout(f,k,V.uDF))}catch(H){i(V.mLd)}}catch(H){}})();
              `
            }}
          />
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `(function(m,o,v,a,b,l,e) {
                if (typeof m['MovableInkTrack'] !== 'undefined') { return; }
                m['MovableInkTrack'] = b;
                l = o.createElement(v);
                e = o.getElementsByTagName(v)[0];
                l.type = 'text/javascript'; l.async = true;
                l.src = '//' + a + '/p/js/1.js';
                m[b] = m[b] || function() { (m[b].q=m[b].q||[]).push(arguments); };
                e.parentNode.insertBefore(l, e);

                /* Exclusively for Maisonette */
              })(window, document, 'script', 'cybiiod8.micpn.com', 'mitr');`
            }}
          />
          {/* Kustomer Chat */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Dynamically adds the SDK to the page.
                window.addEventListener('kustomerLoaded', function() {
                    Kustomer.start({
                      hideChatIcon: true,
                      lang: 'en_us'
                    });
                });
                var script = document.createElement('script');
                script.src = 'https://cdn.kustomerapp.com/chat-web/widget.js';
                script.setAttribute('data-kustomer-api-key', '${process.env.KUSTOMER_API_KEY}');
                window.document.body.appendChild(script);
              `
            }}
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
