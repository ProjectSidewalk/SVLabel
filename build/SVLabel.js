/*******************************************************************************
*                                                                              *
* Author    :  Angus Johnson                                                   *
* Version   :  5.0.2                                                           *
* Date      :  30 December 2012                                                *
* Website   :  http://www.angusj.com                                           *
* Copyright :  Angus Johnson 2010-2012                                         *
*                                                                              *
* License:                                                                     *
* Use, modification & distribution is subject to Boost Software License Ver 1. *
* http://www.boost.org/LICENSE_1_0.txt                                         *
*                                                                              *
* Attributions:                                                                *
* The code in this library is an extension of Bala Vatti's clipping algorithm: *
* "A generic solution to polygon clipping"                                     *
* Communications of the ACM, Vol 35, Issue 7 (July 1992) pp 56-63.             *
* http://portal.acm.org/citation.cfm?id=129906                                 *
*                                                                              *
* Computer graphics and geometric modeling: implementation and algorithms      *
* By Max K. Agoston                                                            *
* Springer; 1 edition (January 4, 2005)                                        *
* http://books.google.com/books?q=vatti+clipping+agoston                       *
*                                                                              *
* See also:                                                                    *
* "Polygon Offsetting by Computing Winding Numbers"                            *
* Paper no. DETC2005-85513 pp. 565-575                                         *
* ASME 2005 International Design Engineering Technical Conferences             *
* and Computers and Information in Engineering Conference (IDETC/CIE2005)      *
* September 24�28, 2005 , Long Beach, California, USA                          *
* http://www.me.berkeley.edu/~mcmains/pubs/DAC05OffsetPolygon.pdf              *
*                                                                              *
*******************************************************************************/

/*******************************************************************************
*                                                                              *
* Author    :  Timo                                                            *
* Version   :  5.0.2.1                                                         *
* Date      :  12 January 2013                                                 *
*                                                                              *
* This is a translation of the C# Clipper library to Javascript.               *
* Int128 struct of C# is implemented using JSBN of Tom Wu.                     *
* Because Javascript lacks support for 64-bit integers, the space              *
* is a little more restricted than in C# version.                              *
*                                                                              *
* C# version has support for coordinate space:                                 *
* +-4611686018427387903 ( sqrt(2^127 -1)/2 )                                   *
* while Javascript version has support for space:                              *
* +-4503599627370495 ( sqrt(2^106 -1)/2 )                                      *
*                                                                              *
* Tom Wu's JSBN proved to be the fastest big integer library:                  *
* http://jsperf.com/big-integer-library-Tests                                   *
*                                                                              *
* This class can be made simpler when (if ever) 64-bit integer support comes.  *
*                                                                              *
*******************************************************************************/

/*******************************************************************************
*                                                                              *
* Basic JavaScript BN library - subset useful for RSA encryption.              *
* http://www-cs-students.stanford.edu/~tjw/jsbn/                               *
* Copyright (c) 2005  Tom Wu                                                   *
* All Rights Reserved.                                                         *
* See "LICENSE" for details:                                                   *
* http://www-cs-students.stanford.edu/~tjw/jsbn/LICENSE                        *
*                                                                              *
*******************************************************************************/

(function(Q){function j(a,b){d.biginteger_used=1;null!=a&&("number"==typeof a?this.fromString(Math.floor(a).toString(),10):null==b&&"string"!=typeof a?this.fromString(a,256):(-1!=a.indexOf(".")&&(a=a.substring(0,a.indexOf("."))),this.fromString(a,b)))}function n(){return new j(null)}function R(a,b,c,e,d,f){for(;0<=--f;){var h=b*this[a++]+c[e]+d;d=Math.floor(h/67108864);c[e++]=h&67108863}return d}function S(a,b,c,e,d,f){var h=b&32767;for(b>>=15;0<=--f;){var k=this[a]&32767,j=this[a++]>>15,l=b*k+j*
h,k=h*k+((l&32767)<<15)+c[e]+(d&1073741823);d=(k>>>30)+(l>>>15)+b*j+(d>>>30);c[e++]=k&1073741823}return d}function T(a,b,c,e,d,f){var h=b&16383;for(b>>=14;0<=--f;){var k=this[a]&16383,j=this[a++]>>14,l=b*k+j*h,k=h*k+((l&16383)<<14)+c[e]+d;d=(k>>28)+(l>>14)+b*j;c[e++]=k&268435455}return d}function L(a,b){var c=F[a.charCodeAt(b)];return null==c?-1:c}function A(a){var b=n();b.fromInt(a);return b}function G(a){var b=1,c;if(0!=(c=a>>>16))a=c,b+=16;if(0!=(c=a>>8))a=c,b+=8;if(0!=(c=a>>4))a=c,b+=4;if(0!=
(c=a>>2))a=c,b+=2;0!=a>>1&&(b+=1);return b}function B(a){this.m=a}function C(a){this.m=a;this.mp=a.invDigit();this.mpl=this.mp&32767;this.mph=this.mp>>15;this.um=(1<<a.DB-15)-1;this.mt2=2*a.t}function U(a,b){return a&b}function K(a,b){return a|b}function M(a,b){return a^b}function N(a,b){return a&~b}function E(){}function O(a){return a}function D(a){this.r2=n();this.q3=n();j.ONE.dlShiftTo(2*a.t,this.r2);this.mu=this.r2.divide(a);this.m=a}var p=navigator.userAgent.toString().toLowerCase(),y,u,x,H,
I,J,P;y=-1!=p.indexOf("chrome")&&-1==p.indexOf("chromium")?1:0;u=-1!=p.indexOf("chromium")?1:0;x=-1!=p.indexOf("safari")&&-1==p.indexOf("chrome")&&-1==p.indexOf("chromium")?1:0;H=-1!=p.indexOf("firefox")?1:0;p.indexOf("firefox/17");p.indexOf("firefox/15");p.indexOf("firefox/3");I=-1!=p.indexOf("opera")?1:0;p.indexOf("msie 10");p.indexOf("msie 9");J=-1!=p.indexOf("msie 8")?1:0;P=-1!=p.indexOf("msie 7")?1:0;var p=-1!=p.indexOf("msie ")?1:0,d={biginteger_used:null},t;"Microsoft Internet Explorer"==navigator.appName?
(j.prototype.am=S,t=30):"Netscape"!=navigator.appName?(j.prototype.am=R,t=26):(j.prototype.am=T,t=28);j.prototype.DB=t;j.prototype.DM=(1<<t)-1;j.prototype.DV=1<<t;j.prototype.FV=Math.pow(2,52);j.prototype.F1=52-t;j.prototype.F2=2*t-52;var F=[],v;t=48;for(v=0;9>=v;++v)F[t++]=v;t=97;for(v=10;36>v;++v)F[t++]=v;t=65;for(v=10;36>v;++v)F[t++]=v;B.prototype.convert=function(a){return 0>a.s||0<=a.compareTo(this.m)?a.mod(this.m):a};B.prototype.revert=function(a){return a};B.prototype.reduce=function(a){a.divRemTo(this.m,
null,a)};B.prototype.mulTo=function(a,b,c){a.multiplyTo(b,c);this.reduce(c)};B.prototype.sqrTo=function(a,b){a.squareTo(b);this.reduce(b)};C.prototype.convert=function(a){var b=n();a.abs().dlShiftTo(this.m.t,b);b.divRemTo(this.m,null,b);0>a.s&&0<b.compareTo(j.ZERO)&&this.m.subTo(b,b);return b};C.prototype.revert=function(a){var b=n();a.copyTo(b);this.reduce(b);return b};C.prototype.reduce=function(a){for(;a.t<=this.mt2;)a[a.t++]=0;for(var b=0;b<this.m.t;++b){var c=a[b]&32767,e=c*this.mpl+((c*this.mph+
(a[b]>>15)*this.mpl&this.um)<<15)&a.DM,c=b+this.m.t;for(a[c]+=this.m.am(0,e,a,b,0,this.m.t);a[c]>=a.DV;)a[c]-=a.DV,a[++c]++}a.clamp();a.drShiftTo(this.m.t,a);0<=a.compareTo(this.m)&&a.subTo(this.m,a)};C.prototype.mulTo=function(a,b,c){a.multiplyTo(b,c);this.reduce(c)};C.prototype.sqrTo=function(a,b){a.squareTo(b);this.reduce(b)};j.prototype.copyTo=function(a){for(var b=this.t-1;0<=b;--b)a[b]=this[b];a.t=this.t;a.s=this.s};j.prototype.fromInt=function(a){this.t=1;this.s=0>a?-1:0;0<a?this[0]=a:-1>a?
this[0]=a+DV:this.t=0};j.prototype.fromString=function(a,b){var c;if(16==b)c=4;else if(8==b)c=3;else if(256==b)c=8;else if(2==b)c=1;else if(32==b)c=5;else if(4==b)c=2;else{this.fromRadix(a,b);return}this.s=this.t=0;for(var e=a.length,d=!1,f=0;0<=--e;){var h=8==c?a[e]&255:L(a,e);0>h?"-"==a.charAt(e)&&(d=!0):(d=!1,0==f?this[this.t++]=h:f+c>this.DB?(this[this.t-1]|=(h&(1<<this.DB-f)-1)<<f,this[this.t++]=h>>this.DB-f):this[this.t-1]|=h<<f,f+=c,f>=this.DB&&(f-=this.DB))}8==c&&0!=(a[0]&128)&&(this.s=-1,
0<f&&(this[this.t-1]|=(1<<this.DB-f)-1<<f));this.clamp();d&&j.ZERO.subTo(this,this)};j.prototype.clamp=function(){for(var a=this.s&this.DM;0<this.t&&this[this.t-1]==a;)--this.t};j.prototype.dlShiftTo=function(a,b){var c;for(c=this.t-1;0<=c;--c)b[c+a]=this[c];for(c=a-1;0<=c;--c)b[c]=0;b.t=this.t+a;b.s=this.s};j.prototype.drShiftTo=function(a,b){for(var c=a;c<this.t;++c)b[c-a]=this[c];b.t=Math.max(this.t-a,0);b.s=this.s};j.prototype.lShiftTo=function(a,b){var c=a%this.DB,e=this.DB-c,d=(1<<e)-1,f=Math.floor(a/
this.DB),h=this.s<<c&this.DM,k;for(k=this.t-1;0<=k;--k)b[k+f+1]=this[k]>>e|h,h=(this[k]&d)<<c;for(k=f-1;0<=k;--k)b[k]=0;b[f]=h;b.t=this.t+f+1;b.s=this.s;b.clamp()};j.prototype.rShiftTo=function(a,b){b.s=this.s;var c=Math.floor(a/this.DB);if(c>=this.t)b.t=0;else{var e=a%this.DB,d=this.DB-e,f=(1<<e)-1;b[0]=this[c]>>e;for(var h=c+1;h<this.t;++h)b[h-c-1]|=(this[h]&f)<<d,b[h-c]=this[h]>>e;0<e&&(b[this.t-c-1]|=(this.s&f)<<d);b.t=this.t-c;b.clamp()}};j.prototype.subTo=function(a,b){for(var c=0,e=0,d=Math.min(a.t,
this.t);c<d;)e+=this[c]-a[c],b[c++]=e&this.DM,e>>=this.DB;if(a.t<this.t){for(e-=a.s;c<this.t;)e+=this[c],b[c++]=e&this.DM,e>>=this.DB;e+=this.s}else{for(e+=this.s;c<a.t;)e-=a[c],b[c++]=e&this.DM,e>>=this.DB;e-=a.s}b.s=0>e?-1:0;-1>e?b[c++]=this.DV+e:0<e&&(b[c++]=e);b.t=c;b.clamp()};j.prototype.multiplyTo=function(a,b){var c=this.abs(),e=a.abs(),d=c.t;for(b.t=d+e.t;0<=--d;)b[d]=0;for(d=0;d<e.t;++d)b[d+c.t]=c.am(0,e[d],b,d,0,c.t);b.s=0;b.clamp();this.s!=a.s&&j.ZERO.subTo(b,b)};j.prototype.squareTo=function(a){for(var b=
this.abs(),c=a.t=2*b.t;0<=--c;)a[c]=0;for(c=0;c<b.t-1;++c){var e=b.am(c,b[c],a,2*c,0,1);if((a[c+b.t]+=b.am(c+1,2*b[c],a,2*c+1,e,b.t-c-1))>=b.DV)a[c+b.t]-=b.DV,a[c+b.t+1]=1}0<a.t&&(a[a.t-1]+=b.am(c,b[c],a,2*c,0,1));a.s=0;a.clamp()};j.prototype.divRemTo=function(a,b,c){var e=a.abs();if(!(0>=e.t)){var d=this.abs();if(d.t<e.t)null!=b&&b.fromInt(0),null!=c&&this.copyTo(c);else{null==c&&(c=n());var f=n(),h=this.s;a=a.s;var k=this.DB-G(e[e.t-1]);0<k?(e.lShiftTo(k,f),d.lShiftTo(k,c)):(e.copyTo(f),d.copyTo(c));
e=f.t;d=f[e-1];if(0!=d){var m=d*(1<<this.F1)+(1<e?f[e-2]>>this.F2:0),l=this.FV/m,m=(1<<this.F1)/m,w=1<<this.F2,q=c.t,p=q-e,s=null==b?n():b;f.dlShiftTo(p,s);0<=c.compareTo(s)&&(c[c.t++]=1,c.subTo(s,c));j.ONE.dlShiftTo(e,s);for(s.subTo(f,f);f.t<e;)f[f.t++]=0;for(;0<=--p;){var r=c[--q]==d?this.DM:Math.floor(c[q]*l+(c[q-1]+w)*m);if((c[q]+=f.am(0,r,c,p,0,e))<r){f.dlShiftTo(p,s);for(c.subTo(s,c);c[q]<--r;)c.subTo(s,c)}}null!=b&&(c.drShiftTo(e,b),h!=a&&j.ZERO.subTo(b,b));c.t=e;c.clamp();0<k&&c.rShiftTo(k,
c);0>h&&j.ZERO.subTo(c,c)}}}};j.prototype.invDigit=function(){if(1>this.t)return 0;var a=this[0];if(0==(a&1))return 0;var b=a&3,b=b*(2-(a&15)*b)&15,b=b*(2-(a&255)*b)&255,b=b*(2-((a&65535)*b&65535))&65535,b=b*(2-a*b%this.DV)%this.DV;return 0<b?this.DV-b:-b};j.prototype.isEven=function(){return 0==(0<this.t?this[0]&1:this.s)};j.prototype.exp=function(a,b){if(4294967295<a||1>a)return j.ONE;var c=n(),e=n(),d=b.convert(this),f=G(a)-1;for(d.copyTo(c);0<=--f;)if(b.sqrTo(c,e),0<(a&1<<f))b.mulTo(e,d,c);else var h=
c,c=e,e=h;return b.revert(c)};j.prototype.toString=function(a){if(0>this.s)return"-"+this.negate().toString(a);if(16==a)a=4;else if(8==a)a=3;else if(2==a)a=1;else if(32==a)a=5;else if(4==a)a=2;else return this.toRadix(a);var b=(1<<a)-1,c,e=!1,d="",f=this.t,h=this.DB-f*this.DB%a;if(0<f--){if(h<this.DB&&0<(c=this[f]>>h))e=!0,d="0123456789abcdefghijklmnopqrstuvwxyz".charAt(c);for(;0<=f;)h<a?(c=(this[f]&(1<<h)-1)<<a-h,c|=this[--f]>>(h+=this.DB-a)):(c=this[f]>>(h-=a)&b,0>=h&&(h+=this.DB,--f)),0<c&&(e=
!0),e&&(d+="0123456789abcdefghijklmnopqrstuvwxyz".charAt(c))}return e?d:"0"};j.prototype.negate=function(){var a=n();j.ZERO.subTo(this,a);return a};j.prototype.abs=function(){return 0>this.s?this.negate():this};j.prototype.compareTo=function(a){var b=this.s-a.s;if(0!=b)return b;var c=this.t,b=c-a.t;if(0!=b)return 0>this.s?-b:b;for(;0<=--c;)if(0!=(b=this[c]-a[c]))return b;return 0};j.prototype.bitLength=function(){return 0>=this.t?0:this.DB*(this.t-1)+G(this[this.t-1]^this.s&this.DM)};j.prototype.mod=
function(a){var b=n();this.abs().divRemTo(a,null,b);0>this.s&&0<b.compareTo(j.ZERO)&&a.subTo(b,b);return b};j.prototype.modPowInt=function(a,b){var c;c=256>a||b.isEven()?new B(b):new C(b);return this.exp(a,c)};j.ZERO=A(0);j.ONE=A(1);E.prototype.convert=O;E.prototype.revert=O;E.prototype.mulTo=function(a,b,c){a.multiplyTo(b,c)};E.prototype.sqrTo=function(a,b){a.squareTo(b)};D.prototype.convert=function(a){if(0>a.s||a.t>2*this.m.t)return a.mod(this.m);if(0>a.compareTo(this.m))return a;var b=n();a.copyTo(b);
this.reduce(b);return b};D.prototype.revert=function(a){return a};D.prototype.reduce=function(a){a.drShiftTo(this.m.t-1,this.r2);a.t>this.m.t+1&&(a.t=this.m.t+1,a.clamp());this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);for(this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);0>a.compareTo(this.r2);)a.dAddOffset(1,this.m.t+1);for(a.subTo(this.r2,a);0<=a.compareTo(this.m);)a.subTo(this.m,a)};D.prototype.mulTo=function(a,b,c){a.multiplyTo(b,c);this.reduce(c)};D.prototype.sqrTo=function(a,b){a.squareTo(b);
this.reduce(b)};var r=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,
719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997],V=67108864/r[r.length-1];j.prototype.chunkSize=function(a){return Math.floor(Math.LN2*this.DB/Math.log(a))};j.prototype.toRadix=function(a){null==a&&(a=10);if(0==this.signum()||2>a||36<a)return"0";var b=this.chunkSize(a),b=Math.pow(a,b),c=A(b),e=n(),d=n(),f="";for(this.divRemTo(c,e,d);0<e.signum();)f=(b+d.intValue()).toString(a).substr(1)+
f,e.divRemTo(c,e,d);return d.intValue().toString(a)+f};j.prototype.fromRadix=function(a,b){this.fromInt(0);null==b&&(b=10);for(var c=this.chunkSize(b),e=Math.pow(b,c),d=!1,f=0,h=0,k=0;k<a.length;++k){var m=L(a,k);0>m?"-"==a.charAt(k)&&0==this.signum()&&(d=!0):(h=b*h+m,++f>=c&&(this.dMultiply(e),this.dAddOffset(h,0),h=f=0))}0<f&&(this.dMultiply(Math.pow(b,f)),this.dAddOffset(h,0));d&&j.ZERO.subTo(this,this)};j.prototype.fromNumber=function(a,b,c){if("number"==typeof b)if(2>a)this.fromInt(1);else{this.fromNumber(a,
c);this.testBit(a-1)||this.bitwiseTo(j.ONE.shiftLeft(a-1),K,this);for(this.isEven()&&this.dAddOffset(1,0);!this.isProbablePrime(b);)this.dAddOffset(2,0),this.bitLength()>a&&this.subTo(j.ONE.shiftLeft(a-1),this)}else{c=[];var e=a&7;c.length=(a>>3)+1;b.nextBytes(c);c[0]=0<e?c[0]&(1<<e)-1:0;this.fromString(c,256)}};j.prototype.bitwiseTo=function(a,b,c){var e,d,f=Math.min(a.t,this.t);for(e=0;e<f;++e)c[e]=b(this[e],a[e]);if(a.t<this.t){d=a.s&this.DM;for(e=f;e<this.t;++e)c[e]=b(this[e],d);c.t=this.t}else{d=
this.s&this.DM;for(e=f;e<a.t;++e)c[e]=b(d,a[e]);c.t=a.t}c.s=b(this.s,a.s);c.clamp()};j.prototype.changeBit=function(a,b){var c=j.ONE.shiftLeft(a);this.bitwiseTo(c,b,c);return c};j.prototype.addTo=function(a,b){for(var c=0,e=0,d=Math.min(a.t,this.t);c<d;)e+=this[c]+a[c],b[c++]=e&this.DM,e>>=this.DB;if(a.t<this.t){for(e+=a.s;c<this.t;)e+=this[c],b[c++]=e&this.DM,e>>=this.DB;e+=this.s}else{for(e+=this.s;c<a.t;)e+=a[c],b[c++]=e&this.DM,e>>=this.DB;e+=a.s}b.s=0>e?-1:0;0<e?b[c++]=e:-1>e&&(b[c++]=this.DV+
e);b.t=c;b.clamp()};j.prototype.dMultiply=function(a){this[this.t]=this.am(0,a-1,this,0,0,this.t);++this.t;this.clamp()};j.prototype.dAddOffset=function(a,b){if(0!=a){for(;this.t<=b;)this[this.t++]=0;for(this[b]+=a;this[b]>=this.DV;)this[b]-=this.DV,++b>=this.t&&(this[this.t++]=0),++this[b]}};j.prototype.multiplyLowerTo=function(a,b,c){var e=Math.min(this.t+a.t,b);c.s=0;for(c.t=e;0<e;)c[--e]=0;var d;for(d=c.t-this.t;e<d;++e)c[e+this.t]=this.am(0,a[e],c,e,0,this.t);for(d=Math.min(a.t,b);e<d;++e)this.am(0,
a[e],c,e,0,b-e);c.clamp()};j.prototype.multiplyUpperTo=function(a,b,c){--b;var e=c.t=this.t+a.t-b;for(c.s=0;0<=--e;)c[e]=0;for(e=Math.max(b-this.t,0);e<a.t;++e)c[this.t+e-b]=this.am(b-e,a[e],c,0,0,this.t+e-b);c.clamp();c.drShiftTo(1,c)};j.prototype.modInt=function(a){if(0>=a)return 0;var b=this.DV%a,c=0>this.s?a-1:0;if(0<this.t)if(0==b)c=this[0]%a;else for(var e=this.t-1;0<=e;--e)c=(b*c+this[e])%a;return c};j.prototype.millerRabin=function(a){var b=this.subtract(j.ONE),c=b.getLowestSetBit();if(0>=
c)return!1;var e=b.shiftRight(c);a=a+1>>1;a>r.length&&(a=r.length);for(var d=n(),f=0;f<a;++f){d.fromInt(r[Math.floor(Math.random()*r.length)]);var h=d.modPow(e,this);if(0!=h.compareTo(j.ONE)&&0!=h.compareTo(b)){for(var k=1;k++<c&&0!=h.compareTo(b);)if(h=h.modPowInt(2,this),0==h.compareTo(j.ONE))return!1;if(0!=h.compareTo(b))return!1}}return!0};j.prototype.clone=function(){var a=n();this.copyTo(a);return a};j.prototype.intValue=function(){if(0>this.s){if(1==this.t)return this[0]-this.DV;if(0==this.t)return-1}else{if(1==
this.t)return this[0];if(0==this.t)return 0}return(this[1]&(1<<32-this.DB)-1)<<this.DB|this[0]};j.prototype.byteValue=function(){return 0==this.t?this.s:this[0]<<24>>24};j.prototype.shortValue=function(){return 0==this.t?this.s:this[0]<<16>>16};j.prototype.signum=function(){return 0>this.s?-1:0>=this.t||1==this.t&&0>=this[0]?0:1};j.prototype.toByteArray=function(){var a=this.t,b=[];b[0]=this.s;var c=this.DB-a*this.DB%8,e,d=0;if(0<a--){if(c<this.DB&&(e=this[a]>>c)!=(this.s&this.DM)>>c)b[d++]=e|this.s<<
this.DB-c;for(;0<=a;)if(8>c?(e=(this[a]&(1<<c)-1)<<8-c,e|=this[--a]>>(c+=this.DB-8)):(e=this[a]>>(c-=8)&255,0>=c&&(c+=this.DB,--a)),0!=(e&128)&&(e|=-256),0==d&&(this.s&128)!=(e&128)&&++d,0<d||e!=this.s)b[d++]=e}return b};j.prototype.equals=function(a){return 0==this.compareTo(a)};j.prototype.min=function(a){return 0>this.compareTo(a)?this:a};j.prototype.max=function(a){return 0<this.compareTo(a)?this:a};j.prototype.and=function(a){var b=n();this.bitwiseTo(a,U,b);return b};j.prototype.or=function(a){var b=
n();this.bitwiseTo(a,K,b);return b};j.prototype.xor=function(a){var b=n();this.bitwiseTo(a,M,b);return b};j.prototype.andNot=function(a){var b=n();this.bitwiseTo(a,N,b);return b};j.prototype.not=function(){for(var a=n(),b=0;b<this.t;++b)a[b]=this.DM&~this[b];a.t=this.t;a.s=~this.s;return a};j.prototype.shiftLeft=function(a){var b=n();0>a?this.rShiftTo(-a,b):this.lShiftTo(a,b);return b};j.prototype.shiftRight=function(a){var b=n();0>a?this.lShiftTo(-a,b):this.rShiftTo(a,b);return b};j.prototype.getLowestSetBit=
function(){for(var a=0;a<this.t;++a)if(0!=this[a]){var b=a*this.DB;a=this[a];if(0==a)a=-1;else{var c=0;0==(a&65535)&&(a>>=16,c+=16);0==(a&255)&&(a>>=8,c+=8);0==(a&15)&&(a>>=4,c+=4);0==(a&3)&&(a>>=2,c+=2);0==(a&1)&&++c;a=c}return b+a}return 0>this.s?this.t*this.DB:-1};j.prototype.bitCount=function(){for(var a=0,b=this.s&this.DM,c=0;c<this.t;++c){for(var d=this[c]^b,g=0;0!=d;)d&=d-1,++g;a+=g}return a};j.prototype.testBit=function(a){var b=Math.floor(a/this.DB);return b>=this.t?0!=this.s:0!=(this[b]&
1<<a%this.DB)};j.prototype.setBit=function(a){return this.changeBit(a,K)};j.prototype.clearBit=function(a){return this.changeBit(a,N)};j.prototype.flipBit=function(a){return this.changeBit(a,M)};j.prototype.add=function(a){var b=n();this.addTo(a,b);return b};j.prototype.subtract=function(a){var b=n();this.subTo(a,b);return b};j.prototype.multiply=function(a){var b=n();this.multiplyTo(a,b);return b};j.prototype.divide=function(a){var b=n();this.divRemTo(a,b,null);return b};j.prototype.remainder=function(a){var b=
n();this.divRemTo(a,null,b);return b};j.prototype.divideAndRemainder=function(a){var b=n(),c=n();this.divRemTo(a,b,c);return[b,c]};j.prototype.modPow=function(a,b){var c=a.bitLength(),d,g=A(1),f;if(0>=c)return g;d=18>c?1:48>c?3:144>c?4:768>c?5:6;f=8>c?new B(b):b.isEven()?new D(b):new C(b);var h=[],k=3,j=d-1,l=(1<<d)-1;h[1]=f.convert(this);if(1<d){c=n();for(f.sqrTo(h[1],c);k<=l;)h[k]=n(),f.mulTo(c,h[k-2],h[k]),k+=2}for(var w=a.t-1,q,p=!0,s=n(),c=G(a[w])-1;0<=w;){c>=j?q=a[w]>>c-j&l:(q=(a[w]&(1<<c+1)-
1)<<j-c,0<w&&(q|=a[w-1]>>this.DB+c-j));for(k=d;0==(q&1);)q>>=1,--k;if(0>(c-=k))c+=this.DB,--w;if(p)h[q].copyTo(g),p=!1;else{for(;1<k;)f.sqrTo(g,s),f.sqrTo(s,g),k-=2;0<k?f.sqrTo(g,s):(k=g,g=s,s=k);f.mulTo(s,h[q],g)}for(;0<=w&&0==(a[w]&1<<c);)f.sqrTo(g,s),k=g,g=s,s=k,0>--c&&(c=this.DB-1,--w)}return f.revert(g)};j.prototype.modInverse=function(a){var b=a.isEven();if(this.isEven()&&b||0==a.signum())return j.ZERO;for(var c=a.clone(),d=this.clone(),g=A(1),f=A(0),h=A(0),k=A(1);0!=c.signum();){for(;c.isEven();){c.rShiftTo(1,
c);if(b){if(!g.isEven()||!f.isEven())g.addTo(this,g),f.subTo(a,f);g.rShiftTo(1,g)}else f.isEven()||f.subTo(a,f);f.rShiftTo(1,f)}for(;d.isEven();){d.rShiftTo(1,d);if(b){if(!h.isEven()||!k.isEven())h.addTo(this,h),k.subTo(a,k);h.rShiftTo(1,h)}else k.isEven()||k.subTo(a,k);k.rShiftTo(1,k)}0<=c.compareTo(d)?(c.subTo(d,c),b&&g.subTo(h,g),f.subTo(k,f)):(d.subTo(c,d),b&&h.subTo(g,h),k.subTo(f,k))}if(0!=d.compareTo(j.ONE))return j.ZERO;if(0<=k.compareTo(a))return k.subtract(a);if(0>k.signum())k.addTo(a,k);
else return k;return 0>k.signum()?k.add(a):k};j.prototype.pow=function(a){return this.exp(a,new E)};j.prototype.gcd=function(a){var b=0>this.s?this.negate():this.clone();a=0>a.s?a.negate():a.clone();if(0>b.compareTo(a)){var c=b,b=a;a=c}var c=b.getLowestSetBit(),d=a.getLowestSetBit();if(0>d)return b;c<d&&(d=c);0<d&&(b.rShiftTo(d,b),a.rShiftTo(d,a));for(;0<b.signum();)0<(c=b.getLowestSetBit())&&b.rShiftTo(c,b),0<(c=a.getLowestSetBit())&&a.rShiftTo(c,a),0<=b.compareTo(a)?(b.subTo(a,b),b.rShiftTo(1,b)):
(a.subTo(b,a),a.rShiftTo(1,a));0<d&&a.lShiftTo(d,a);return a};j.prototype.isProbablePrime=function(a){var b,c=this.abs();if(1==c.t&&c[0]<=r[r.length-1]){for(b=0;b<r.length;++b)if(c[0]==r[b])return!0;return!1}if(c.isEven())return!1;for(b=1;b<r.length;){for(var d=r[b],g=b+1;g<r.length&&d<V;)d*=r[g++];for(d=c.modInt(d);b<g;)if(0==d%r[b++])return!1}return c.millerRabin(a)};j.prototype.square=function(){var a=n();this.squareTo(a);return a};d.Math_Abs_Int64=d.Math_Abs_Int32=d.Math_Abs_Double=function(a){return Math.abs(a)};
d.Math_Max_Int32_Int32=function(a,b){return Math.max(a,b)};d.Cast_Int32=p||I||x?function(a){return a|0}:function(a){return~~a};d.Cast_Int64=y?function(a){return-2147483648>a||2147483647<a?0>a?Math.ceil(a):Math.floor(a):~~a}:H&&"function"==typeof Number.toInteger?function(a){return Number.toInteger(a)}:P||J?function(a){return parseInt(a,10)}:p?function(a){return-2147483648>a||2147483647<a?0>a?Math.ceil(a):Math.floor(a):a|0}:function(a){return 0>a?Math.ceil(a):Math.floor(a)};d.Clear=function(a){a.length=
0};d.MaxSteps=64;d.PI=3.141592653589793;d.PI2=6.283185307179586;d.IntPoint=function(){var a=arguments;1==a.length&&(this.X=a[0].X,this.Y=a[0].Y);2==a.length&&(this.X=a[0],this.Y=a[1])};d.IntRect=function(){var a=arguments;if(4==a.length){var b=a[1],c=a[2],d=a[3];this.left=a[0];this.top=b;this.right=c;this.bottom=d}else this.bottom=this.right=this.top=this.left=0};d.Polygon=function(){return[]};d.Polygons=function(){return[[]]};d.ExPolygon=function(){this.holes=this.outer=null};d.ClipType={ctIntersection:0,
ctUnion:1,ctDifference:2,ctXor:3};d.PolyType={ptSubject:0,ptClip:1};d.PolyFillType={pftEvenOdd:0,pftNonZero:1,pftPositive:2,pftNegative:3};d.JoinType={jtSquare:0,jtRound:1,jtMiter:2};d.EdgeSide={esLeft:1,esRight:2};d.Protects={ipNone:0,ipLeft:1,ipRight:2,ipBoth:3};d.Direction={dRightToLeft:0,dLeftToRight:1};d.TEdge=function(){this.tmpX=this.deltaY=this.deltaX=this.dx=this.ytop=this.xtop=this.ycurr=this.xcurr=this.ybot=this.xbot=0;this.polyType=d.PolyType.ptSubject;this.side=null;this.outIdx=this.windCnt2=
this.windCnt=this.windDelta=0;this.prevInSEL=this.nextInSEL=this.prevInAEL=this.nextInAEL=this.nextInLML=this.prev=this.next=null};d.IntersectNode=function(){this.next=this.pt=this.edge2=this.edge1=null};d.LocalMinima=function(){this.Y=0;this.next=this.rightBound=this.leftBound=null};d.Scanbeam=function(){this.Y=0;this.next=null};d.OutRec=function(){this.idx=0;this.isHole=!1;this.bottomPt=this.pts=this.AppendLink=this.FirstLeft=null};d.OutPt=function(){this.idx=0;this.prev=this.next=this.pt=null};
d.JoinRec=function(){this.pt1b=this.pt1a=null;this.poly1Idx=0;this.pt2b=this.pt2a=null;this.poly2Idx=0};d.HorzJoinRec=function(){this.edge=null;this.savedIdx=0};d.ClipperBase=function(){this.m_CurrentLM=this.m_MinimaList=null;this.m_edges=[[]];this.m_UseFullRange=!1};d.ClipperBase.horizontal=-9007199254740992;d.ClipperBase.loRange=47453132;d.ClipperBase.hiRange=0xfffffffffffff;d.ClipperBase.PointsEqual=function(a,b){return a.X==b.X&&a.Y==b.Y};d.ClipperBase.prototype.PointIsVertex=function(a,b){var c=
b;do{if(d.ClipperBase.PointsEqual(c.pt,a))return!0;c=c.next}while(c!=b);return!1};d.ClipperBase.prototype.PointInPolygon=function(a,b,c){var d=b,g=!1;if(c){do{if((d.pt.Y<=a.Y&&a.Y<d.prev.pt.Y||d.prev.pt.Y<=a.Y&&a.Y<d.pt.Y)&&0>(new j(a.X-d.pt.X)).compareTo((new j(d.prev.pt.X-d.pt.X)).multiply(new j(a.Y-d.pt.Y)).divide(new j(d.prev.pt.Y-d.pt.Y))))g=!g;d=d.next}while(d!=b)}else{do{if((d.pt.Y<=a.Y&&a.Y<d.prev.pt.Y||d.prev.pt.Y<=a.Y&&a.Y<d.pt.Y)&&a.X-d.pt.X<(d.prev.pt.X-d.pt.X)*(a.Y-d.pt.Y)/(d.prev.pt.Y-
d.pt.Y))g=!g;d=d.next}while(d!=b)}return g};d.ClipperBase.prototype.SlopesEqual=function(){var a=arguments,b,c,d,g;if(3==a.length)return b=a[0],c=a[1],(a=a[2])?(new j(b.deltaY)).multiply(new j(c.deltaX)).toString()==(new j(b.deltaX)).multiply(new j(c.deltaY)).toString():b.deltaY*c.deltaX==b.deltaX*c.deltaY;if(4==a.length)return b=a[0],c=a[1],d=a[2],(a=a[3])?(new j(b.Y-c.Y)).multiply(new j(c.X-d.X)).toString()==(new j(b.X-c.X)).multiply(new j(c.Y-d.Y)).toString():0==(b.Y-c.Y)*(c.X-d.X)-(b.X-c.X)*(c.Y-
d.Y);if(5==a.length)return b=a[0],c=a[1],d=a[2],g=a[3],(a=a[4])?(new j(b.Y-c.Y)).multiply(new j(d.X-g.X)).toString()==(new j(b.X-c.X)).multiply(new j(d.Y-g.Y)).toString():0==(b.Y-c.Y)*(d.X-g.X)-(b.X-c.X)*(d.Y-g.Y)};d.ClipperBase.prototype.Clear=function(){this.DisposeLocalMinimaList();for(var a=0;a<this.m_edges.length;++a){for(var b=0;b<this.m_edges[a].length;++b)this.m_edges[a][b]=null;d.Clear(this.m_edges[a])}d.Clear(this.m_edges);this.m_UseFullRange=!1};d.ClipperBase.prototype.DisposeLocalMinimaList=
function(){for(;null!=this.m_MinimaList;){var a=this.m_MinimaList.next;this.m_MinimaList=null;this.m_MinimaList=a}this.m_CurrentLM=null};d.ClipperBase.prototype.AddPolygons=function(a,b){var c=!1,e=!1;if(!(a instanceof Array))return c;for(var g=0;g<a.length;++g)if((e=this.AddPolygon(a[g],b,!0))&&"exceed"!=e)c=!0;else if("exceed"==e)break;"exceed"==e&&d.Error("Coordinate exceeds range bounds in AddPolygons().");return c};d.ClipperBase.prototype.AddPolygon=function(a,b,c){if(!(a instanceof Array))return!1;
var e=a.length;if(3>e)return!1;var g=new d.Polygon;g.push(new d.IntPoint(a[0].X,a[0].Y));var f=0,h,k=!1;for(h=1;h<e;++h){var j;j=this.m_UseFullRange?d.ClipperBase.hiRange:d.ClipperBase.loRange;if(d.Math_Abs_Int64(a[h].X)>j||d.Math_Abs_Int64(a[h].Y)>j){if(d.Math_Abs_Int64(a[h].X)>d.ClipperBase.hiRange||d.Math_Abs_Int64(a[h].Y)>d.ClipperBase.hiRange){if("undefined"!=typeof c)return"exceed";k=!0;break}this.m_UseFullRange=!0}d.ClipperBase.PointsEqual(g[f],a[h])||(0<f&&this.SlopesEqual(g[f-1],g[f],a[h],
this.m_UseFullRange)?d.ClipperBase.PointsEqual(g[f-1],a[h])&&f--:f++,f<g.length?g[f]=a[h]:g.push(new d.IntPoint(a[h].X,a[h].Y)))}k&&"undefined"==typeof c&&d.Error("Coordinate exceeds range bounds in AddPolygon()");if(2>f)return!1;for(e=f+1;2<e;){if(d.ClipperBase.PointsEqual(g[f],g[0]))f--;else if(d.ClipperBase.PointsEqual(g[0],g[1])||this.SlopesEqual(g[f],g[0],g[1],this.m_UseFullRange))g[0]=g[f--];else if(this.SlopesEqual(g[f-1],g[f],g[0],this.m_UseFullRange))f--;else if(this.SlopesEqual(g[0],g[1],
g[2],this.m_UseFullRange)){for(h=2;h<=f;++h)g[h-1]=g[h];f--}else break;e--}if(3>e)return!1;a=[];for(h=0;h<e;h++)a.push(new d.TEdge);this.m_edges.push(a);a[0].xcurr=g[0].X;a[0].ycurr=g[0].Y;this.InitEdge(a[e-1],a[0],a[e-2],g[e-1],b);for(h=e-2;0<h;--h)this.InitEdge(a[h],a[h+1],a[h-1],g[h],b);this.InitEdge(a[0],a[1],a[e-1],g[0],b);e=b=a[0];do b.xcurr=b.xbot,b.ycurr=b.ybot,b.ytop<e.ytop&&(e=b),b=b.next;while(b!=a[0]);0<e.windDelta&&(e=e.next);e.dx==d.ClipperBase.horizontal&&(e=e.next);b=e;do b=this.AddBoundsToLML(b);
while(b!=e);return!0};d.ClipperBase.prototype.InitEdge=function(a,b,c,d,g){a.next=b;a.prev=c;a.xcurr=d.X;a.ycurr=d.Y;a.ycurr>=a.next.ycurr?(a.xbot=a.xcurr,a.ybot=a.ycurr,a.xtop=a.next.xcurr,a.ytop=a.next.ycurr,a.windDelta=1):(a.xtop=a.xcurr,a.ytop=a.ycurr,a.xbot=a.next.xcurr,a.ybot=a.next.ycurr,a.windDelta=-1);this.SetDx(a);a.polyType=g;a.outIdx=-1};d.ClipperBase.prototype.SetDx=function(a){a.deltaX=a.xtop-a.xbot;a.deltaY=a.ytop-a.ybot;a.dx=0==a.deltaY?d.ClipperBase.horizontal:a.deltaX/a.deltaY};
d.ClipperBase.prototype.AddBoundsToLML=function(a){a.nextInLML=null;for(a=a.next;;){if(a.dx==d.ClipperBase.horizontal){if(a.next.ytop<a.ytop&&a.next.xbot>a.prev.xbot)break;a.xtop!=a.prev.xbot&&this.SwapX(a);a.nextInLML=a.prev}else if(a.ycurr==a.prev.ycurr)break;else a.nextInLML=a.prev;a=a.next}var b=new d.LocalMinima;b.next=null;b.Y=a.prev.ybot;a.dx==d.ClipperBase.horizontal?(a.xbot!=a.prev.xbot&&this.SwapX(a),b.leftBound=a.prev,b.rightBound=a):a.dx<a.prev.dx?(b.leftBound=a.prev,b.rightBound=a):(b.leftBound=
a,b.rightBound=a.prev);b.leftBound.side=d.EdgeSide.esLeft;b.rightBound.side=d.EdgeSide.esRight;for(this.InsertLocalMinima(b);!(a.next.ytop==a.ytop&&a.next.dx!=d.ClipperBase.horizontal);)a=a.nextInLML=a.next,a.dx==d.ClipperBase.horizontal&&a.xbot!=a.prev.xtop&&this.SwapX(a);return a.next};d.ClipperBase.prototype.InsertLocalMinima=function(a){if(null==this.m_MinimaList)this.m_MinimaList=a;else if(a.Y>=this.m_MinimaList.Y)a.next=this.m_MinimaList,this.m_MinimaList=a;else{for(var b=this.m_MinimaList;null!=
b.next&&a.Y<b.next.Y;)b=b.next;a.next=b.next;b.next=a}};d.ClipperBase.prototype.PopLocalMinima=function(){null!=this.m_CurrentLM&&(this.m_CurrentLM=this.m_CurrentLM.next)};d.ClipperBase.prototype.SwapX=function(a){a.xcurr=a.xtop;a.xtop=a.xbot;a.xbot=a.xcurr};d.ClipperBase.prototype.Reset=function(){for(var a=this.m_CurrentLM=this.m_MinimaList;null!=a;){for(var b=a.leftBound;null!=b;)b.xcurr=b.xbot,b.ycurr=b.ybot,b.side=d.EdgeSide.esLeft,b.outIdx=-1,b=b.nextInLML;for(b=a.rightBound;null!=b;)b.xcurr=
b.xbot,b.ycurr=b.ybot,b.side=d.EdgeSide.esRight,b.outIdx=-1,b=b.nextInLML;a=a.next}};d.ClipperBase.prototype.GetBounds=function(){var a=new d.IntRect,b=this.m_MinimaList;if(null==b)return a;a.left=b.leftBound.xbot;a.top=b.leftBound.ybot;a.right=b.leftBound.xbot;for(a.bottom=b.leftBound.ybot;null!=b;){b.leftBound.ybot>a.bottom&&(a.bottom=b.leftBound.ybot);for(var c=b.leftBound;;){for(var e=c;null!=c.nextInLML;)c.xbot<a.left&&(a.left=c.xbot),c.xbot>a.right&&(a.right=c.xbot),c=c.nextInLML;c.xbot<a.left&&
(a.left=c.xbot);c.xbot>a.right&&(a.right=c.xbot);c.xtop<a.left&&(a.left=c.xtop);c.xtop>a.right&&(a.right=c.xtop);c.ytop<a.top&&(a.top=c.ytop);if(e==b.leftBound)c=b.rightBound;else break}b=b.next}return a};d.Clipper=function(){this.m_PolyOuts=null;this.m_ClipType=d.ClipType.ctIntersection;this.m_IntersectNodes=this.m_SortedEdges=this.m_ActiveEdges=this.m_Scanbeam=null;this.m_ExecuteLocked=!1;this.m_SubjFillType=this.m_ClipFillType=d.PolyFillType.pftEvenOdd;this.m_HorizJoins=this.m_Joins=null;this.m_UsingExPolygons=
this.m_ReverseOutput=!1;d.ClipperBase.call(this);this.m_IntersectNodes=this.m_SortedEdges=this.m_ActiveEdges=this.m_Scanbeam=null;this.m_ExecuteLocked=!1;this.m_PolyOuts=[];this.m_Joins=[];this.m_HorizJoins=[];this.m_UsingExPolygons=this.m_ReverseOutput=!1};d.Clipper.prototype.Clear=function(){0!=this.m_edges.length&&(this.DisposeAllPolyPts(),d.ClipperBase.prototype.Clear.call(this))};d.Clipper.prototype.DisposeScanbeamList=function(){for(;null!=this.m_Scanbeam;){var a=this.m_Scanbeam.next;this.m_Scanbeam=
null;this.m_Scanbeam=a}};d.Clipper.prototype.Reset=function(){d.ClipperBase.prototype.Reset.call(this);this.m_SortedEdges=this.m_ActiveEdges=this.m_Scanbeam=null;this.DisposeAllPolyPts();for(var a=this.m_MinimaList;null!=a;)this.InsertScanbeam(a.Y),this.InsertScanbeam(a.leftBound.ytop),a=a.next};d.Clipper.prototype.get_ReverseSolution=function(){return this.m_ReverseOutput};d.Clipper.prototype.set_ReverseSolution=function(a){this.m_ReverseOutput=a};d.Clipper.prototype.InsertScanbeam=function(a){var b;
if(null==this.m_Scanbeam)this.m_Scanbeam=new d.Scanbeam,this.m_Scanbeam.next=null,this.m_Scanbeam.Y=a;else if(a>this.m_Scanbeam.Y)b=new d.Scanbeam,b.Y=a,b.next=this.m_Scanbeam,this.m_Scanbeam=b;else{for(var c=this.m_Scanbeam;null!=c.next&&a<=c.next.Y;)c=c.next;a!=c.Y&&(b=new d.Scanbeam,b.Y=a,b.next=c.next,c.next=b)}};d.Clipper.prototype.Execute=function(a,b,c,e){var g;2==arguments.length&&(e=c=d.PolyFillType.pftEvenOdd);if(b.hasOwnProperty("outer")){if(this.m_ExecuteLocked)return!1;this.m_ExecuteLocked=
!0;d.Clear(b);this.m_SubjFillType=c;this.m_ClipFillType=e;this.m_ClipType=a;this.m_UsingExPolygons=!0;(g=this.ExecuteInternal())&&this.BuildResultEx(b)}else{if(this.m_ExecuteLocked)return!1;this.m_ExecuteLocked=!0;d.Clear(b);this.m_SubjFillType=c;this.m_ClipFillType=e;this.m_ClipType=a;this.m_UsingExPolygons=!1;(g=this.ExecuteInternal())&&this.BuildResult(b)}this.m_ExecuteLocked=!1;return g};d.Clipper.prototype.PolySort=function(a,b){if(a==b)return 0;if(null==a.pts||null==b.pts)return null==a.pts!=
(null==b.pts)?null==a.pts?1:-1:0;var c=(a.isHole?a.FirstLeft.idx:a.idx)-(b.isHole?b.FirstLeft.idx:b.idx);return 0==c&&a.isHole!=b.isHole?a.isHole?1:-1:c};d.Clipper.prototype.FindAppendLinkEnd=function(a){for(;null!=a.AppendLink;)a=a.AppendLink;return a};d.Clipper.prototype.FixHoleLinkage=function(a){var b;b=null!=a.bottomPt?this.m_PolyOuts[a.bottomPt.idx].FirstLeft:a.FirstLeft;a==b&&d.Error("HoleLinkage error");null!=b&&(null!=b.AppendLink&&(b=this.FindAppendLinkEnd(b)),b==a?b=null:b.isHole&&(this.FixHoleLinkage(b),
b=b.FirstLeft));a.FirstLeft=b;null==b&&(a.isHole=!1);a.AppendLink=null};d.Clipper.prototype.ExecuteInternal=function(){var a;try{this.Reset();if(null==this.m_CurrentLM)return!0;var b=this.PopScanbeam();do{this.InsertLocalMinimaIntoAEL(b);d.Clear(this.m_HorizJoins);this.ProcessHorizontals();var c=this.PopScanbeam();a=this.ProcessIntersections(b,c);if(!a)break;this.ProcessEdgesAtTopOfScanbeam(c);b=c}while(null!=this.m_Scanbeam)}catch(e){a=!1}if(a){for(c=0;c<this.m_PolyOuts.length;c++)b=this.m_PolyOuts[c],
null!=b.pts&&(this.FixupOutPolygon(b),null!=b.pts&&(b.isHole&&this.m_UsingExPolygons&&this.FixHoleLinkage(b),(b.isHole^this.m_ReverseOutput)==0<this.Area(b,this.m_UseFullRange)&&this.ReversePolyPtLinks(b.pts)));this.JoinCommonEdges();this.m_UsingExPolygons&&this.m_PolyOuts.sort(this.PolySort)}d.Clear(this.m_Joins);d.Clear(this.m_HorizJoins);return a};d.Clipper.prototype.PopScanbeam=function(){var a=this.m_Scanbeam.Y;this.m_Scanbeam=this.m_Scanbeam.next;return a};d.Clipper.prototype.DisposeAllPolyPts=
function(){for(var a=0;a<this.m_PolyOuts.length;++a)this.DisposeOutRec(a);d.Clear(this.m_PolyOuts)};d.Clipper.prototype.DisposeOutRec=function(a){var b=this.m_PolyOuts[a];null!=b.pts&&this.DisposeOutPts(b.pts);this.m_PolyOuts[a]=null};d.Clipper.prototype.DisposeOutPts=function(a){if(null!=a)for(a.prev.next=null;null!=a;)a=a.next};d.Clipper.prototype.AddJoin=function(a,b,c,e){var g=new d.JoinRec;g.poly1Idx=0<=c?c:a.outIdx;g.pt1a=new d.IntPoint(a.xcurr,a.ycurr);g.pt1b=new d.IntPoint(a.xtop,a.ytop);
g.poly2Idx=0<=e?e:b.outIdx;g.pt2a=new d.IntPoint(b.xcurr,b.ycurr);g.pt2b=new d.IntPoint(b.xtop,b.ytop);this.m_Joins.push(g)};d.Clipper.prototype.AddHorzJoin=function(a,b){var c=new d.HorzJoinRec;c.edge=a;c.savedIdx=b;this.m_HorizJoins.push(c)};d.Clipper.prototype.InsertLocalMinimaIntoAEL=function(a){for(var b,c;null!=this.m_CurrentLM&&this.m_CurrentLM.Y==a;){var e=this.m_CurrentLM.leftBound,g=this.m_CurrentLM.rightBound;this.InsertEdgeIntoAEL(e);this.InsertScanbeam(e.ytop);this.InsertEdgeIntoAEL(g);
this.IsEvenOddFillType(e)?(e.windDelta=1,g.windDelta=1):g.windDelta=-e.windDelta;this.SetWindingCount(e);g.windCnt=e.windCnt;g.windCnt2=e.windCnt2;g.dx==d.ClipperBase.horizontal?(this.AddEdgeToSEL(g),this.InsertScanbeam(g.nextInLML.ytop)):this.InsertScanbeam(g.ytop);this.IsContributing(e)&&this.AddLocalMinPoly(e,g,new d.IntPoint(e.xcurr,this.m_CurrentLM.Y));if(0<=g.outIdx&&g.dx==d.ClipperBase.horizontal)for(var f=0;f<this.m_HorizJoins.length;f++){b=new d.IntPoint;c=new d.IntPoint;var h=this.m_HorizJoins[f];
b={Value:b};c={Value:c};this.GetOverlapSegment(new d.IntPoint(h.edge.xbot,h.edge.ybot),new d.IntPoint(h.edge.xtop,h.edge.ytop),new d.IntPoint(g.xbot,g.ybot),new d.IntPoint(g.xtop,g.ytop),b,c)&&this.AddJoin(h.edge,g,h.savedIdx,-1)}if(e.nextInAEL!=g){0<=g.outIdx&&(0<=g.prevInAEL.outIdx&&this.SlopesEqual(g.prevInAEL,g,this.m_UseFullRange))&&this.AddJoin(g,g.prevInAEL,-1,-1);c=e.nextInAEL;for(b=new d.IntPoint(e.xcurr,e.ycurr);c!=g;)null==c&&d.Error("InsertLocalMinimaIntoAEL: missing rightbound!"),this.IntersectEdges(g,
c,b,d.Protects.ipNone),c=c.nextInAEL}this.PopLocalMinima()}};d.Clipper.prototype.InsertEdgeIntoAEL=function(a){a.prevInAEL=null;a.nextInAEL=null;if(null==this.m_ActiveEdges)this.m_ActiveEdges=a;else if(this.E2InsertsBeforeE1(this.m_ActiveEdges,a))a.nextInAEL=this.m_ActiveEdges,this.m_ActiveEdges=this.m_ActiveEdges.prevInAEL=a;else{for(var b=this.m_ActiveEdges;null!=b.nextInAEL&&!this.E2InsertsBeforeE1(b.nextInAEL,a);)b=b.nextInAEL;a.nextInAEL=b.nextInAEL;null!=b.nextInAEL&&(b.nextInAEL.prevInAEL=
a);a.prevInAEL=b;b.nextInAEL=a}};d.Clipper.prototype.E2InsertsBeforeE1=function(a,b){return b.xcurr==a.xcurr?b.dx>a.dx:b.xcurr<a.xcurr};d.Clipper.prototype.IsEvenOddFillType=function(a){return a.polyType==d.PolyType.ptSubject?this.m_SubjFillType==d.PolyFillType.pftEvenOdd:this.m_ClipFillType==d.PolyFillType.pftEvenOdd};d.Clipper.prototype.IsEvenOddAltFillType=function(a){return a.polyType==d.PolyType.ptSubject?this.m_ClipFillType==d.PolyFillType.pftEvenOdd:this.m_SubjFillType==d.PolyFillType.pftEvenOdd};
d.Clipper.prototype.IsContributing=function(a){var b,c;a.polyType==d.PolyType.ptSubject?(b=this.m_SubjFillType,c=this.m_ClipFillType):(b=this.m_ClipFillType,c=this.m_SubjFillType);switch(b){case d.PolyFillType.pftEvenOdd:case d.PolyFillType.pftNonZero:if(1!=d.Math_Abs_Int32(a.windCnt))return!1;break;case d.PolyFillType.pftPositive:if(1!=a.windCnt)return!1;break;default:if(-1!=a.windCnt)return!1}switch(this.m_ClipType){case d.ClipType.ctIntersection:switch(c){case d.PolyFillType.pftEvenOdd:case d.PolyFillType.pftNonZero:return 0!=
a.windCnt2;case d.PolyFillType.pftPositive:return 0<a.windCnt2;default:return 0>a.windCnt2}case d.ClipType.ctUnion:switch(c){case d.PolyFillType.pftEvenOdd:case d.PolyFillType.pftNonZero:return 0==a.windCnt2;case d.PolyFillType.pftPositive:return 0>=a.windCnt2;default:return 0<=a.windCnt2}case d.ClipType.ctDifference:if(a.polyType==d.PolyType.ptSubject)switch(c){case d.PolyFillType.pftEvenOdd:case d.PolyFillType.pftNonZero:return 0==a.windCnt2;case d.PolyFillType.pftPositive:return 0>=a.windCnt2;
default:return 0<=a.windCnt2}else switch(c){case d.PolyFillType.pftEvenOdd:case d.PolyFillType.pftNonZero:return 0!=a.windCnt2;case d.PolyFillType.pftPositive:return 0<a.windCnt2;default:return 0>a.windCnt2}}return!0};d.Clipper.prototype.SetWindingCount=function(a){for(var b=a.prevInAEL;null!=b&&b.polyType!=a.polyType;)b=b.prevInAEL;null==b?(a.windCnt=a.windDelta,a.windCnt2=0,b=this.m_ActiveEdges):(a.windCnt=this.IsEvenOddFillType(a)?1:0>b.windCnt*b.windDelta?1<d.Math_Abs_Int32(b.windCnt)?0>b.windDelta*
a.windDelta?b.windCnt:b.windCnt+a.windDelta:b.windCnt+b.windDelta+a.windDelta:1<d.Math_Abs_Int32(b.windCnt)&&0>b.windDelta*a.windDelta?b.windCnt:0==b.windCnt+a.windDelta?b.windCnt:b.windCnt+a.windDelta,a.windCnt2=b.windCnt2,b=b.nextInAEL);if(this.IsEvenOddAltFillType(a))for(;b!=a;)a.windCnt2=0==a.windCnt2?1:0,b=b.nextInAEL;else for(;b!=a;)a.windCnt2+=b.windDelta,b=b.nextInAEL};d.Clipper.prototype.AddEdgeToSEL=function(a){null==this.m_SortedEdges?(this.m_SortedEdges=a,a.prevInSEL=null,a.nextInSEL=
null):(a.nextInSEL=this.m_SortedEdges,a.prevInSEL=null,this.m_SortedEdges=this.m_SortedEdges.prevInSEL=a)};d.Clipper.prototype.CopyAELToSEL=function(){var a=this.m_ActiveEdges;this.m_SortedEdges=a;if(null!=this.m_ActiveEdges){this.m_SortedEdges.prevInSEL=null;for(a=a.nextInAEL;null!=a;)a.prevInSEL=a.prevInAEL,a.prevInSEL.nextInSEL=a,a.nextInSEL=null,a=a.nextInAEL}};d.Clipper.prototype.SwapPositionsInAEL=function(a,b){var c,d;!(null==a.nextInAEL&&null==a.prevInAEL)&&!(null==b.nextInAEL&&null==b.prevInAEL)&&
(a.nextInAEL==b?(c=b.nextInAEL,null!=c&&(c.prevInAEL=a),d=a.prevInAEL,null!=d&&(d.nextInAEL=b),b.prevInAEL=d,b.nextInAEL=a,a.prevInAEL=b,a.nextInAEL=c):b.nextInAEL==a?(c=a.nextInAEL,null!=c&&(c.prevInAEL=b),d=b.prevInAEL,null!=d&&(d.nextInAEL=a),a.prevInAEL=d,a.nextInAEL=b,b.prevInAEL=a,b.nextInAEL=c):(c=a.nextInAEL,d=a.prevInAEL,a.nextInAEL=b.nextInAEL,null!=a.nextInAEL&&(a.nextInAEL.prevInAEL=a),a.prevInAEL=b.prevInAEL,null!=a.prevInAEL&&(a.prevInAEL.nextInAEL=a),b.nextInAEL=c,null!=b.nextInAEL&&
(b.nextInAEL.prevInAEL=b),b.prevInAEL=d,null!=b.prevInAEL&&(b.prevInAEL.nextInAEL=b)),null==a.prevInAEL?this.m_ActiveEdges=a:null==b.prevInAEL&&(this.m_ActiveEdges=b))};d.Clipper.prototype.SwapPositionsInSEL=function(a,b){var c,d;!(null==a.nextInSEL&&null==a.prevInSEL)&&!(null==b.nextInSEL&&null==b.prevInSEL)&&(a.nextInSEL==b?(c=b.nextInSEL,null!=c&&(c.prevInSEL=a),d=a.prevInSEL,null!=d&&(d.nextInSEL=b),b.prevInSEL=d,b.nextInSEL=a,a.prevInSEL=b,a.nextInSEL=c):b.nextInSEL==a?(c=a.nextInSEL,null!=c&&
(c.prevInSEL=b),d=b.prevInSEL,null!=d&&(d.nextInSEL=a),a.prevInSEL=d,a.nextInSEL=b,b.prevInSEL=a,b.nextInSEL=c):(c=a.nextInSEL,d=a.prevInSEL,a.nextInSEL=b.nextInSEL,null!=a.nextInSEL&&(a.nextInSEL.prevInSEL=a),a.prevInSEL=b.prevInSEL,null!=a.prevInSEL&&(a.prevInSEL.nextInSEL=a),b.nextInSEL=c,null!=b.nextInSEL&&(b.nextInSEL.prevInSEL=b),b.prevInSEL=d,null!=b.prevInSEL&&(b.prevInSEL.nextInSEL=b)),null==a.prevInSEL?this.m_SortedEdges=a:null==b.prevInSEL&&(this.m_SortedEdges=b))};d.Clipper.prototype.AddLocalMaxPoly=
function(a,b,c){this.AddOutPt(a,c);a.outIdx==b.outIdx?(a.outIdx=-1,b.outIdx=-1):a.outIdx<b.outIdx?this.AppendPolygon(a,b):this.AppendPolygon(b,a)};d.Clipper.prototype.AddLocalMinPoly=function(a,b,c){var e;b.dx==d.ClipperBase.horizontal||a.dx>b.dx?(this.AddOutPt(a,c),b.outIdx=a.outIdx,a.side=d.EdgeSide.esLeft,b.side=d.EdgeSide.esRight,e=a,a=e.prevInAEL==b?b.prevInAEL:e.prevInAEL):(this.AddOutPt(b,c),a.outIdx=b.outIdx,a.side=d.EdgeSide.esRight,b.side=d.EdgeSide.esLeft,e=b,a=e.prevInAEL==a?a.prevInAEL:
e.prevInAEL);null!=a&&(0<=a.outIdx&&d.Clipper.TopX(a,c.Y)==d.Clipper.TopX(e,c.Y)&&this.SlopesEqual(e,a,this.m_UseFullRange))&&this.AddJoin(e,a,-1,-1)};d.Clipper.prototype.CreateOutRec=function(){var a=new d.OutRec;a.idx=-1;a.isHole=!1;a.FirstLeft=null;a.AppendLink=null;a.pts=null;a.bottomPt=null;return a};d.Clipper.prototype.AddOutPt=function(a,b){var c,e,g=a.side==d.EdgeSide.esLeft;if(0>a.outIdx)c=this.CreateOutRec(),this.m_PolyOuts.push(c),c.idx=this.m_PolyOuts.length-1,a.outIdx=c.idx,e=new d.OutPt,
c.pts=e,c.bottomPt=e,e.pt=b,e.idx=c.idx,e.next=e,e.prev=e,this.SetHoleState(a,c);else{c=this.m_PolyOuts[a.outIdx];e=c.pts;var f;g&&d.ClipperBase.PointsEqual(b,e.pt)||!g&&d.ClipperBase.PointsEqual(b,e.prev.pt)||(f=new d.OutPt,f.pt=b,f.idx=c.idx,f.pt.Y==c.bottomPt.pt.Y&&f.pt.X<c.bottomPt.pt.X&&(c.bottomPt=f),f.next=e,f.prev=e.prev,f.prev.next=f,e.prev=f,g&&(c.pts=f))}};d.Clipper.prototype.SwapPoints=function(a,b){var c=a.Value;a.Value=b.Value;b.Value=c};d.Clipper.prototype.GetOverlapSegment=function(a,
b,c,e,g,f){if(d.Math_Abs_Int64(a.X-b.X)>d.Math_Abs_Int64(a.Y-b.Y))return a.X>b.X&&(a={Value:a},b={Value:b},this.SwapPoints(a,b),a=a.Value,b=b.Value),c.X>e.X&&(c={Value:c},e={Value:e},this.SwapPoints(c,e),c=c.Value,e=e.Value),g.Value=a.X>c.X?a:c,f.Value=b.X<e.X?b:e,g.Value.X<f.Value.X;a.Y<b.Y&&(a={Value:a},b={Value:b},this.SwapPoints(a,b),a=a.Value,b=b.Value);c.Y<e.Y&&(c={Value:c},e={Value:e},this.SwapPoints(c,e),c=c.Value,e=e.Value);g.Value=a.Y<c.Y?a:c;f.Value=b.Y>e.Y?b:e;return g.Value.Y>f.Value.Y};
d.Clipper.prototype.FindSegment=function(a,b,c){if(null==a.Value)return!1;var e=a.Value,g=new d.IntPoint(b.Value),f=new d.IntPoint(c.Value);do{if(this.SlopesEqual(g,f,a.Value.pt,a.Value.prev.pt,!0)&&this.SlopesEqual(g,f,a.Value.pt,!0)&&this.GetOverlapSegment(g,f,a.Value.pt,a.Value.prev.pt,b,c))return!0;a.Value=a.Value.next}while(a.Value!=e);return!1};d.Clipper.prototype.Pt3IsBetweenPt1AndPt2=function(a,b,c){return d.ClipperBase.PointsEqual(a,c)||d.ClipperBase.PointsEqual(b,c)?!0:a.X!=b.X?a.X<c.X==
c.X<b.X:a.Y<c.Y==c.Y<b.Y};d.Clipper.prototype.InsertPolyPtBetween=function(a,b,c){var e=new d.OutPt;e.pt=c;b==a.next?(a.next=e,b.prev=e,e.next=b,e.prev=a):(b.next=e,a.prev=e,e.next=a,e.prev=b);return e};d.Clipper.prototype.SetHoleState=function(a,b){for(var c=!1,d=a.prevInAEL;null!=d;)0<=d.outIdx&&(c=!c,null==b.FirstLeft&&(b.FirstLeft=this.m_PolyOuts[d.outIdx])),d=d.prevInAEL;c&&(b.isHole=!0)};d.Clipper.prototype.GetDx=function(a,b){return a.Y==b.Y?d.ClipperBase.horizontal:(b.X-a.X)/(b.Y-a.Y)};d.Clipper.prototype.FirstIsBottomPt=
function(a,b){for(var c=a.prev;d.ClipperBase.PointsEqual(c.pt,a.pt)&&c!=a;)c=c.prev;for(var e=d.Math_Abs_Double(this.GetDx(a.pt,c.pt)),c=a.next;d.ClipperBase.PointsEqual(c.pt,a.pt)&&c!=a;)c=c.next;for(var g=d.Math_Abs_Double(this.GetDx(a.pt,c.pt)),c=b.prev;d.ClipperBase.PointsEqual(c.pt,b.pt)&&c!=b;)c=c.prev;for(var f=d.Math_Abs_Double(this.GetDx(b.pt,c.pt)),c=b.next;d.ClipperBase.PointsEqual(c.pt,b.pt)&&c!=b;)c=c.next;c=d.Math_Abs_Double(this.GetDx(b.pt,c.pt));return e>=f&&e>=c||g>=f&&g>=c};d.Clipper.prototype.GetBottomPt=
function(a){for(var b=null,c=a.next;c!=a;)c.pt.Y>a.pt.Y?(a=c,b=null):c.pt.Y==a.pt.Y&&c.pt.X<=a.pt.X&&(c.pt.X<a.pt.X?(b=null,a=c):c.next!=a&&c.prev!=a&&(b=c)),c=c.next;if(null!=b)for(;b!=c;){this.FirstIsBottomPt(c,b)||(a=b);for(b=b.next;!d.ClipperBase.PointsEqual(b.pt,a.pt);)b=b.next}return a};d.Clipper.prototype.GetLowermostRec=function(a,b){var c=a.bottomPt,d=b.bottomPt;return c.pt.Y>d.pt.Y?a:c.pt.Y<d.pt.Y?b:c.pt.X<d.pt.X?a:c.pt.X>d.pt.X?b:c.next==c?b:d.next==d?a:this.FirstIsBottomPt(c,d)?a:b};d.Clipper.prototype.Param1RightOfParam2=
function(a,b){do if(a=a.FirstLeft,a==b)return!0;while(null!=a);return!1};d.Clipper.prototype.AppendPolygon=function(a,b){var c=this.m_PolyOuts[a.outIdx],e=this.m_PolyOuts[b.outIdx],g;g=this.Param1RightOfParam2(c,e)?e:this.Param1RightOfParam2(e,c)?c:this.GetLowermostRec(c,e);var f=c.pts,h=f.prev,k=e.pts,j=k.prev;a.side==d.EdgeSide.esLeft?(b.side==d.EdgeSide.esLeft?(this.ReversePolyPtLinks(k),k.next=f,f.prev=k,h.next=j,j.prev=h,c.pts=j):(j.next=f,f.prev=j,k.prev=h,h.next=k,c.pts=k),f=d.EdgeSide.esLeft):
(b.side==d.EdgeSide.esRight?(this.ReversePolyPtLinks(k),h.next=j,j.prev=h,k.next=f,f.prev=k):(h.next=k,k.prev=h,f.prev=j,j.next=f),f=d.EdgeSide.esRight);g==e&&(c.bottomPt=e.bottomPt,c.bottomPt.idx=c.idx,e.FirstLeft!=c&&(c.FirstLeft=e.FirstLeft),c.isHole=e.isHole);e.pts=null;e.bottomPt=null;e.AppendLink=c;c=a.outIdx;e=b.outIdx;a.outIdx=-1;b.outIdx=-1;for(g=this.m_ActiveEdges;null!=g;){if(g.outIdx==e){g.outIdx=c;g.side=f;break}g=g.nextInAEL}for(g=0;g<this.m_Joins.length;++g)this.m_Joins[g].poly1Idx==
e&&(this.m_Joins[g].poly1Idx=c),this.m_Joins[g].poly2Idx==e&&(this.m_Joins[g].poly2Idx=c);for(g=0;g<this.m_HorizJoins.length;++g)this.m_HorizJoins[g].savedIdx==e&&(this.m_HorizJoins[g].savedIdx=c)};d.Clipper.prototype.ReversePolyPtLinks=function(a){if(null!=a){var b,c;b=a;do c=b.next,b.next=b.prev,b=b.prev=c;while(b!=a)}};d.Clipper.SwapSides=function(a,b){var c=a.side;a.side=b.side;b.side=c};d.Clipper.SwapPolyIndexes=function(a,b){var c=a.outIdx;a.outIdx=b.outIdx;b.outIdx=c};d.Clipper.prototype.DoEdge1=
function(a,b,c){this.AddOutPt(a,c);d.Clipper.SwapSides(a,b);d.Clipper.SwapPolyIndexes(a,b)};d.Clipper.prototype.DoEdge2=function(a,b,c){this.AddOutPt(b,c);d.Clipper.SwapSides(a,b);d.Clipper.SwapPolyIndexes(a,b)};d.Clipper.prototype.DoBothEdges=function(a,b,c){this.AddOutPt(a,c);this.AddOutPt(b,c);d.Clipper.SwapSides(a,b);d.Clipper.SwapPolyIndexes(a,b)};d.Clipper.prototype.IntersectEdges=function(a,b,c,e){var g=0==(d.Protects.ipLeft&e)&&null==a.nextInLML&&a.xtop==c.X&&a.ytop==c.Y;e=0==(d.Protects.ipRight&
e)&&null==b.nextInLML&&b.xtop==c.X&&b.ytop==c.Y;var f=0<=a.outIdx,h=0<=b.outIdx;if(a.polyType==b.polyType)if(this.IsEvenOddFillType(a)){var j=a.windCnt;a.windCnt=b.windCnt;b.windCnt=j}else a.windCnt=0==a.windCnt+b.windDelta?-a.windCnt:a.windCnt+b.windDelta,b.windCnt=0==b.windCnt-a.windDelta?-b.windCnt:b.windCnt-a.windDelta;else a.windCnt2=this.IsEvenOddFillType(b)?0==a.windCnt2?1:0:a.windCnt2+b.windDelta,b.windCnt2=this.IsEvenOddFillType(a)?0==b.windCnt2?1:0:b.windCnt2-a.windDelta;var m,l,n;a.polyType==
d.PolyType.ptSubject?(m=this.m_SubjFillType,n=this.m_ClipFillType):(m=this.m_ClipFillType,n=this.m_SubjFillType);b.polyType==d.PolyType.ptSubject?(l=this.m_SubjFillType,j=this.m_ClipFillType):(l=this.m_ClipFillType,j=this.m_SubjFillType);switch(m){case d.PolyFillType.pftPositive:m=a.windCnt;break;case d.PolyFillType.pftNegative:m=-a.windCnt;break;default:m=d.Math_Abs_Int32(a.windCnt)}switch(l){case d.PolyFillType.pftPositive:l=b.windCnt;break;case d.PolyFillType.pftNegative:l=-b.windCnt;break;default:l=
d.Math_Abs_Int32(b.windCnt)}if(f&&h)g||e||0!=m&&1!=m||0!=l&&1!=l||a.polyType!=b.polyType&&this.m_ClipType!=d.ClipType.ctXor?this.AddLocalMaxPoly(a,b,c):this.DoBothEdges(a,b,c);else if(f)(0==l||1==l)&&(this.m_ClipType!=d.ClipType.ctIntersection||b.polyType==d.PolyType.ptSubject||0!=b.windCnt2)&&this.DoEdge1(a,b,c);else if(h)(0==m||1==m)&&(this.m_ClipType!=d.ClipType.ctIntersection||a.polyType==d.PolyType.ptSubject||0!=a.windCnt2)&&this.DoEdge2(a,b,c);else if((0==m||1==m)&&(0==l||1==l)&&!g&&!e){switch(n){case d.PolyFillType.pftPositive:f=
a.windCnt2;break;case d.PolyFillType.pftNegative:f=-a.windCnt2;break;default:f=d.Math_Abs_Int32(a.windCnt2)}switch(j){case d.PolyFillType.pftPositive:h=b.windCnt2;break;case d.PolyFillType.pftNegative:h=-b.windCnt2;break;default:h=d.Math_Abs_Int32(b.windCnt2)}if(a.polyType!=b.polyType)this.AddLocalMinPoly(a,b,c);else if(1==m&&1==l)switch(this.m_ClipType){case d.ClipType.ctIntersection:0<f&&0<h&&this.AddLocalMinPoly(a,b,c);break;case d.ClipType.ctUnion:0>=f&&0>=h&&this.AddLocalMinPoly(a,b,c);break;
case d.ClipType.ctDifference:(a.polyType==d.PolyType.ptClip&&0<f&&0<h||a.polyType==d.PolyType.ptSubject&&0>=f&&0>=h)&&this.AddLocalMinPoly(a,b,c);break;case d.ClipType.ctXor:this.AddLocalMinPoly(a,b,c)}else d.Clipper.SwapSides(a,b)}if(g!=e&&(g&&0<=a.outIdx||e&&0<=b.outIdx))d.Clipper.SwapSides(a,b),d.Clipper.SwapPolyIndexes(a,b);g&&this.DeleteFromAEL(a);e&&this.DeleteFromAEL(b)};d.Clipper.prototype.DeleteFromAEL=function(a){var b=a.prevInAEL,c=a.nextInAEL;null==b&&null==c&&a!=this.m_ActiveEdges||(null!=
b?b.nextInAEL=c:this.m_ActiveEdges=c,null!=c&&(c.prevInAEL=b),a.nextInAEL=null,a.prevInAEL=null)};d.Clipper.prototype.DeleteFromSEL=function(a){var b=a.prevInSEL,c=a.nextInSEL;null==b&&null==c&&a!=this.m_SortedEdges||(null!=b?b.nextInSEL=c:this.m_SortedEdges=c,null!=c&&(c.prevInSEL=b),a.nextInSEL=null,a.prevInSEL=null)};d.Clipper.prototype.UpdateEdgeIntoAEL=function(a){null==a.Value.nextInLML&&d.Error("UpdateEdgeIntoAEL: invalid call");var b=a.Value.prevInAEL,c=a.Value.nextInAEL;a.Value.nextInLML.outIdx=
a.Value.outIdx;null!=b?b.nextInAEL=a.Value.nextInLML:this.m_ActiveEdges=a.Value.nextInLML;null!=c&&(c.prevInAEL=a.Value.nextInLML);a.Value.nextInLML.side=a.Value.side;a.Value.nextInLML.windDelta=a.Value.windDelta;a.Value.nextInLML.windCnt=a.Value.windCnt;a.Value.nextInLML.windCnt2=a.Value.windCnt2;a.Value=a.Value.nextInLML;a.Value.prevInAEL=b;a.Value.nextInAEL=c;a.Value.dx!=d.ClipperBase.horizontal&&this.InsertScanbeam(a.Value.ytop)};d.Clipper.prototype.ProcessHorizontals=function(){for(var a=this.m_SortedEdges;null!=
a;)this.DeleteFromSEL(a),this.ProcessHorizontal(a),a=this.m_SortedEdges};d.Clipper.prototype.ProcessHorizontal=function(a){var b,c,e;a.xcurr<a.xtop?(c=a.xcurr,e=a.xtop,b=d.Direction.dLeftToRight):(c=a.xtop,e=a.xcurr,b=d.Direction.dRightToLeft);var g;g=null!=a.nextInLML?null:this.GetMaximaPair(a);for(var f=this.GetNextInAEL(a,b);null!=f;){var h=this.GetNextInAEL(f,b);if(null!=g||b==d.Direction.dLeftToRight&&f.xcurr<=e||b==d.Direction.dRightToLeft&&f.xcurr>=c){if(f.xcurr==a.xtop&&null==g)if(this.SlopesEqual(f,
a.nextInLML,this.m_UseFullRange)){0<=a.outIdx&&0<=f.outIdx&&this.AddJoin(a.nextInLML,f,a.outIdx,-1);break}else if(f.dx<a.nextInLML.dx)break;if(f==g){b==d.Direction.dLeftToRight?this.IntersectEdges(a,f,new d.IntPoint(f.xcurr,a.ycurr),0):this.IntersectEdges(f,a,new d.IntPoint(f.xcurr,a.ycurr),0);0<=g.outIdx&&d.Error("ProcessHorizontal error");return}f.dx==d.ClipperBase.horizontal&&this.IsMinima(f);b==d.Direction.dLeftToRight?this.IntersectEdges(a,f,new d.IntPoint(f.xcurr,a.ycurr),this.IsTopHorz(a,f.xcurr)?
d.Protects.ipLeft:d.Protects.ipBoth):this.IntersectEdges(f,a,new d.IntPoint(f.xcurr,a.ycurr),this.IsTopHorz(a,f.xcurr)?d.Protects.ipRight:d.Protects.ipBoth);this.SwapPositionsInAEL(a,f)}else if(b==d.Direction.dLeftToRight&&f.xcurr>e&&null==a.nextInSEL||b==d.Direction.dRightToLeft&&f.xcurr<c&&null==a.nextInSEL)break;f=h}null!=a.nextInLML?(0<=a.outIdx&&this.AddOutPt(a,new d.IntPoint(a.xtop,a.ytop)),a={Value:a},this.UpdateEdgeIntoAEL(a)):(0<=a.outIdx&&this.IntersectEdges(a,g,new d.IntPoint(a.xtop,a.ycurr),
d.Protects.ipBoth),this.DeleteFromAEL(g),this.DeleteFromAEL(a))};d.Clipper.prototype.IsTopHorz=function(a,b){for(var c=this.m_SortedEdges;null!=c;){if(b>=Math.min(c.xcurr,c.xtop)&&b<=Math.max(c.xcurr,c.xtop))return!1;c=c.nextInSEL}return!0};d.Clipper.prototype.GetNextInAEL=function(a,b){return b==d.Direction.dLeftToRight?a.nextInAEL:a.prevInAEL};d.Clipper.prototype.IsMinima=function(a){return null!=a&&a.prev.nextInLML!=a&&a.next.nextInLML!=a};d.Clipper.prototype.IsMaxima=function(a,b){return null!=
a&&a.ytop==b&&null==a.nextInLML};d.Clipper.prototype.IsIntermediate=function(a,b){return a.ytop==b&&null!=a.nextInLML};d.Clipper.prototype.GetMaximaPair=function(a){return!this.IsMaxima(a.next,a.ytop)||a.next.xtop!=a.xtop?a.prev:a.next};d.Clipper.prototype.ProcessIntersections=function(a,b){if(null==this.m_ActiveEdges)return!0;try{this.BuildIntersectList(a,b);if(null==this.m_IntersectNodes)return!0;if(this.FixupIntersections())this.ProcessIntersectList();else return!1}catch(c){this.m_SortedEdges=
null,this.DisposeIntersectNodes(),d.Error("ProcessIntersections error")}return!0};d.Clipper.prototype.BuildIntersectList=function(a,b){if(null!=this.m_ActiveEdges){var c=this.m_ActiveEdges;c.tmpX=d.Clipper.TopX(c,b);this.m_SortedEdges=c;this.m_SortedEdges.prevInSEL=null;for(c=c.nextInAEL;null!=c;)c.prevInSEL=c.prevInAEL,c.prevInSEL.nextInSEL=c,c.nextInSEL=null,c.tmpX=d.Clipper.TopX(c,b),c=c.nextInAEL;for(var e=!0;e&&null!=this.m_SortedEdges;){e=!1;for(c=this.m_SortedEdges;null!=c.nextInSEL;){var g=
c.nextInSEL,f=new d.IntPoint,h;if(h=c.tmpX>g.tmpX)f={Value:f},h=this.IntersectPoint(c,g,f),f=f.Value;h?(f.Y>a&&(f.Y=a,f.X=d.Clipper.TopX(c,f.Y)),this.AddIntersectNode(c,g,f),this.SwapPositionsInSEL(c,g),e=!0):c=g}if(null!=c.prevInSEL)c.prevInSEL.nextInSEL=null;else break}this.m_SortedEdges=null}};d.Clipper.prototype.FixupIntersections=function(){if(null==this.m_IntersectNodes.next)return!0;this.CopyAELToSEL();for(var a=this.m_IntersectNodes,b=this.m_IntersectNodes.next;null!=b;){var c=a.edge1;if(c.prevInSEL==
a.edge2)b=c.prevInSEL;else if(c.nextInSEL==a.edge2)b=c.nextInSEL;else{for(;null!=b&&!(b.edge1.nextInSEL==b.edge2||b.edge1.prevInSEL==b.edge2);)b=b.next;if(null==b)return!1;this.SwapIntersectNodes(a,b);c=a.edge1;b=a.edge2}this.SwapPositionsInSEL(c,b);a=a.next;b=a.next}this.m_SortedEdges=null;return a.edge1.prevInSEL==a.edge2||a.edge1.nextInSEL==a.edge2};d.Clipper.prototype.ProcessIntersectList=function(){for(;null!=this.m_IntersectNodes;){var a=this.m_IntersectNodes.next;this.IntersectEdges(this.m_IntersectNodes.edge1,
this.m_IntersectNodes.edge2,this.m_IntersectNodes.pt,d.Protects.ipBoth);this.SwapPositionsInAEL(this.m_IntersectNodes.edge1,this.m_IntersectNodes.edge2);this.m_IntersectNodes=null;this.m_IntersectNodes=a}};y=function(a){return 0>a?Math.ceil(a-0.5):Math.round(a)};H=function(a){return 0>a?Math.ceil(a-0.5):Math.floor(a+0.5)};I=function(a){return 0>a?-Math.round(Math.abs(a)):Math.round(a)};J=function(a){if(0>a)return a-=0.5,-2147483648>a?Math.ceil(a):a|0;a+=0.5;return 2147483647<a?Math.floor(a):a|0};
d.Clipper.Round=p?y:u?I:x?J:H;d.Clipper.TopX=function(a,b){return b==a.ytop?a.xtop:a.xbot+d.Clipper.Round(a.dx*(b-a.ybot))};d.Clipper.prototype.AddIntersectNode=function(a,b,c){var e=new d.IntersectNode;e.edge1=a;e.edge2=b;e.pt=c;e.next=null;if(null==this.m_IntersectNodes)this.m_IntersectNodes=e;else if(this.ProcessParam1BeforeParam2(e,this.m_IntersectNodes))e.next=this.m_IntersectNodes,this.m_IntersectNodes=e;else{for(a=this.m_IntersectNodes;null!=a.next&&this.ProcessParam1BeforeParam2(a.next,e);)a=
a.next;e.next=a.next;a.next=e}};d.Clipper.prototype.ProcessParam1BeforeParam2=function(a,b){var c;return a.pt.Y==b.pt.Y?a.edge1==b.edge1||a.edge2==b.edge1?(c=b.pt.X>a.pt.X,0<b.edge1.dx?!c:c):a.edge1==b.edge2||a.edge2==b.edge2?(c=b.pt.X>a.pt.X,0<b.edge2.dx?!c:c):b.pt.X>a.pt.X:a.pt.Y>b.pt.Y};d.Clipper.prototype.SwapIntersectNodes=function(a,b){var c=a.edge1,d=a.edge2,g=a.pt;a.edge1=b.edge1;a.edge2=b.edge2;a.pt=b.pt;b.edge1=c;b.edge2=d;b.pt=g};d.Clipper.prototype.IntersectPoint=function(a,b,c){var e,
g;if(this.SlopesEqual(a,b,this.m_UseFullRange))return!1;if(0==a.dx)c.Value.X=a.xbot,b.dx==d.ClipperBase.horizontal?c.Value.Y=b.ybot:(g=b.ybot-b.xbot/b.dx,c.Value.Y=d.Clipper.Round(c.Value.X/b.dx+g));else if(0==b.dx)c.Value.X=b.xbot,a.dx==d.ClipperBase.horizontal?c.Value.Y=a.ybot:(e=a.ybot-a.xbot/a.dx,c.Value.Y=d.Clipper.Round(c.Value.X/a.dx+e));else{e=a.xbot-a.ybot*a.dx;g=b.xbot-b.ybot*b.dx;var f=(g-e)/(a.dx-b.dx);c.Value.Y=d.Clipper.Round(f);c.Value.X=d.Math_Abs_Double(a.dx)<d.Math_Abs_Double(b.dx)?
d.Clipper.Round(a.dx*f+e):d.Clipper.Round(b.dx*f+g)}if(c.Value.Y<a.ytop||c.Value.Y<b.ytop){if(a.ytop>b.ytop)return c.Value.X=a.xtop,c.Value.Y=a.ytop,d.Clipper.TopX(b,a.ytop)<a.xtop;c.Value.X=b.xtop;c.Value.Y=b.ytop;return d.Clipper.TopX(a,b.ytop)>b.xtop}return!0};d.Clipper.prototype.DisposeIntersectNodes=function(){for(;null!=this.m_IntersectNodes;){var a=this.m_IntersectNodes.next;this.m_IntersectNodes=null;this.m_IntersectNodes=a}};d.Clipper.prototype.ProcessEdgesAtTopOfScanbeam=function(a){for(var b=
this.m_ActiveEdges,c;null!=b;)if(this.IsMaxima(b,a)&&this.GetMaximaPair(b).dx!=d.ClipperBase.horizontal)c=b.prevInAEL,this.DoMaxima(b,a),b=null==c?this.m_ActiveEdges:c.nextInAEL;else{if(this.IsIntermediate(b,a)&&b.nextInLML.dx==d.ClipperBase.horizontal){if(0<=b.outIdx){this.AddOutPt(b,new d.IntPoint(b.xtop,b.ytop));for(c=0;c<this.m_HorizJoins.length;++c){var e=new d.IntPoint,g=new d.IntPoint,f=this.m_HorizJoins[c],e={Value:e},g={Value:g};this.GetOverlapSegment(new d.IntPoint(f.edge.xbot,f.edge.ybot),
new d.IntPoint(f.edge.xtop,f.edge.ytop),new d.IntPoint(b.nextInLML.xbot,b.nextInLML.ybot),new d.IntPoint(b.nextInLML.xtop,b.nextInLML.ytop),e,g)&&this.AddJoin(f.edge,b.nextInLML,f.savedIdx,b.outIdx)}this.AddHorzJoin(b.nextInLML,b.outIdx)}b={Value:b};this.UpdateEdgeIntoAEL(b);b=b.Value;this.AddEdgeToSEL(b)}else b.xcurr=d.Clipper.TopX(b,a),b.ycurr=a;b=b.nextInAEL}this.ProcessHorizontals();for(b=this.m_ActiveEdges;null!=b;)this.IsIntermediate(b,a)&&(0<=b.outIdx&&this.AddOutPt(b,new d.IntPoint(b.xtop,
b.ytop)),b={Value:b},this.UpdateEdgeIntoAEL(b),b=b.Value,c=b.prevInAEL,e=b.nextInAEL,null!=c&&c.xcurr==b.xbot&&c.ycurr==b.ybot&&0<=b.outIdx&&0<=c.outIdx&&c.ycurr>c.ytop&&this.SlopesEqual(b,c,this.m_UseFullRange)?(this.AddOutPt(c,new d.IntPoint(b.xbot,b.ybot)),this.AddJoin(b,c,-1,-1)):null!=e&&(e.xcurr==b.xbot&&e.ycurr==b.ybot&&0<=b.outIdx&&0<=e.outIdx&&e.ycurr>e.ytop&&this.SlopesEqual(b,e,this.m_UseFullRange))&&(this.AddOutPt(e,new d.IntPoint(b.xbot,b.ybot)),this.AddJoin(b,e,-1,-1))),b=b.nextInAEL};
d.Clipper.prototype.DoMaxima=function(a,b){for(var c=this.GetMaximaPair(a),e=a.xtop,g=a.nextInAEL;g!=c;)null==g&&d.Error("DoMaxima error"),this.IntersectEdges(a,g,new d.IntPoint(e,b),d.Protects.ipBoth),g=g.nextInAEL;0>a.outIdx&&0>c.outIdx?(this.DeleteFromAEL(a),this.DeleteFromAEL(c)):0<=a.outIdx&&0<=c.outIdx?this.IntersectEdges(a,c,new d.IntPoint(e,b),d.Protects.ipNone):d.Error("DoMaxima error")};d.Clipper.ReversePolygons=function(a){for(var b=a.length,c=0;c<b;c++)a[c]instanceof Array&&a[c].reverse()};
d.Clipper.Orientation=function(a){return 0<=this.Area(a)};d.Clipper.prototype.PointCount=function(a){if(null==a)return 0;var b=0,c=a;do b++,c=c.next;while(c!=a);return b};d.Clipper.prototype.BuildResult=function(a){d.Clear(a);for(var b,c=this.m_PolyOuts.length,e=0;e<c;e++)if(b=this.m_PolyOuts[e],null!=b.pts){b=b.pts;var g=this.PointCount(b);if(!(3>g)){for(var f=new d.Polygon(g),h=0;h<g;h++)f.push(b.pt),b=b.prev;a.push(f)}}};d.Clipper.prototype.BuildResultEx=function(a){d.Clear(a);for(var b=0;b<this.m_PolyOuts.length;){var c=
this.m_PolyOuts[b++];if(null==c.pts)break;var e=c.pts,c=this.PointCount(e);if(!(3>c)){var g=new d.ExPolygon;g.outer=new d.Polygon;g.holes=new d.Polygons;for(var f=0;f<c;f++)g.outer.push(e.pt),e=e.prev;for(;b<this.m_PolyOuts.length;){c=this.m_PolyOuts[b];if(null==c.pts||!c.isHole)break;f=new d.Polygon;e=c.pts;do f.push(e.pt),e=e.prev;while(e!=c.pts);g.holes.push(f);b++}a.push(g)}}};d.Clipper.prototype.FixupOutPolygon=function(a){for(var b=null,c=a.pts=a.bottomPt;;){if(c.prev==c||c.prev==c.next){this.DisposeOutPts(c);
a.pts=null;a.bottomPt=null;return}if(d.ClipperBase.PointsEqual(c.pt,c.next.pt)||this.SlopesEqual(c.prev.pt,c.pt,c.next.pt,this.m_UseFullRange))b=null,c==a.bottomPt&&(a.bottomPt=null),c.prev.next=c.next,c=c.next.prev=c.prev;else if(c==b)break;else null==b&&(b=c),c=c.next}null==a.bottomPt&&(a.bottomPt=this.GetBottomPt(c),a.bottomPt.idx=a.idx,a.pts=a.bottomPt)};d.Clipper.prototype.JoinPoints=function(a,b,c){b.Value=null;c.Value=null;var e=this.m_PolyOuts[a.poly1Idx],g=this.m_PolyOuts[a.poly2Idx];if(null==
e||null==g)return!1;var f=e.pts,h=g.pts,j=a.pt2a,m=a.pt2b,l=a.pt1a;a=a.pt1b;var f={Value:f},j={Value:j},m={Value:m},n=this.FindSegment(f,j,m),f=f.Value,j=j.Value,m=m.Value;if(!n)return!1;if(e==g){if(h=f.next,h={Value:h},l={Value:l},a={Value:a},e=this.FindSegment(h,l,a),h=h.Value,l=l.Value,a=a.Value,!e||h==f)return!1}else if(h={Value:h},l={Value:l},a={Value:a},e=this.FindSegment(h,l,a),h=h.Value,l=l.Value,a=a.Value,!e)return!1;j={Value:j};m={Value:m};l=this.GetOverlapSegment(j.Value,m.Value,l,a,j,
m);j=j.Value;m=m.Value;if(!l)return!1;l=f.prev;b.Value=d.ClipperBase.PointsEqual(f.pt,j)?f:d.ClipperBase.PointsEqual(l.pt,j)?l:this.InsertPolyPtBetween(f,l,j);c.Value=d.ClipperBase.PointsEqual(f.pt,m)?f:d.ClipperBase.PointsEqual(l.pt,m)?l:b.Value==f||b.Value==l?this.InsertPolyPtBetween(f,l,m):this.Pt3IsBetweenPt1AndPt2(f.pt,b.Value.pt,m)?this.InsertPolyPtBetween(f,b.Value,m):this.InsertPolyPtBetween(b.Value,l,m);l=h.prev;f=d.ClipperBase.PointsEqual(h.pt,j)?h:d.ClipperBase.PointsEqual(l.pt,j)?l:this.InsertPolyPtBetween(h,
l,j);h=d.ClipperBase.PointsEqual(h.pt,m)?h:d.ClipperBase.PointsEqual(l.pt,m)?l:f==h||f==l?this.InsertPolyPtBetween(h,l,m):this.Pt3IsBetweenPt1AndPt2(h.pt,f.pt,m)?this.InsertPolyPtBetween(h,f,m):this.InsertPolyPtBetween(f,l,m);return b.Value.next==c.Value&&f.prev==h?(b.Value.next=f,f.prev=b.Value,c.Value.prev=h,h.next=c.Value,!0):b.Value.prev==c.Value&&f.next==h?(b.Value.prev=f,f.next=b.Value,c.Value.next=h,h.prev=c.Value,!0):!1};d.Clipper.prototype.FixupJoinRecs=function(a,b,c){for(;c<this.m_Joins.length;c++){var d=
this.m_Joins[c];d.poly1Idx==a.poly1Idx&&this.PointIsVertex(d.pt1a,b)&&(d.poly1Idx=a.poly2Idx);d.poly2Idx==a.poly1Idx&&this.PointIsVertex(d.pt2a,b)&&(d.poly2Idx=a.poly2Idx)}};d.Clipper.prototype.JoinCommonEdges=function(){for(var a,b,c=0;c<this.m_Joins.length;c++){a=this.m_Joins[c];var d,g;d={Value:d};g={Value:g};var f=this.JoinPoints(a,d,g);d=d.Value;g=g.Value;if(f){var f=this.m_PolyOuts[a.poly1Idx],h=this.m_PolyOuts[a.poly2Idx];if(f==h)if(f.pts=this.GetBottomPt(d),f.bottomPt=f.pts,f.bottomPt.idx=
f.idx,h=this.CreateOutRec(),this.m_PolyOuts.push(h),h.idx=this.m_PolyOuts.length-1,a.poly2Idx=h.idx,h.pts=this.GetBottomPt(g),h.bottomPt=h.pts,h.bottomPt.idx=h.idx,this.PointInPolygon(h.pts.pt,f.pts,this.m_UseFullRange))h.isHole=!f.isHole,h.FirstLeft=f,this.FixupJoinRecs(a,g,c+1),this.FixupOutPolygon(f),this.FixupOutPolygon(h),(h.isHole^this.m_ReverseOutput)==0<this.Area(h,this.m_UseFullRange)&&this.ReversePolyPtLinks(h.pts);else if(this.PointInPolygon(f.pts.pt,h.pts,this.m_UseFullRange)){if(h.isHole=
f.isHole,f.isHole=!h.isHole,h.FirstLeft=f.FirstLeft,f.FirstLeft=h,this.FixupJoinRecs(a,g,c+1),this.FixupOutPolygon(f),this.FixupOutPolygon(h),(f.isHole^this.m_ReverseOutput)==0<this.Area(f,this.m_UseFullRange)&&this.ReversePolyPtLinks(f.pts),this.m_UsingExPolygons&&f.isHole)for(a=0;a<this.m_PolyOuts.length;++a)b=this.m_PolyOuts[a],b.isHole&&(null!=b.bottomPt&&b.FirstLeft==f)&&(b.FirstLeft=h)}else{if(h.isHole=f.isHole,h.FirstLeft=f.FirstLeft,this.FixupJoinRecs(a,g,c+1),this.FixupOutPolygon(f),this.FixupOutPolygon(h),
this.m_UsingExPolygons&&null!=h.pts)for(a=0;a<this.m_PolyOuts.length;++a)b=this.m_PolyOuts[a],b.isHole&&(null!=b.bottomPt&&b.FirstLeft==f&&this.PointInPolygon(b.bottomPt.pt,h.pts,this.m_UseFullRange))&&(b.FirstLeft=h)}else{if(this.m_UsingExPolygons)for(a=0;a<this.m_PolyOuts.length;++a)this.m_PolyOuts[a].isHole&&(null!=this.m_PolyOuts[a].bottomPt&&this.m_PolyOuts[a].FirstLeft==h)&&(this.m_PolyOuts[a].FirstLeft=f);this.FixupOutPolygon(f);null!=f.pts&&(f.isHole=0>this.Area(f,this.m_UseFullRange),f.isHole&&
null==f.FirstLeft&&(f.FirstLeft=h.FirstLeft));b=f.idx;var j=h.idx;h.pts=null;h.bottomPt=null;h.AppendLink=f;for(a=c+1;a<this.m_Joins.length;a++)f=this.m_Joins[a],f.poly1Idx==j&&(f.poly1Idx=b),f.poly2Idx==j&&(f.poly2Idx=b)}}}};d.Clipper.FullRangeNeeded=function(a){for(var b=!1,c=0;c<a.length;c++)if(d.Math_Abs_Int64(a[c].X)>d.ClipperBase.hiRange||d.Math_Abs_Int64(a[c].Y)>d.ClipperBase.hiRange)d.Error("Coordinate exceeds range bounds in FullRangeNeeded().");else if(d.Math_Abs_Int64(a[c].X)>d.ClipperBase.loRange||
d.Math_Abs_Int64(a[c].Y)>d.ClipperBase.loRange)b=!0;return b};d.Clipper.prototype.Area=d.Clipper.Area=function(){var a=arguments,b;if(1==a.length){var c=a[0],e=c.length-1;if(2>e)return 0;if(d.Clipper.FullRangeNeeded(c)){a=(new j(c[e].X+c[0].X)).multiply(new j(c[0].Y-c[e].Y));for(b=1;b<=e;++b)a=a.add((new j(c[b-1].X+c[b].X)).multiply(new j(c[b].Y-c[b-1].Y)));return parseFloat(a.toString())/2}a=(c[e].X+c[0].X)*(c[0].Y-c[e].Y);for(b=1;b<=e;++b)a+=(c[b-1].X+c[b].X)*(c[b].Y-c[b-1].Y);return a/2}if(2==
a.length){b=a[0];c=b.pts;if(null==c)return 0;if(a[1]){a=new j(j.ZERO);do a=a.add((new j(c.pt.X+c.prev.pt.X)).multiply(new j(c.prev.pt.Y-c.pt.Y))),c=c.next;while(c!=b.pts);return parseFloat(a.toString())/2}a=0;do a+=(c.pt.X+c.prev.pt.X)*(c.prev.pt.Y-c.pt.Y),c=c.next;while(c!=b.pts);return a/2}};d.Clipper.BuildArc=function(a,b,c,e){var g=Math.sqrt(d.Math_Abs_Double(e))*d.Math_Abs_Double(c-b),g=g/4;6>g&&(g=6);64<g&&(g=d.MaxSteps);var g=d.Cast_Int32(g),f=new d.Polygon;c=(c-b)/(g-1);for(var h=0;h<g;++h)f.push(new d.IntPoint(a.X+
d.Clipper.Round(Math.cos(b)*e),a.Y+d.Clipper.Round(Math.sin(b)*e))),b+=c;return f};d.Clipper.GetUnitNormal=function(a,b){var c=b.X-a.X,e=b.Y-a.Y;if(0==c&&0==e)return new d.Clipper.DoublePoint(0,0);var g=1/Math.sqrt(c*c+e*e);return new d.Clipper.DoublePoint(e*g,-(c*g))};d.Clipper.prototype.OffsetPolygons=function(a,b,c,e,g){var f=arguments;4==f.length?g=!0:3==f.length?(e=2,g=!0):2==f.length&&(c=d.JoinType.jtSquare,e=2,g=!0);isNaN(b)?d.Error("Delta is not a number"):isNaN(e)&&d.Error("MiterLimit is not a number");
f={};new d.Clipper.PolyOffsetBuilder(a,f,b,c,e,g);return f=f.Value?f.Value:[[]]};d.Clipper.prototype.SimplifyPolygon=function(a,b){var c=new d.Polygons,e=new d.Clipper;e.AddPolygon(a,d.PolyType.ptSubject)&&e.Execute(d.ClipType.ctUnion,c,b,b);return c};d.Clipper.prototype.SimplifyPolygons=function(a,b){var c=new d.Polygons,e=new d.Clipper;e.AddPolygons(a,d.PolyType.ptSubject)&&e.Execute(d.ClipType.ctUnion,c,b,b);return c};u=d.Clipper;x=d.ClipperBase;var z;if("undefined"==typeof Object.getOwnPropertyNames)for(z in x.prototype){if("undefined"==
typeof u.prototype[z]||u.prototype[z]==Object.prototype[z])u.prototype[z]=x.prototype[z]}else{p=Object.getOwnPropertyNames(x.prototype);for(y=0;y<p.length;y++)"undefined"==typeof Object.getOwnPropertyDescriptor(u.prototype,p[y])&&Object.defineProperty(u.prototype,p[y],Object.getOwnPropertyDescriptor(x.prototype,p[y]))}for(z in x)"undefined"==typeof u[z]&&(u[z]=x[z]);u.$baseCtor=x;d.Clipper.DoublePoint=function(a,b){this.X=a;this.Y=b};d.Clipper.PolyOffsetBuilder=function(a,b,c,e,g,f){this.normals=
this.currentPoly=this.pts=null;this.m_k=this.m_j=this.m_i=this.m_R=this.delta=0;this.botPt=null;if(0==c)b.Value=a;else{this.pts=a;this.delta=c;if(f){for(var h=this.pts.length,j=0;j<h&&0==this.pts[j].length;)j++;if(j==h)return;this.botPt=this.pts[j][0];for(f=j;f<h;++f){this.UpdateBotPt(this.pts[f][0])&&(j=f);for(a=this.pts[f].length-1;0<a;a--)d.ClipperBase.PointsEqual(this.pts[f][a],this.pts[f][a-1])?this.pts[f].splice(a,1):this.UpdateBotPt(this.pts[f][a])&&(j=f)}d.Clipper.Orientation(this.pts[j])||
d.Clipper.ReversePolygons(this.pts)}1>=g&&(g=1);f=2/(g*g);this.normals=[];b.Value=new d.Polygons;d.Clear(b.Value);for(this.m_i=0;this.m_i<this.pts.length;this.m_i++)if(h=this.pts[this.m_i].length,1<h&&(this.pts[this.m_i][0].X==this.pts[this.m_i][h-1].X&&this.pts[this.m_i][0].Y==this.pts[this.m_i][h-1].Y)&&h--,!(0==h||3>h&&0>=c))if(1==h)a=d.Clipper.BuildArc(this.pts[this.m_i][h-1],0,d.PI2,c),b.Value.push(a);else{d.Clear(this.normals);for(a=0;a<h-1;++a)this.normals.push(d.Clipper.GetUnitNormal(this.pts[this.m_i][a],
this.pts[this.m_i][a+1]));this.normals.push(d.Clipper.GetUnitNormal(this.pts[this.m_i][h-1],this.pts[this.m_i][0]));this.currentPoly=new d.Polygon;this.m_k=h-1;for(this.m_j=0;this.m_j<h;++this.m_j){switch(e){case d.JoinType.jtMiter:this.m_R=1+(this.normals[this.m_j].X*this.normals[this.m_k].X+this.normals[this.m_j].Y*this.normals[this.m_k].Y);this.m_R>=f?this.DoMiter():this.DoSquare(g);break;case d.JoinType.jtRound:this.DoRound();break;case d.JoinType.jtSquare:this.DoSquare(1)}this.m_k=this.m_j}b.Value.push(this.currentPoly)}e=
new d.Clipper;e.AddPolygons(b.Value,d.PolyType.ptSubject);if(0<c)e.Execute(d.ClipType.ctUnion,b.Value,d.PolyFillType.pftPositive,d.PolyFillType.pftPositive);else if(c=e.GetBounds(),g=new d.Polygon,g.push(new d.IntPoint(c.left-10,c.bottom+10)),g.push(new d.IntPoint(c.right+10,c.bottom+10)),g.push(new d.IntPoint(c.right+10,c.top-10)),g.push(new d.IntPoint(c.left-10,c.top-10)),e.AddPolygon(g,d.PolyType.ptSubject),e.Execute(d.ClipType.ctUnion,b.Value,d.PolyFillType.pftNegative,d.PolyFillType.pftNegative),
0<b.Value.length){b.Value.splice(0,1);for(f=0;f<b.Value.length;f++)b.Value[f].reverse()}}};d.Clipper.PolyOffsetBuilder.prototype.UpdateBotPt=function(a){return a.Y>this.botPt.Y||a.Y==this.botPt.Y&&a.X<this.botPt.X?(this.botPt=a,!0):!1};d.Clipper.PolyOffsetBuilder.prototype.AddPoint=function(a){this.currentPoly.push(a)};d.Clipper.PolyOffsetBuilder.prototype.DoSquare=function(a){var b=new d.IntPoint(d.Cast_Int64(d.Clipper.Round(this.pts[this.m_i][this.m_j].X+this.normals[this.m_k].X*this.delta)),d.Cast_Int64(d.Clipper.Round(this.pts[this.m_i][this.m_j].Y+
this.normals[this.m_k].Y*this.delta))),c=new d.IntPoint(d.Cast_Int64(d.Clipper.Round(this.pts[this.m_i][this.m_j].X+this.normals[this.m_j].X*this.delta)),d.Cast_Int64(d.Clipper.Round(this.pts[this.m_i][this.m_j].Y+this.normals[this.m_j].Y*this.delta)));if(0<=(this.normals[this.m_k].X*this.normals[this.m_j].Y-this.normals[this.m_j].X*this.normals[this.m_k].Y)*this.delta){var e=Math.atan2(this.normals[this.m_k].Y,this.normals[this.m_k].X),g=Math.atan2(-this.normals[this.m_j].Y,-this.normals[this.m_j].X),
e=Math.abs(g-e);e>d.PI&&(e=d.PI2-e);a=Math.tan((d.PI-e)/4)*Math.abs(this.delta*a);b=new d.IntPoint(d.Cast_Int64(b.X-this.normals[this.m_k].Y*a),d.Cast_Int64(b.Y+this.normals[this.m_k].X*a));this.AddPoint(b);c=new d.IntPoint(d.Cast_Int64(c.X+this.normals[this.m_j].Y*a),d.Cast_Int64(c.Y-this.normals[this.m_j].X*a))}else this.AddPoint(b),this.AddPoint(this.pts[this.m_i][this.m_j]);this.AddPoint(c)};d.Clipper.PolyOffsetBuilder.prototype.DoMiter=function(){if(0<=(this.normals[this.m_k].X*this.normals[this.m_j].Y-
this.normals[this.m_j].X*this.normals[this.m_k].Y)*this.delta){var a=this.delta/this.m_R;this.AddPoint(new d.IntPoint(d.Cast_Int64(d.Clipper.Round(this.pts[this.m_i][this.m_j].X+(this.normals[this.m_k].X+this.normals[this.m_j].X)*a)),d.Cast_Int64(d.Clipper.Round(this.pts[this.m_i][this.m_j].Y+(this.normals[this.m_k].Y+this.normals[this.m_j].Y)*a))))}else{var a=new d.IntPoint(d.Cast_Int64(d.Clipper.Round(this.pts[this.m_i][this.m_j].X+this.normals[this.m_k].X*this.delta)),d.Cast_Int64(d.Clipper.Round(this.pts[this.m_i][this.m_j].Y+
this.normals[this.m_k].Y*this.delta))),b=new d.IntPoint(d.Cast_Int64(d.Clipper.Round(this.pts[this.m_i][this.m_j].X+this.normals[this.m_j].X*this.delta)),d.Cast_Int64(d.Clipper.Round(this.pts[this.m_i][this.m_j].Y+this.normals[this.m_j].Y*this.delta)));this.AddPoint(a);this.AddPoint(this.pts[this.m_i][this.m_j]);this.AddPoint(b)}};d.Clipper.PolyOffsetBuilder.prototype.DoRound=function(){var a=new d.IntPoint(d.Clipper.Round(this.pts[this.m_i][this.m_j].X+this.normals[this.m_k].X*this.delta),d.Clipper.Round(this.pts[this.m_i][this.m_j].Y+
this.normals[this.m_k].Y*this.delta)),b=new d.IntPoint(d.Clipper.Round(this.pts[this.m_i][this.m_j].X+this.normals[this.m_j].X*this.delta),d.Clipper.Round(this.pts[this.m_i][this.m_j].Y+this.normals[this.m_j].Y*this.delta));this.AddPoint(a);if(0<=(this.normals[this.m_k].X*this.normals[this.m_j].Y-this.normals[this.m_j].X*this.normals[this.m_k].Y)*this.delta){if(0.985>this.normals[this.m_j].X*this.normals[this.m_k].X+this.normals[this.m_j].Y*this.normals[this.m_k].Y){var a=Math.atan2(this.normals[this.m_k].Y,
this.normals[this.m_k].X),c=Math.atan2(this.normals[this.m_j].Y,this.normals[this.m_j].X);0<this.delta&&c<a?c+=d.PI2:0>this.delta&&c>a&&(c-=d.PI2);a=d.Clipper.BuildArc(this.pts[this.m_i][this.m_j],a,c,this.delta);for(c=0;c<a.length;c++)this.AddPoint(a[c])}}else this.AddPoint(this.pts[this.m_i][this.m_j]);this.AddPoint(b)};d.Error=function(a){try{throw Error(a);}catch(b){alert(b.message)}};d.Clone=function(a){if(!(a instanceof Array)||0==a.length)return[];if(1==a.length&&0==a[0].length)return[[]];
var b=a[0]instanceof Array;b||(a=[a]);var c=a.length,d,g,f,h,j=[];for(g=0;g<c;g++){d=a[g].length;h=[];for(f=0;f<d;f++)h.push({X:a[g][f].X,Y:a[g][f].Y});j.push(h)}b||(j=j[0]);return j};d.Clean=function(a,b){if(!(a instanceof Array))return[];var c=a[0]instanceof Array;a=d.Clone(a);if("number"!=typeof b||null===b)return d.Error("Delta is not a number in Clean()."),a;if(0==a.length||1==a.length&&0==a[0].length||0>b)return a;c||(a=[a]);for(var e=a.length,g,f,h,j,m,l,n,q=[],p=0;p<e;p++)if(f=a[p],g=f.length,
0!=g)if(3>g)h=f,q.push(h);else{h=f;j=b*b;m=f[0];for(n=l=1;n<g;n++)(f[n].X-m.X)*(f[n].X-m.X)+(f[n].Y-m.Y)*(f[n].Y-m.Y)<=j||(h[l]=f[n],m=f[n],l++);m=f[l-1];(f[0].X-m.X)*(f[0].X-m.X)+(f[0].Y-m.Y)*(f[0].Y-m.Y)<=j&&l--;l<g&&h.splice(l,g-l);h.length&&q.push(h)}!c&&q.length?q=q[0]:!c&&0==q.length?q=[]:c&&0==q.length&&(q=[[]]);return q};d.Lighten=function(a,b){if(!(a instanceof Array))return[];if("number"!=typeof b||null===b)return d.Error("Tolerance is not a number in Lighten()."),d.Clone(a);if(0===a.length||
1==a.length&&0===a[0].length||0>b)return d.Clone(a);a[0]instanceof Array||(a=[a]);var c,e,g,f,h,j,m,l,n,p,r,s,t,v=a.length,u=[];for(c=0;c<v;c++){g=a[c];for(f=0;1E6>f;f++){h=[];j=g.length;g[j-1].X!=g[0].X||g[j-1].Y!=g[0].Y?(s=1,g.push({X:g[0].X,Y:g[0].Y}),j=g.length):s=0;r=[];for(e=0;e<j-2;e++){m=g[e];n=g[e+1];l=g[e+2];t=l.X-m.X;l=l.Y-m.Y;p=0;if(0!==t||0!==l)p=Math.sqrt(t*t+l*l),p=Math.abs((n.X-m.X)*l-(n.Y-m.Y)*t)/p;p<=b&&(r[e+1]=1,e++)}h.push({X:g[0].X,Y:g[0].Y});for(e=1;e<j-1;e++)r[e]||h.push({X:g[e].X,
Y:g[e].Y});h.push({X:g[j-1].X,Y:g[j-1].Y});s&&g.pop();if(r.length)g=h;else break}j=h.length;h[j-1].X==h[0].X&&h[j-1].Y==h[0].Y&&h.pop();2<h.length&&u.push(h)}!a[0]instanceof Array&&(u=u[0]);"undefined"==typeof u&&(u=[[]]);return u};Q.ClipperLib=d})(window);
/*! jQuery v1.7.2 jquery.com | jquery.org/license */
(function(a,b){function cy(a){return f.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:!1}function cu(a){if(!cj[a]){var b=c.body,d=f("<"+a+">").appendTo(b),e=d.css("display");d.remove();if(e==="none"||e===""){ck||(ck=c.createElement("iframe"),ck.frameBorder=ck.width=ck.height=0),b.appendChild(ck);if(!cl||!ck.createElement)cl=(ck.contentWindow||ck.contentDocument).document,cl.write((f.support.boxModel?"<!doctype html>":"")+"<html><body>"),cl.close();d=cl.createElement(a),cl.body.appendChild(d),e=f.css(d,"display"),b.removeChild(ck)}cj[a]=e}return cj[a]}function ct(a,b){var c={};f.each(cp.concat.apply([],cp.slice(0,b)),function(){c[this]=a});return c}function cs(){cq=b}function cr(){setTimeout(cs,0);return cq=f.now()}function ci(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}function ch(){try{return new a.XMLHttpRequest}catch(b){}}function cb(a,c){a.dataFilter&&(c=a.dataFilter(c,a.dataType));var d=a.dataTypes,e={},g,h,i=d.length,j,k=d[0],l,m,n,o,p;for(g=1;g<i;g++){if(g===1)for(h in a.converters)typeof h=="string"&&(e[h.toLowerCase()]=a.converters[h]);l=k,k=d[g];if(k==="*")k=l;else if(l!=="*"&&l!==k){m=l+" "+k,n=e[m]||e["* "+k];if(!n){p=b;for(o in e){j=o.split(" ");if(j[0]===l||j[0]==="*"){p=e[j[1]+" "+k];if(p){o=e[o],o===!0?n=p:p===!0&&(n=o);break}}}}!n&&!p&&f.error("No conversion from "+m.replace(" "," to ")),n!==!0&&(c=n?n(c):p(o(c)))}}return c}function ca(a,c,d){var e=a.contents,f=a.dataTypes,g=a.responseFields,h,i,j,k;for(i in g)i in d&&(c[g[i]]=d[i]);while(f[0]==="*")f.shift(),h===b&&(h=a.mimeType||c.getResponseHeader("content-type"));if(h)for(i in e)if(e[i]&&e[i].test(h)){f.unshift(i);break}if(f[0]in d)j=f[0];else{for(i in d){if(!f[0]||a.converters[i+" "+f[0]]){j=i;break}k||(k=i)}j=j||k}if(j){j!==f[0]&&f.unshift(j);return d[j]}}function b_(a,b,c,d){if(f.isArray(b))f.each(b,function(b,e){c||bD.test(a)?d(a,e):b_(a+"["+(typeof e=="object"?b:"")+"]",e,c,d)});else if(!c&&f.type(b)==="object")for(var e in b)b_(a+"["+e+"]",b[e],c,d);else d(a,b)}function b$(a,c){var d,e,g=f.ajaxSettings.flatOptions||{};for(d in c)c[d]!==b&&((g[d]?a:e||(e={}))[d]=c[d]);e&&f.extend(!0,a,e)}function bZ(a,c,d,e,f,g){f=f||c.dataTypes[0],g=g||{},g[f]=!0;var h=a[f],i=0,j=h?h.length:0,k=a===bS,l;for(;i<j&&(k||!l);i++)l=h[i](c,d,e),typeof l=="string"&&(!k||g[l]?l=b:(c.dataTypes.unshift(l),l=bZ(a,c,d,e,l,g)));(k||!l)&&!g["*"]&&(l=bZ(a,c,d,e,"*",g));return l}function bY(a){return function(b,c){typeof b!="string"&&(c=b,b="*");if(f.isFunction(c)){var d=b.toLowerCase().split(bO),e=0,g=d.length,h,i,j;for(;e<g;e++)h=d[e],j=/^\+/.test(h),j&&(h=h.substr(1)||"*"),i=a[h]=a[h]||[],i[j?"unshift":"push"](c)}}}function bB(a,b,c){var d=b==="width"?a.offsetWidth:a.offsetHeight,e=b==="width"?1:0,g=4;if(d>0){if(c!=="border")for(;e<g;e+=2)c||(d-=parseFloat(f.css(a,"padding"+bx[e]))||0),c==="margin"?d+=parseFloat(f.css(a,c+bx[e]))||0:d-=parseFloat(f.css(a,"border"+bx[e]+"Width"))||0;return d+"px"}d=by(a,b);if(d<0||d==null)d=a.style[b];if(bt.test(d))return d;d=parseFloat(d)||0;if(c)for(;e<g;e+=2)d+=parseFloat(f.css(a,"padding"+bx[e]))||0,c!=="padding"&&(d+=parseFloat(f.css(a,"border"+bx[e]+"Width"))||0),c==="margin"&&(d+=parseFloat(f.css(a,c+bx[e]))||0);return d+"px"}function bo(a){var b=c.createElement("div");bh.appendChild(b),b.innerHTML=a.outerHTML;return b.firstChild}function bn(a){var b=(a.nodeName||"").toLowerCase();b==="input"?bm(a):b!=="script"&&typeof a.getElementsByTagName!="undefined"&&f.grep(a.getElementsByTagName("input"),bm)}function bm(a){if(a.type==="checkbox"||a.type==="radio")a.defaultChecked=a.checked}function bl(a){return typeof a.getElementsByTagName!="undefined"?a.getElementsByTagName("*"):typeof a.querySelectorAll!="undefined"?a.querySelectorAll("*"):[]}function bk(a,b){var c;b.nodeType===1&&(b.clearAttributes&&b.clearAttributes(),b.mergeAttributes&&b.mergeAttributes(a),c=b.nodeName.toLowerCase(),c==="object"?b.outerHTML=a.outerHTML:c!=="input"||a.type!=="checkbox"&&a.type!=="radio"?c==="option"?b.selected=a.defaultSelected:c==="input"||c==="textarea"?b.defaultValue=a.defaultValue:c==="script"&&b.text!==a.text&&(b.text=a.text):(a.checked&&(b.defaultChecked=b.checked=a.checked),b.value!==a.value&&(b.value=a.value)),b.removeAttribute(f.expando),b.removeAttribute("_submit_attached"),b.removeAttribute("_change_attached"))}function bj(a,b){if(b.nodeType===1&&!!f.hasData(a)){var c,d,e,g=f._data(a),h=f._data(b,g),i=g.events;if(i){delete h.handle,h.events={};for(c in i)for(d=0,e=i[c].length;d<e;d++)f.event.add(b,c,i[c][d])}h.data&&(h.data=f.extend({},h.data))}}function bi(a,b){return f.nodeName(a,"table")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function U(a){var b=V.split("|"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}function T(a,b,c){b=b||0;if(f.isFunction(b))return f.grep(a,function(a,d){var e=!!b.call(a,d,a);return e===c});if(b.nodeType)return f.grep(a,function(a,d){return a===b===c});if(typeof b=="string"){var d=f.grep(a,function(a){return a.nodeType===1});if(O.test(b))return f.filter(b,d,!c);b=f.filter(b,d)}return f.grep(a,function(a,d){return f.inArray(a,b)>=0===c})}function S(a){return!a||!a.parentNode||a.parentNode.nodeType===11}function K(){return!0}function J(){return!1}function n(a,b,c){var d=b+"defer",e=b+"queue",g=b+"mark",h=f._data(a,d);h&&(c==="queue"||!f._data(a,e))&&(c==="mark"||!f._data(a,g))&&setTimeout(function(){!f._data(a,e)&&!f._data(a,g)&&(f.removeData(a,d,!0),h.fire())},0)}function m(a){for(var b in a){if(b==="data"&&f.isEmptyObject(a[b]))continue;if(b!=="toJSON")return!1}return!0}function l(a,c,d){if(d===b&&a.nodeType===1){var e="data-"+c.replace(k,"-$1").toLowerCase();d=a.getAttribute(e);if(typeof d=="string"){try{d=d==="true"?!0:d==="false"?!1:d==="null"?null:f.isNumeric(d)?+d:j.test(d)?f.parseJSON(d):d}catch(g){}f.data(a,c,d)}else d=b}return d}function h(a){var b=g[a]={},c,d;a=a.split(/\s+/);for(c=0,d=a.length;c<d;c++)b[a[c]]=!0;return b}var c=a.document,d=a.navigator,e=a.location,f=function(){function J(){if(!e.isReady){try{c.documentElement.doScroll("left")}catch(a){setTimeout(J,1);return}e.ready()}}var e=function(a,b){return new e.fn.init(a,b,h)},f=a.jQuery,g=a.$,h,i=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,j=/\S/,k=/^\s+/,l=/\s+$/,m=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,n=/^[\],:{}\s]*$/,o=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,p=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,q=/(?:^|:|,)(?:\s*\[)+/g,r=/(webkit)[ \/]([\w.]+)/,s=/(opera)(?:.*version)?[ \/]([\w.]+)/,t=/(msie) ([\w.]+)/,u=/(mozilla)(?:.*? rv:([\w.]+))?/,v=/-([a-z]|[0-9])/ig,w=/^-ms-/,x=function(a,b){return(b+"").toUpperCase()},y=d.userAgent,z,A,B,C=Object.prototype.toString,D=Object.prototype.hasOwnProperty,E=Array.prototype.push,F=Array.prototype.slice,G=String.prototype.trim,H=Array.prototype.indexOf,I={};e.fn=e.prototype={constructor:e,init:function(a,d,f){var g,h,j,k;if(!a)return this;if(a.nodeType){this.context=this[0]=a,this.length=1;return this}if(a==="body"&&!d&&c.body){this.context=c,this[0]=c.body,this.selector=a,this.length=1;return this}if(typeof a=="string"){a.charAt(0)!=="<"||a.charAt(a.length-1)!==">"||a.length<3?g=i.exec(a):g=[null,a,null];if(g&&(g[1]||!d)){if(g[1]){d=d instanceof e?d[0]:d,k=d?d.ownerDocument||d:c,j=m.exec(a),j?e.isPlainObject(d)?(a=[c.createElement(j[1])],e.fn.attr.call(a,d,!0)):a=[k.createElement(j[1])]:(j=e.buildFragment([g[1]],[k]),a=(j.cacheable?e.clone(j.fragment):j.fragment).childNodes);return e.merge(this,a)}h=c.getElementById(g[2]);if(h&&h.parentNode){if(h.id!==g[2])return f.find(a);this.length=1,this[0]=h}this.context=c,this.selector=a;return this}return!d||d.jquery?(d||f).find(a):this.constructor(d).find(a)}if(e.isFunction(a))return f.ready(a);a.selector!==b&&(this.selector=a.selector,this.context=a.context);return e.makeArray(a,this)},selector:"",jquery:"1.7.2",length:0,size:function(){return this.length},toArray:function(){return F.call(this,0)},get:function(a){return a==null?this.toArray():a<0?this[this.length+a]:this[a]},pushStack:function(a,b,c){var d=this.constructor();e.isArray(a)?E.apply(d,a):e.merge(d,a),d.prevObject=this,d.context=this.context,b==="find"?d.selector=this.selector+(this.selector?" ":"")+c:b&&(d.selector=this.selector+"."+b+"("+c+")");return d},each:function(a,b){return e.each(this,a,b)},ready:function(a){e.bindReady(),A.add(a);return this},eq:function(a){a=+a;return a===-1?this.slice(a):this.slice(a,a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(F.apply(this,arguments),"slice",F.call(arguments).join(","))},map:function(a){return this.pushStack(e.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:E,sort:[].sort,splice:[].splice},e.fn.init.prototype=e.fn,e.extend=e.fn.extend=function(){var a,c,d,f,g,h,i=arguments[0]||{},j=1,k=arguments.length,l=!1;typeof i=="boolean"&&(l=i,i=arguments[1]||{},j=2),typeof i!="object"&&!e.isFunction(i)&&(i={}),k===j&&(i=this,--j);for(;j<k;j++)if((a=arguments[j])!=null)for(c in a){d=i[c],f=a[c];if(i===f)continue;l&&f&&(e.isPlainObject(f)||(g=e.isArray(f)))?(g?(g=!1,h=d&&e.isArray(d)?d:[]):h=d&&e.isPlainObject(d)?d:{},i[c]=e.extend(l,h,f)):f!==b&&(i[c]=f)}return i},e.extend({noConflict:function(b){a.$===e&&(a.$=g),b&&a.jQuery===e&&(a.jQuery=f);return e},isReady:!1,readyWait:1,holdReady:function(a){a?e.readyWait++:e.ready(!0)},ready:function(a){if(a===!0&&!--e.readyWait||a!==!0&&!e.isReady){if(!c.body)return setTimeout(e.ready,1);e.isReady=!0;if(a!==!0&&--e.readyWait>0)return;A.fireWith(c,[e]),e.fn.trigger&&e(c).trigger("ready").off("ready")}},bindReady:function(){if(!A){A=e.Callbacks("once memory");if(c.readyState==="complete")return setTimeout(e.ready,1);if(c.addEventListener)c.addEventListener("DOMContentLoaded",B,!1),a.addEventListener("load",e.ready,!1);else if(c.attachEvent){c.attachEvent("onreadystatechange",B),a.attachEvent("onload",e.ready);var b=!1;try{b=a.frameElement==null}catch(d){}c.documentElement.doScroll&&b&&J()}}},isFunction:function(a){return e.type(a)==="function"},isArray:Array.isArray||function(a){return e.type(a)==="array"},isWindow:function(a){return a!=null&&a==a.window},isNumeric:function(a){return!isNaN(parseFloat(a))&&isFinite(a)},type:function(a){return a==null?String(a):I[C.call(a)]||"object"},isPlainObject:function(a){if(!a||e.type(a)!=="object"||a.nodeType||e.isWindow(a))return!1;try{if(a.constructor&&!D.call(a,"constructor")&&!D.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}var d;for(d in a);return d===b||D.call(a,d)},isEmptyObject:function(a){for(var b in a)return!1;return!0},error:function(a){throw new Error(a)},parseJSON:function(b){if(typeof b!="string"||!b)return null;b=e.trim(b);if(a.JSON&&a.JSON.parse)return a.JSON.parse(b);if(n.test(b.replace(o,"@").replace(p,"]").replace(q,"")))return(new Function("return "+b))();e.error("Invalid JSON: "+b)},parseXML:function(c){if(typeof c!="string"||!c)return null;var d,f;try{a.DOMParser?(f=new DOMParser,d=f.parseFromString(c,"text/xml")):(d=new ActiveXObject("Microsoft.XMLDOM"),d.async="false",d.loadXML(c))}catch(g){d=b}(!d||!d.documentElement||d.getElementsByTagName("parsererror").length)&&e.error("Invalid XML: "+c);return d},noop:function(){},globalEval:function(b){b&&j.test(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(w,"ms-").replace(v,x)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,c,d){var f,g=0,h=a.length,i=h===b||e.isFunction(a);if(d){if(i){for(f in a)if(c.apply(a[f],d)===!1)break}else for(;g<h;)if(c.apply(a[g++],d)===!1)break}else if(i){for(f in a)if(c.call(a[f],f,a[f])===!1)break}else for(;g<h;)if(c.call(a[g],g,a[g++])===!1)break;return a},trim:G?function(a){return a==null?"":G.call(a)}:function(a){return a==null?"":(a+"").replace(k,"").replace(l,"")},makeArray:function(a,b){var c=b||[];if(a!=null){var d=e.type(a);a.length==null||d==="string"||d==="function"||d==="regexp"||e.isWindow(a)?E.call(c,a):e.merge(c,a)}return c},inArray:function(a,b,c){var d;if(b){if(H)return H.call(b,a,c);d=b.length,c=c?c<0?Math.max(0,d+c):c:0;for(;c<d;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,c){var d=a.length,e=0;if(typeof c.length=="number")for(var f=c.length;e<f;e++)a[d++]=c[e];else while(c[e]!==b)a[d++]=c[e++];a.length=d;return a},grep:function(a,b,c){var d=[],e;c=!!c;for(var f=0,g=a.length;f<g;f++)e=!!b(a[f],f),c!==e&&d.push(a[f]);return d},map:function(a,c,d){var f,g,h=[],i=0,j=a.length,k=a instanceof e||j!==b&&typeof j=="number"&&(j>0&&a[0]&&a[j-1]||j===0||e.isArray(a));if(k)for(;i<j;i++)f=c(a[i],i,d),f!=null&&(h[h.length]=f);else for(g in a)f=c(a[g],g,d),f!=null&&(h[h.length]=f);return h.concat.apply([],h)},guid:1,proxy:function(a,c){if(typeof c=="string"){var d=a[c];c=a,a=d}if(!e.isFunction(a))return b;var f=F.call(arguments,2),g=function(){return a.apply(c,f.concat(F.call(arguments)))};g.guid=a.guid=a.guid||g.guid||e.guid++;return g},access:function(a,c,d,f,g,h,i){var j,k=d==null,l=0,m=a.length;if(d&&typeof d=="object"){for(l in d)e.access(a,c,l,d[l],1,h,f);g=1}else if(f!==b){j=i===b&&e.isFunction(f),k&&(j?(j=c,c=function(a,b,c){return j.call(e(a),c)}):(c.call(a,f),c=null));if(c)for(;l<m;l++)c(a[l],d,j?f.call(a[l],l,c(a[l],d)):f,i);g=1}return g?a:k?c.call(a):m?c(a[0],d):h},now:function(){return(new Date).getTime()},uaMatch:function(a){a=a.toLowerCase();var b=r.exec(a)||s.exec(a)||t.exec(a)||a.indexOf("compatible")<0&&u.exec(a)||[];return{browser:b[1]||"",version:b[2]||"0"}},sub:function(){function a(b,c){return new a.fn.init(b,c)}e.extend(!0,a,this),a.superclass=this,a.fn=a.prototype=this(),a.fn.constructor=a,a.sub=this.sub,a.fn.init=function(d,f){f&&f instanceof e&&!(f instanceof a)&&(f=a(f));return e.fn.init.call(this,d,f,b)},a.fn.init.prototype=a.fn;var b=a(c);return a},browser:{}}),e.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){I["[object "+b+"]"]=b.toLowerCase()}),z=e.uaMatch(y),z.browser&&(e.browser[z.browser]=!0,e.browser.version=z.version),e.browser.webkit&&(e.browser.safari=!0),j.test(" ")&&(k=/^[\s\xA0]+/,l=/[\s\xA0]+$/),h=e(c),c.addEventListener?B=function(){c.removeEventListener("DOMContentLoaded",B,!1),e.ready()}:c.attachEvent&&(B=function(){c.readyState==="complete"&&(c.detachEvent("onreadystatechange",B),e.ready())});return e}(),g={};f.Callbacks=function(a){a=a?g[a]||h(a):{};var c=[],d=[],e,i,j,k,l,m,n=function(b){var d,e,g,h,i;for(d=0,e=b.length;d<e;d++)g=b[d],h=f.type(g),h==="array"?n(g):h==="function"&&(!a.unique||!p.has(g))&&c.push(g)},o=function(b,f){f=f||[],e=!a.memory||[b,f],i=!0,j=!0,m=k||0,k=0,l=c.length;for(;c&&m<l;m++)if(c[m].apply(b,f)===!1&&a.stopOnFalse){e=!0;break}j=!1,c&&(a.once?e===!0?p.disable():c=[]:d&&d.length&&(e=d.shift(),p.fireWith(e[0],e[1])))},p={add:function(){if(c){var a=c.length;n(arguments),j?l=c.length:e&&e!==!0&&(k=a,o(e[0],e[1]))}return this},remove:function(){if(c){var b=arguments,d=0,e=b.length;for(;d<e;d++)for(var f=0;f<c.length;f++)if(b[d]===c[f]){j&&f<=l&&(l--,f<=m&&m--),c.splice(f--,1);if(a.unique)break}}return this},has:function(a){if(c){var b=0,d=c.length;for(;b<d;b++)if(a===c[b])return!0}return!1},empty:function(){c=[];return this},disable:function(){c=d=e=b;return this},disabled:function(){return!c},lock:function(){d=b,(!e||e===!0)&&p.disable();return this},locked:function(){return!d},fireWith:function(b,c){d&&(j?a.once||d.push([b,c]):(!a.once||!e)&&o(b,c));return this},fire:function(){p.fireWith(this,arguments);return this},fired:function(){return!!i}};return p};var i=[].slice;f.extend({Deferred:function(a){var b=f.Callbacks("once memory"),c=f.Callbacks("once memory"),d=f.Callbacks("memory"),e="pending",g={resolve:b,reject:c,notify:d},h={done:b.add,fail:c.add,progress:d.add,state:function(){return e},isResolved:b.fired,isRejected:c.fired,then:function(a,b,c){i.done(a).fail(b).progress(c);return this},always:function(){i.done.apply(i,arguments).fail.apply(i,arguments);return this},pipe:function(a,b,c){return f.Deferred(function(d){f.each({done:[a,"resolve"],fail:[b,"reject"],progress:[c,"notify"]},function(a,b){var c=b[0],e=b[1],g;f.isFunction(c)?i[a](function(){g=c.apply(this,arguments),g&&f.isFunction(g.promise)?g.promise().then(d.resolve,d.reject,d.notify):d[e+"With"](this===i?d:this,[g])}):i[a](d[e])})}).promise()},promise:function(a){if(a==null)a=h;else for(var b in h)a[b]=h[b];return a}},i=h.promise({}),j;for(j in g)i[j]=g[j].fire,i[j+"With"]=g[j].fireWith;i.done(function(){e="resolved"},c.disable,d.lock).fail(function(){e="rejected"},b.disable,d.lock),a&&a.call(i,i);return i},when:function(a){function m(a){return function(b){e[a]=arguments.length>1?i.call(arguments,0):b,j.notifyWith(k,e)}}function l(a){return function(c){b[a]=arguments.length>1?i.call(arguments,0):c,--g||j.resolveWith(j,b)}}var b=i.call(arguments,0),c=0,d=b.length,e=Array(d),g=d,h=d,j=d<=1&&a&&f.isFunction(a.promise)?a:f.Deferred(),k=j.promise();if(d>1){for(;c<d;c++)b[c]&&b[c].promise&&f.isFunction(b[c].promise)?b[c].promise().then(l(c),j.reject,m(c)):--g;g||j.resolveWith(j,b)}else j!==a&&j.resolveWith(j,d?[a]:[]);return k}}),f.support=function(){var b,d,e,g,h,i,j,k,l,m,n,o,p=c.createElement("div"),q=c.documentElement;p.setAttribute("className","t"),p.innerHTML="   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>",d=p.getElementsByTagName("*"),e=p.getElementsByTagName("a")[0];if(!d||!d.length||!e)return{};g=c.createElement("select"),h=g.appendChild(c.createElement("option")),i=p.getElementsByTagName("input")[0],b={leadingWhitespace:p.firstChild.nodeType===3,tbody:!p.getElementsByTagName("tbody").length,htmlSerialize:!!p.getElementsByTagName("link").length,style:/top/.test(e.getAttribute("style")),hrefNormalized:e.getAttribute("href")==="/a",opacity:/^0.55/.test(e.style.opacity),cssFloat:!!e.style.cssFloat,checkOn:i.value==="on",optSelected:h.selected,getSetAttribute:p.className!=="t",enctype:!!c.createElement("form").enctype,html5Clone:c.createElement("nav").cloneNode(!0).outerHTML!=="<:nav></:nav>",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,pixelMargin:!0},f.boxModel=b.boxModel=c.compatMode==="CSS1Compat",i.checked=!0,b.noCloneChecked=i.cloneNode(!0).checked,g.disabled=!0,b.optDisabled=!h.disabled;try{delete p.test}catch(r){b.deleteExpando=!1}!p.addEventListener&&p.attachEvent&&p.fireEvent&&(p.attachEvent("onclick",function(){b.noCloneEvent=!1}),p.cloneNode(!0).fireEvent("onclick")),i=c.createElement("input"),i.value="t",i.setAttribute("type","radio"),b.radioValue=i.value==="t",i.setAttribute("checked","checked"),i.setAttribute("name","t"),p.appendChild(i),j=c.createDocumentFragment(),j.appendChild(p.lastChild),b.checkClone=j.cloneNode(!0).cloneNode(!0).lastChild.checked,b.appendChecked=i.checked,j.removeChild(i),j.appendChild(p);if(p.attachEvent)for(n in{submit:1,change:1,focusin:1})m="on"+n,o=m in p,o||(p.setAttribute(m,"return;"),o=typeof p[m]=="function"),b[n+"Bubbles"]=o;j.removeChild(p),j=g=h=p=i=null,f(function(){var d,e,g,h,i,j,l,m,n,q,r,s,t,u=c.getElementsByTagName("body")[0];!u||(m=1,t="padding:0;margin:0;border:",r="position:absolute;top:0;left:0;width:1px;height:1px;",s=t+"0;visibility:hidden;",n="style='"+r+t+"5px solid #000;",q="<div "+n+"display:block;'><div style='"+t+"0;display:block;overflow:hidden;'></div></div>"+"<table "+n+"' cellpadding='0' cellspacing='0'>"+"<tr><td></td></tr></table>",d=c.createElement("div"),d.style.cssText=s+"width:0;height:0;position:static;top:0;margin-top:"+m+"px",u.insertBefore(d,u.firstChild),p=c.createElement("div"),d.appendChild(p),p.innerHTML="<table><tr><td style='"+t+"0;display:none'></td><td>t</td></tr></table>",k=p.getElementsByTagName("td"),o=k[0].offsetHeight===0,k[0].style.display="",k[1].style.display="none",b.reliableHiddenOffsets=o&&k[0].offsetHeight===0,a.getComputedStyle&&(p.innerHTML="",l=c.createElement("div"),l.style.width="0",l.style.marginRight="0",p.style.width="2px",p.appendChild(l),b.reliableMarginRight=(parseInt((a.getComputedStyle(l,null)||{marginRight:0}).marginRight,10)||0)===0),typeof p.style.zoom!="undefined"&&(p.innerHTML="",p.style.width=p.style.padding="1px",p.style.border=0,p.style.overflow="hidden",p.style.display="inline",p.style.zoom=1,b.inlineBlockNeedsLayout=p.offsetWidth===3,p.style.display="block",p.style.overflow="visible",p.innerHTML="<div style='width:5px;'></div>",b.shrinkWrapBlocks=p.offsetWidth!==3),p.style.cssText=r+s,p.innerHTML=q,e=p.firstChild,g=e.firstChild,i=e.nextSibling.firstChild.firstChild,j={doesNotAddBorder:g.offsetTop!==5,doesAddBorderForTableAndCells:i.offsetTop===5},g.style.position="fixed",g.style.top="20px",j.fixedPosition=g.offsetTop===20||g.offsetTop===15,g.style.position=g.style.top="",e.style.overflow="hidden",e.style.position="relative",j.subtractsBorderForOverflowNotVisible=g.offsetTop===-5,j.doesNotIncludeMarginInBodyOffset=u.offsetTop!==m,a.getComputedStyle&&(p.style.marginTop="1%",b.pixelMargin=(a.getComputedStyle(p,null)||{marginTop:0}).marginTop!=="1%"),typeof d.style.zoom!="undefined"&&(d.style.zoom=1),u.removeChild(d),l=p=d=null,f.extend(b,j))});return b}();var j=/^(?:\{.*\}|\[.*\])$/,k=/([A-Z])/g;f.extend({cache:{},uuid:0,expando:"jQuery"+(f.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){a=a.nodeType?f.cache[a[f.expando]]:a[f.expando];return!!a&&!m(a)},data:function(a,c,d,e){if(!!f.acceptData(a)){var g,h,i,j=f.expando,k=typeof c=="string",l=a.nodeType,m=l?f.cache:a,n=l?a[j]:a[j]&&j,o=c==="events";if((!n||!m[n]||!o&&!e&&!m[n].data)&&k&&d===b)return;n||(l?a[j]=n=++f.uuid:n=j),m[n]||(m[n]={},l||(m[n].toJSON=f.noop));if(typeof c=="object"||typeof c=="function")e?m[n]=f.extend(m[n],c):m[n].data=f.extend(m[n].data,c);g=h=m[n],e||(h.data||(h.data={}),h=h.data),d!==b&&(h[f.camelCase(c)]=d);if(o&&!h[c])return g.events;k?(i=h[c],i==null&&(i=h[f.camelCase(c)])):i=h;return i}},removeData:function(a,b,c){if(!!f.acceptData(a)){var d,e,g,h=f.expando,i=a.nodeType,j=i?f.cache:a,k=i?a[h]:h;if(!j[k])return;if(b){d=c?j[k]:j[k].data;if(d){f.isArray(b)||(b in d?b=[b]:(b=f.camelCase(b),b in d?b=[b]:b=b.split(" ")));for(e=0,g=b.length;e<g;e++)delete d[b[e]];if(!(c?m:f.isEmptyObject)(d))return}}if(!c){delete j[k].data;if(!m(j[k]))return}f.support.deleteExpando||!j.setInterval?delete j[k]:j[k]=null,i&&(f.support.deleteExpando?delete a[h]:a.removeAttribute?a.removeAttribute(h):a[h]=null)}},_data:function(a,b,c){return f.data(a,b,c,!0)},acceptData:function(a){if(a.nodeName){var b=f.noData[a.nodeName.toLowerCase()];if(b)return b!==!0&&a.getAttribute("classid")===b}return!0}}),f.fn.extend({data:function(a,c){var d,e,g,h,i,j=this[0],k=0,m=null;if(a===b){if(this.length){m=f.data(j);if(j.nodeType===1&&!f._data(j,"parsedAttrs")){g=j.attributes;for(i=g.length;k<i;k++)h=g[k].name,h.indexOf("data-")===0&&(h=f.camelCase(h.substring(5)),l(j,h,m[h]));f._data(j,"parsedAttrs",!0)}}return m}if(typeof a=="object")return this.each(function(){f.data(this,a)});d=a.split(".",2),d[1]=d[1]?"."+d[1]:"",e=d[1]+"!";return f.access(this,function(c){if(c===b){m=this.triggerHandler("getData"+e,[d[0]]),m===b&&j&&(m=f.data(j,a),m=l(j,a,m));return m===b&&d[1]?this.data(d[0]):m}d[1]=c,this.each(function(){var b=f(this);b.triggerHandler("setData"+e,d),f.data(this,a,c),b.triggerHandler("changeData"+e,d)})},null,c,arguments.length>1,null,!1)},removeData:function(a){return this.each(function(){f.removeData(this,a)})}}),f.extend({_mark:function(a,b){a&&(b=(b||"fx")+"mark",f._data(a,b,(f._data(a,b)||0)+1))},_unmark:function(a,b,c){a!==!0&&(c=b,b=a,a=!1);if(b){c=c||"fx";var d=c+"mark",e=a?0:(f._data(b,d)||1)-1;e?f._data(b,d,e):(f.removeData(b,d,!0),n(b,c,"mark"))}},queue:function(a,b,c){var d;if(a){b=(b||"fx")+"queue",d=f._data(a,b),c&&(!d||f.isArray(c)?d=f._data(a,b,f.makeArray(c)):d.push(c));return d||[]}},dequeue:function(a,b){b=b||"fx";var c=f.queue(a,b),d=c.shift(),e={};d==="inprogress"&&(d=c.shift()),d&&(b==="fx"&&c.unshift("inprogress"),f._data(a,b+".run",e),d.call(a,function(){f.dequeue(a,b)},e)),c.length||(f.removeData(a,b+"queue "+b+".run",!0),n(a,b,"queue"))}}),f.fn.extend({queue:function(a,c){var d=2;typeof a!="string"&&(c=a,a="fx",d--);if(arguments.length<d)return f.queue(this[0],a);return c===b?this:this.each(function(){var b=f.queue(this,a,c);a==="fx"&&b[0]!=="inprogress"&&f.dequeue(this,a)})},dequeue:function(a){return this.each(function(){f.dequeue(this,a)})},delay:function(a,b){a=f.fx?f.fx.speeds[a]||a:a,b=b||"fx";return this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,c){function m(){--h||d.resolveWith(e,[e])}typeof a!="string"&&(c=a,a=b),a=a||"fx";var d=f.Deferred(),e=this,g=e.length,h=1,i=a+"defer",j=a+"queue",k=a+"mark",l;while(g--)if(l=f.data(e[g],i,b,!0)||(f.data(e[g],j,b,!0)||f.data(e[g],k,b,!0))&&f.data(e[g],i,f.Callbacks("once memory"),!0))h++,l.add(m);m();return d.promise(c)}});var o=/[\n\t\r]/g,p=/\s+/,q=/\r/g,r=/^(?:button|input)$/i,s=/^(?:button|input|object|select|textarea)$/i,t=/^a(?:rea)?$/i,u=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,v=f.support.getSetAttribute,w,x,y;f.fn.extend({attr:function(a,b){return f.access(this,f.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){f.removeAttr(this,a)})},prop:function(a,b){return f.access(this,f.prop,a,b,arguments.length>1)},removeProp:function(a){a=f.propFix[a]||a;return this.each(function(){try{this[a]=b,delete this[a]}catch(c){}})},addClass:function(a){var b,c,d,e,g,h,i;if(f.isFunction(a))return this.each(function(b){f(this).addClass(a.call(this,b,this.className))});if(a&&typeof a=="string"){b=a.split(p);for(c=0,d=this.length;c<d;c++){e=this[c];if(e.nodeType===1)if(!e.className&&b.length===1)e.className=a;else{g=" "+e.className+" ";for(h=0,i=b.length;h<i;h++)~g.indexOf(" "+b[h]+" ")||(g+=b[h]+" ");e.className=f.trim(g)}}}return this},removeClass:function(a){var c,d,e,g,h,i,j;if(f.isFunction(a))return this.each(function(b){f(this).removeClass(a.call(this,b,this.className))});if(a&&typeof a=="string"||a===b){c=(a||"").split(p);for(d=0,e=this.length;d<e;d++){g=this[d];if(g.nodeType===1&&g.className)if(a){h=(" "+g.className+" ").replace(o," ");for(i=0,j=c.length;i<j;i++)h=h.replace(" "+c[i]+" "," ");g.className=f.trim(h)}else g.className=""}}return this},toggleClass:function(a,b){var c=typeof a,d=typeof b=="boolean";if(f.isFunction(a))return this.each(function(c){f(this).toggleClass(a.call(this,c,this.className,b),b)});return this.each(function(){if(c==="string"){var e,g=0,h=f(this),i=b,j=a.split(p);while(e=j[g++])i=d?i:!h.hasClass(e),h[i?"addClass":"removeClass"](e)}else if(c==="undefined"||c==="boolean")this.className&&f._data(this,"__className__",this.className),this.className=this.className||a===!1?"":f._data(this,"__className__")||""})},hasClass:function(a){var b=" "+a+" ",c=0,d=this.length;for(;c<d;c++)if(this[c].nodeType===1&&(" "+this[c].className+" ").replace(o," ").indexOf(b)>-1)return!0;return!1},val:function(a){var c,d,e,g=this[0];{if(!!arguments.length){e=f.isFunction(a);return this.each(function(d){var g=f(this),h;if(this.nodeType===1){e?h=a.call(this,d,g.val()):h=a,h==null?h="":typeof h=="number"?h+="":f.isArray(h)&&(h=f.map(h,function(a){return a==null?"":a+""})),c=f.valHooks[this.type]||f.valHooks[this.nodeName.toLowerCase()];if(!c||!("set"in c)||c.set(this,h,"value")===b)this.value=h}})}if(g){c=f.valHooks[g.type]||f.valHooks[g.nodeName.toLowerCase()];if(c&&"get"in c&&(d=c.get(g,"value"))!==b)return d;d=g.value;return typeof d=="string"?d.replace(q,""):d==null?"":d}}}}),f.extend({valHooks:{option:{get:function(a){var b=a.attributes.value;return!b||b.specified?a.value:a.text}},select:{get:function(a){var b,c,d,e,g=a.selectedIndex,h=[],i=a.options,j=a.type==="select-one";if(g<0)return null;c=j?g:0,d=j?g+1:i.length;for(;c<d;c++){e=i[c];if(e.selected&&(f.support.optDisabled?!e.disabled:e.getAttribute("disabled")===null)&&(!e.parentNode.disabled||!f.nodeName(e.parentNode,"optgroup"))){b=f(e).val();if(j)return b;h.push(b)}}if(j&&!h.length&&i.length)return f(i[g]).val();return h},set:function(a,b){var c=f.makeArray(b);f(a).find("option").each(function(){this.selected=f.inArray(f(this).val(),c)>=0}),c.length||(a.selectedIndex=-1);return c}}},attrFn:{val:!0,css:!0,html:!0,text:!0,data:!0,width:!0,height:!0,offset:!0},attr:function(a,c,d,e){var g,h,i,j=a.nodeType;if(!!a&&j!==3&&j!==8&&j!==2){if(e&&c in f.attrFn)return f(a)[c](d);if(typeof a.getAttribute=="undefined")return f.prop(a,c,d);i=j!==1||!f.isXMLDoc(a),i&&(c=c.toLowerCase(),h=f.attrHooks[c]||(u.test(c)?x:w));if(d!==b){if(d===null){f.removeAttr(a,c);return}if(h&&"set"in h&&i&&(g=h.set(a,d,c))!==b)return g;a.setAttribute(c,""+d);return d}if(h&&"get"in h&&i&&(g=h.get(a,c))!==null)return g;g=a.getAttribute(c);return g===null?b:g}},removeAttr:function(a,b){var c,d,e,g,h,i=0;if(b&&a.nodeType===1){d=b.toLowerCase().split(p),g=d.length;for(;i<g;i++)e=d[i],e&&(c=f.propFix[e]||e,h=u.test(e),h||f.attr(a,e,""),a.removeAttribute(v?e:c),h&&c in a&&(a[c]=!1))}},attrHooks:{type:{set:function(a,b){if(r.test(a.nodeName)&&a.parentNode)f.error("type property can't be changed");else if(!f.support.radioValue&&b==="radio"&&f.nodeName(a,"input")){var c=a.value;a.setAttribute("type",b),c&&(a.value=c);return b}}},value:{get:function(a,b){if(w&&f.nodeName(a,"button"))return w.get(a,b);return b in a?a.value:null},set:function(a,b,c){if(w&&f.nodeName(a,"button"))return w.set(a,b,c);a.value=b}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(a,c,d){var e,g,h,i=a.nodeType;if(!!a&&i!==3&&i!==8&&i!==2){h=i!==1||!f.isXMLDoc(a),h&&(c=f.propFix[c]||c,g=f.propHooks[c]);return d!==b?g&&"set"in g&&(e=g.set(a,d,c))!==b?e:a[c]=d:g&&"get"in g&&(e=g.get(a,c))!==null?e:a[c]}},propHooks:{tabIndex:{get:function(a){var c=a.getAttributeNode("tabindex");return c&&c.specified?parseInt(c.value,10):s.test(a.nodeName)||t.test(a.nodeName)&&a.href?0:b}}}}),f.attrHooks.tabindex=f.propHooks.tabIndex,x={get:function(a,c){var d,e=f.prop(a,c);return e===!0||typeof e!="boolean"&&(d=a.getAttributeNode(c))&&d.nodeValue!==!1?c.toLowerCase():b},set:function(a,b,c){var d;b===!1?f.removeAttr(a,c):(d=f.propFix[c]||c,d in a&&(a[d]=!0),a.setAttribute(c,c.toLowerCase()));return c}},v||(y={name:!0,id:!0,coords:!0},w=f.valHooks.button={get:function(a,c){var d;d=a.getAttributeNode(c);return d&&(y[c]?d.nodeValue!=="":d.specified)?d.nodeValue:b},set:function(a,b,d){var e=a.getAttributeNode(d);e||(e=c.createAttribute(d),a.setAttributeNode(e));return e.nodeValue=b+""}},f.attrHooks.tabindex.set=w.set,f.each(["width","height"],function(a,b){f.attrHooks[b]=f.extend(f.attrHooks[b],{set:function(a,c){if(c===""){a.setAttribute(b,"auto");return c}}})}),f.attrHooks.contenteditable={get:w.get,set:function(a,b,c){b===""&&(b="false"),w.set(a,b,c)}}),f.support.hrefNormalized||f.each(["href","src","width","height"],function(a,c){f.attrHooks[c]=f.extend(f.attrHooks[c],{get:function(a){var d=a.getAttribute(c,2);return d===null?b:d}})}),f.support.style||(f.attrHooks.style={get:function(a){return a.style.cssText.toLowerCase()||b},set:function(a,b){return a.style.cssText=""+b}}),f.support.optSelected||(f.propHooks.selected=f.extend(f.propHooks.selected,{get:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex);return null}})),f.support.enctype||(f.propFix.enctype="encoding"),f.support.checkOn||f.each(["radio","checkbox"],function(){f.valHooks[this]={get:function(a){return a.getAttribute("value")===null?"on":a.value}}}),f.each(["radio","checkbox"],function(){f.valHooks[this]=f.extend(f.valHooks[this],{set:function(a,b){if(f.isArray(b))return a.checked=f.inArray(f(a).val(),b)>=0}})});var z=/^(?:textarea|input|select)$/i,A=/^([^\.]*)?(?:\.(.+))?$/,B=/(?:^|\s)hover(\.\S+)?\b/,C=/^key/,D=/^(?:mouse|contextmenu)|click/,E=/^(?:focusinfocus|focusoutblur)$/,F=/^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,G=function(
a){var b=F.exec(a);b&&(b[1]=(b[1]||"").toLowerCase(),b[3]=b[3]&&new RegExp("(?:^|\\s)"+b[3]+"(?:\\s|$)"));return b},H=function(a,b){var c=a.attributes||{};return(!b[1]||a.nodeName.toLowerCase()===b[1])&&(!b[2]||(c.id||{}).value===b[2])&&(!b[3]||b[3].test((c["class"]||{}).value))},I=function(a){return f.event.special.hover?a:a.replace(B,"mouseenter$1 mouseleave$1")};f.event={add:function(a,c,d,e,g){var h,i,j,k,l,m,n,o,p,q,r,s;if(!(a.nodeType===3||a.nodeType===8||!c||!d||!(h=f._data(a)))){d.handler&&(p=d,d=p.handler,g=p.selector),d.guid||(d.guid=f.guid++),j=h.events,j||(h.events=j={}),i=h.handle,i||(h.handle=i=function(a){return typeof f!="undefined"&&(!a||f.event.triggered!==a.type)?f.event.dispatch.apply(i.elem,arguments):b},i.elem=a),c=f.trim(I(c)).split(" ");for(k=0;k<c.length;k++){l=A.exec(c[k])||[],m=l[1],n=(l[2]||"").split(".").sort(),s=f.event.special[m]||{},m=(g?s.delegateType:s.bindType)||m,s=f.event.special[m]||{},o=f.extend({type:m,origType:l[1],data:e,handler:d,guid:d.guid,selector:g,quick:g&&G(g),namespace:n.join(".")},p),r=j[m];if(!r){r=j[m]=[],r.delegateCount=0;if(!s.setup||s.setup.call(a,e,n,i)===!1)a.addEventListener?a.addEventListener(m,i,!1):a.attachEvent&&a.attachEvent("on"+m,i)}s.add&&(s.add.call(a,o),o.handler.guid||(o.handler.guid=d.guid)),g?r.splice(r.delegateCount++,0,o):r.push(o),f.event.global[m]=!0}a=null}},global:{},remove:function(a,b,c,d,e){var g=f.hasData(a)&&f._data(a),h,i,j,k,l,m,n,o,p,q,r,s;if(!!g&&!!(o=g.events)){b=f.trim(I(b||"")).split(" ");for(h=0;h<b.length;h++){i=A.exec(b[h])||[],j=k=i[1],l=i[2];if(!j){for(j in o)f.event.remove(a,j+b[h],c,d,!0);continue}p=f.event.special[j]||{},j=(d?p.delegateType:p.bindType)||j,r=o[j]||[],m=r.length,l=l?new RegExp("(^|\\.)"+l.split(".").sort().join("\\.(?:.*\\.)?")+"(\\.|$)"):null;for(n=0;n<r.length;n++)s=r[n],(e||k===s.origType)&&(!c||c.guid===s.guid)&&(!l||l.test(s.namespace))&&(!d||d===s.selector||d==="**"&&s.selector)&&(r.splice(n--,1),s.selector&&r.delegateCount--,p.remove&&p.remove.call(a,s));r.length===0&&m!==r.length&&((!p.teardown||p.teardown.call(a,l)===!1)&&f.removeEvent(a,j,g.handle),delete o[j])}f.isEmptyObject(o)&&(q=g.handle,q&&(q.elem=null),f.removeData(a,["events","handle"],!0))}},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(c,d,e,g){if(!e||e.nodeType!==3&&e.nodeType!==8){var h=c.type||c,i=[],j,k,l,m,n,o,p,q,r,s;if(E.test(h+f.event.triggered))return;h.indexOf("!")>=0&&(h=h.slice(0,-1),k=!0),h.indexOf(".")>=0&&(i=h.split("."),h=i.shift(),i.sort());if((!e||f.event.customEvent[h])&&!f.event.global[h])return;c=typeof c=="object"?c[f.expando]?c:new f.Event(h,c):new f.Event(h),c.type=h,c.isTrigger=!0,c.exclusive=k,c.namespace=i.join("."),c.namespace_re=c.namespace?new RegExp("(^|\\.)"+i.join("\\.(?:.*\\.)?")+"(\\.|$)"):null,o=h.indexOf(":")<0?"on"+h:"";if(!e){j=f.cache;for(l in j)j[l].events&&j[l].events[h]&&f.event.trigger(c,d,j[l].handle.elem,!0);return}c.result=b,c.target||(c.target=e),d=d!=null?f.makeArray(d):[],d.unshift(c),p=f.event.special[h]||{};if(p.trigger&&p.trigger.apply(e,d)===!1)return;r=[[e,p.bindType||h]];if(!g&&!p.noBubble&&!f.isWindow(e)){s=p.delegateType||h,m=E.test(s+h)?e:e.parentNode,n=null;for(;m;m=m.parentNode)r.push([m,s]),n=m;n&&n===e.ownerDocument&&r.push([n.defaultView||n.parentWindow||a,s])}for(l=0;l<r.length&&!c.isPropagationStopped();l++)m=r[l][0],c.type=r[l][1],q=(f._data(m,"events")||{})[c.type]&&f._data(m,"handle"),q&&q.apply(m,d),q=o&&m[o],q&&f.acceptData(m)&&q.apply(m,d)===!1&&c.preventDefault();c.type=h,!g&&!c.isDefaultPrevented()&&(!p._default||p._default.apply(e.ownerDocument,d)===!1)&&(h!=="click"||!f.nodeName(e,"a"))&&f.acceptData(e)&&o&&e[h]&&(h!=="focus"&&h!=="blur"||c.target.offsetWidth!==0)&&!f.isWindow(e)&&(n=e[o],n&&(e[o]=null),f.event.triggered=h,e[h](),f.event.triggered=b,n&&(e[o]=n));return c.result}},dispatch:function(c){c=f.event.fix(c||a.event);var d=(f._data(this,"events")||{})[c.type]||[],e=d.delegateCount,g=[].slice.call(arguments,0),h=!c.exclusive&&!c.namespace,i=f.event.special[c.type]||{},j=[],k,l,m,n,o,p,q,r,s,t,u;g[0]=c,c.delegateTarget=this;if(!i.preDispatch||i.preDispatch.call(this,c)!==!1){if(e&&(!c.button||c.type!=="click")){n=f(this),n.context=this.ownerDocument||this;for(m=c.target;m!=this;m=m.parentNode||this)if(m.disabled!==!0){p={},r=[],n[0]=m;for(k=0;k<e;k++)s=d[k],t=s.selector,p[t]===b&&(p[t]=s.quick?H(m,s.quick):n.is(t)),p[t]&&r.push(s);r.length&&j.push({elem:m,matches:r})}}d.length>e&&j.push({elem:this,matches:d.slice(e)});for(k=0;k<j.length&&!c.isPropagationStopped();k++){q=j[k],c.currentTarget=q.elem;for(l=0;l<q.matches.length&&!c.isImmediatePropagationStopped();l++){s=q.matches[l];if(h||!c.namespace&&!s.namespace||c.namespace_re&&c.namespace_re.test(s.namespace))c.data=s.data,c.handleObj=s,o=((f.event.special[s.origType]||{}).handle||s.handler).apply(q.elem,g),o!==b&&(c.result=o,o===!1&&(c.preventDefault(),c.stopPropagation()))}}i.postDispatch&&i.postDispatch.call(this,c);return c.result}},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){a.which==null&&(a.which=b.charCode!=null?b.charCode:b.keyCode);return a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,d){var e,f,g,h=d.button,i=d.fromElement;a.pageX==null&&d.clientX!=null&&(e=a.target.ownerDocument||c,f=e.documentElement,g=e.body,a.pageX=d.clientX+(f&&f.scrollLeft||g&&g.scrollLeft||0)-(f&&f.clientLeft||g&&g.clientLeft||0),a.pageY=d.clientY+(f&&f.scrollTop||g&&g.scrollTop||0)-(f&&f.clientTop||g&&g.clientTop||0)),!a.relatedTarget&&i&&(a.relatedTarget=i===a.target?d.toElement:i),!a.which&&h!==b&&(a.which=h&1?1:h&2?3:h&4?2:0);return a}},fix:function(a){if(a[f.expando])return a;var d,e,g=a,h=f.event.fixHooks[a.type]||{},i=h.props?this.props.concat(h.props):this.props;a=f.Event(g);for(d=i.length;d;)e=i[--d],a[e]=g[e];a.target||(a.target=g.srcElement||c),a.target.nodeType===3&&(a.target=a.target.parentNode),a.metaKey===b&&(a.metaKey=a.ctrlKey);return h.filter?h.filter(a,g):a},special:{ready:{setup:f.bindReady},load:{noBubble:!0},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(a,b,c){f.isWindow(this)&&(this.onbeforeunload=c)},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null)}}},simulate:function(a,b,c,d){var e=f.extend(new f.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?f.event.trigger(e,null,b):f.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},f.event.handle=f.event.dispatch,f.removeEvent=c.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){a.detachEvent&&a.detachEvent("on"+b,c)},f.Event=function(a,b){if(!(this instanceof f.Event))return new f.Event(a,b);a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault()?K:J):this.type=a,b&&f.extend(this,b),this.timeStamp=a&&a.timeStamp||f.now(),this[f.expando]=!0},f.Event.prototype={preventDefault:function(){this.isDefaultPrevented=K;var a=this.originalEvent;!a||(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){this.isPropagationStopped=K;var a=this.originalEvent;!a||(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=K,this.stopPropagation()},isDefaultPrevented:J,isPropagationStopped:J,isImmediatePropagationStopped:J},f.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){f.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c=this,d=a.relatedTarget,e=a.handleObj,g=e.selector,h;if(!d||d!==c&&!f.contains(c,d))a.type=e.origType,h=e.handler.apply(this,arguments),a.type=b;return h}}}),f.support.submitBubbles||(f.event.special.submit={setup:function(){if(f.nodeName(this,"form"))return!1;f.event.add(this,"click._submit keypress._submit",function(a){var c=a.target,d=f.nodeName(c,"input")||f.nodeName(c,"button")?c.form:b;d&&!d._submit_attached&&(f.event.add(d,"submit._submit",function(a){a._submit_bubble=!0}),d._submit_attached=!0)})},postDispatch:function(a){a._submit_bubble&&(delete a._submit_bubble,this.parentNode&&!a.isTrigger&&f.event.simulate("submit",this.parentNode,a,!0))},teardown:function(){if(f.nodeName(this,"form"))return!1;f.event.remove(this,"._submit")}}),f.support.changeBubbles||(f.event.special.change={setup:function(){if(z.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio")f.event.add(this,"propertychange._change",function(a){a.originalEvent.propertyName==="checked"&&(this._just_changed=!0)}),f.event.add(this,"click._change",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1,f.event.simulate("change",this,a,!0))});return!1}f.event.add(this,"beforeactivate._change",function(a){var b=a.target;z.test(b.nodeName)&&!b._change_attached&&(f.event.add(b,"change._change",function(a){this.parentNode&&!a.isSimulated&&!a.isTrigger&&f.event.simulate("change",this.parentNode,a,!0)}),b._change_attached=!0)})},handle:function(a){var b=a.target;if(this!==b||a.isSimulated||a.isTrigger||b.type!=="radio"&&b.type!=="checkbox")return a.handleObj.handler.apply(this,arguments)},teardown:function(){f.event.remove(this,"._change");return z.test(this.nodeName)}}),f.support.focusinBubbles||f.each({focus:"focusin",blur:"focusout"},function(a,b){var d=0,e=function(a){f.event.simulate(b,a.target,f.event.fix(a),!0)};f.event.special[b]={setup:function(){d++===0&&c.addEventListener(a,e,!0)},teardown:function(){--d===0&&c.removeEventListener(a,e,!0)}}}),f.fn.extend({on:function(a,c,d,e,g){var h,i;if(typeof a=="object"){typeof c!="string"&&(d=d||c,c=b);for(i in a)this.on(i,c,d,a[i],g);return this}d==null&&e==null?(e=c,d=c=b):e==null&&(typeof c=="string"?(e=d,d=b):(e=d,d=c,c=b));if(e===!1)e=J;else if(!e)return this;g===1&&(h=e,e=function(a){f().off(a);return h.apply(this,arguments)},e.guid=h.guid||(h.guid=f.guid++));return this.each(function(){f.event.add(this,a,e,d,c)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,c,d){if(a&&a.preventDefault&&a.handleObj){var e=a.handleObj;f(a.delegateTarget).off(e.namespace?e.origType+"."+e.namespace:e.origType,e.selector,e.handler);return this}if(typeof a=="object"){for(var g in a)this.off(g,c,a[g]);return this}if(c===!1||typeof c=="function")d=c,c=b;d===!1&&(d=J);return this.each(function(){f.event.remove(this,a,d,c)})},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},live:function(a,b,c){f(this.context).on(a,this.selector,b,c);return this},die:function(a,b){f(this.context).off(a,this.selector||"**",b);return this},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return arguments.length==1?this.off(a,"**"):this.off(b,a,c)},trigger:function(a,b){return this.each(function(){f.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0])return f.event.trigger(a,b,this[0],!0)},toggle:function(a){var b=arguments,c=a.guid||f.guid++,d=0,e=function(c){var e=(f._data(this,"lastToggle"+a.guid)||0)%d;f._data(this,"lastToggle"+a.guid,e+1),c.preventDefault();return b[e].apply(this,arguments)||!1};e.guid=c;while(d<b.length)b[d++].guid=c;return this.click(e)},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){f.fn[b]=function(a,c){c==null&&(c=a,a=null);return arguments.length>0?this.on(b,null,a,c):this.trigger(b)},f.attrFn&&(f.attrFn[b]=!0),C.test(b)&&(f.event.fixHooks[b]=f.event.keyHooks),D.test(b)&&(f.event.fixHooks[b]=f.event.mouseHooks)}),function(){function x(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}if(j.nodeType===1){g||(j[d]=c,j.sizset=h);if(typeof b!="string"){if(j===b){k=!0;break}}else if(m.filter(b,[j]).length>0){k=j;break}}j=j[a]}e[h]=k}}}function w(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}j.nodeType===1&&!g&&(j[d]=c,j.sizset=h);if(j.nodeName.toLowerCase()===b){k=j;break}j=j[a]}e[h]=k}}}var a=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,d="sizcache"+(Math.random()+"").replace(".",""),e=0,g=Object.prototype.toString,h=!1,i=!0,j=/\\/g,k=/\r\n/g,l=/\W/;[0,0].sort(function(){i=!1;return 0});var m=function(b,d,e,f){e=e||[],d=d||c;var h=d;if(d.nodeType!==1&&d.nodeType!==9)return[];if(!b||typeof b!="string")return e;var i,j,k,l,n,q,r,t,u=!0,v=m.isXML(d),w=[],x=b;do{a.exec(""),i=a.exec(x);if(i){x=i[3],w.push(i[1]);if(i[2]){l=i[3];break}}}while(i);if(w.length>1&&p.exec(b))if(w.length===2&&o.relative[w[0]])j=y(w[0]+w[1],d,f);else{j=o.relative[w[0]]?[d]:m(w.shift(),d);while(w.length)b=w.shift(),o.relative[b]&&(b+=w.shift()),j=y(b,j,f)}else{!f&&w.length>1&&d.nodeType===9&&!v&&o.match.ID.test(w[0])&&!o.match.ID.test(w[w.length-1])&&(n=m.find(w.shift(),d,v),d=n.expr?m.filter(n.expr,n.set)[0]:n.set[0]);if(d){n=f?{expr:w.pop(),set:s(f)}:m.find(w.pop(),w.length===1&&(w[0]==="~"||w[0]==="+")&&d.parentNode?d.parentNode:d,v),j=n.expr?m.filter(n.expr,n.set):n.set,w.length>0?k=s(j):u=!1;while(w.length)q=w.pop(),r=q,o.relative[q]?r=w.pop():q="",r==null&&(r=d),o.relative[q](k,r,v)}else k=w=[]}k||(k=j),k||m.error(q||b);if(g.call(k)==="[object Array]")if(!u)e.push.apply(e,k);else if(d&&d.nodeType===1)for(t=0;k[t]!=null;t++)k[t]&&(k[t]===!0||k[t].nodeType===1&&m.contains(d,k[t]))&&e.push(j[t]);else for(t=0;k[t]!=null;t++)k[t]&&k[t].nodeType===1&&e.push(j[t]);else s(k,e);l&&(m(l,h,e,f),m.uniqueSort(e));return e};m.uniqueSort=function(a){if(u){h=i,a.sort(u);if(h)for(var b=1;b<a.length;b++)a[b]===a[b-1]&&a.splice(b--,1)}return a},m.matches=function(a,b){return m(a,null,null,b)},m.matchesSelector=function(a,b){return m(b,null,null,[a]).length>0},m.find=function(a,b,c){var d,e,f,g,h,i;if(!a)return[];for(e=0,f=o.order.length;e<f;e++){h=o.order[e];if(g=o.leftMatch[h].exec(a)){i=g[1],g.splice(1,1);if(i.substr(i.length-1)!=="\\"){g[1]=(g[1]||"").replace(j,""),d=o.find[h](g,b,c);if(d!=null){a=a.replace(o.match[h],"");break}}}}d||(d=typeof b.getElementsByTagName!="undefined"?b.getElementsByTagName("*"):[]);return{set:d,expr:a}},m.filter=function(a,c,d,e){var f,g,h,i,j,k,l,n,p,q=a,r=[],s=c,t=c&&c[0]&&m.isXML(c[0]);while(a&&c.length){for(h in o.filter)if((f=o.leftMatch[h].exec(a))!=null&&f[2]){k=o.filter[h],l=f[1],g=!1,f.splice(1,1);if(l.substr(l.length-1)==="\\")continue;s===r&&(r=[]);if(o.preFilter[h]){f=o.preFilter[h](f,s,d,r,e,t);if(!f)g=i=!0;else if(f===!0)continue}if(f)for(n=0;(j=s[n])!=null;n++)j&&(i=k(j,f,n,s),p=e^i,d&&i!=null?p?g=!0:s[n]=!1:p&&(r.push(j),g=!0));if(i!==b){d||(s=r),a=a.replace(o.match[h],"");if(!g)return[];break}}if(a===q)if(g==null)m.error(a);else break;q=a}return s},m.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)};var n=m.getText=function(a){var b,c,d=a.nodeType,e="";if(d){if(d===1||d===9||d===11){if(typeof a.textContent=="string")return a.textContent;if(typeof a.innerText=="string")return a.innerText.replace(k,"");for(a=a.firstChild;a;a=a.nextSibling)e+=n(a)}else if(d===3||d===4)return a.nodeValue}else for(b=0;c=a[b];b++)c.nodeType!==8&&(e+=n(c));return e},o=m.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(a){return a.getAttribute("href")},type:function(a){return a.getAttribute("type")}},relative:{"+":function(a,b){var c=typeof b=="string",d=c&&!l.test(b),e=c&&!d;d&&(b=b.toLowerCase());for(var f=0,g=a.length,h;f<g;f++)if(h=a[f]){while((h=h.previousSibling)&&h.nodeType!==1);a[f]=e||h&&h.nodeName.toLowerCase()===b?h||!1:h===b}e&&m.filter(b,a,!0)},">":function(a,b){var c,d=typeof b=="string",e=0,f=a.length;if(d&&!l.test(b)){b=b.toLowerCase();for(;e<f;e++){c=a[e];if(c){var g=c.parentNode;a[e]=g.nodeName.toLowerCase()===b?g:!1}}}else{for(;e<f;e++)c=a[e],c&&(a[e]=d?c.parentNode:c.parentNode===b);d&&m.filter(b,a,!0)}},"":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("parentNode",b,f,a,d,c)},"~":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("previousSibling",b,f,a,d,c)}},find:{ID:function(a,b,c){if(typeof b.getElementById!="undefined"&&!c){var d=b.getElementById(a[1]);return d&&d.parentNode?[d]:[]}},NAME:function(a,b){if(typeof b.getElementsByName!="undefined"){var c=[],d=b.getElementsByName(a[1]);for(var e=0,f=d.length;e<f;e++)d[e].getAttribute("name")===a[1]&&c.push(d[e]);return c.length===0?null:c}},TAG:function(a,b){if(typeof b.getElementsByTagName!="undefined")return b.getElementsByTagName(a[1])}},preFilter:{CLASS:function(a,b,c,d,e,f){a=" "+a[1].replace(j,"")+" ";if(f)return a;for(var g=0,h;(h=b[g])!=null;g++)h&&(e^(h.className&&(" "+h.className+" ").replace(/[\t\n\r]/g," ").indexOf(a)>=0)?c||d.push(h):c&&(b[g]=!1));return!1},ID:function(a){return a[1].replace(j,"")},TAG:function(a,b){return a[1].replace(j,"").toLowerCase()},CHILD:function(a){if(a[1]==="nth"){a[2]||m.error(a[0]),a[2]=a[2].replace(/^\+|\s*/g,"");var b=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2]==="even"&&"2n"||a[2]==="odd"&&"2n+1"||!/\D/.test(a[2])&&"0n+"+a[2]||a[2]);a[2]=b[1]+(b[2]||1)-0,a[3]=b[3]-0}else a[2]&&m.error(a[0]);a[0]=e++;return a},ATTR:function(a,b,c,d,e,f){var g=a[1]=a[1].replace(j,"");!f&&o.attrMap[g]&&(a[1]=o.attrMap[g]),a[4]=(a[4]||a[5]||"").replace(j,""),a[2]==="~="&&(a[4]=" "+a[4]+" ");return a},PSEUDO:function(b,c,d,e,f){if(b[1]==="not")if((a.exec(b[3])||"").length>1||/^\w/.test(b[3]))b[3]=m(b[3],null,null,c);else{var g=m.filter(b[3],c,d,!0^f);d||e.push.apply(e,g);return!1}else if(o.match.POS.test(b[0])||o.match.CHILD.test(b[0]))return!0;return b},POS:function(a){a.unshift(!0);return a}},filters:{enabled:function(a){return a.disabled===!1&&a.type!=="hidden"},disabled:function(a){return a.disabled===!0},checked:function(a){return a.checked===!0},selected:function(a){a.parentNode&&a.parentNode.selectedIndex;return a.selected===!0},parent:function(a){return!!a.firstChild},empty:function(a){return!a.firstChild},has:function(a,b,c){return!!m(c[3],a).length},header:function(a){return/h\d/i.test(a.nodeName)},text:function(a){var b=a.getAttribute("type"),c=a.type;return a.nodeName.toLowerCase()==="input"&&"text"===c&&(b===c||b===null)},radio:function(a){return a.nodeName.toLowerCase()==="input"&&"radio"===a.type},checkbox:function(a){return a.nodeName.toLowerCase()==="input"&&"checkbox"===a.type},file:function(a){return a.nodeName.toLowerCase()==="input"&&"file"===a.type},password:function(a){return a.nodeName.toLowerCase()==="input"&&"password"===a.type},submit:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"submit"===a.type},image:function(a){return a.nodeName.toLowerCase()==="input"&&"image"===a.type},reset:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"reset"===a.type},button:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&"button"===a.type||b==="button"},input:function(a){return/input|select|textarea|button/i.test(a.nodeName)},focus:function(a){return a===a.ownerDocument.activeElement}},setFilters:{first:function(a,b){return b===0},last:function(a,b,c,d){return b===d.length-1},even:function(a,b){return b%2===0},odd:function(a,b){return b%2===1},lt:function(a,b,c){return b<c[3]-0},gt:function(a,b,c){return b>c[3]-0},nth:function(a,b,c){return c[3]-0===b},eq:function(a,b,c){return c[3]-0===b}},filter:{PSEUDO:function(a,b,c,d){var e=b[1],f=o.filters[e];if(f)return f(a,c,b,d);if(e==="contains")return(a.textContent||a.innerText||n([a])||"").indexOf(b[3])>=0;if(e==="not"){var g=b[3];for(var h=0,i=g.length;h<i;h++)if(g[h]===a)return!1;return!0}m.error(e)},CHILD:function(a,b){var c,e,f,g,h,i,j,k=b[1],l=a;switch(k){case"only":case"first":while(l=l.previousSibling)if(l.nodeType===1)return!1;if(k==="first")return!0;l=a;case"last":while(l=l.nextSibling)if(l.nodeType===1)return!1;return!0;case"nth":c=b[2],e=b[3];if(c===1&&e===0)return!0;f=b[0],g=a.parentNode;if(g&&(g[d]!==f||!a.nodeIndex)){i=0;for(l=g.firstChild;l;l=l.nextSibling)l.nodeType===1&&(l.nodeIndex=++i);g[d]=f}j=a.nodeIndex-e;return c===0?j===0:j%c===0&&j/c>=0}},ID:function(a,b){return a.nodeType===1&&a.getAttribute("id")===b},TAG:function(a,b){return b==="*"&&a.nodeType===1||!!a.nodeName&&a.nodeName.toLowerCase()===b},CLASS:function(a,b){return(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)>-1},ATTR:function(a,b){var c=b[1],d=m.attr?m.attr(a,c):o.attrHandle[c]?o.attrHandle[c](a):a[c]!=null?a[c]:a.getAttribute(c),e=d+"",f=b[2],g=b[4];return d==null?f==="!=":!f&&m.attr?d!=null:f==="="?e===g:f==="*="?e.indexOf(g)>=0:f==="~="?(" "+e+" ").indexOf(g)>=0:g?f==="!="?e!==g:f==="^="?e.indexOf(g)===0:f==="$="?e.substr(e.length-g.length)===g:f==="|="?e===g||e.substr(0,g.length+1)===g+"-":!1:e&&d!==!1},POS:function(a,b,c,d){var e=b[2],f=o.setFilters[e];if(f)return f(a,c,b,d)}}},p=o.match.POS,q=function(a,b){return"\\"+(b-0+1)};for(var r in o.match)o.match[r]=new RegExp(o.match[r].source+/(?![^\[]*\])(?![^\(]*\))/.source),o.leftMatch[r]=new RegExp(/(^(?:.|\r|\n)*?)/.source+o.match[r].source.replace(/\\(\d+)/g,q));o.match.globalPOS=p;var s=function(a,b){a=Array.prototype.slice.call(a,0);if(b){b.push.apply(b,a);return b}return a};try{Array.prototype.slice.call(c.documentElement.childNodes,0)[0].nodeType}catch(t){s=function(a,b){var c=0,d=b||[];if(g.call(a)==="[object Array]")Array.prototype.push.apply(d,a);else if(typeof a.length=="number")for(var e=a.length;c<e;c++)d.push(a[c]);else for(;a[c];c++)d.push(a[c]);return d}}var u,v;c.documentElement.compareDocumentPosition?u=function(a,b){if(a===b){h=!0;return 0}if(!a.compareDocumentPosition||!b.compareDocumentPosition)return a.compareDocumentPosition?-1:1;return a.compareDocumentPosition(b)&4?-1:1}:(u=function(a,b){if(a===b){h=!0;return 0}if(a.sourceIndex&&b.sourceIndex)return a.sourceIndex-b.sourceIndex;var c,d,e=[],f=[],g=a.parentNode,i=b.parentNode,j=g;if(g===i)return v(a,b);if(!g)return-1;if(!i)return 1;while(j)e.unshift(j),j=j.parentNode;j=i;while(j)f.unshift(j),j=j.parentNode;c=e.length,d=f.length;for(var k=0;k<c&&k<d;k++)if(e[k]!==f[k])return v(e[k],f[k]);return k===c?v(a,f[k],-1):v(e[k],b,1)},v=function(a,b,c){if(a===b)return c;var d=a.nextSibling;while(d){if(d===b)return-1;d=d.nextSibling}return 1}),function(){var a=c.createElement("div"),d="script"+(new Date).getTime(),e=c.documentElement;a.innerHTML="<a name='"+d+"'/>",e.insertBefore(a,e.firstChild),c.getElementById(d)&&(o.find.ID=function(a,c,d){if(typeof c.getElementById!="undefined"&&!d){var e=c.getElementById(a[1]);return e?e.id===a[1]||typeof e.getAttributeNode!="undefined"&&e.getAttributeNode("id").nodeValue===a[1]?[e]:b:[]}},o.filter.ID=function(a,b){var c=typeof a.getAttributeNode!="undefined"&&a.getAttributeNode("id");return a.nodeType===1&&c&&c.nodeValue===b}),e.removeChild(a),e=a=null}(),function(){var a=c.createElement("div");a.appendChild(c.createComment("")),a.getElementsByTagName("*").length>0&&(o.find.TAG=function(a,b){var c=b.getElementsByTagName(a[1]);if(a[1]==="*"){var d=[];for(var e=0;c[e];e++)c[e].nodeType===1&&d.push(c[e]);c=d}return c}),a.innerHTML="<a href='#'></a>",a.firstChild&&typeof a.firstChild.getAttribute!="undefined"&&a.firstChild.getAttribute("href")!=="#"&&(o.attrHandle.href=function(a){return a.getAttribute("href",2)}),a=null}(),c.querySelectorAll&&function(){var a=m,b=c.createElement("div"),d="__sizzle__";b.innerHTML="<p class='TEST'></p>";if(!b.querySelectorAll||b.querySelectorAll(".TEST").length!==0){m=function(b,e,f,g){e=e||c;if(!g&&!m.isXML(e)){var h=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);if(h&&(e.nodeType===1||e.nodeType===9)){if(h[1])return s(e.getElementsByTagName(b),f);if(h[2]&&o.find.CLASS&&e.getElementsByClassName)return s(e.getElementsByClassName(h[2]),f)}if(e.nodeType===9){if(b==="body"&&e.body)return s([e.body],f);if(h&&h[3]){var i=e.getElementById(h[3]);if(!i||!i.parentNode)return s([],f);if(i.id===h[3])return s([i],f)}try{return s(e.querySelectorAll(b),f)}catch(j){}}else if(e.nodeType===1&&e.nodeName.toLowerCase()!=="object"){var k=e,l=e.getAttribute("id"),n=l||d,p=e.parentNode,q=/^\s*[+~]/.test(b);l?n=n.replace(/'/g,"\\$&"):e.setAttribute("id",n),q&&p&&(e=e.parentNode);try{if(!q||p)return s(e.querySelectorAll("[id='"+n+"'] "+b),f)}catch(r){}finally{l||k.removeAttribute("id")}}}return a(b,e,f,g)};for(var e in a)m[e]=a[e];b=null}}(),function(){var a=c.documentElement,b=a.matchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||a.msMatchesSelector;if(b){var d=!b.call(c.createElement("div"),"div"),e=!1;try{b.call(c.documentElement,"[Tests!='']:sizzle")}catch(f){e=!0}m.matchesSelector=function(a,c){c=c.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!m.isXML(a))try{if(e||!o.match.PSEUDO.test(c)&&!/!=/.test(c)){var f=b.call(a,c);if(f||!d||a.document&&a.document.nodeType!==11)return f}}catch(g){}return m(c,null,null,[a]).length>0}}}(),function(){var a=c.createElement("div");a.innerHTML="<div class='Tests e'></div><div class='Tests'></div>";if(!!a.getElementsByClassName&&a.getElementsByClassName("e").length!==0){a.lastChild.className="e";if(a.getElementsByClassName("e").length===1)return;o.order.splice(1,0,"CLASS"),o.find.CLASS=function(a,b,c){if(typeof b.getElementsByClassName!="undefined"&&!c)return b.getElementsByClassName(a[1])},a=null}}(),c.documentElement.contains?m.contains=function(a,b){return a!==b&&(a.contains?a.contains(b):!0)}:c.documentElement.compareDocumentPosition?m.contains=function(a,b){return!!(a.compareDocumentPosition(b)&16)}:m.contains=function(){return!1},m.isXML=function(a){var b=(a?a.ownerDocument||a:0).documentElement;return b?b.nodeName!=="HTML":!1};var y=function(a,b,c){var d,e=[],f="",g=b.nodeType?[b]:b;while(d=o.match.PSEUDO.exec(a))f+=d[0],a=a.replace(o.match.PSEUDO,"");a=o.relative[a]?a+"*":a;for(var h=0,i=g.length;h<i;h++)m(a,g[h],e,c);return m.filter(f,e)};m.attr=f.attr,m.selectors.attrMap={},f.find=m,f.expr=m.selectors,f.expr[":"]=f.expr.filters,f.unique=m.uniqueSort,f.text=m.getText,f.isXMLDoc=m.isXML,f.contains=m.contains}();var L=/Until$/,M=/^(?:parents|prevUntil|prevAll)/,N=/,/,O=/^.[^:#\[\.,]*$/,P=Array.prototype.slice,Q=f.expr.match.globalPOS,R={children:!0,contents:!0,next:!0,prev:!0};f.fn.extend({find:function(a){var b=this,c,d;if(typeof a!="string")return f(a).filter(function(){for(c=0,d=b.length;c<d;c++)if(f.contains(b[c],this))return!0});var e=this.pushStack("","find",a),g,h,i;for(c=0,d=this.length;c<d;c++){g=e.length,f.find(a,this[c],e);if(c>0)for(h=g;h<e.length;h++)for(i=0;i<g;i++)if(e[i]===e[h]){e.splice(h--,1);break}}return e},has:function(a){var b=f(a);return this.filter(function(){for(var a=0,c=b.length;a<c;a++)if(f.contains(this,b[a]))return!0})},not:function(a){return this.pushStack(T(this,a,!1),"not",a)},filter:function(a){return this.pushStack(T(this,a,!0),"filter",a)},is:function(a){return!!a&&(typeof a=="string"?Q.test(a)?f(a,this.context).index(this[0])>=0:f.filter(a,this).length>0:this.filter(a).length>0)},closest:function(a,b){var c=[],d,e,g=this[0];if(f.isArray(a)){var h=1;while(g&&g.ownerDocument&&g!==b){for(d=0;d<a.length;d++)f(g).is(a[d])&&c.push({selector:a[d],elem:g,level:h});g=g.parentNode,h++}return c}var i=Q.test(a)||typeof a!="string"?f(a,b||this.context):0;for(d=0,e=this.length;d<e;d++){g=this[d];while(g){if(i?i.index(g)>-1:f.find.matchesSelector(g,a)){c.push(g);break}g=g.parentNode;if(!g||!g.ownerDocument||g===b||g.nodeType===11)break}}c=c.length>1?f.unique(c):c;return this.pushStack(c,"closest",a)},index:function(a){if(!a)return this[0]&&this[0].parentNode?this.prevAll().length:-1;if(typeof a=="string")return f.inArray(this[0],f(a));return f.inArray(a.jquery?a[0]:a,this)},add:function(a,b){var c=typeof a=="string"?f(a,b):f.makeArray(a&&a.nodeType?[a]:a),d=f.merge(this.get(),c);return this.pushStack(S(c[0])||S(d[0])?d:f.unique(d))},andSelf:function(){return this.add(this.prevObject)}}),f.each({parent:function(a){var b=a.parentNode;return b&&b.nodeType!==11?b:null},parents:function(a){return f.dir(a,"parentNode")},parentsUntil:function(a,b,c){return f.dir(a,"parentNode",c)},next:function(a){return f.nth(a,2,"nextSibling")},prev:function(a){return f.nth(a,2,"previousSibling")},nextAll:function(a){return f.dir(a,"nextSibling")},prevAll:function(a){return f.dir(a,"previousSibling")},nextUntil:function(a,b,c){return f.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return f.dir(a,"previousSibling",c)},siblings:function(a){return f.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return f.sibling(a.firstChild)},contents:function(a){return f.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:f.makeArray(a.childNodes)}},function(a,b){f.fn[a]=function(c,d){var e=f.map(this,b,c);L.test(a)||(d=c),d&&typeof d=="string"&&(e=f.filter(d,e)),e=this.length>1&&!R[a]?f.unique(e):e,(this.length>1||N.test(d))&&M.test(a)&&(e=e.reverse());return this.pushStack(e,a,P.call(arguments).join(","))}}),f.extend({filter:function(a,b,c){c&&(a=":not("+a+")");return b.length===1?f.find.matchesSelector(b[0],a)?[b[0]]:[]:f.find.matches(a,b)},dir:function(a,c,d){var e=[],g=a[c];while(g&&g.nodeType!==9&&(d===b||g.nodeType!==1||!f(g).is(d)))g.nodeType===1&&e.push(g),g=g[c];return e},nth:function(a,b,c,d){b=b||1;var e=0;for(;a;a=a[c])if(a.nodeType===1&&++e===b)break;return a},sibling:function(a,b){var c=[];for(;a;a=a.nextSibling)a.nodeType===1&&a!==b&&c.push(a);return c}});var V="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",W=/ jQuery\d+="(?:\d+|null)"/g,X=/^\s+/,Y=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,Z=/<([\w:]+)/,$=/<tbody/i,_=/<|&#?\w+;/,ba=/<(?:script|style)/i,bb=/<(?:script|object|embed|option|style)/i,bc=new RegExp("<(?:"+V+")[\\s/>]","i"),bd=/checked\s*(?:[^=]|=\s*.checked.)/i,be=/\/(java|ecma)script/i,bf=/^\s*<!(?:\[CDATA\[|\-\-)/,bg={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},bh=U(c);bg.optgroup=bg.option,bg.tbody=bg.tfoot=bg.colgroup=bg.caption=bg.thead,bg.th=bg.td,f.support.htmlSerialize||(bg._default=[1,"div<div>","</div>"]),f.fn.extend({text:function(a){return f.access(this,function(a){return a===b?f.text(this):this.empty().append((this[0]&&this[0].ownerDocument||c).createTextNode(a))},null,a,arguments.length)},wrapAll:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapAll(a.call(this,b))});if(this[0]){var b=f(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&a.firstChild.nodeType===1)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapInner(a.call(this,b))});return this.each(function(){var b=f(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=f.isFunction(a);return this.each(function(c){f(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){f.nodeName(this,"body")||f(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this)});if(arguments.length){var a=f
.clean(arguments);a.push.apply(a,this.toArray());return this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling)});if(arguments.length){var a=this.pushStack(this,"after",arguments);a.push.apply(a,f.clean(arguments));return a}},remove:function(a,b){for(var c=0,d;(d=this[c])!=null;c++)if(!a||f.filter(a,[d]).length)!b&&d.nodeType===1&&(f.cleanData(d.getElementsByTagName("*")),f.cleanData([d])),d.parentNode&&d.parentNode.removeChild(d);return this},empty:function(){for(var a=0,b;(b=this[a])!=null;a++){b.nodeType===1&&f.cleanData(b.getElementsByTagName("*"));while(b.firstChild)b.removeChild(b.firstChild)}return this},clone:function(a,b){a=a==null?!1:a,b=b==null?a:b;return this.map(function(){return f.clone(this,a,b)})},html:function(a){return f.access(this,function(a){var c=this[0]||{},d=0,e=this.length;if(a===b)return c.nodeType===1?c.innerHTML.replace(W,""):null;if(typeof a=="string"&&!ba.test(a)&&(f.support.leadingWhitespace||!X.test(a))&&!bg[(Z.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(Y,"<$1></$2>");try{for(;d<e;d++)c=this[d]||{},c.nodeType===1&&(f.cleanData(c.getElementsByTagName("*")),c.innerHTML=a);c=0}catch(g){}}c&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(a){if(this[0]&&this[0].parentNode){if(f.isFunction(a))return this.each(function(b){var c=f(this),d=c.html();c.replaceWith(a.call(this,b,d))});typeof a!="string"&&(a=f(a).detach());return this.each(function(){var b=this.nextSibling,c=this.parentNode;f(this).remove(),b?f(b).before(a):f(c).append(a)})}return this.length?this.pushStack(f(f.isFunction(a)?a():a),"replaceWith",a):this},detach:function(a){return this.remove(a,!0)},domManip:function(a,c,d){var e,g,h,i,j=a[0],k=[];if(!f.support.checkClone&&arguments.length===3&&typeof j=="string"&&bd.test(j))return this.each(function(){f(this).domManip(a,c,d,!0)});if(f.isFunction(j))return this.each(function(e){var g=f(this);a[0]=j.call(this,e,c?g.html():b),g.domManip(a,c,d)});if(this[0]){i=j&&j.parentNode,f.support.parentNode&&i&&i.nodeType===11&&i.childNodes.length===this.length?e={fragment:i}:e=f.buildFragment(a,this,k),h=e.fragment,h.childNodes.length===1?g=h=h.firstChild:g=h.firstChild;if(g){c=c&&f.nodeName(g,"tr");for(var l=0,m=this.length,n=m-1;l<m;l++)d.call(c?bi(this[l],g):this[l],e.cacheable||m>1&&l<n?f.clone(h,!0,!0):h)}k.length&&f.each(k,function(a,b){b.src?f.ajax({type:"GET",global:!1,url:b.src,async:!1,dataType:"script"}):f.globalEval((b.text||b.textContent||b.innerHTML||"").replace(bf,"/*$0*/")),b.parentNode&&b.parentNode.removeChild(b)})}return this}}),f.buildFragment=function(a,b,d){var e,g,h,i,j=a[0];b&&b[0]&&(i=b[0].ownerDocument||b[0]),i.createDocumentFragment||(i=c),a.length===1&&typeof j=="string"&&j.length<512&&i===c&&j.charAt(0)==="<"&&!bb.test(j)&&(f.support.checkClone||!bd.test(j))&&(f.support.html5Clone||!bc.test(j))&&(g=!0,h=f.fragments[j],h&&h!==1&&(e=h)),e||(e=i.createDocumentFragment(),f.clean(a,i,e,d)),g&&(f.fragments[j]=h?e:1);return{fragment:e,cacheable:g}},f.fragments={},f.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){f.fn[a]=function(c){var d=[],e=f(c),g=this.length===1&&this[0].parentNode;if(g&&g.nodeType===11&&g.childNodes.length===1&&e.length===1){e[b](this[0]);return this}for(var h=0,i=e.length;h<i;h++){var j=(h>0?this.clone(!0):this).get();f(e[h])[b](j),d=d.concat(j)}return this.pushStack(d,a,e.selector)}}),f.extend({clone:function(a,b,c){var d,e,g,h=f.support.html5Clone||f.isXMLDoc(a)||!bc.test("<"+a.nodeName+">")?a.cloneNode(!0):bo(a);if((!f.support.noCloneEvent||!f.support.noCloneChecked)&&(a.nodeType===1||a.nodeType===11)&&!f.isXMLDoc(a)){bk(a,h),d=bl(a),e=bl(h);for(g=0;d[g];++g)e[g]&&bk(d[g],e[g])}if(b){bj(a,h);if(c){d=bl(a),e=bl(h);for(g=0;d[g];++g)bj(d[g],e[g])}}d=e=null;return h},clean:function(a,b,d,e){var g,h,i,j=[];b=b||c,typeof b.createElement=="undefined"&&(b=b.ownerDocument||b[0]&&b[0].ownerDocument||c);for(var k=0,l;(l=a[k])!=null;k++){typeof l=="number"&&(l+="");if(!l)continue;if(typeof l=="string")if(!_.test(l))l=b.createTextNode(l);else{l=l.replace(Y,"<$1></$2>");var m=(Z.exec(l)||["",""])[1].toLowerCase(),n=bg[m]||bg._default,o=n[0],p=b.createElement("div"),q=bh.childNodes,r;b===c?bh.appendChild(p):U(b).appendChild(p),p.innerHTML=n[1]+l+n[2];while(o--)p=p.lastChild;if(!f.support.tbody){var s=$.test(l),t=m==="table"&&!s?p.firstChild&&p.firstChild.childNodes:n[1]==="<table>"&&!s?p.childNodes:[];for(i=t.length-1;i>=0;--i)f.nodeName(t[i],"tbody")&&!t[i].childNodes.length&&t[i].parentNode.removeChild(t[i])}!f.support.leadingWhitespace&&X.test(l)&&p.insertBefore(b.createTextNode(X.exec(l)[0]),p.firstChild),l=p.childNodes,p&&(p.parentNode.removeChild(p),q.length>0&&(r=q[q.length-1],r&&r.parentNode&&r.parentNode.removeChild(r)))}var u;if(!f.support.appendChecked)if(l[0]&&typeof (u=l.length)=="number")for(i=0;i<u;i++)bn(l[i]);else bn(l);l.nodeType?j.push(l):j=f.merge(j,l)}if(d){g=function(a){return!a.type||be.test(a.type)};for(k=0;j[k];k++){h=j[k];if(e&&f.nodeName(h,"script")&&(!h.type||be.test(h.type)))e.push(h.parentNode?h.parentNode.removeChild(h):h);else{if(h.nodeType===1){var v=f.grep(h.getElementsByTagName("script"),g);j.splice.apply(j,[k+1,0].concat(v))}d.appendChild(h)}}}return j},cleanData:function(a){var b,c,d=f.cache,e=f.event.special,g=f.support.deleteExpando;for(var h=0,i;(i=a[h])!=null;h++){if(i.nodeName&&f.noData[i.nodeName.toLowerCase()])continue;c=i[f.expando];if(c){b=d[c];if(b&&b.events){for(var j in b.events)e[j]?f.event.remove(i,j):f.removeEvent(i,j,b.handle);b.handle&&(b.handle.elem=null)}g?delete i[f.expando]:i.removeAttribute&&i.removeAttribute(f.expando),delete d[c]}}}});var bp=/alpha\([^)]*\)/i,bq=/opacity=([^)]*)/,br=/([A-Z]|^ms)/g,bs=/^[\-+]?(?:\d*\.)?\d+$/i,bt=/^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,bu=/^([\-+])=([\-+.\de]+)/,bv=/^margin/,bw={position:"absolute",visibility:"hidden",display:"block"},bx=["Top","Right","Bottom","Left"],by,bz,bA;f.fn.css=function(a,c){return f.access(this,function(a,c,d){return d!==b?f.style(a,c,d):f.css(a,c)},a,c,arguments.length>1)},f.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=by(a,"opacity");return c===""?"1":c}return a.style.opacity}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":f.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,d,e){if(!!a&&a.nodeType!==3&&a.nodeType!==8&&!!a.style){var g,h,i=f.camelCase(c),j=a.style,k=f.cssHooks[i];c=f.cssProps[i]||i;if(d===b){if(k&&"get"in k&&(g=k.get(a,!1,e))!==b)return g;return j[c]}h=typeof d,h==="string"&&(g=bu.exec(d))&&(d=+(g[1]+1)*+g[2]+parseFloat(f.css(a,c)),h="number");if(d==null||h==="number"&&isNaN(d))return;h==="number"&&!f.cssNumber[i]&&(d+="px");if(!k||!("set"in k)||(d=k.set(a,d))!==b)try{j[c]=d}catch(l){}}},css:function(a,c,d){var e,g;c=f.camelCase(c),g=f.cssHooks[c],c=f.cssProps[c]||c,c==="cssFloat"&&(c="float");if(g&&"get"in g&&(e=g.get(a,!0,d))!==b)return e;if(by)return by(a,c)},swap:function(a,b,c){var d={},e,f;for(f in b)d[f]=a.style[f],a.style[f]=b[f];e=c.call(a);for(f in b)a.style[f]=d[f];return e}}),f.curCSS=f.css,c.defaultView&&c.defaultView.getComputedStyle&&(bz=function(a,b){var c,d,e,g,h=a.style;b=b.replace(br,"-$1").toLowerCase(),(d=a.ownerDocument.defaultView)&&(e=d.getComputedStyle(a,null))&&(c=e.getPropertyValue(b),c===""&&!f.contains(a.ownerDocument.documentElement,a)&&(c=f.style(a,b))),!f.support.pixelMargin&&e&&bv.test(b)&&bt.test(c)&&(g=h.width,h.width=c,c=e.width,h.width=g);return c}),c.documentElement.currentStyle&&(bA=function(a,b){var c,d,e,f=a.currentStyle&&a.currentStyle[b],g=a.style;f==null&&g&&(e=g[b])&&(f=e),bt.test(f)&&(c=g.left,d=a.runtimeStyle&&a.runtimeStyle.left,d&&(a.runtimeStyle.left=a.currentStyle.left),g.left=b==="fontSize"?"1em":f,f=g.pixelLeft+"px",g.left=c,d&&(a.runtimeStyle.left=d));return f===""?"auto":f}),by=bz||bA,f.each(["height","width"],function(a,b){f.cssHooks[b]={get:function(a,c,d){if(c)return a.offsetWidth!==0?bB(a,b,d):f.swap(a,bw,function(){return bB(a,b,d)})},set:function(a,b){return bs.test(b)?b+"px":b}}}),f.support.opacity||(f.cssHooks.opacity={get:function(a,b){return bq.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=f.isNumeric(b)?"alpha(opacity="+b*100+")":"",g=d&&d.filter||c.filter||"";c.zoom=1;if(b>=1&&f.trim(g.replace(bp,""))===""){c.removeAttribute("filter");if(d&&!d.filter)return}c.filter=bp.test(g)?g.replace(bp,e):g+" "+e}}),f(function(){f.support.reliableMarginRight||(f.cssHooks.marginRight={get:function(a,b){return f.swap(a,{display:"inline-block"},function(){return b?by(a,"margin-right"):a.style.marginRight})}})}),f.expr&&f.expr.filters&&(f.expr.filters.hidden=function(a){var b=a.offsetWidth,c=a.offsetHeight;return b===0&&c===0||!f.support.reliableHiddenOffsets&&(a.style&&a.style.display||f.css(a,"display"))==="none"},f.expr.filters.visible=function(a){return!f.expr.filters.hidden(a)}),f.each({margin:"",padding:"",border:"Width"},function(a,b){f.cssHooks[a+b]={expand:function(c){var d,e=typeof c=="string"?c.split(" "):[c],f={};for(d=0;d<4;d++)f[a+bx[d]+b]=e[d]||e[d-2]||e[0];return f}}});var bC=/%20/g,bD=/\[\]$/,bE=/\r?\n/g,bF=/#.*$/,bG=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,bH=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,bI=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,bJ=/^(?:GET|HEAD)$/,bK=/^\/\//,bL=/\?/,bM=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bN=/^(?:select|textarea)/i,bO=/\s+/,bP=/([?&])_=[^&]*/,bQ=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,bR=f.fn.load,bS={},bT={},bU,bV,bW=["*/"]+["*"];try{bU=e.href}catch(bX){bU=c.createElement("a"),bU.href="",bU=bU.href}bV=bQ.exec(bU.toLowerCase())||[],f.fn.extend({load:function(a,c,d){if(typeof a!="string"&&bR)return bR.apply(this,arguments);if(!this.length)return this;var e=a.indexOf(" ");if(e>=0){var g=a.slice(e,a.length);a=a.slice(0,e)}var h="GET";c&&(f.isFunction(c)?(d=c,c=b):typeof c=="object"&&(c=f.param(c,f.ajaxSettings.traditional),h="POST"));var i=this;f.ajax({url:a,type:h,dataType:"html",data:c,complete:function(a,b,c){c=a.responseText,a.isResolved()&&(a.done(function(a){c=a}),i.html(g?f("<div>").append(c.replace(bM,"")).find(g):c)),d&&i.each(d,[c,b,a])}});return this},serialize:function(){return f.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?f.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||bN.test(this.nodeName)||bH.test(this.type))}).map(function(a,b){var c=f(this).val();return c==null?null:f.isArray(c)?f.map(c,function(a,c){return{name:b.name,value:a.replace(bE,"\r\n")}}):{name:b.name,value:c.replace(bE,"\r\n")}}).get()}}),f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){f.fn[b]=function(a){return this.on(b,a)}}),f.each(["get","post"],function(a,c){f[c]=function(a,d,e,g){f.isFunction(d)&&(g=g||e,e=d,d=b);return f.ajax({type:c,url:a,data:d,success:e,dataType:g})}}),f.extend({getScript:function(a,c){return f.get(a,b,c,"script")},getJSON:function(a,b,c){return f.get(a,b,c,"json")},ajaxSetup:function(a,b){b?b$(a,f.ajaxSettings):(b=a,a=f.ajaxSettings),b$(a,b);return a},ajaxSettings:{url:bU,isLocal:bI.test(bV[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded; charset=UTF-8",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":bW},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":f.parseJSON,"text xml":f.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:bY(bS),ajaxTransport:bY(bT),ajax:function(a,c){function w(a,c,l,m){if(s!==2){s=2,q&&clearTimeout(q),p=b,n=m||"",v.readyState=a>0?4:0;var o,r,u,w=c,x=l?ca(d,v,l):b,y,z;if(a>=200&&a<300||a===304){if(d.ifModified){if(y=v.getResponseHeader("Last-Modified"))f.lastModified[k]=y;if(z=v.getResponseHeader("Etag"))f.etag[k]=z}if(a===304)w="notmodified",o=!0;else try{r=cb(d,x),w="success",o=!0}catch(A){w="parsererror",u=A}}else{u=w;if(!w||a)w="error",a<0&&(a=0)}v.status=a,v.statusText=""+(c||w),o?h.resolveWith(e,[r,w,v]):h.rejectWith(e,[v,w,u]),v.statusCode(j),j=b,t&&g.trigger("ajax"+(o?"Success":"Error"),[v,d,o?r:u]),i.fireWith(e,[v,w]),t&&(g.trigger("ajaxComplete",[v,d]),--f.active||f.event.trigger("ajaxStop"))}}typeof a=="object"&&(c=a,a=b),c=c||{};var d=f.ajaxSetup({},c),e=d.context||d,g=e!==d&&(e.nodeType||e instanceof f)?f(e):f.event,h=f.Deferred(),i=f.Callbacks("once memory"),j=d.statusCode||{},k,l={},m={},n,o,p,q,r,s=0,t,u,v={readyState:0,setRequestHeader:function(a,b){if(!s){var c=a.toLowerCase();a=m[c]=m[c]||a,l[a]=b}return this},getAllResponseHeaders:function(){return s===2?n:null},getResponseHeader:function(a){var c;if(s===2){if(!o){o={};while(c=bG.exec(n))o[c[1].toLowerCase()]=c[2]}c=o[a.toLowerCase()]}return c===b?null:c},overrideMimeType:function(a){s||(d.mimeType=a);return this},abort:function(a){a=a||"abort",p&&p.abort(a),w(0,a);return this}};h.promise(v),v.success=v.done,v.error=v.fail,v.complete=i.add,v.statusCode=function(a){if(a){var b;if(s<2)for(b in a)j[b]=[j[b],a[b]];else b=a[v.status],v.then(b,b)}return this},d.url=((a||d.url)+"").replace(bF,"").replace(bK,bV[1]+"//"),d.dataTypes=f.trim(d.dataType||"*").toLowerCase().split(bO),d.crossDomain==null&&(r=bQ.exec(d.url.toLowerCase()),d.crossDomain=!(!r||r[1]==bV[1]&&r[2]==bV[2]&&(r[3]||(r[1]==="http:"?80:443))==(bV[3]||(bV[1]==="http:"?80:443)))),d.data&&d.processData&&typeof d.data!="string"&&(d.data=f.param(d.data,d.traditional)),bZ(bS,d,c,v);if(s===2)return!1;t=d.global,d.type=d.type.toUpperCase(),d.hasContent=!bJ.test(d.type),t&&f.active++===0&&f.event.trigger("ajaxStart");if(!d.hasContent){d.data&&(d.url+=(bL.test(d.url)?"&":"?")+d.data,delete d.data),k=d.url;if(d.cache===!1){var x=f.now(),y=d.url.replace(bP,"$1_="+x);d.url=y+(y===d.url?(bL.test(d.url)?"&":"?")+"_="+x:"")}}(d.data&&d.hasContent&&d.contentType!==!1||c.contentType)&&v.setRequestHeader("Content-Type",d.contentType),d.ifModified&&(k=k||d.url,f.lastModified[k]&&v.setRequestHeader("If-Modified-Since",f.lastModified[k]),f.etag[k]&&v.setRequestHeader("If-None-Match",f.etag[k])),v.setRequestHeader("Accept",d.dataTypes[0]&&d.accepts[d.dataTypes[0]]?d.accepts[d.dataTypes[0]]+(d.dataTypes[0]!=="*"?", "+bW+"; q=0.01":""):d.accepts["*"]);for(u in d.headers)v.setRequestHeader(u,d.headers[u]);if(d.beforeSend&&(d.beforeSend.call(e,v,d)===!1||s===2)){v.abort();return!1}for(u in{success:1,error:1,complete:1})v[u](d[u]);p=bZ(bT,d,c,v);if(!p)w(-1,"No Transport");else{v.readyState=1,t&&g.trigger("ajaxSend",[v,d]),d.async&&d.timeout>0&&(q=setTimeout(function(){v.abort("timeout")},d.timeout));try{s=1,p.send(l,w)}catch(z){if(s<2)w(-1,z);else throw z}}return v},param:function(a,c){var d=[],e=function(a,b){b=f.isFunction(b)?b():b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};c===b&&(c=f.ajaxSettings.traditional);if(f.isArray(a)||a.jquery&&!f.isPlainObject(a))f.each(a,function(){e(this.name,this.value)});else for(var g in a)b_(g,a[g],c,e);return d.join("&").replace(bC,"+")}}),f.extend({active:0,lastModified:{},etag:{}});var cc=f.now(),cd=/(\=)\?(&|$)|\?\?/i;f.ajaxSetup({jsonp:"callback",jsonpCallback:function(){return f.expando+"_"+cc++}}),f.ajaxPrefilter("json jsonp",function(b,c,d){var e=typeof b.data=="string"&&/^application\/x\-www\-form\-urlencoded/.test(b.contentType);if(b.dataTypes[0]==="jsonp"||b.jsonp!==!1&&(cd.test(b.url)||e&&cd.test(b.data))){var g,h=b.jsonpCallback=f.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,i=a[h],j=b.url,k=b.data,l="$1"+h+"$2";b.jsonp!==!1&&(j=j.replace(cd,l),b.url===j&&(e&&(k=k.replace(cd,l)),b.data===k&&(j+=(/\?/.test(j)?"&":"?")+b.jsonp+"="+h))),b.url=j,b.data=k,a[h]=function(a){g=[a]},d.always(function(){a[h]=i,g&&f.isFunction(i)&&a[h](g[0])}),b.converters["script json"]=function(){g||f.error(h+" was not called");return g[0]},b.dataTypes[0]="json";return"script"}}),f.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){f.globalEval(a);return a}}}),f.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),f.ajaxTransport("script",function(a){if(a.crossDomain){var d,e=c.head||c.getElementsByTagName("head")[0]||c.documentElement;return{send:function(f,g){d=c.createElement("script"),d.async="async",a.scriptCharset&&(d.charset=a.scriptCharset),d.src=a.url,d.onload=d.onreadystatechange=function(a,c){if(c||!d.readyState||/loaded|complete/.test(d.readyState))d.onload=d.onreadystatechange=null,e&&d.parentNode&&e.removeChild(d),d=b,c||g(200,"success")},e.insertBefore(d,e.firstChild)},abort:function(){d&&d.onload(0,1)}}}});var ce=a.ActiveXObject?function(){for(var a in cg)cg[a](0,1)}:!1,cf=0,cg;f.ajaxSettings.xhr=a.ActiveXObject?function(){return!this.isLocal&&ch()||ci()}:ch,function(a){f.extend(f.support,{ajax:!!a,cors:!!a&&"withCredentials"in a})}(f.ajaxSettings.xhr()),f.support.ajax&&f.ajaxTransport(function(c){if(!c.crossDomain||f.support.cors){var d;return{send:function(e,g){var h=c.xhr(),i,j;c.username?h.open(c.type,c.url,c.async,c.username,c.password):h.open(c.type,c.url,c.async);if(c.xhrFields)for(j in c.xhrFields)h[j]=c.xhrFields[j];c.mimeType&&h.overrideMimeType&&h.overrideMimeType(c.mimeType),!c.crossDomain&&!e["X-Requested-With"]&&(e["X-Requested-With"]="XMLHttpRequest");try{for(j in e)h.setRequestHeader(j,e[j])}catch(k){}h.send(c.hasContent&&c.data||null),d=function(a,e){var j,k,l,m,n;try{if(d&&(e||h.readyState===4)){d=b,i&&(h.onreadystatechange=f.noop,ce&&delete cg[i]);if(e)h.readyState!==4&&h.abort();else{j=h.status,l=h.getAllResponseHeaders(),m={},n=h.responseXML,n&&n.documentElement&&(m.xml=n);try{m.text=h.responseText}catch(a){}try{k=h.statusText}catch(o){k=""}!j&&c.isLocal&&!c.crossDomain?j=m.text?200:404:j===1223&&(j=204)}}}catch(p){e||g(-1,p)}m&&g(j,k,m,l)},!c.async||h.readyState===4?d():(i=++cf,ce&&(cg||(cg={},f(a).unload(ce)),cg[i]=d),h.onreadystatechange=d)},abort:function(){d&&d(0,1)}}}});var cj={},ck,cl,cm=/^(?:toggle|show|hide)$/,cn=/^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,co,cp=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]],cq;f.fn.extend({show:function(a,b,c){var d,e;if(a||a===0)return this.animate(ct("show",3),a,b,c);for(var g=0,h=this.length;g<h;g++)d=this[g],d.style&&(e=d.style.display,!f._data(d,"olddisplay")&&e==="none"&&(e=d.style.display=""),(e===""&&f.css(d,"display")==="none"||!f.contains(d.ownerDocument.documentElement,d))&&f._data(d,"olddisplay",cu(d.nodeName)));for(g=0;g<h;g++){d=this[g];if(d.style){e=d.style.display;if(e===""||e==="none")d.style.display=f._data(d,"olddisplay")||""}}return this},hide:function(a,b,c){if(a||a===0)return this.animate(ct("hide",3),a,b,c);var d,e,g=0,h=this.length;for(;g<h;g++)d=this[g],d.style&&(e=f.css(d,"display"),e!=="none"&&!f._data(d,"olddisplay")&&f._data(d,"olddisplay",e));for(g=0;g<h;g++)this[g].style&&(this[g].style.display="none");return this},_toggle:f.fn.toggle,toggle:function(a,b,c){var d=typeof a=="boolean";f.isFunction(a)&&f.isFunction(b)?this._toggle.apply(this,arguments):a==null||d?this.each(function(){var b=d?a:f(this).is(":hidden");f(this)[b?"show":"hide"]()}):this.animate(ct("toggle",3),a,b,c);return this},fadeTo:function(a,b,c,d){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){function g(){e.queue===!1&&f._mark(this);var b=f.extend({},e),c=this.nodeType===1,d=c&&f(this).is(":hidden"),g,h,i,j,k,l,m,n,o,p,q;b.animatedProperties={};for(i in a){g=f.camelCase(i),i!==g&&(a[g]=a[i],delete a[i]);if((k=f.cssHooks[g])&&"expand"in k){l=k.expand(a[g]),delete a[g];for(i in l)i in a||(a[i]=l[i])}}for(g in a){h=a[g],f.isArray(h)?(b.animatedProperties[g]=h[1],h=a[g]=h[0]):b.animatedProperties[g]=b.specialEasing&&b.specialEasing[g]||b.easing||"swing";if(h==="hide"&&d||h==="show"&&!d)return b.complete.call(this);c&&(g==="height"||g==="width")&&(b.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY],f.css(this,"display")==="inline"&&f.css(this,"float")==="none"&&(!f.support.inlineBlockNeedsLayout||cu(this.nodeName)==="inline"?this.style.display="inline-block":this.style.zoom=1))}b.overflow!=null&&(this.style.overflow="hidden");for(i in a)j=new f.fx(this,b,i),h=a[i],cm.test(h)?(q=f._data(this,"toggle"+i)||(h==="toggle"?d?"show":"hide":0),q?(f._data(this,"toggle"+i,q==="show"?"hide":"show"),j[q]()):j[h]()):(m=cn.exec(h),n=j.cur(),m?(o=parseFloat(m[2]),p=m[3]||(f.cssNumber[i]?"":"px"),p!=="px"&&(f.style(this,i,(o||1)+p),n=(o||1)/j.cur()*n,f.style(this,i,n+p)),m[1]&&(o=(m[1]==="-="?-1:1)*o+n),j.custom(n,o,p)):j.custom(n,h,""));return!0}var e=f.speed(b,c,d);if(f.isEmptyObject(a))return this.each(e.complete,[!1]);a=f.extend({},a);return e.queue===!1?this.each(g):this.queue(e.queue,g)},stop:function(a,c,d){typeof a!="string"&&(d=c,c=a,a=b),c&&a!==!1&&this.queue(a||"fx",[]);return this.each(function(){function h(a,b,c){var e=b[c];f.removeData(a,c,!0),e.stop(d)}var b,c=!1,e=f.timers,g=f._data(this);d||f._unmark(!0,this);if(a==null)for(b in g)g[b]&&g[b].stop&&b.indexOf(".run")===b.length-4&&h(this,g,b);else g[b=a+".run"]&&g[b].stop&&h(this,g,b);for(b=e.length;b--;)e[b].elem===this&&(a==null||e[b].queue===a)&&(d?e[b](!0):e[b].saveState(),c=!0,e.splice(b,1));(!d||!c)&&f.dequeue(this,a)})}}),f.each({slideDown:ct("show",1),slideUp:ct("hide",1),slideToggle:ct("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){f.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),f.extend({speed:function(a,b,c){var d=a&&typeof a=="object"?f.extend({},a):{complete:c||!c&&b||f.isFunction(a)&&a,duration:a,easing:c&&b||b&&!f.isFunction(b)&&b};d.duration=f.fx.off?0:typeof d.duration=="number"?d.duration:d.duration in f.fx.speeds?f.fx.speeds[d.duration]:f.fx.speeds._default;if(d.queue==null||d.queue===!0)d.queue="fx";d.old=d.complete,d.complete=function(a){f.isFunction(d.old)&&d.old.call(this),d.queue?f.dequeue(this,d.queue):a!==!1&&f._unmark(this)};return d},easing:{linear:function(a){return a},swing:function(a){return-Math.cos(a*Math.PI)/2+.5}},timers:[],fx:function(a,b,c){this.options=b,this.elem=a,this.prop=c,b.orig=b.orig||{}}}),f.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this),(f.fx.step[this.prop]||f.fx.step._default)(this)},cur:function(){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null))return this.elem[this.prop];var a,b=f.css(this.elem,this.prop);return isNaN(a=parseFloat(b))?!b||b==="auto"?0:b:a},custom:function(a,c,d){function h(a){return e.step(a)}var e=this,g=f.fx;this.startTime=cq||cr(),this.end=c,this.now=this.start=a,this.pos=this.state=0,this.unit=d||this.unit||(f.cssNumber[this.prop]?"":"px"),h.queue=this.options.queue,h.elem=this.elem,h.saveState=function(){f._data(e.elem,"fxshow"+e.prop)===b&&(e.options.hide?f._data(e.elem,"fxshow"+e.prop,e.start):e.options.show&&f._data(e.elem,"fxshow"+e.prop,e.end))},h()&&f.timers.push(h)&&!co&&(co=setInterval(g.tick,g.interval))},show:function(){var a=f._data(this.elem,"fxshow"+this.prop);this.options.orig[this.prop]=a||f.style(this.elem,this.prop),this.options.show=!0,a!==b?this.custom(this.cur(),a):this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur()),f(this.elem).show()},hide:function(){this.options.orig[this.prop]=f._data(this.elem,"fxshow"+this.prop)||f.style(this.elem,this.prop),this.options.hide=!0,this.custom(this.cur(),0)},step:function(a){var b,c,d,e=cq||cr(),g=!0,h=this.elem,i=this.options;if(a||e>=i.duration+this.startTime){this.now=this.end,this.pos=this.state=1,this.update(),i.animatedProperties[this.prop]=!0;for(b in i.animatedProperties)i.animatedProperties[b]!==!0&&(g=!1);if(g){i.overflow!=null&&!f.support.shrinkWrapBlocks&&f.each(["","X","Y"],function(a,b){h.style["overflow"+b]=i.overflow[a]}),i.hide&&f(h).hide();if(i.hide||i.show)for(b in i.animatedProperties)f.style(h,b,i.orig[b]),f.removeData(h,"fxshow"+b,!0),f.removeData(h,"toggle"+b,!0);d=i.complete,d&&(i.complete=!1,d.call(h))}return!1}i.duration==Infinity?this.now=e:(c=e-this.startTime,this.state=c/i.duration,this.pos=f.easing[i.animatedProperties[this.prop]](this.state,c,0,1,i.duration),this.now=this.start+(this.end-this.start)*this.pos),this.update();return!0}},f.extend(f.fx,{tick:function(){var a,b=f.timers,c=0;for(;c<b.length;c++)a=b[c],!a()&&b[c]===a&&b.splice(c--,1);b.length||f.fx.stop()},interval:13,stop:function(){clearInterval(co),co=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){f.style(a.elem,"opacity",a.now)},_default:function(a){a.elem.style&&a.elem.style[a.prop]!=null?a.elem.style[a.prop]=a.now+a.unit:a.elem[a.prop]=a.now}}}),f.each(cp.concat.apply([],cp),function(a,b){b.indexOf("margin")&&(f.fx.step[b]=function(a){f.style(a.elem,b,Math.max(0,a.now)+a.unit)})}),f.expr&&f.expr.filters&&(f.expr.filters.animated=function(a){return f.grep(f.timers,function(b){return a===b.elem}).length});var cv,cw=/^t(?:able|d|h)$/i,cx=/^(?:body|html)$/i;"getBoundingClientRect"in c.documentElement?cv=function(a,b,c,d){try{d=a.getBoundingClientRect()}catch(e){}if(!d||!f.contains(c,a))return d?{top:d.top,left:d.left}:{top:0,left:0};var g=b.body,h=cy(b),i=c.clientTop||g.clientTop||0,j=c.clientLeft||g.clientLeft||0,k=h.pageYOffset||f.support.boxModel&&c.scrollTop||g.scrollTop,l=h.pageXOffset||f.support.boxModel&&c.scrollLeft||g.scrollLeft,m=d.top+k-i,n=d.left+l-j;return{top:m,left:n}}:cv=function(a,b,c){var d,e=a.offsetParent,g=a,h=b.body,i=b.defaultView,j=i?i.getComputedStyle(a,null):a.currentStyle,k=a.offsetTop,l=a.offsetLeft;while((a=a.parentNode)&&a!==h&&a!==c){if(f.support.fixedPosition&&j.position==="fixed")break;d=i?i.getComputedStyle(a,null):a.currentStyle,k-=a.scrollTop,l-=a.scrollLeft,a===e&&(k+=a.offsetTop,l+=a.offsetLeft,f.support.doesNotAddBorder&&(!f.support.doesAddBorderForTableAndCells||!cw.test(a.nodeName))&&(k+=parseFloat(d.borderTopWidth)||0,l+=parseFloat(d.borderLeftWidth)||0),g=e,e=a.offsetParent),f.support.subtractsBorderForOverflowNotVisible&&d.overflow!=="visible"&&(k+=parseFloat(d.borderTopWidth)||0,l+=parseFloat(d.borderLeftWidth)||0),j=d}if(j.position==="relative"||j.position==="static")k+=h.offsetTop,l+=h.offsetLeft;f.support.fixedPosition&&j.position==="fixed"&&(k+=Math.max(c.scrollTop,h.scrollTop),l+=Math.max(c.scrollLeft,h.scrollLeft));return{top:k,left:l}},f.fn.offset=function(a){if(arguments.length)return a===b?this:this.each(function(b){f.offset.setOffset(this,a,b)});var c=this[0],d=c&&c.ownerDocument;if(!d)return null;if(c===d.body)return f.offset.bodyOffset(c);return cv(c,d,d.documentElement)},f.offset={bodyOffset:function(a){var b=a.offsetTop,c=a.offsetLeft;f.support.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(f.css(a,"marginTop"))||0,c+=parseFloat(f.css(a,"marginLeft"))||0);return{top:b,left:c}},setOffset:function(a,b,c){var d=f.css(a,"position");d==="static"&&(a.style.position="relative");var e=f(a),g=e.offset(),h=f.css(a,"top"),i=f.css(a,"left"),j=(d==="absolute"||d==="fixed")&&f.inArray("auto",[h,i])>-1,k={},l={},m,n;j?(l=e.position(),m=l.top,n=l.left):(m=parseFloat(h)||0,n=parseFloat(i)||0),f.isFunction(b)&&(b=b.call(a,c,g)),b.top!=null&&(k.top=b.top-g.top+m),b.left!=null&&(k.left=b.left-g.left+n),"using"in b?b.using.call(a,k):e.css(k)}},f.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),c=this.offset(),d=cx.test(b[0].nodeName)?{top:0,left:0}:b.offset();c.top-=parseFloat(f.css(a,"marginTop"))||0,c.left-=parseFloat(f.css(a,"marginLeft"))||0,d.top+=parseFloat(f.css(b[0],"borderTopWidth"))||0,d.left+=parseFloat(f.css(b[0],"borderLeftWidth"))||0;return{top:c.top-d.top,left:c.left-d.left}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||c.body;while(a&&!cx.test(a.nodeName)&&f.css(a,"position")==="static")a=a.offsetParent;return a})}}),f.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,c){var d=/Y/.test(c);f.fn[a]=function(e){return f.access(this,function(a,e,g){var h=cy(a);if(g===b)return h?c in h?h[c]:f.support.boxModel&&h.document.documentElement[e]||h.document.body[e]:a[e];h?h.scrollTo(d?f(h).scrollLeft():g,d?g:f(h).scrollTop()):a[e]=g},a,e,arguments.length,null)}}),f.each({Height:"height",Width:"width"},function(a,c){var d="client"+a,e="scroll"+a,g="offset"+a;f.fn["inner"+a]=function(){var a=this[0];return a?a.style?parseFloat(f.css(a,c,"padding")):this[c]():null},f.fn["outer"+a]=function(a){var b=this[0];return b?b.style?parseFloat(f.css(b,c,a?"margin":"border")):this[c]():null},f.fn[c]=function(a){return f.access(this,function(a,c,h){var i,j,k,l;if(f.isWindow(a)){i=a.document,j=i.documentElement[d];return f.support.boxModel&&j||i.body&&i.body[d]||j}if(a.nodeType===9){i=a.documentElement;if(i[d]>=i[e])return i[d];return Math.max(a.body[e],i[e],a.body[g],i[g])}if(h===b){k=f.css(a,c),l=parseFloat(k);return f.isNumeric(l)?l:k}f(a).css(c,h)},c,a,arguments.length,null)}}),a.jQuery=a.$=f,typeof define=="function"&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return f})})(window);
/**
 * Copyright (c) 2005 - 2010, James Auldridge
 * All rights reserved.
 *
 * Licensed under the BSD, MIT, and GPL (your choice!) Licenses:
 *  http://code.google.com/p/cookies/wiki/License
 *
 */
var jaaulde=window.jaaulde||{};jaaulde.utils=jaaulde.utils||{};jaaulde.utils.cookies=(function(){var resolveOptions,assembleOptionsString,parseCookies,constructor,defaultOptions={expiresAt:null,path:'/',domain:null,secure:false};resolveOptions=function(options){var returnValue,expireDate;if(typeof options!=='object'||options===null){returnValue=defaultOptions;}else
{returnValue={expiresAt:defaultOptions.expiresAt,path:defaultOptions.path,domain:defaultOptions.domain,secure:defaultOptions.secure};if(typeof options.expiresAt==='object'&&options.expiresAt instanceof Date){returnValue.expiresAt=options.expiresAt;}else if(typeof options.hoursToLive==='number'&&options.hoursToLive!==0){expireDate=new Date();expireDate.setTime(expireDate.getTime()+(options.hoursToLive*60*60*1000));returnValue.expiresAt=expireDate;}if(typeof options.path==='string'&&options.path!==''){returnValue.path=options.path;}if(typeof options.domain==='string'&&options.domain!==''){returnValue.domain=options.domain;}if(options.secure===true){returnValue.secure=options.secure;}}return returnValue;};assembleOptionsString=function(options){options=resolveOptions(options);return((typeof options.expiresAt==='object'&&options.expiresAt instanceof Date?'; expires='+options.expiresAt.toGMTString():'')+'; path='+options.path+(typeof options.domain==='string'?'; domain='+options.domain:'')+(options.secure===true?'; secure':''));};parseCookies=function(){var cookies={},i,pair,name,value,separated=document.cookie.split(';'),unparsedValue;for(i=0;i<separated.length;i=i+1){pair=separated[i].split('=');name=pair[0].replace(/^\s*/,'').replace(/\s*$/,'');try
{value=decodeURIComponent(pair[1]);}catch(e1){value=pair[1];}if(typeof JSON==='object'&&JSON!==null&&typeof JSON.parse==='function'){try
{unparsedValue=value;value=JSON.parse(value);}catch(e2){value=unparsedValue;}}cookies[name]=value;}return cookies;};constructor=function(){};constructor.prototype.get=function(cookieName){var returnValue,item,cookies=parseCookies();if(typeof cookieName==='string'){returnValue=(typeof cookies[cookieName]!=='undefined')?cookies[cookieName]:null;}else if(typeof cookieName==='object'&&cookieName!==null){returnValue={};for(item in cookieName){if(typeof cookies[cookieName[item]]!=='undefined'){returnValue[cookieName[item]]=cookies[cookieName[item]];}else
{returnValue[cookieName[item]]=null;}}}else
{returnValue=cookies;}return returnValue;};constructor.prototype.filter=function(cookieNameRegExp){var cookieName,returnValue={},cookies=parseCookies();if(typeof cookieNameRegExp==='string'){cookieNameRegExp=new RegExp(cookieNameRegExp);}for(cookieName in cookies){if(cookieName.match(cookieNameRegExp)){returnValue[cookieName]=cookies[cookieName];}}return returnValue;};constructor.prototype.set=function(cookieName,value,options){if(typeof options!=='object'||options===null){options={};}if(typeof value==='undefined'||value===null){value='';options.hoursToLive=-8760;}else if(typeof value!=='string'){if(typeof JSON==='object'&&JSON!==null&&typeof JSON.stringify==='function'){value=JSON.stringify(value);}else
{throw new Error('cookies.set() received non-string value and could not serialize.');}}var optionsString=assembleOptionsString(options);document.cookie=cookieName+'='+encodeURIComponent(value)+optionsString;};constructor.prototype.del=function(cookieName,options){var allCookies={},name;if(typeof options!=='object'||options===null){options={};}if(typeof cookieName==='boolean'&&cookieName===true){allCookies=this.get();}else if(typeof cookieName==='string'){allCookies[cookieName]=true;}for(name in allCookies){if(typeof name==='string'&&name!==''){this.set(name,null,options);}}};constructor.prototype.test=function(){var returnValue=false,testName='cT',testValue='data';this.set(testName,testValue);if(this.get(testName)===testValue){this.del(testName);returnValue=true;}return returnValue;};constructor.prototype.setOptions=function(options){if(typeof options!=='object'){options=null;}defaultOptions=resolveOptions(options);};return new constructor();})();(function(){if(window.jQuery){(function($){$.cookies=jaaulde.utils.cookies;var extensions={cookify:function(options){return this.each(function(){var i,nameAttrs=['name','id'],name,$this=$(this),value;for(i in nameAttrs){if(!isNaN(i)){name=$this.attr(nameAttrs[i]);if(typeof name==='string'&&name!==''){if($this.is(':checkbox, :radio')){if($this.attr('checked')){value=$this.val();}}else if($this.is(':input')){value=$this.val();}else
{value=$this.html();}if(typeof value!=='string'||value===''){value=null;}$.cookies.set(name,value,options);break;}}}});},cookieFill:function(){return this.each(function(){var n,getN,nameAttrs=['name','id'],name,$this=$(this),value;getN=function(){n=nameAttrs.pop();return!!n;};while(getN()){name=$this.attr(n);if(typeof name==='string'&&name!==''){value=$.cookies.get(name);if(value!==null){if($this.is(':checkbox, :radio')){if($this.val()===value){$this.attr('checked','checked');}else
{$this.removeAttr('checked');}}else if($this.is(':input')){$this.val(value);}else
{$this.html(value);}}break;}}});},cookieBind:function(options){return this.each(function(){var $this=$(this);$this.cookieFill().change(function(){$this.cookify(options);});});}};$.each(extensions,function(i){$.fn[i]=this;});})(window.jQuery);}})();
/*!
 * hoverIntent r7 // 2013.03.11 // jQuery 1.9.1+
 * http://cherne.net/brian/resources/jquery.hoverIntent.html
 *
 * You may use hoverIntent under the terms of the MIT license.
 * Copyright 2007, 2013 Brian Cherne
 */
(function(e){e.fn.hoverIntent=function(t,n,r){var i={interval:100,sensitivity:7,timeout:0};if(typeof t==="object"){i=e.extend(i,t)}else if(e.isFunction(n)){i=e.extend(i,{over:t,out:n,selector:r})}else{i=e.extend(i,{over:t,out:t,selector:n})}var s,o,u,a;var f=function(e){s=e.pageX;o=e.pageY};var l=function(t,n){n.hoverIntent_t=clearTimeout(n.hoverIntent_t);if(Math.abs(u-s)+Math.abs(a-o)<i.sensitivity){e(n).off("mousemove.hoverIntent",f);n.hoverIntent_s=1;return i.over.apply(n,[t])}else{u=s;a=o;n.hoverIntent_t=setTimeout(function(){l(t,n)},i.interval)}};var c=function(e,t){t.hoverIntent_t=clearTimeout(t.hoverIntent_t);t.hoverIntent_s=0;return i.out.apply(t,[e])};var h=function(t){var n=jQuery.extend({},t);var r=this;if(r.hoverIntent_t){r.hoverIntent_t=clearTimeout(r.hoverIntent_t)}if(t.type=="mouseenter"){u=n.pageX;a=n.pageY;e(r).on("mousemove.hoverIntent",f);if(r.hoverIntent_s!=1){r.hoverIntent_t=setTimeout(function(){l(n,r)},i.interval)}}else{e(r).off("mousemove.hoverIntent",f);if(r.hoverIntent_s==1){r.hoverIntent_t=setTimeout(function(){c(n,r)},i.timeout)}}};return this.on({"mouseenter.hoverIntent":h,"mouseleave.hoverIntent":h},i.selector)}})(jQuery)
/**
 * KineticJS JavaScript Framework v4.3.3
 * http://www.kineticjs.com/
 * Copyright 2013, Eric Rowell
 * Licensed under the MIT or GPL Version 2 licenses.
 * Date: Feb 12 2013
 *
 * Copyright (C) 2011 - 2013 by Eric Rowell
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var Kinetic={};(function(){Kinetic.version="4.3.3",Kinetic.Filters={},Kinetic.Plugins={},Kinetic.Global={stages:[],idCounter:0,ids:{},names:{},shapes:{},warn:function(a){window.console&&console.warn&&console.warn("Kinetic warning: "+a)},extend:function(a,b){for(var c in b.prototype)c in a.prototype||(a.prototype[c]=b.prototype[c])},_addId:function(a,b){b!==undefined&&(this.ids[b]=a)},_removeId:function(a){a!==undefined&&delete this.ids[a]},_addName:function(a,b){b!==undefined&&(this.names[b]===undefined&&(this.names[b]=[]),this.names[b].push(a))},_removeName:function(a,b){if(a!==undefined){var c=this.names[a];if(c!==undefined){for(var d=0;d<c.length;d++){var e=c[d];e._id===b&&c.splice(d,1)}c.length===0&&delete this.names[a]}}}}})(),function(a,b){typeof exports=="object"?module.exports=b():typeof define=="function"&&define.amd?define(b):a.returnExports=b()}(this,function(){return Kinetic}),function(){Kinetic.Type={_isElement:function(a){return!!a&&a.nodeType==1},_isFunction:function(a){return!!(a&&a.constructor&&a.call&&a.apply)},_isObject:function(a){return!!a&&a.constructor==Object},_isArray:function(a){return Object.prototype.toString.call(a)=="[object Array]"},_isNumber:function(a){return Object.prototype.toString.call(a)=="[object Number]"},_isString:function(a){return Object.prototype.toString.call(a)=="[object String]"},_hasMethods:function(a){var b=[];for(var c in a)this._isFunction(a[c])&&b.push(c);return b.length>0},_isInDocument:function(a){while(a=a.parentNode)if(a==document)return!0;return!1},_getXY:function(a){if(this._isNumber(a))return{x:a,y:a};if(this._isArray(a)){if(a.length===1){var b=a[0];if(this._isNumber(b))return{x:b,y:b};if(this._isArray(b))return{x:b[0],y:b[1]};if(this._isObject(b))return b}else if(a.length>=2)return{x:a[0],y:a[1]}}else if(this._isObject(a))return a;return null},_getSize:function(a){if(this._isNumber(a))return{width:a,height:a};if(this._isArray(a))if(a.length===1){var b=a[0];if(this._isNumber(b))return{width:b,height:b};if(this._isArray(b)){if(b.length>=4)return{width:b[2],height:b[3]};if(b.length>=2)return{width:b[0],height:b[1]}}else if(this._isObject(b))return b}else{if(a.length>=4)return{width:a[2],height:a[3]};if(a.length>=2)return{width:a[0],height:a[1]}}else if(this._isObject(a))return a;return null},_getPoints:function(a){if(a===undefined)return[];if(this._isArray(a[0])){var b=[];for(var c=0;c<a.length;c++)b.push({x:a[c][0],y:a[c][1]});return b}if(this._isObject(a[0]))return a;var b=[];for(var c=0;c<a.length;c+=2)b.push({x:a[c],y:a[c+1]});return b},_getImage:function(a,b){if(!a)b(null);else if(this._isElement(a))b(a);else if(this._isString(a)){var c=new Image;c.onload=function(){b(c)},c.src=a}else if(a.data){var d=document.createElement("canvas");d.width=a.width,d.height=a.height;var e=d.getContext("2d");e.putImageData(a,0,0);var f=d.toDataURL(),c=new Image;c.onload=function(){b(c)},c.src=f}else b(null)},_rgbToHex:function(a,b,c){return((1<<24)+(a<<16)+(b<<8)+c).toString(16).slice(1)},_hexToRgb:function(a){var b=parseInt(a,16);return{r:b>>16&255,g:b>>8&255,b:b&255}},_getRandomColorKey:function(){var a=Math.round(Math.random()*255),b=Math.round(Math.random()*255),c=Math.round(Math.random()*255);return this._rgbToHex(a,b,c)},_merge:function(a,b){var c=this._clone(b);for(var d in a)this._isObject(a[d])?c[d]=this._merge(a[d],c[d]):c[d]=a[d];return c},_clone:function(a){var b={};for(var c in a)this._isObject(a[c])?b[c]=this._clone(a[c]):b[c]=a[c];return b},_degToRad:function(a){return a*Math.PI/180},_radToDeg:function(a){return a*180/Math.PI}}}(),function(){var a=document.createElement("canvas"),b=a.getContext("2d"),c=window.devicePixelRatio||1,d=b.webkitBackingStorePixelRatio||b.mozBackingStorePixelRatio||b.msBackingStorePixelRatio||b.oBackingStorePixelRatio||b.backingStorePixelRatio||1,e=c/d;Kinetic.Canvas=function(a,b,c){this.pixelRatio=c||e,this.width=a,this.height=b,this.element=document.createElement("canvas"),this.context=this.element.getContext("2d"),this.setSize(a||0,b||0)},Kinetic.Canvas.prototype={clear:function(){var a=this.getContext(),b=this.getElement();a.clearRect(0,0,b.width,b.height)},getElement:function(){return this.element},getContext:function(){return this.context},setWidth:function(a){this.width=a,this.element.width=a*this.pixelRatio,this.element.style.width=a+"px"},setHeight:function(a){this.height=a,this.element.height=a*this.pixelRatio,this.element.style.height=a+"px"},getWidth:function(){return this.width},getHeight:function(){return this.height},setSize:function(a,b){this.setWidth(a),this.setHeight(b)},toDataURL:function(a,b){try{return this.element.toDataURL(a,b)}catch(c){try{return this.element.toDataURL()}catch(c){return Kinetic.Global.warn("Unable to get data URL. "+c.message),""}}},fill:function(a){a.getFillEnabled()&&this._fill(a)},stroke:function(a){a.getStrokeEnabled()&&this._stroke(a)},fillStroke:function(a){var b=a.getFillEnabled();b&&this._fill(a),a.getStrokeEnabled()&&this._stroke(a,a.hasShadow()&&a.hasFill()&&b)},applyShadow:function(a,b){var c=this.context;c.save(),this._applyShadow(a),b(),c.restore(),b()},_applyLineCap:function(a){var b=a.getLineCap();b&&(this.context.lineCap=b)},_applyOpacity:function(a){var b=a.getAbsoluteOpacity();b!==1&&(this.context.globalAlpha=b)},_applyLineJoin:function(a){var b=a.getLineJoin();b&&(this.context.lineJoin=b)},_applyAncestorTransforms:function(a){var b=this.context;a._eachAncestorReverse(function(a){var c=a.getTransform(),d=c.getMatrix();b.transform(d[0],d[1],d[2],d[3],d[4],d[5])},!0)}},Kinetic.SceneCanvas=function(a,b,c){Kinetic.Canvas.call(this,a,b,c)},Kinetic.SceneCanvas.prototype={setWidth:function(a){var b=this.pixelRatio;Kinetic.Canvas.prototype.setWidth.call(this,a),this.context.scale(b,b)},setHeight:function(a){var b=this.pixelRatio;Kinetic.Canvas.prototype.setHeight.call(this,a),this.context.scale(b,b)},_fillColor:function(a){var b=this.context,c=a.getFill();b.fillStyle=c,a._fillFunc(b)},_fillPattern:function(a){var b=this.context,c=a.getFillPatternImage(),d=a.getFillPatternX(),e=a.getFillPatternY(),f=a.getFillPatternScale(),g=a.getFillPatternRotation(),h=a.getFillPatternOffset(),i=a.getFillPatternRepeat();(d||e)&&b.translate(d||0,e||0),g&&b.rotate(g),f&&b.scale(f.x,f.y),h&&b.translate(-1*h.x,-1*h.y),b.fillStyle=b.createPattern(c,i||"repeat"),b.fill()},_fillLinearGradient:function(a){var b=this.context,c=a.getFillLinearGradientStartPoint(),d=a.getFillLinearGradientEndPoint(),e=a.getFillLinearGradientColorStops(),f=b.createLinearGradient(c.x,c.y,d.x,d.y);for(var g=0;g<e.length;g+=2)f.addColorStop(e[g],e[g+1]);b.fillStyle=f,b.fill()},_fillRadialGradient:function(a){var b=this.context,c=a.getFillRadialGradientStartPoint(),d=a.getFillRadialGradientEndPoint(),e=a.getFillRadialGradientStartRadius(),f=a.getFillRadialGradientEndRadius(),g=a.getFillRadialGradientColorStops(),h=b.createRadialGradient(c.x,c.y,e,d.x,d.y,f);for(var i=0;i<g.length;i+=2)h.addColorStop(g[i],g[i+1]);b.fillStyle=h,b.fill()},_fill:function(a,b){var c=this.context,d=a.getFill(),e=a.getFillPatternImage(),f=a.getFillLinearGradientStartPoint(),g=a.getFillRadialGradientStartPoint(),h=a.getFillPriority();c.save(),!b&&a.hasShadow()&&this._applyShadow(a),d&&h==="color"?this._fillColor(a):e&&h==="pattern"?this._fillPattern(a):f&&h==="linear-gradient"?this._fillLinearGradient(a):g&&h==="radial-gradient"?this._fillRadialGradient(a):d?this._fillColor(a):e?this._fillPattern(a):f?this._fillLinearGradient(a):g&&this._fillRadialGradient(a),c.restore(),!b&&a.hasShadow()&&this._fill(a,!0)},_stroke:function(a,b){var c=this.context,d=a.getStroke(),e=a.getStrokeWidth(),f=a.getDashArray();if(d||e)c.save(),this._applyLineCap(a),f&&a.getDashArrayEnabled()&&(c.setLineDash?c.setLineDash(f):"mozDash"in c?c.mozDash=f:"webkitLineDash"in c&&(c.webkitLineDash=f)),!b&&a.hasShadow()&&this._applyShadow(a),c.lineWidth=e||2,c.strokeStyle=d||"black",a._strokeFunc(c),c.restore(),!b&&a.hasShadow()&&this._stroke(a,!0)},_applyShadow:function(a){var b=this.context;if(a.hasShadow()&&a.getShadowEnabled()){var c=a.getAbsoluteOpacity(),d=a.getShadowColor()||"black",e=a.getShadowBlur()||5,f=a.getShadowOffset()||{x:0,y:0};a.getShadowOpacity()&&(b.globalAlpha=a.getShadowOpacity()*c),b.shadowColor=d,b.shadowBlur=e,b.shadowOffsetX=f.x,b.shadowOffsetY=f.y}}},Kinetic.Global.extend(Kinetic.SceneCanvas,Kinetic.Canvas),Kinetic.HitCanvas=function(a,b,c){Kinetic.Canvas.call(this,a,b,c)},Kinetic.HitCanvas.prototype={_fill:function(a){var b=this.context;b.save(),b.fillStyle="#"+a.colorKey,a._fillFuncHit(b),b.restore()},_stroke:function(a){var b=this.context,c=a.getStroke(),d=a.getStrokeWidth();if(c||d)this._applyLineCap(a),b.save(),b.lineWidth=d||2,b.strokeStyle="#"+a.colorKey,a._strokeFuncHit(b),b.restore()}},Kinetic.Global.extend(Kinetic.HitCanvas,Kinetic.Canvas)}(),function(){Kinetic.Tween=function(a,b,c,d,e,f){this._listeners=[],this.addListener(this),this.obj=a,this.propFunc=b,this.begin=d,this._pos=d,this.setDuration(f),this.isPlaying=!1,this._change=0,this.prevTime=0,this.prevPos=0,this.looping=!1,this._time=0,this._position=0,this._startTime=0,this._finish=0,this.name="",this.func=c,this.setFinish(e)},Kinetic.Tween.prototype={setTime:function(a){this.prevTime=this._time,a>this.getDuration()?this.looping?(this.rewind(a-this._duration),this.update(),this.broadcastMessage("onLooped",{target:this,type:"onLooped"})):(this._time=this._duration,this.update(),this.stop(),this.broadcastMessage("onFinished",{target:this,type:"onFinished"})):a<0?(this.rewind(),this.update()):(this._time=a,this.update())},getTime:function(){return this._time},setDuration:function(a){this._duration=a===null||a<=0?1e5:a},getDuration:function(){return this._duration},setPosition:function(a){this.prevPos=this._pos,this.propFunc(a),this._pos=a,this.broadcastMessage("onChanged",{target:this,type:"onChanged"})},getPosition:function(a){return a===undefined&&(a=this._time),this.func(a,this.begin,this._change,this._duration)},setFinish:function(a){this._change=a-this.begin},getFinish:function(){return this.begin+this._change},start:function(){this.rewind(),this.startEnterFrame(),this.broadcastMessage("onStarted",{target:this,type:"onStarted"})},rewind:function(a){this.stop(),this._time=a===undefined?0:a,this.fixTime(),this.update()},fforward:function(){this._time=this._duration,this.fixTime(),this.update()},update:function(){this.setPosition(this.getPosition(this._time))},startEnterFrame:function(){this.stopEnterFrame(),this.isPlaying=!0,this.onEnterFrame()},onEnterFrame:function(){this.isPlaying&&this.nextFrame()},nextFrame:function(){this.setTime((this.getTimer()-this._startTime)/1e3)},stop:function(){this.stopEnterFrame(),this.broadcastMessage("onStopped",{target:this,type:"onStopped"})},stopEnterFrame:function(){this.isPlaying=!1},continueTo:function(a,b){this.begin=this._pos,this.setFinish(a),this._duration!==undefined&&this.setDuration(b),this.start()},resume:function(){this.fixTime(),this.startEnterFrame(),this.broadcastMessage("onResumed",{target:this,type:"onResumed"})},yoyo:function(){this.continueTo(this.begin,this._time)},addListener:function(a){return this.removeListener(a),this._listeners.push(a)},removeListener:function(a){var b=this._listeners,c=b.length;while(c--)if(b[c]==a)return b.splice(c,1),!0;return!1},broadcastMessage:function(){var a=[];for(var b=0;b<arguments.length;b++)a.push(arguments[b]);var c=a.shift(),d=this._listeners,e=d.length;for(var b=0;b<e;b++)d[b][c]&&d[b][c].apply(d[b],a)},fixTime:function(){this._startTime=this.getTimer()-this._time*1e3},getTimer:function(){return(new Date).getTime()-this._time}},Kinetic.Tweens={"back-ease-in":function(a,b,c,d,e,f){var g=1.70158;return c*(a/=d)*a*((g+1)*a-g)+b},"back-ease-out":function(a,b,c,d,e,f){var g=1.70158;return c*((a=a/d-1)*a*((g+1)*a+g)+1)+b},"back-ease-in-out":function(a,b,c,d,e,f){var g=1.70158;return(a/=d/2)<1?c/2*a*a*(((g*=1.525)+1)*a-g)+b:c/2*((a-=2)*a*(((g*=1.525)+1)*a+g)+2)+b},"elastic-ease-in":function(a,b,c,d,e,f){var g=0;return a===0?b:(a/=d)==1?b+c:(f||(f=d*.3),!e||e<Math.abs(c)?(e=c,g=f/4):g=f/(2*Math.PI)*Math.asin(c/e),-(e*Math.pow(2,10*(a-=1))*Math.sin((a*d-g)*2*Math.PI/f))+b)},"elastic-ease-out":function(a,b,c,d,e,f){var g=0;return a===0?b:(a/=d)==1?b+c:(f||(f=d*.3),!e||e<Math.abs(c)?(e=c,g=f/4):g=f/(2*Math.PI)*Math.asin(c/e),e*Math.pow(2,-10*a)*Math.sin((a*d-g)*2*Math.PI/f)+c+b)},"elastic-ease-in-out":function(a,b,c,d,e,f){var g=0;return a===0?b:(a/=d/2)==2?b+c:(f||(f=d*.3*1.5),!e||e<Math.abs(c)?(e=c,g=f/4):g=f/(2*Math.PI)*Math.asin(c/e),a<1?-0.5*e*Math.pow(2,10*(a-=1))*Math.sin((a*d-g)*2*Math.PI/f)+b:e*Math.pow(2,-10*(a-=1))*Math.sin((a*d-g)*2*Math.PI/f)*.5+c+b)},"bounce-ease-out":function(a,b,c,d){return(a/=d)<1/2.75?c*7.5625*a*a+b:a<2/2.75?c*(7.5625*(a-=1.5/2.75)*a+.75)+b:a<2.5/2.75?c*(7.5625*(a-=2.25/2.75)*a+.9375)+b:c*(7.5625*(a-=2.625/2.75)*a+.984375)+b},"bounce-ease-in":function(a,b,c,d){return c-Kinetic.Tweens["bounce-ease-out"](d-a,0,c,d)+b},"bounce-ease-in-out":function(a,b,c,d){return a<d/2?Kinetic.Tweens["bounce-ease-in"](a*2,0,c,d)*.5+b:Kinetic.Tweens["bounce-ease-out"](a*2-d,0,c,d)*.5+c*.5+b},"ease-in":function(a,b,c,d){return c*(a/=d)*a+b},"ease-out":function(a,b,c,d){return-c*(a/=d)*(a-2)+b},"ease-in-out":function(a,b,c,d){return(a/=d/2)<1?c/2*a*a+b:-c/2*(--a*(a-2)-1)+b},"strong-ease-in":function(a,b,c,d){return c*(a/=d)*a*a*a*a+b},"strong-ease-out":function(a,b,c,d){return c*((a=a/d-1)*a*a*a*a+1)+b},"strong-ease-in-out":function(a,b,c,d){return(a/=d/2)<1?c/2*a*a*a*a*a+b:c/2*((a-=2)*a*a*a*a+2)+b},linear:function(a,b,c,d){return c*a/d+b}}}(),function(){Kinetic.Transform=function(){this.m=[1,0,0,1,0,0]},Kinetic.Transform.prototype={translate:function(a,b){this.m[4]+=this.m[0]*a+this.m[2]*b,this.m[5]+=this.m[1]*a+this.m[3]*b},scale:function(a,b){this.m[0]*=a,this.m[1]*=a,this.m[2]*=b,this.m[3]*=b},rotate:function(a){var b=Math.cos(a),c=Math.sin(a),d=this.m[0]*b+this.m[2]*c,e=this.m[1]*b+this.m[3]*c,f=this.m[0]*-c+this.m[2]*b,g=this.m[1]*-c+this.m[3]*b;this.m[0]=d,this.m[1]=e,this.m[2]=f,this.m[3]=g},getTranslation:function(){return{x:this.m[4],y:this.m[5]}},multiply:function(a){var b=this.m[0]*a.m[0]+this.m[2]*a.m[1],c=this.m[1]*a.m[0]+this.m[3]*a.m[1],d=this.m[0]*a.m[2]+this.m[2]*a.m[3],e=this.m[1]*a.m[2]+this.m[3]*a.m[3],f=this.m[0]*a.m[4]+this.m[2]*a.m[5]+this.m[4],g=this.m[1]*a.m[4]+this.m[3]*a.m[5]+this.m[5];this.m[0]=b,this.m[1]=c,this.m[2]=d,this.m[3]=e,this.m[4]=f,this.m[5]=g},invert:function(){var a=1/(this.m[0]*this.m[3]-this.m[1]*this.m[2]),b=this.m[3]*a,c=-this.m[1]*a,d=-this.m[2]*a,e=this.m[0]*a,f=a*(this.m[2]*this.m[5]-this.m[3]*this.m[4]),g=a*(this.m[1]*this.m[4]-this.m[0]*this.m[5]);this.m[0]=b,this.m[1]=c,this.m[2]=d,this.m[3]=e,this.m[4]=f,this.m[5]=g},getMatrix:function(){return this.m}}}(),function(){Kinetic.Collection=function(){var a=[].slice.call(arguments),b=a.length,c=0;this.length=b;for(;c<b;c++)this[c]=a[c];return this},Kinetic.Collection.prototype=new Array,Kinetic.Collection.prototype.apply=function(a){args=[].slice.call(arguments),args.shift();for(var b=0;b<this.length;b++)Kinetic.Type._isFunction(this[b][a])&&this[b][a].apply(this[b],args)},Kinetic.Collection.prototype.each=function(a){for(var b=0;b<this.length;b++)a.call(this[b],b,this[b])}}(),function(){Kinetic.Filters.Grayscale=function(a,b){var c=a.data;for(var d=0;d<c.length;d+=4){var e=.34*c[d]+.5*c[d+1]+.16*c[d+2];c[d]=e,c[d+1]=e,c[d+2]=e}}}(),function(){Kinetic.Filters.Brighten=function(a,b){var c=b.val||0,d=a.data;for(var e=0;e<d.length;e+=4)d[e]+=c,d[e+1]+=c,d[e+2]+=c}}(),function(){Kinetic.Filters.Invert=function(a,b){var c=a.data;for(var d=0;d<c.length;d+=4)c[d]=255-c[d],c[d+1]=255-c[d+1],c[d+2]=255-c[d+2]}}(),function(){Kinetic.Node=function(a){this._nodeInit(a)},Kinetic.Node.prototype={_nodeInit:function(a){this._id=Kinetic.Global.idCounter++,this.defaultNodeAttrs={visible:!0,listening:!0,name:undefined,opacity:1,x:0,y:0,scale:{x:1,y:1},rotation:0,offset:{x:0,y:0},draggable:!1,dragOnTop:!0},this.setDefaultAttrs(this.defaultNodeAttrs),this.eventListeners={},this.setAttrs(a)},on:function(a,b){var c=a.split(" "),d=c.length;for(var e=0;e<d;e++){var f=c[e],g=f,h=g.split("."),i=h[0],j=h.length>1?h[1]:"";this.eventListeners[i]||(this.eventListeners[i]=[]),this.eventListeners[i].push({name:j,handler:b})}},off:function(a){var b=a.split(" "),c=b.length;for(var d=0;d<c;d++){var e=b[d],f=e,g=f.split("."),h=g[0];if(g.length>1)if(h)this.eventListeners[h]&&this._off(h,g[1]);else for(var e in this.eventListeners)this._off(e,g[1]);else delete this.eventListeners[h]}},remove:function(){var a=this.getParent();a&&a.children&&(a.children.splice(this.index,1),a._setChildrenIndices()),delete this.parent},destroy:function(){var a=this.getParent(),b=this.getStage(),c=Kinetic.DD,d=Kinetic.Global;while(this.children&&this.children.length>0)this.children[0].destroy();d._removeId(this.getId()),d._removeName(this.getName(),this._id),c&&c.node&&c.node._id===this._id&&node._endDrag(),this.trans&&this.trans.stop(),this.remove()},getAttrs:function(){return this.attrs},setDefaultAttrs:function(a){this.attrs===undefined&&(this.attrs={});if(a)for(var b in a)this.attrs[b]===undefined&&(this.attrs[b]=a[b])},setAttrs:function(a){if(a)for(var b in a){var c="set"+b.charAt(0).toUpperCase()+b.slice(1);Kinetic.Type._isFunction(this[c])?this[c](a[b]):this.setAttr(b,a[b])}},getVisible:function(){var a=this.attrs.visible,b=this.getParent();return a&&b&&!b.getVisible()?!1:a},getListening:function(){var a=this.attrs.listening,b=this.getParent();return a&&b&&!b.getListening()?!1:a},show:function(){this.setVisible(!0)},hide:function(){this.setVisible(!1)},getZIndex:function(){return this.index},getAbsoluteZIndex:function(){function e(b){var f=[],g=b.length;for(var h=0;h<g;h++){var i=b[h];d++,i.nodeType!=="Shape"&&(f=f.concat(i.getChildren())),i._id===c._id&&(h=g)}f.length>0&&f[0].getLevel()<=a&&e(f)}var a=this.getLevel(),b=this.getStage(),c=this,d=0;return c.nodeType!=="Stage"&&e(c.getStage().getChildren()),d},getLevel:function(){var a=0,b=this.parent;while(b)a++,b=b.parent;return a},setPosition:function(){var a=Kinetic.Type._getXY([].slice.call(arguments));this.setAttr("x",a.x),this.setAttr("y",a.y)},getPosition:function(){var a=this.attrs;return{x:a.x,y:a.y}},getAbsolutePosition:function(){var a=this.getAbsoluteTransform(),b=this.getOffset();return a.translate(b.x,b.y),a.getTranslation()},setAbsolutePosition:function(){var a=Kinetic.Type._getXY([].slice.call(arguments)),b=this._clearTransform();this.attrs.x=b.x,this.attrs.y=b.y,delete b.x,delete b.y;var c=this.getAbsoluteTransform();c.invert(),c.translate(a.x,a.y),a={x:this.attrs.x+c.getTranslation().x,y:this.attrs.y+c.getTranslation().y},this.setPosition(a.x,a.y),this._setTransform(b)},move:function(){var a=Kinetic.Type._getXY([].slice.call(arguments)),b=this.getX(),c=this.getY();a.x!==undefined&&(b+=a.x),a.y!==undefined&&(c+=a.y),this.setPosition(b,c)},_eachAncestorReverse:function(a,b){var c=[],d=this.getParent();b&&c.unshift(this);while(d)c.unshift(d),d=d.parent;var e=c.length;for(var f=0;f<e;f++)a(c[f])},rotate:function(a){this.setRotation(this.getRotation()+a)},rotateDeg:function(a){this.setRotation(this.getRotation()+Kinetic.Type._degToRad(a))},moveToTop:function(){var a=this.index;return this.parent.children.splice(a,1),this.parent.children.push(this),this.parent._setChildrenIndices(),!0},moveUp:function(){var a=this.index,b=this.parent.getChildren().length;if(a<b-1)return this.parent.children.splice(a,1),this.parent.children.splice(a+1,0,this),this.parent._setChildrenIndices(),!0},moveDown:function(){var a=this.index;if(a>0)return this.parent.children.splice(a,1),this.parent.children.splice(a-1,0,this),this.parent._setChildrenIndices(),!0},moveToBottom:function(){var a=this.index;if(a>0)return this.parent.children.splice(a,1),this.parent.children.unshift(this),this.parent._setChildrenIndices(),!0},setZIndex:function(a){var b=this.index;this.parent.children.splice(b,1),this.parent.children.splice(a,0,this),this.parent._setChildrenIndices()},getAbsoluteOpacity:function(){var a=this.getOpacity();return this.getParent()&&(a*=this.getParent().getAbsoluteOpacity()),a},moveTo:function(a){Kinetic.Node.prototype.remove.call(this),a.add(this)},toObject:function(){var a=Kinetic.Type,b={},c=this.attrs;b.attrs={};for(var d in c){var e=c[d];!a._isFunction(e)&&!a._isElement(e)&&(!a._isObject(e)||!a._hasMethods(e))&&(b.attrs[d]=e)}return b.nodeType=this.nodeType,b.shapeType=this.shapeType,b},toJSON:function(){return JSON.stringify(this.toObject())},getParent:function(){return this.parent},getLayer:function(){return this.getParent().getLayer()},getStage:function(){return this.getParent()?this.getParent().getStage():undefined},simulate:function(a,b){this._handleEvent(a,b||{})},fire:function(a,b){this._executeHandlers(a,b||{})},getAbsoluteTransform:function(){var a=new Kinetic.Transform;return this._eachAncestorReverse(function(b){var c=b.getTransform();a.multiply(c)},!0),a},getTransform:function(){var a=new Kinetic.Transform,b=this.attrs,c=b.x,d=b.y,e=b.rotation,f=b.scale,g=f.x,h=f.y,i=b.offset,j=i.x,k=i.y;return(c!==0||d!==0)&&a.translate(c,d),e!==0&&a.rotate(e),(g!==1||h!==1)&&a.scale(g,h),(j!==0||k!==0)&&a.translate(-1*j,-1*k),a},clone:function(a){var b=this.shapeType||this.nodeType,c=new Kinetic[b](this.attrs);for(var d in this.eventListeners){var e=this.eventListeners[d],f=e.length;for(var g=0;g<f;g++){var h=e[g];h.name.indexOf("kinetic")<0&&(c.eventListeners[d]||(c.eventListeners[d]=[]),c.eventListeners[d].push(h))}}return c.setAttrs(a),c},toDataURL:function(a){a=a||{};var b=a.mimeType||null,c=a.quality||null,d,e,f=a.x||0,g=a.y||0;return a.width&&a.height?d=new Kinetic.SceneCanvas(a.width,a.height,1):(d=this.getStage().bufferCanvas,d.clear()),e=d.getContext(),e.save(),(f||g)&&e.translate(-1*f,-1*g),this.drawScene(d),e.restore(),d.toDataURL(b,c)},toImage:function(a){Kinetic.Type._getImage(this.toDataURL(a),function(b){a.callback(b)})},setSize:function(){var a=Kinetic.Type._getSize(Array.prototype.slice.call(arguments));this.setWidth(a.width),this.setHeight(a.height)},getSize:function(){return{width:this.getWidth(),height:this.getHeight()}},getWidth:function(){return this.attrs.width||0},getHeight:function(){return this.attrs.height||0},_get:function(a){return this.nodeType===a?[this]:[]},_off:function(a,b){for(var c=0;c<this.eventListeners[a].length;c++)if(this.eventListeners[a][c].name===b){this.eventListeners[a].splice(c,1);if(this.eventListeners[a].length===0){delete this.eventListeners[a];break}c--}},_clearTransform:function(){var a=this.attrs,b=a.scale,c=a.offset,d={x:a.x,y:a.y,rotation:a.rotation,scale:{x:b.x,y:b.y},offset:{x:c.x,y:c.y}};return this.attrs.x=0,this.attrs.y=0,this.attrs.rotation=0,this.attrs.scale={x:1,y:1},this.attrs.offset={x:0,y:0},d},_setTransform:function(a){for(var b in a)this.attrs[b]=a[b]},_fireBeforeChangeEvent:function(a,b,c){this._handleEvent("before"+a.toUpperCase()+"Change",{oldVal:b,newVal:c})},_fireChangeEvent:function(a,b,c){this._handleEvent(a+"Change",{oldVal:b,newVal:c})},setId:function(a){var b=this.getId(),c=this.getStage(),d=Kinetic.Global;d._removeId(b),d._addId(this,a),this.setAttr("id",a)},setName:function(a){var b=this.getName(),c=this.getStage(),d=Kinetic.Global;d._removeName(b,this._id),d._addName(this,a),this.setAttr("name",a)},setAttr:function(a,b){if(b!==undefined){var c=this.attrs[a];this._fireBeforeChangeEvent(a,c,b),this.attrs[a]=b,this._fireChangeEvent(a,c,b)}},_handleEvent:function(a,b,c){b&&this.nodeType==="Shape"&&(b.shape=this);var d=this.getStage(),e=this.eventListeners,f=!0;a==="mouseenter"&&c&&this._id===c._id?f=!1:a==="mouseleave"&&c&&this._id===c._id&&(f=!1),f&&(e[a]&&this.fire(a,b),b&&!b.cancelBubble&&this.parent&&(c&&c.parent?this._handleEvent.call(this.parent,a,b,c.parent):this._handleEvent.call(this.parent,a,b)))},_executeHandlers:function(a,b){var c=this.eventListeners[a],d=c.length;for(var e=0;e<d;e++)c[e].handler.apply(this,[b])}},Kinetic.Node.addSetters=function(constructor,a){var b=a.length;for(var c=0;c<b;c++){var d=a[c];this._addSetter(constructor,d)}},Kinetic.Node.addPointSetters=function(constructor,a){var b=a.length;for(var c=0;c<b;c++){var d=a[c];this._addPointSetter(constructor,d)}},Kinetic.Node.addRotationSetters=function(constructor,a){var b=a.length;for(var c=0;c<b;c++){var d=a[c];this._addRotationSetter(constructor,d)}},Kinetic.Node.addGetters=function(constructor,a){var b=a.length;for(var c=0;c<b;c++){var d=a[c];this._addGetter(constructor,d)}},Kinetic.Node.addRotationGetters=function(constructor,a){var b=a.length;for(var c=0;c<b;c++){var d=a[c];this._addRotationGetter(constructor,d)}},Kinetic.Node.addGettersSetters=function(constructor,a){this.addSetters(constructor,a),this.addGetters(constructor,a)},Kinetic.Node.addPointGettersSetters=function(constructor,a){this.addPointSetters(constructor,a),this.addGetters(constructor,a)},Kinetic.Node.addRotationGettersSetters=function(constructor,a){this.addRotationSetters(constructor,a),this.addRotationGetters(constructor,a)},Kinetic.Node._addSetter=function(constructor,a){var b=this,c="set"+a.charAt(0).toUpperCase()+a.slice(1);constructor.prototype[c]=function(b){this.setAttr(a,b)}},Kinetic.Node._addPointSetter=function(constructor,a){var b=this,c="set"+a.charAt(0).toUpperCase()+a.slice(1);constructor.prototype[c]=function(){var b=Kinetic.Type._getXY([].slice.call(arguments));b&&b.x===undefined&&(b.x=this.attrs[a].x),b&&b.y===undefined&&(b.y=this.attrs[a].y),this.setAttr(a,b)}},Kinetic.Node._addRotationSetter=function(constructor,a){var b=this,c="set"+a.charAt(0).toUpperCase()+a.slice(1);constructor.prototype[c]=function(b){this.setAttr(a,b)},constructor.prototype[c+"Deg"]=function(b){this.setAttr(a,Kinetic.Type._degToRad(b))}},Kinetic.Node._addGetter=function(constructor,a){var b=this,c="get"+a.charAt(0).toUpperCase()+a.slice(1);constructor.prototype[c]=function(b){return this.attrs[a]}},Kinetic.Node._addRotationGetter=function(constructor,a){var b=this,c="get"+a.charAt(0).toUpperCase()+a.slice(1);constructor.prototype[c]=function(){return this.attrs[a]},constructor.prototype[c+"Deg"]=function(){return Kinetic.Type._radToDeg(this.attrs[a])}},Kinetic.Node.create=function(a,b){return this._createNode(JSON.parse(a),b)},Kinetic.Node._createNode=function(a,b){var c;a.nodeType==="Shape"?a.shapeType===undefined?c="Shape":c=a.shapeType:c=a.nodeType,b&&(a.attrs.container=b);var d=new Kinetic[c](a.attrs);if(a.children){var e=a.children.length;for(var f=0;f<e;f++)d.add(this._createNode(a.children[f]))}return d},Kinetic.Node.addGettersSetters(Kinetic.Node,["x","y","opacity"]),Kinetic.Node.addGetters(Kinetic.Node,["name","id"]),Kinetic.Node.addRotationGettersSetters(Kinetic.Node,["rotation"]),Kinetic.Node.addPointGettersSetters(Kinetic.Node,["scale","offset"]),Kinetic.Node.addSetters(Kinetic.Node,["width","height","listening","visible"]),Kinetic.Node.prototype.isListening=Kinetic.Node.prototype.getListening,Kinetic.Node.prototype.isVisible=Kinetic.Node.prototype.getVisible;var a=["on","off"];for(var b=0;b<2;b++)(function(b){var c=a[b];Kinetic.Collection.prototype[c]=function(){var a=[].slice.call(arguments);a.unshift(c),this.apply.apply(this,a)}})(b)}(),function(){Kinetic.Animation=function(a,b){this.func=a,this.node=b,this.id=Kinetic.Animation.animIdCounter++,this.frame={time:0,timeDiff:0,lastTime:(new Date).getTime()}},Kinetic.Animation.prototype={isRunning:function(){var a=Kinetic.Animation,b=a.animations;for(var c=0;c<b.length;c++)if(b[c].id===this.id)return!0;return!1},start:function(){this.stop(),this.frame.timeDiff=0,this.frame.lastTime=(new Date).getTime(),Kinetic.Animation._addAnimation(this)},stop:function(){Kinetic.Animation._removeAnimation(this)},_updateFrameObject:function(a){this.frame.timeDiff=a-this.frame.lastTime,this.frame.lastTime=a,this.frame.time+=this.frame.timeDiff,this.frame.frameRate=1e3/this.frame.timeDiff}},Kinetic.Animation.animations=[],Kinetic.Animation.animIdCounter=0,Kinetic.Animation.animRunning=!1,Kinetic.Animation.fixedRequestAnimFrame=function(a){window.setTimeout(a,1e3/60)},Kinetic.Animation._addAnimation=function(a){this.animations.push(a),this._handleAnimation()},Kinetic.Animation._removeAnimation=function(a){var b=a.id,c=this.animations,d=c.length;for(var e=0;e<d;e++)if(c[e].id===b){this.animations.splice(e,1);break}},Kinetic.Animation._runFrames=function(){var a={},b=this.animations;for(var c=0;c<b.length;c++){var d=b[c],e=d.node,f=d.func;d._updateFrameObject((new Date).getTime()),e&&e._id!==undefined&&(a[e._id]=e),f&&f(d.frame)}for(var g in a)a[g].draw()},Kinetic.Animation._animationLoop=function(){var a=this;this.animations.length>0?(this._runFrames(),Kinetic.Animation.requestAnimFrame(function(){a._animationLoop()})):this.animRunning=!1},Kinetic.Animation._handleAnimation=function(){var a=this;this.animRunning||(this.animRunning=!0,a._animationLoop())},RAF=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||Kinetic.Animation.fixedRequestAnimFrame}(),Kinetic.Animation.requestAnimFrame=function(a){var b=Kinetic.DD&&Kinetic.DD.moving?this.fixedRequestAnimFrame:RAF;b(a)};var a=Kinetic.Node.prototype.moveTo;Kinetic.Node.prototype.moveTo=function(b){a.call(this,b)}}(),function(){Kinetic.DD={anim:new Kinetic.Animation,moving:!1,offset:{x:0,y:0}},Kinetic.getNodeDragging=function(){return Kinetic.DD.node},Kinetic.DD._setupDragLayerAndGetContainer=function(a){var b=a.getStage(),c=a.nodeType,d,e;return a._eachAncestorReverse(function(a){a.nodeType==="Layer"?(b.dragLayer.setAttrs(a.getAttrs()),d=b.dragLayer,b.add(b.dragLayer)):a.nodeType==="Group"&&(e=new Kinetic.Group(a.getAttrs()),d.add(e),d=e)}),d},Kinetic.DD._initDragLayer=function(a){a.dragLayer=new Kinetic.Layer,a.dragLayer.getCanvas().getElement().className="kinetic-drag-and-drop-layer"},Kinetic.DD._drag=function(a){var b=Kinetic.DD,c=b.node;if(c){var d=c.getStage().getUserPosition(),e=c.attrs.dragBoundFunc,f={x:d.x-b.offset.x,y:d.y-b.offset.y};e!==undefined&&(f=e.call(c,f,a)),c.setAbsolutePosition(f),b.moving||(b.moving=!0,c.setListening(!1),c._handleEvent("dragstart",a)),c._handleEvent("dragmove",a)}},Kinetic.DD._endDrag=function(a){var b=Kinetic.DD,c=b.node;if(c){var d=c.nodeType,e=c.getStage();c.setListening(!0),d==="Stage"?c.draw():((d==="Group"||d==="Shape")&&c.getDragOnTop()&&b.prevParent&&(c.moveTo(b.prevParent),c.getStage().dragLayer.remove(),b.prevParent=null),c.getLayer().draw()),delete b.node,b.anim.stop(),b.moving&&(b.moving=!1,c._handleEvent("dragend",a))}},Kinetic.Node.prototype._startDrag=function(a){var b=Kinetic.DD,c=this,d=this.getStage(),e=d.getUserPosition();if(e){var f=this.getTransform().getTranslation(),g=this.getAbsolutePosition(),h=this.nodeType,i;b.node=this,b.offset.x=e.x-g.x,b.offset.y=e.y-g.y,h==="Stage"||h==="Layer"?(b.anim.node=this,b.anim.start()):this.getDragOnTop()?(i=b._setupDragLayerAndGetContainer(this),b.anim.node=d.dragLayer,b.prevParent=this.getParent(),setTimeout(function(){b.node&&(c.moveTo(i),b.prevParent.getLayer().draw(),d.dragLayer.draw(),b.anim.start())},0)):(b.anim.node=this.getLayer(),b.anim.start())}},Kinetic.Node.prototype.setDraggable=function(a){this.setAttr("draggable",a),this._dragChange()},Kinetic.Node.prototype.getDraggable=function(){return this.attrs.draggable},Kinetic.Node.prototype.isDragging=function(){var a=Kinetic.DD;return a.node&&a.node._id===this._id&&a.moving},Kinetic.Node.prototype._listenDrag=function(){this._dragCleanup
();var a=this;this.on("mousedown.kinetic touchstart.kinetic",function(b){Kinetic.getNodeDragging()||a._startDrag(b)})},Kinetic.Node.prototype._dragChange=function(){if(this.attrs.draggable)this._listenDrag();else{this._dragCleanup();var a=this.getStage(),b=Kinetic.DD;a&&b.node&&b.node._id===this._id&&b._endDrag()}},Kinetic.Node.prototype._dragCleanup=function(){this.off("mousedown.kinetic"),this.off("touchstart.kinetic")},Kinetic.Node.prototype.isDraggable=Kinetic.Node.prototype.getDraggable,Kinetic.Node.addGettersSetters(Kinetic.Node,["dragBoundFunc","dragOnTop"]);var a=document.getElementsByTagName("html")[0];a.addEventListener("mouseup",Kinetic.DD._endDrag,!0),a.addEventListener("touchend",Kinetic.DD._endDrag,!0)}(),function(){Kinetic.Transition=function(a,b){function e(a,b,d,f){for(var g in a)g!=="duration"&&g!=="easing"&&g!=="callback"&&(Kinetic.Type._isObject(a[g])?(d[g]={},e(a[g],b[g],d[g],f)):c._add(c._getTween(b,g,a[g],d,f)))}var c=this,d={};this.node=a,this.config=b,this.tweens=[],e(b,a.attrs,d,d),this.tweens[0].onStarted=function(){},this.tweens[0].onStopped=function(){a.transAnim.stop()},this.tweens[0].onResumed=function(){a.transAnim.start()},this.tweens[0].onLooped=function(){},this.tweens[0].onChanged=function(){},this.tweens[0].onFinished=function(){var c={};for(var d in b)d!=="duration"&&d!=="easing"&&d!=="callback"&&(c[d]=b[d]);a.transAnim.stop(),a.setAttrs(c),b.callback&&b.callback()}},Kinetic.Transition.prototype={start:function(){for(var a=0;a<this.tweens.length;a++)this.tweens[a].start()},stop:function(){for(var a=0;a<this.tweens.length;a++)this.tweens[a].stop()},resume:function(){for(var a=0;a<this.tweens.length;a++)this.tweens[a].resume()},_onEnterFrame:function(){for(var a=0;a<this.tweens.length;a++)this.tweens[a].onEnterFrame()},_add:function(a){this.tweens.push(a)},_getTween:function(a,b,c,d,e){var f=this.config,g=this.node,h=f.easing;h===undefined&&(h="linear");var i=new Kinetic.Tween(g,function(a){d[b]=a,g.setAttrs(e)},Kinetic.Tweens[h],a[b],c,f.duration);return i}},Kinetic.Node.prototype.transitionTo=function(a){var b=this,c=new Kinetic.Transition(this,a);return this.transAnim||(this.transAnim=new Kinetic.Animation),this.transAnim.func=function(){c._onEnterFrame()},this.transAnim.node=this.nodeType==="Stage"?this:this.getLayer(),c.start(),this.transAnim.start(),this.trans=c,c}}(),function(){Kinetic.Container=function(a){this._containerInit(a)},Kinetic.Container.prototype={_containerInit:function(a){this.children=[],Kinetic.Node.call(this,a)},getChildren:function(){return this.children},removeChildren:function(){while(this.children.length>0)this.children[0].remove()},add:function(a){var b=Kinetic.Global,c=this.children;return a.index=c.length,a.parent=this,c.push(a),this},get:function(a){var b=new Kinetic.Collection;if(a.charAt(0)==="#"){var c=this._getNodeById(a.slice(1));c&&b.push(c)}else if(a.charAt(0)==="."){var d=this._getNodesByName(a.slice(1));Kinetic.Collection.apply(b,d)}else{var e=[],f=this.getChildren(),g=f.length;for(var h=0;h<g;h++)e=e.concat(f[h]._get(a));Kinetic.Collection.apply(b,e)}return b},_getNodeById:function(a){var b=this.getStage(),c=Kinetic.Global,d=c.ids[a];return d!==undefined&&this.isAncestorOf(d)?d:null},_getNodesByName:function(a){var b=Kinetic.Global,c=b.names[a]||[];return this._getDescendants(c)},_get:function(a){var b=Kinetic.Node.prototype._get.call(this,a),c=this.getChildren(),d=c.length;for(var e=0;e<d;e++)b=b.concat(c[e]._get(a));return b},toObject:function(){var a=Kinetic.Node.prototype.toObject.call(this);a.children=[];var b=this.getChildren(),c=b.length;for(var d=0;d<c;d++){var e=b[d];a.children.push(e.toObject())}return a},_getDescendants:function(a){var b=[],c=a.length;for(var d=0;d<c;d++){var e=a[d];this.isAncestorOf(e)&&b.push(e)}return b},isAncestorOf:function(a){var b=a.getParent();while(b){if(b._id===this._id)return!0;b=b.getParent()}return!1},clone:function(a){var b=Kinetic.Node.prototype.clone.call(this,a);for(var c in this.children)b.add(this.children[c].clone());return b},getIntersections:function(){var a=Kinetic.Type._getXY(Array.prototype.slice.call(arguments)),b=[],c=this.get("Shape"),d=c.length;for(var e=0;e<d;e++){var f=c[e];f.isVisible()&&f.intersects(a)&&b.push(f)}return b},_setChildrenIndices:function(){var a=this.children,b=a.length;for(var c=0;c<b;c++)a[c].index=c},draw:function(){this.drawScene(),this.drawHit()},drawScene:function(a){if(this.isVisible()){var b=this.children,c=b.length;for(var d=0;d<c;d++)b[d].drawScene(a)}},drawHit:function(){if(this.isVisible()&&this.isListening()){var a=this.children,b=a.length;for(var c=0;c<b;c++)a[c].drawHit()}}},Kinetic.Global.extend(Kinetic.Container,Kinetic.Node)}(),function(){function a(a){a.fill()}function b(a){a.stroke()}function c(a){a.fill()}function d(a){a.stroke()}Kinetic.Shape=function(a){this._initShape(a)},Kinetic.Shape.prototype={_initShape:function(e){this.setDefaultAttrs({fillEnabled:!0,strokeEnabled:!0,shadowEnabled:!0,dashArrayEnabled:!0,fillPriority:"color"}),this.nodeType="Shape",this._fillFunc=a,this._strokeFunc=b,this._fillFuncHit=c,this._strokeFuncHit=d;var f=Kinetic.Global.shapes,g;for(;;){g=Kinetic.Type._getRandomColorKey();if(g&&!(g in f))break}this.colorKey=g,f[g]=this,Kinetic.Node.call(this,e)},getContext:function(){return this.getLayer().getContext()},getCanvas:function(){return this.getLayer().getCanvas()},hasShadow:function(){return!!(this.getShadowColor()||this.getShadowBlur()||this.getShadowOffset())},hasFill:function(){return!!(this.getFill()||this.getFillPatternImage()||this.getFillLinearGradientStartPoint()||this.getFillRadialGradientStartPoint())},_get:function(a){return this.nodeType===a||this.shapeType===a?[this]:[]},intersects:function(){var a=Kinetic.Type._getXY(Array.prototype.slice.call(arguments)),b=this.getStage(),c=b.hitCanvas;c.clear(),this.drawScene(c);var d=c.context.getImageData(Math.round(a.x),Math.round(a.y),1,1).data;return d[3]>0},enableFill:function(){this.setAttr("fillEnabled",!0)},disableFill:function(){this.setAttr("fillEnabled",!1)},enableStroke:function(){this.setAttr("strokeEnabled",!0)},disableStroke:function(){this.setAttr("strokeEnabled",!1)},enableShadow:function(){this.setAttr("shadowEnabled",!0)},disableShadow:function(){this.setAttr("shadowEnabled",!1)},enableDashArray:function(){this.setAttr("dashArrayEnabled",!0)},disableDashArray:function(){this.setAttr("dashArrayEnabled",!1)},remove:function(){Kinetic.Node.prototype.remove.call(this),delete Kinetic.Global.shapes[this.colorKey]},drawScene:function(a){var b=this.attrs,c=b.drawFunc,a=a||this.getLayer().getCanvas(),d=a.getContext();c&&this.isVisible()&&(d.save(),a._applyOpacity(this),a._applyLineJoin(this),a._applyAncestorTransforms(this),c.call(this,a),d.restore())},drawHit:function(){var a=this.attrs,b=a.drawHitFunc||a.drawFunc,c=this.getLayer().hitCanvas,d=c.getContext();b&&this.isVisible()&&this.isListening()&&(d.save(),c._applyLineJoin(this),c._applyAncestorTransforms(this),b.call(this,c),d.restore())},_setDrawFuncs:function(){!this.attrs.drawFunc&&this.drawFunc&&this.setDrawFunc(this.drawFunc),!this.attrs.drawHitFunc&&this.drawHitFunc&&this.setDrawHitFunc(this.drawHitFunc)}},Kinetic.Global.extend(Kinetic.Shape,Kinetic.Node),Kinetic.Node.addGettersSetters(Kinetic.Shape,["stroke","lineJoin","lineCap","strokeWidth","drawFunc","drawHitFunc","dashArray","shadowColor","shadowBlur","shadowOpacity","fillPatternImage","fill","fillPatternX","fillPatternY","fillLinearGradientColorStops","fillRadialGradientStartRadius","fillRadialGradientEndRadius","fillRadialGradientColorStops","fillPatternRepeat","fillEnabled","strokeEnabled","shadowEnabled","dashArrayEnabled","fillPriority"]),Kinetic.Node.addPointGettersSetters(Kinetic.Shape,["fillPatternOffset","fillPatternScale","fillLinearGradientStartPoint","fillLinearGradientEndPoint","fillRadialGradientStartPoint","fillRadialGradientEndPoint","shadowOffset"]),Kinetic.Node.addRotationGettersSetters(Kinetic.Shape,["fillPatternRotation"])}(),function(){Kinetic.Stage=function(a){this._initStage(a)},Kinetic.Stage.prototype={_initStage:function(a){var b=Kinetic.DD;this.setDefaultAttrs({width:400,height:200}),Kinetic.Container.call(this,a),this._setStageDefaultProperties(),this._id=Kinetic.Global.idCounter++,this._buildDOM(),this._bindContentEvents(),Kinetic.Global.stages.push(this),b&&b._initDragLayer(this)},setContainer:function(a){typeof a=="string"&&(a=document.getElementById(a)),this.setAttr("container",a)},setHeight:function(a){Kinetic.Node.prototype.setHeight.call(this,a),this._resizeDOM()},setWidth:function(a){Kinetic.Node.prototype.setWidth.call(this,a),this._resizeDOM()},clear:function(){var a=this.children;for(var b=0;b<a.length;b++)a[b].clear()},remove:function(){var a=this.content;Kinetic.Node.prototype.remove.call(this),a&&Kinetic.Type._isInDocument(a)&&this.attrs.container.removeChild(a)},reset:function(){this.removeChildren(),this._setStageDefaultProperties(),this.setAttrs(this.defaultNodeAttrs)},getMousePosition:function(){return this.mousePos},getTouchPosition:function(){return this.touchPos},getUserPosition:function(){return this.getTouchPosition()||this.getMousePosition()},getStage:function(){return this},getContent:function(){return this.content},toDataURL:function(a){function i(d){var e=h[d],j=e.toDataURL(),k=new Image;k.onload=function(){g.drawImage(k,0,0),d<h.length-1?i(d+1):a.callback(f.toDataURL(b,c))},k.src=j}a=a||{};var b=a.mimeType||null,c=a.quality||null,d=a.x||0,e=a.y||0,f=new Kinetic.SceneCanvas(a.width||this.getWidth(),a.height||this.getHeight()),g=f.getContext(),h=this.children;(d||e)&&g.translate(-1*d,-1*e),i(0)},toImage:function(a){var b=a.callback;a.callback=function(a){Kinetic.Type._getImage(a,function(a){b(a)})},this.toDataURL(a)},getIntersection:function(a){var b,c=this.getChildren();for(var d=c.length-1;d>=0;d--){var e=c[d];if(e.isVisible()&&e.isListening()){var f=e.hitCanvas.context.getImageData(Math.round(a.x),Math.round(a.y),1,1).data;if(f[3]===255){var g=Kinetic.Type._rgbToHex(f[0],f[1],f[2]);return b=Kinetic.Global.shapes[g],{shape:b,pixel:f}}if(f[0]>0||f[1]>0||f[2]>0||f[3]>0)return{pixel:f}}}return null},_resizeDOM:function(){if(this.content){var a=this.attrs.width,b=this.attrs.height;this.content.style.width=a+"px",this.content.style.height=b+"px",this.bufferCanvas.setSize(a,b,1),this.hitCanvas.setSize(a,b);var c=this.children;for(var d=0;d<c.length;d++){var e=c[d];e.getCanvas().setSize(a,b),e.hitCanvas.setSize(a,b),e.draw()}}},add:function(a){return Kinetic.Container.prototype.add.call(this,a),a.canvas.setSize(this.attrs.width,this.attrs.height),a.hitCanvas.setSize(this.attrs.width,this.attrs.height),a.draw(),this.content.appendChild(a.canvas.element),this},getDragLayer:function(){return this.dragLayer},_setUserPosition:function(a){a||(a=window.event),this._setMousePosition(a),this._setTouchPosition(a)},_bindContentEvents:function(){var a=Kinetic.Global,b=this,c=["mousedown","mousemove","mouseup","mouseout","touchstart","touchmove","touchend"];for(var d=0;d<c.length;d++){var e=c[d];(function(){var a=e;b.content.addEventListener(a,function(c){b["_"+a](c)},!1)})()}},_mouseout:function(a){this._setUserPosition(a);var b=Kinetic.DD,c=this.targetShape;c&&(!b||!b.moving)&&(c._handleEvent("mouseout",a),c._handleEvent("mouseleave",a),this.targetShape=null),this.mousePos=undefined},_mousemove:function(a){this._setUserPosition(a);var b=Kinetic.DD,c=this.getIntersection(this.getUserPosition());if(c){var d=c.shape;d&&(!!b&&!!b.moving||c.pixel[3]!==255||!!this.targetShape&&this.targetShape._id===d._id?d._handleEvent("mousemove",a):(this.targetShape&&(this.targetShape._handleEvent("mouseout",a,d),this.targetShape._handleEvent("mouseleave",a,d)),d._handleEvent("mouseover",a,this.targetShape),d._handleEvent("mouseenter",a,this.targetShape),this.targetShape=d))}else this.targetShape&&(!b||!b.moving)&&(this.targetShape._handleEvent("mouseout",a),this.targetShape._handleEvent("mouseleave",a),this.targetShape=null);b&&b._drag(a)},_mousedown:function(a){var b,c=Kinetic.DD;this._setUserPosition(a),b=this.getIntersection(this.getUserPosition());if(b&&b.shape){var d=b.shape;this.clickStart=!0,d._handleEvent("mousedown",a)}c&&this.attrs.draggable&&!c.node&&this._startDrag(a)},_mouseup:function(a){this._setUserPosition(a);var b=this,c=Kinetic.DD,d=this.getIntersection(this.getUserPosition());if(d&&d.shape){var e=d.shape;e._handleEvent("mouseup",a),this.clickStart&&(!c||!c.moving||!c.node)&&(e._handleEvent("click",a),this.inDoubleClickWindow&&e._handleEvent("dblclick",a),this.inDoubleClickWindow=!0,setTimeout(function(){b.inDoubleClickWindow=!1},this.dblClickWindow))}this.clickStart=!1},_touchstart:function(a){var b,c=Kinetic.DD;this._setUserPosition(a),a.preventDefault(),b=this.getIntersection(this.getUserPosition());if(b&&b.shape){var d=b.shape;this.tapStart=!0,d._handleEvent("touchstart",a)}c&&this.attrs.draggable&&!c.node&&this._startDrag(a)},_touchend:function(a){this._setUserPosition(a);var b=this,c=Kinetic.DD,d=this.getIntersection(this.getUserPosition());if(d&&d.shape){var e=d.shape;e._handleEvent("touchend",a),this.tapStart&&(!c||!c.moving||!c.node)&&(e._handleEvent("tap",a),this.inDoubleClickWindow&&e._handleEvent("dbltap",a),this.inDoubleClickWindow=!0,setTimeout(function(){b.inDoubleClickWindow=!1},this.dblClickWindow))}this.tapStart=!1},_touchmove:function(a){this._setUserPosition(a);var b=Kinetic.DD;a.preventDefault();var c=this.getIntersection(this.getUserPosition());if(c&&c.shape){var d=c.shape;d._handleEvent("touchmove",a)}b&&b._drag(a)},_setMousePosition:function(a){var b=a.clientX-this._getContentPosition().left,c=a.clientY-this._getContentPosition().top;this.mousePos={x:b,y:c}},_setTouchPosition:function(a){if(a.touches!==undefined&&a.touches.length===1){var b=a.touches[0],c=b.clientX-this._getContentPosition().left,d=b.clientY-this._getContentPosition().top;this.touchPos={x:c,y:d}}},_getContentPosition:function(){var a=this.content.getBoundingClientRect();return{top:a.top,left:a.left}},_buildDOM:function(){this.content=document.createElement("div"),this.content.style.position="relative",this.content.style.display="inline-block",this.content.className="kineticjs-content",this.attrs.container.appendChild(this.content),this.bufferCanvas=new Kinetic.SceneCanvas,this.hitCanvas=new Kinetic.HitCanvas,this._resizeDOM()},_onContent:function(a,b){var c=a.split(" ");for(var d=0;d<c.length;d++){var e=c[d];this.content.addEventListener(e,b,!1)}},_setStageDefaultProperties:function(){this.nodeType="Stage",this.dblClickWindow=400,this.targetShape=null,this.mousePos=undefined,this.clickStart=!1,this.touchPos=undefined,this.tapStart=!1}},Kinetic.Global.extend(Kinetic.Stage,Kinetic.Container),Kinetic.Node.addGetters(Kinetic.Stage,["container"])}(),function(){Kinetic.Layer=function(a){this._initLayer(a)},Kinetic.Layer.prototype={_initLayer:function(a){this.setDefaultAttrs({clearBeforeDraw:!0}),this.nodeType="Layer",this.beforeDrawFunc=undefined,this.afterDrawFunc=undefined,this.canvas=new Kinetic.SceneCanvas,this.canvas.getElement().style.position="absolute",this.hitCanvas=new Kinetic.HitCanvas,Kinetic.Container.call(this,a)},draw:function(){var a=this.getContext();this.beforeDrawFunc!==undefined&&this.beforeDrawFunc.call(this),Kinetic.Container.prototype.draw.call(this),this.afterDrawFunc!==undefined&&this.afterDrawFunc.call(this)},drawHit:function(){this.hitCanvas.clear(),Kinetic.Container.prototype.drawHit.call(this)},drawScene:function(a){a=a||this.getCanvas(),this.attrs.clearBeforeDraw&&a.clear(),Kinetic.Container.prototype.drawScene.call(this,a)},toDataURL:function(a){a=a||{};var b=a.mimeType||null,c=a.quality||null,d,e,f=a.x||0,g=a.y||0;return a.width||a.height||a.x||a.y?Kinetic.Node.prototype.toDataURL.call(this,a):this.getCanvas().toDataURL(b,c)},beforeDraw:function(a){this.beforeDrawFunc=a},afterDraw:function(a){this.afterDrawFunc=a},getCanvas:function(){return this.canvas},getContext:function(){return this.canvas.context},clear:function(){this.getCanvas().clear()},setVisible:function(a){Kinetic.Node.prototype.setVisible.call(this,a),a?(this.canvas.element.style.display="block",this.hitCanvas.element.style.display="block"):(this.canvas.element.style.display="none",this.hitCanvas.element.style.display="none")},setZIndex:function(a){Kinetic.Node.prototype.setZIndex.call(this,a);var b=this.getStage();b&&(b.content.removeChild(this.canvas.element),a<b.getChildren().length-1?b.content.insertBefore(this.canvas.element,b.getChildren()[a+1].canvas.element):b.content.appendChild(this.canvas.element))},moveToTop:function(){Kinetic.Node.prototype.moveToTop.call(this);var a=this.getStage();a&&(a.content.removeChild(this.canvas.element),a.content.appendChild(this.canvas.element))},moveUp:function(){if(Kinetic.Node.prototype.moveUp.call(this)){var a=this.getStage();a&&(a.content.removeChild(this.canvas.element),this.index<a.getChildren().length-1?a.content.insertBefore(this.canvas.element,a.getChildren()[this.index+1].canvas.element):a.content.appendChild(this.canvas.element))}},moveDown:function(){if(Kinetic.Node.prototype.moveDown.call(this)){var a=this.getStage();if(a){var b=a.getChildren();a.content.removeChild(this.canvas.element),a.content.insertBefore(this.canvas.element,b[this.index+1].canvas.element)}}},moveToBottom:function(){if(Kinetic.Node.prototype.moveToBottom.call(this)){var a=this.getStage();if(a){var b=a.getChildren();a.content.removeChild(this.canvas.element),a.content.insertBefore(this.canvas.element,b[1].canvas.element)}}},getLayer:function(){return this},remove:function(){var a=this.getStage(),b=this.canvas,c=b.element;Kinetic.Node.prototype.remove.call(this),a&&b&&Kinetic.Type._isInDocument(c)&&a.content.removeChild(c)}},Kinetic.Global.extend(Kinetic.Layer,Kinetic.Container),Kinetic.Node.addGettersSetters(Kinetic.Layer,["clearBeforeDraw"])}(),function(){Kinetic.Group=function(a){this._initGroup(a)},Kinetic.Group.prototype={_initGroup:function(a){this.nodeType="Group",Kinetic.Container.call(this,a)}},Kinetic.Global.extend(Kinetic.Group,Kinetic.Container)}(),function(){Kinetic.Rect=function(a){this._initRect(a)},Kinetic.Rect.prototype={_initRect:function(a){this.setDefaultAttrs({width:0,height:0,cornerRadius:0}),Kinetic.Shape.call(this,a),this.shapeType="Rect",this._setDrawFuncs()},drawFunc:function(a){var b=a.getContext();b.beginPath();var c=this.getCornerRadius(),d=this.getWidth(),e=this.getHeight();c===0?b.rect(0,0,d,e):(b.moveTo(c,0),b.lineTo(d-c,0),b.arc(d-c,c,c,Math.PI*3/2,0,!1),b.lineTo(d,e-c),b.arc(d-c,e-c,c,0,Math.PI/2,!1),b.lineTo(c,e),b.arc(c,e-c,c,Math.PI/2,Math.PI,!1),b.lineTo(0,c),b.arc(c,c,c,Math.PI,Math.PI*3/2,!1)),b.closePath(),a.fillStroke(this)}},Kinetic.Global.extend(Kinetic.Rect,Kinetic.Shape),Kinetic.Node.addGettersSetters(Kinetic.Rect,["cornerRadius"])}(),function(){Kinetic.Circle=function(a){this._initCircle(a)},Kinetic.Circle.prototype={_initCircle:function(a){this.setDefaultAttrs({radius:0}),Kinetic.Shape.call(this,a),this.shapeType="Circle",this._setDrawFuncs()},drawFunc:function(a){var b=a.getContext();b.beginPath(),b.arc(0,0,this.getRadius(),0,Math.PI*2,!0),b.closePath(),a.fillStroke(this)},getWidth:function(){return this.getRadius()*2},getHeight:function(){return this.getRadius()*2},setWidth:function(a){Kinetic.Node.prototype.setWidth.call(this,a),this.setRadius(a/2)},setHeight:function(a){Kinetic.Node.prototype.setHeight.call(this,a),this.setRadius(a/2)}},Kinetic.Global.extend(Kinetic.Circle,Kinetic.Shape),Kinetic.Node.addGettersSetters(Kinetic.Circle,["radius"])}(),function(){Kinetic.Wedge=function(a){this._initWedge(a)},Kinetic.Wedge.prototype={_initWedge:function(a){this.setDefaultAttrs({radius:0,angle:0,clockwise:!1}),Kinetic.Shape.call(this,a),this.shapeType="Wedge",this._setDrawFuncs()},drawFunc:function(a){var b=a.getContext();b.beginPath(),b.arc(0,0,this.getRadius(),0,this.getAngle(),this.getClockwise()),b.lineTo(0,0),b.closePath(),a.fillStroke(this)},setAngleDeg:function(a){this.setAngle(Kinetic.Type._degToRad(a))},getAngleDeg:function(){return Kinetic.Type._radToDeg(this.getAngle())}},Kinetic.Global.extend(Kinetic.Wedge,Kinetic.Shape),Kinetic.Node.addGettersSetters(Kinetic.Wedge,["radius","angle","clockwise"])}(),function(){Kinetic.Ellipse=function(a){this._initEllipse(a)},Kinetic.Ellipse.prototype={_initEllipse:function(a){this.setDefaultAttrs({radius:{x:0,y:0}}),Kinetic.Shape.call(this,a),this.shapeType="Ellipse",this._setDrawFuncs()},drawFunc:function(a){var b=a.getContext(),c=this.getRadius();b.beginPath(),b.save(),c.x!==c.y&&b.scale(1,c.y/c.x),b.arc(0,0,c.x,0,Math.PI*2,!0),b.restore(),b.closePath(),a.fillStroke(this)},getWidth:function(){return this.getRadius().x*2},getHeight:function(){return this.getRadius().y*2},setWidth:function(a){Kinetic.Node.prototype.setWidth.call(this,a),this.setRadius({x:a/2})},setHeight:function(a){Kinetic.Node.prototype.setHeight.call(this,a),this.setRadius({y:a/2})}},Kinetic.Global.extend(Kinetic.Ellipse,Kinetic.Shape),Kinetic.Node.addPointGettersSetters(Kinetic.Ellipse,["radius"])}(),function(){Kinetic.Image=function(a){this._initImage(a)},Kinetic.Image.prototype={_initImage:function(a){Kinetic.Shape.call(this,a),this.shapeType="Image",this._setDrawFuncs();var b=this;this.on("imageChange",function(a){b._syncSize()}),this._syncSize()},drawFunc:function(a){var b=this.getWidth(),c=this.getHeight(),d,e=this,f=a.getContext();f.beginPath(),f.rect(0,0,b,c),f.closePath(),a.fillStroke(this);if(this.attrs.image){if(this.attrs.crop&&this.attrs.crop.width&&this.attrs.crop.height){var g=this.attrs.crop.x||0,h=this.attrs.crop.y||0,i=this.attrs.crop.width,j=this.attrs.crop.height;d=[this.attrs.image,g,h,i,j,0,0,b,c]}else d=[this.attrs.image,0,0,b,c];this.hasShadow()?a.applyShadow(this,function(){e._drawImage(f,d)}):this._drawImage(f,d)}},drawHitFunc:function(a){var b=this.getWidth(),c=this.getHeight(),d=this.imageHitRegion,e=!1,f=a.getContext();d?(f.drawImage(d,0,0,b,c),f.beginPath(),f.rect(0,0,b,c),f.closePath(),a.stroke(this)):(f.beginPath(),f.rect(0,0,b,c),f.closePath(),a.fillStroke(this))},applyFilter:function(a,b,c){var d=new Kinetic.Canvas(this.attrs.image.width,this.attrs.image.height),e=d.getContext();e.drawImage(this.attrs.image,0,0);try{var f=e.getImageData(0,0,d.getWidth(),d.getHeight());a(f,b);var g=this;Kinetic.Type._getImage(f,function(a){g.setImage(a),c&&c()})}catch(h){Kinetic.Global.warn("Unable to apply filter. "+h.message)}},setCrop:function(){var a=[].slice.call(arguments),b=Kinetic.Type._getXY(a),c=Kinetic.Type._getSize(a),d=Kinetic.Type._merge(b,c);this.setAttr("crop",Kinetic.Type._merge(d,this.getCrop()))},createImageHitRegion:function(a){var b=new Kinetic.Canvas(this.attrs.width,this.attrs.height),c=b.getContext();c.drawImage(this.attrs.image,0,0);try{var d=c.getImageData(0,0,b.getWidth(),b.getHeight()),e=d.data,f=Kinetic.Type._hexToRgb(this.colorKey);for(var g=0,h=e.length;g<h;g+=4)e[g]=f.r,e[g+1]=f.g,e[g+2]=f.b;var i=this;Kinetic.Type._getImage(d,function(b){i.imageHitRegion=b,a&&a()})}catch(j){Kinetic.Global.warn("Unable to create image hit region. "+j.message)}},clearImageHitRegion:function(){delete this.imageHitRegion},_syncSize:function(){this.attrs.image&&(this.attrs.width||this.setWidth(this.attrs.image.width),this.attrs.height||this.setHeight(this.attrs.image.height))},_drawImage:function(a,b){b.length===5?a.drawImage(b[0],b[1],b[2],b[3],b[4]):b.length===9&&a.drawImage(b[0],b[1],b[2],b[3],b[4],b[5],b[6],b[7],b[8])}},Kinetic.Global.extend(Kinetic.Image,Kinetic.Shape),Kinetic.Node.addGettersSetters(Kinetic.Image,["image"]),Kinetic.Node.addGetters(Kinetic.Image,["crop"])}(),function(){Kinetic.Polygon=function(a){this._initPolygon(a)},Kinetic.Polygon.prototype={_initPolygon:function(a){this.setDefaultAttrs({points:[]}),Kinetic.Shape.call(this,a),this.shapeType="Polygon",this._setDrawFuncs()},drawFunc:function(a){var b=a.getContext(),c=this.getPoints(),d=c.length;b.beginPath(),b.moveTo(c[0].x,c[0].y);for(var e=1;e<d;e++)b.lineTo(c[e].x,c[e].y);b.closePath(),a.fillStroke(this)},setPoints:function(a){this.setAttr("points",Kinetic.Type._getPoints(a))}},Kinetic.Global.extend(Kinetic.Polygon,Kinetic.Shape),Kinetic.Node.addGetters(Kinetic.Polygon,["points"])}(),function(){function v(a){a.fillText(this.partialText,0,0)}function w(a){a.strokeText(this.partialText,0,0)}var a="auto",b="Calibri",c="canvas",d="center",e="Change.kinetic",f="2d",g="\n",h="",i="left",j="\n",k="text",l="Text",m="top",o="middle",p="normal",q="px ",r=" ",s="right",t=["fontFamily","fontSize","fontStyle","padding","align","lineHeight","text","width","height"],u=t.length;Kinetic.Text=function(a){this._initText(a)},Kinetic.Text.prototype={_initText:function(d){var f=this;this.setDefaultAttrs({fontFamily:b,text:h,fontSize:12,align:i,verticalAlign:m,fontStyle:p,padding:0,width:a,height:a,lineHeight:1}),this.dummyCanvas=document.createElement(c),Kinetic.Shape.call(this,d),this._fillFunc=v,this._strokeFunc=w,this.shapeType=l,this._setDrawFuncs();for(var g=0;g<u;g++)this.on(t[g]+e,f._setTextData);this._setTextData()},drawFunc:function(a){var b=a.getContext(),c=this.getPadding(),e=this.getFontStyle(),f=this.getFontSize(),g=this.getFontFamily(),h=this.getTextHeight(),j=this.getLineHeight()*h,k=this.textArr,l=k.length,m=this.getWidth();b.font=e+r+f+q+g,b.textBaseline=o,b.textAlign=i,b.save(),b.translate(c,0),b.translate(0,c+h/2);for(var n=0;n<l;n++){var p=k[n],t=p.text,u=p.width;b.save(),this.getAlign()===s?b.translate(m-u-c*2,0):this.getAlign()===d&&b.translate((m-u-c*2)/2,0),this.partialText=t,a.fillStroke(this),b.restore(),b.translate(0,j)}b.restore()},drawHitFunc:function(a){var b=a.getContext(),c=this.getWidth(),d=this.getHeight();b.beginPath(),b.rect(0,0,c,d),b.closePath(),a.fillStroke(this)},setText:function(a){var b=Kinetic.Type._isString(a)?a:a.toString();this.setAttr(k,b)},getWidth:function(){return this.attrs.width===a?this.getTextWidth()+this.getPadding()*2:this.attrs.width},getHeight:function(){return this.attrs.height===a?this.getTextHeight()*this.textArr.length*this.attrs.lineHeight+this.attrs.padding*2:this.attrs.height},getTextWidth:function(){return this.textWidth},getTextHeight:function(){return this.textHeight},_getTextSize:function(a){var b=this.dummyCanvas,c=b.getContext(f),d=this.getFontSize(),e;return c.save(),c.font=this.getFontStyle()+r+d+q+this.getFontFamily(),e=c.measureText(a),c.restore(),{width:e.width,height:parseInt(d,10)}},_expandTextData:function(a){var b=a.length;n=0,text=h,newArr=[];for(n=0;n<b;n++)text=a[n],newArr.push({text:text,width:this._getTextSize(text).width});return newArr},_setTextData:function(){var b=this.getText().split(h),c=[],d=0;addLine=!0,lineHeightPx=0,padding=this.getPadding(),this.textWidth=0,this.textHeight=this._getTextSize(this.getText()).height,lineHeightPx=this.getLineHeight()*this.textHeight;while(b.length>0&&addLine&&(this.attrs.height===a||lineHeightPx*(d+1)<this.attrs.height-padding*2)){var e=0,f=undefined;addLine=!1;while(e<b.length){if(b.indexOf(j)===e){b.splice(e,1),f=b.splice(0,e).join(h);break}var i=b.slice(0,e);if(this.attrs.width!==a&&this._getTextSize(i.join(h)).width>this.attrs.width-padding*2){if(e==0)break;var k=i.lastIndexOf(r),l=i.lastIndexOf(g),m=Math.max(k,l);if(m>=0){f=b.splice(0,1+m).join(h);break}f=b.splice(0,e).join(h);break}e++,e===b.length&&(f=b.splice(0,e).join(h))}this.textWidth=Math.max(this.textWidth,this._getTextSize(f).width),f!==undefined&&(c.push(f),addLine=!0),d++}this.textArr=this._expandTextData(c)}},Kinetic.Global.extend(Kinetic.Text,Kinetic.Shape),Kinetic.Node.addGettersSetters(Kinetic.Text,["fontFamily","fontSize","fontStyle","padding","align","lineHeight"]),Kinetic.Node.addGetters(Kinetic.Text,[k])}(),function(){Kinetic.Line=function(a){this._initLine(a)},Kinetic.Line.prototype={_initLine:function(a){this.setDefaultAttrs({points:[],lineCap:"butt"}),Kinetic.Shape.call(this,a),this.shapeType="Line",this._setDrawFuncs()},drawFunc:function(a){var b=this.getPoints(),c=b.length,d=a.getContext();d.beginPath(),d.moveTo(b[0].x,b[0].y);for(var e=1;e<c;e++){var f=b[e];d.lineTo(f.x,f.y)}a.stroke(this)},setPoints:function(a){this.setAttr("points",Kinetic.Type._getPoints(a))}},Kinetic.Global.extend(Kinetic.Line,Kinetic.Shape),Kinetic.Node.addGetters(Kinetic.Line,["points"])}(),function(){Kinetic.Spline=function(a){this._initSpline(a)},Kinetic.Spline._getControlPoints=function(a,b,c,d){var e=a.x,f=a.y,g=b.x,h=b.y,i=c.x,j=c.y,k=Math.sqrt(Math.pow(g-e,2)+Math.pow(h-f,2)),l=Math.sqrt(Math.pow(i-g,2)+Math.pow(j-h,2)),m=d*k/(k+l),n=d*l/(k+l),o=g-m*(i-e),p=h-m*(j-f),q=g+n*(i-e),r=h+n*(j-f);return[{x:o,y:p},{x:q,y:r}]},Kinetic.Spline.prototype={_initSpline:function(a){this.setDefaultAttrs({tension:1}),Kinetic.Line.call(this,a),this.shapeType="Spline"},drawFunc:function(a){var b=this.getPoints(),c=b.length,d=a.getContext(),e=this.getTension();d.beginPath(),d.moveTo(b[0].x,b[0].y);if(e!==0&&c>2){var f=this.allPoints,g=f.length;d.quadraticCurveTo(f[0].x,f[0].y,f[1].x,f[1].y);var h=2;while(h<g-1)d.bezierCurveTo(f[h].x,f[h++].y,f[h].x,f[h++].y,f[h].x,f[h++].y);d.quadraticCurveTo(f[g-1].x,f[g-1].y,b[c-1].x,b[c-1].y)}else for(var h=1;h<c;h++){var i=b[h];d.lineTo(i.x,i.y)}a.stroke(this)},setPoints:function(a){Kinetic.Line.prototype.setPoints.call(this,a),this._setAllPoints()},setTension:function(a){this.setAttr("tension",a),this._setAllPoints()},_setAllPoints:function(){var a=this.getPoints(),b=a.length,c=this.getTension(),d=[];for(var e=1;e<b-1;e++){var f=Kinetic.Spline._getControlPoints(a[e-1],a[e],a[e+1],c);d.push(f[0]),d.push(a[e]),d.push(f[1])}this.allPoints=d}},Kinetic.Global.extend(Kinetic.Spline,Kinetic.Line),Kinetic.Node.addGetters(Kinetic.Spline,["tension"])}(),function(){Kinetic.Blob=function(a){this._initBlob(a)},Kinetic.Blob.prototype={_initBlob:function(a){Kinetic.Spline.call(this,a),this.shapeType="Blob"},drawFunc:function(a){var b=this.getPoints(),c=b.length,d=a.getContext(),e=this.getTension();d.beginPath(),d.moveTo(b[0].x,b[0].y);if(e!==0&&c>2){var f=this.allPoints,g=f.length,h=0;while(h<g-1)d.bezierCurveTo(f[h].x,f[h++].y,f[h].x,f[h++].y,f[h].x,f[h++].y)}else for(var h=1;h<c;h++){var i=b[h];d.lineTo(i.x,i.y)}d.closePath(),a.fillStroke(this)},_setAllPoints:function(){var a=this.getPoints(),b=a.length,c=this.getTension(),d=Kinetic.Spline._getControlPoints(a[b-1],a[0],a[1],c),e=Kinetic.Spline._getControlPoints(a[b-2],a[b-1],a[0],c);Kinetic.Spline.prototype._setAllPoints.call(this),this.allPoints.unshift(d[1]),this.allPoints.push(e[0]),this.allPoints.push(a[b-1]),this.allPoints.push(e[1]),this.allPoints.push(d[0]),this.allPoints.push(a[0])}},Kinetic.Global.extend(Kinetic.Blob,Kinetic.Spline)}(),function(){Kinetic.Sprite=function(a){this._initSprite(a)},Kinetic.Sprite.prototype={_initSprite:function(a){this.setDefaultAttrs({index:0,frameRate:17}),Kinetic.Shape.call(this,a),this.shapeType="Sprite",this._setDrawFuncs(),this.anim=new Kinetic.Animation;var b=this;this.on("animationChange",function(){b.setIndex(0)})},drawFunc:function(a){var b=this.attrs.animation,c=this.attrs.index,d=this.attrs.animations[b][c],e=a.getContext(),f=this.attrs.image;f&&e.drawImage(f,d.x,d.y,d.width,d.height,0,0,d.width,d.height)},drawHitFunc:function(a){var b=this.attrs.animation,c=this.attrs.index,d=this.attrs.animations[b][c],e=a.getContext();e.beginPath(),e.rect(0,0,d.width,d.height),e.closePath(),a.fill(this)},start:function(){var a=this,b=this.getLayer();this.anim.node=b,this.interval=setInterval(function(){var b=a.attrs.index;a._updateIndex(),a.afterFrameFunc&&b===a.afterFrameIndex&&(a.afterFrameFunc(),delete a.afterFrameFunc,delete a.afterFrameIndex)},1e3/this.attrs.frameRate),this.anim.start()},stop:function(){this.anim.stop(),clearInterval(this.interval)},afterFrame:function(a,b){this.afterFrameIndex=a,this.afterFrameFunc=b},_updateIndex:function(){var a=this.attrs.index,b=this.attrs.animation;a<this.attrs.animations[b].length-1?this.attrs.index++:this.attrs.index=0}},Kinetic.Global.extend(Kinetic.Sprite,Kinetic.Shape),Kinetic.Node.addGettersSetters(Kinetic.Sprite,["animation","animations","index"])}(),function(){Kinetic.Star=function(a){this._initStar(a)},Kinetic.Star.prototype={_initStar:function(a){this.setDefaultAttrs({numPoints:0,innerRadius:0,outerRadius:0}),Kinetic.Shape.call(this,a),this.shapeType="Star",this._setDrawFuncs()},drawFunc:function(a){var b=a.getContext(),c=this.attrs.innerRadius,d=this.attrs.outerRadius,e=this.attrs.numPoints;b.beginPath(),b.moveTo(0,0-this.attrs.outerRadius);for(var f=1;f<e*2;f++){var g=f%2===0?d:c,h=g*Math.sin(f*Math.PI/e),i=-1*g*Math.cos(f*Math.PI/e);b.lineTo(h,i)}b.closePath(),a.fillStroke(this)}},Kinetic.Global.extend(Kinetic.Star,Kinetic.Shape),Kinetic.Node.addGettersSetters(Kinetic.Star,["numPoints","innerRadius","outerRadius"])}(),function(){Kinetic.RegularPolygon=function(a){this._initRegularPolygon(a)},Kinetic.RegularPolygon.prototype={_initRegularPolygon:function(
a){this.setDefaultAttrs({radius:0,sides:0}),Kinetic.Shape.call(this,a),this.shapeType="RegularPolygon",this._setDrawFuncs()},drawFunc:function(a){var b=a.getContext(),c=this.attrs.sides,d=this.attrs.radius;b.beginPath(),b.moveTo(0,0-d);for(var e=1;e<c;e++){var f=d*Math.sin(e*2*Math.PI/c),g=-1*d*Math.cos(e*2*Math.PI/c);b.lineTo(f,g)}b.closePath(),a.fillStroke(this)}},Kinetic.Global.extend(Kinetic.RegularPolygon,Kinetic.Shape),Kinetic.Node.addGettersSetters(Kinetic.RegularPolygon,["radius","sides"])}(),function(){Kinetic.Path=function(a){this._initPath(a)},Kinetic.Path.prototype={_initPath:function(a){this.dataArray=[];var b=this;Kinetic.Shape.call(this,a),this.shapeType="Path",this._setDrawFuncs(),this.dataArray=Kinetic.Path.parsePathData(this.attrs.data),this.on("dataChange",function(){b.dataArray=Kinetic.Path.parsePathData(b.attrs.data)})},drawFunc:function(a){var b=this.dataArray,c=a.getContext();c.beginPath();for(var d=0;d<b.length;d++){var e=b[d].command,f=b[d].points;switch(e){case"L":c.lineTo(f[0],f[1]);break;case"M":c.moveTo(f[0],f[1]);break;case"C":c.bezierCurveTo(f[0],f[1],f[2],f[3],f[4],f[5]);break;case"Q":c.quadraticCurveTo(f[0],f[1],f[2],f[3]);break;case"A":var g=f[0],h=f[1],i=f[2],j=f[3],k=f[4],l=f[5],m=f[6],n=f[7],o=i>j?i:j,p=i>j?1:i/j,q=i>j?j/i:1;c.translate(g,h),c.rotate(m),c.scale(p,q),c.arc(0,0,o,k,k+l,1-n),c.scale(1/p,1/q),c.rotate(-m),c.translate(-g,-h);break;case"z":c.closePath()}}a.fillStroke(this)}},Kinetic.Global.extend(Kinetic.Path,Kinetic.Shape),Kinetic.Path.getLineLength=function(a,b,c,d){return Math.sqrt((c-a)*(c-a)+(d-b)*(d-b))},Kinetic.Path.getPointOnLine=function(a,b,c,d,e,f,g){f===undefined&&(f=b),g===undefined&&(g=c);var h=(e-c)/(d-b+1e-8),i=Math.sqrt(a*a/(1+h*h));d<b&&(i*=-1);var j=h*i,k;if((g-c)/(f-b+1e-8)===h)k={x:f+i,y:g+j};else{var l,m,n=this.getLineLength(b,c,d,e);if(n<1e-8)return undefined;var o=(f-b)*(d-b)+(g-c)*(e-c);o/=n*n,l=b+o*(d-b),m=c+o*(e-c);var p=this.getLineLength(f,g,l,m),q=Math.sqrt(a*a-p*p);i=Math.sqrt(q*q/(1+h*h)),d<b&&(i*=-1),j=h*i,k={x:l+i,y:m+j}}return k},Kinetic.Path.getPointOnCubicBezier=function(a,b,c,d,e,f,g,h,i){function j(a){return a*a*a}function k(a){return 3*a*a*(1-a)}function l(a){return 3*a*(1-a)*(1-a)}function m(a){return(1-a)*(1-a)*(1-a)}var n=h*j(a)+f*k(a)+d*l(a)+b*m(a),o=i*j(a)+g*k(a)+e*l(a)+c*m(a);return{x:n,y:o}},Kinetic.Path.getPointOnQuadraticBezier=function(a,b,c,d,e,f,g){function h(a){return a*a}function i(a){return 2*a*(1-a)}function j(a){return(1-a)*(1-a)}var k=f*h(a)+d*i(a)+b*j(a),l=g*h(a)+e*i(a)+c*j(a);return{x:k,y:l}},Kinetic.Path.getPointOnEllipticalArc=function(a,b,c,d,e,f){var g=Math.cos(f),h=Math.sin(f),i={x:c*Math.cos(e),y:d*Math.sin(e)};return{x:a+(i.x*g-i.y*h),y:b+(i.x*h+i.y*g)}},Kinetic.Path.parsePathData=function(a){if(!a)return[];var b=a,c=["m","M","l","L","v","V","h","H","z","Z","c","C","q","Q","t","T","s","S","a","A"];b=b.replace(new RegExp(" ","g"),",");for(var d=0;d<c.length;d++)b=b.replace(new RegExp(c[d],"g"),"|"+c[d]);var e=b.split("|"),f=[],g=0,h=0;for(var d=1;d<e.length;d++){var i=e[d],j=i.charAt(0);i=i.slice(1),i=i.replace(new RegExp(",-","g"),"-"),i=i.replace(new RegExp("-","g"),",-"),i=i.replace(new RegExp("e,-","g"),"e-");var k=i.split(",");k.length>0&&k[0]===""&&k.shift();for(var l=0;l<k.length;l++)k[l]=parseFloat(k[l]);while(k.length>0){if(isNaN(k[0]))break;var m=null,n=[],o=g,p=h;switch(j){case"l":g+=k.shift(),h+=k.shift(),m="L",n.push(g,h);break;case"L":g=k.shift(),h=k.shift(),n.push(g,h);break;case"m":g+=k.shift(),h+=k.shift(),m="M",n.push(g,h),j="l";break;case"M":g=k.shift(),h=k.shift(),m="M",n.push(g,h),j="L";break;case"h":g+=k.shift(),m="L",n.push(g,h);break;case"H":g=k.shift(),m="L",n.push(g,h);break;case"v":h+=k.shift(),m="L",n.push(g,h);break;case"V":h=k.shift(),m="L",n.push(g,h);break;case"C":n.push(k.shift(),k.shift(),k.shift(),k.shift()),g=k.shift(),h=k.shift(),n.push(g,h);break;case"c":n.push(g+k.shift(),h+k.shift(),g+k.shift(),h+k.shift()),g+=k.shift(),h+=k.shift(),m="C",n.push(g,h);break;case"S":var q=g,r=h,s=f[f.length-1];s.command==="C"&&(q=g+(g-s.points[2]),r=h+(h-s.points[3])),n.push(q,r,k.shift(),k.shift()),g=k.shift(),h=k.shift(),m="C",n.push(g,h);break;case"s":var q=g,r=h,s=f[f.length-1];s.command==="C"&&(q=g+(g-s.points[2]),r=h+(h-s.points[3])),n.push(q,r,g+k.shift(),h+k.shift()),g+=k.shift(),h+=k.shift(),m="C",n.push(g,h);break;case"Q":n.push(k.shift(),k.shift()),g=k.shift(),h=k.shift(),n.push(g,h);break;case"q":n.push(g+k.shift(),h+k.shift()),g+=k.shift(),h+=k.shift(),m="Q",n.push(g,h);break;case"T":var q=g,r=h,s=f[f.length-1];s.command==="Q"&&(q=g+(g-s.points[0]),r=h+(h-s.points[1])),g=k.shift(),h=k.shift(),m="Q",n.push(q,r,g,h);break;case"t":var q=g,r=h,s=f[f.length-1];s.command==="Q"&&(q=g+(g-s.points[0]),r=h+(h-s.points[1])),g+=k.shift(),h+=k.shift(),m="Q",n.push(q,r,g,h);break;case"A":var t=k.shift(),u=k.shift(),v=k.shift(),w=k.shift(),x=k.shift(),y=g,z=h;g=k.shift(),h=k.shift(),m="A",n=this.convertEndpointToCenterParameterization(y,z,g,h,w,x,t,u,v);break;case"a":var t=k.shift(),u=k.shift(),v=k.shift(),w=k.shift(),x=k.shift(),y=g,z=h;g+=k.shift(),h+=k.shift(),m="A",n=this.convertEndpointToCenterParameterization(y,z,g,h,w,x,t,u,v)}f.push({command:m||j,points:n,start:{x:o,y:p},pathLength:this.calcLength(o,p,m||j,n)})}(j==="z"||j==="Z")&&f.push({command:"z",points:[],start:undefined,pathLength:0})}return f},Kinetic.Path.calcLength=function(a,b,c,d){var e,f,g,h=Kinetic.Path;switch(c){case"L":return h.getLineLength(a,b,d[0],d[1]);case"C":e=0,f=h.getPointOnCubicBezier(0,a,b,d[0],d[1],d[2],d[3],d[4],d[5]);for(t=.01;t<=1;t+=.01)g=h.getPointOnCubicBezier(t,a,b,d[0],d[1],d[2],d[3],d[4],d[5]),e+=h.getLineLength(f.x,f.y,g.x,g.y),f=g;return e;case"Q":e=0,f=h.getPointOnQuadraticBezier(0,a,b,d[0],d[1],d[2],d[3]);for(t=.01;t<=1;t+=.01)g=h.getPointOnQuadraticBezier(t,a,b,d[0],d[1],d[2],d[3]),e+=h.getLineLength(f.x,f.y,g.x,g.y),f=g;return e;case"A":e=0;var i=d[4],j=d[5],k=d[4]+j,l=Math.PI/180;Math.abs(i-k)<l&&(l=Math.abs(i-k)),f=h.getPointOnEllipticalArc(d[0],d[1],d[2],d[3],i,0);if(j<0)for(t=i-l;t>k;t-=l)g=h.getPointOnEllipticalArc(d[0],d[1],d[2],d[3],t,0),e+=h.getLineLength(f.x,f.y,g.x,g.y),f=g;else for(t=i+l;t<k;t+=l)g=h.getPointOnEllipticalArc(d[0],d[1],d[2],d[3],t,0),e+=h.getLineLength(f.x,f.y,g.x,g.y),f=g;return g=h.getPointOnEllipticalArc(d[0],d[1],d[2],d[3],k,0),e+=h.getLineLength(f.x,f.y,g.x,g.y),e}return 0},Kinetic.Path.convertEndpointToCenterParameterization=function(a,b,c,d,e,f,g,h,i){var j=i*(Math.PI/180),k=Math.cos(j)*(a-c)/2+Math.sin(j)*(b-d)/2,l=-1*Math.sin(j)*(a-c)/2+Math.cos(j)*(b-d)/2,m=k*k/(g*g)+l*l/(h*h);m>1&&(g*=Math.sqrt(m),h*=Math.sqrt(m));var n=Math.sqrt((g*g*h*h-g*g*l*l-h*h*k*k)/(g*g*l*l+h*h*k*k));e==f&&(n*=-1),isNaN(n)&&(n=0);var o=n*g*l/h,p=n*-h*k/g,q=(a+c)/2+Math.cos(j)*o-Math.sin(j)*p,r=(b+d)/2+Math.sin(j)*o+Math.cos(j)*p,s=function(a){return Math.sqrt(a[0]*a[0]+a[1]*a[1])},t=function(a,b){return(a[0]*b[0]+a[1]*b[1])/(s(a)*s(b))},u=function(a,b){return(a[0]*b[1]<a[1]*b[0]?-1:1)*Math.acos(t(a,b))},v=u([1,0],[(k-o)/g,(l-p)/h]),w=[(k-o)/g,(l-p)/h],x=[(-1*k-o)/g,(-1*l-p)/h],y=u(w,x);return t(w,x)<=-1&&(y=Math.PI),t(w,x)>=1&&(y=0),f===0&&y>0&&(y-=2*Math.PI),f==1&&y<0&&(y+=2*Math.PI),[q,r,g,h,v,y,j,f]},Kinetic.Node.addGettersSetters(Kinetic.Path,["data"])}(),function(){function a(a){a.fillText(this.partialText,0,0)}function b(a){a.strokeText(this.partialText,0,0)}Kinetic.TextPath=function(a){this._initTextPath(a)},Kinetic.TextPath.prototype={_initTextPath:function(c){this.setDefaultAttrs({fontFamily:"Calibri",fontSize:12,fontStyle:"normal",text:""}),this.dummyCanvas=document.createElement("canvas"),this.dataArray=[];var d=this;Kinetic.Shape.call(this,c),this._fillFunc=a,this._strokeFunc=b,this.shapeType="TextPath",this._setDrawFuncs(),this.dataArray=Kinetic.Path.parsePathData(this.attrs.data),this.on("dataChange",function(){d.dataArray=Kinetic.Path.parsePathData(this.attrs.data)});var e=["text","textStroke","textStrokeWidth"];for(var f=0;f<e.length;f++){var g=e[f];this.on(g+"Change",d._setTextData)}d._setTextData()},drawFunc:function(a){var b=this.charArr,c=a.getContext();c.font=this.attrs.fontStyle+" "+this.attrs.fontSize+"pt "+this.attrs.fontFamily,c.textBaseline="middle",c.textAlign="left",c.save();var d=this.glyphInfo;for(var e=0;e<d.length;e++){c.save();var f=d[e].p0,g=d[e].p1,h=parseFloat(this.attrs.fontSize);c.translate(f.x,f.y),c.rotate(d[e].rotation),this.partialText=d[e].text,a.fillStroke(this),c.restore()}c.restore()},getTextWidth:function(){return this.textWidth},getTextHeight:function(){return this.textHeight},setText:function(a){Kinetic.Text.prototype.setText.call(this,a)},_getTextSize:function(a){var b=this.dummyCanvas,c=b.getContext("2d");c.save(),c.font=this.attrs.fontStyle+" "+this.attrs.fontSize+"pt "+this.attrs.fontFamily;var d=c.measureText(a);return c.restore(),{width:d.width,height:parseInt(this.attrs.fontSize,10)}},_setTextData:function(){var a=this,b=this._getTextSize(this.attrs.text);this.textWidth=b.width,this.textHeight=b.height,this.glyphInfo=[];var c=this.attrs.text.split(""),d,e,f,g=-1,h=0,i=function(){h=0;var b=a.dataArray;for(var c=g+1;c<b.length;c++){if(b[c].pathLength>0)return g=c,b[c];b[c].command=="M"&&(d={x:b[c].points[0],y:b[c].points[1]})}return{}},j=function(b,c){var g=a._getTextSize(b).width,j=0,k=0,l=!1;e=undefined;while(Math.abs(g-j)/g>.01&&k<25){k++;var m=j;while(f===undefined)f=i(),f&&m+f.pathLength<g&&(m+=f.pathLength,f=undefined);if(f==={}||d===undefined)return undefined;var n=!1;switch(f.command){case"L":Kinetic.Path.getLineLength(d.x,d.y,f.points[0],f.points[1])>g?e=Kinetic.Path.getPointOnLine(g,d.x,d.y,f.points[0],f.points[1],d.x,d.y):f=undefined;break;case"A":var o=f.points[4],p=f.points[5],q=f.points[4]+p;h===0?h=o+1e-8:g>j?h+=Math.PI/180*p/Math.abs(p):h-=Math.PI/360*p/Math.abs(p),Math.abs(h)>Math.abs(q)&&(h=q,n=!0),e=Kinetic.Path.getPointOnEllipticalArc(f.points[0],f.points[1],f.points[2],f.points[3],h,f.points[6]);break;case"C":h===0?g>f.pathLength?h=1e-8:h=g/f.pathLength:g>j?h+=(g-j)/f.pathLength:h-=(j-g)/f.pathLength,h>1&&(h=1,n=!0),e=Kinetic.Path.getPointOnCubicBezier(h,f.start.x,f.start.y,f.points[0],f.points[1],f.points[2],f.points[3],f.points[4],f.points[5]);break;case"Q":h===0?h=g/f.pathLength:g>j?h+=(g-j)/f.pathLength:h-=(j-g)/f.pathLength,h>1&&(h=1,n=!0),e=Kinetic.Path.getPointOnQuadraticBezier(h,f.start.x,f.start.y,f.points[0],f.points[1],f.points[2],f.points[3])}e!==undefined&&(j=Kinetic.Path.getLineLength(d.x,d.y,e.x,e.y)),n&&(n=!1,f=undefined)}};for(var k=0;k<c.length;k++){j(c[k]);if(d===undefined||e===undefined)break;var l=Kinetic.Path.getLineLength(d.x,d.y,e.x,e.y),m=0,n=Kinetic.Path.getPointOnLine(m+l/2,d.x,d.y,e.x,e.y),o=Math.atan2(e.y-d.y,e.x-d.x);this.glyphInfo.push({transposeX:n.x,transposeY:n.y,text:c[k],rotation:o,p0:d,p1:e}),d=e}}},Kinetic.Global.extend(Kinetic.TextPath,Kinetic.Shape),Kinetic.Node.addGettersSetters(Kinetic.TextPath,["fontFamily","fontSize","fontStyle"]),Kinetic.Node.addGetters(Kinetic.TextPath,["text"])}();

var svl = svl || {};

/**
 * ActionStack keeps track of user's actions.
 * @param {object} $ jQuery ojbect
 * @param {object} params Other parameters
 * @returns {{className: string}}
 * @constructor
 * @memberof svl
 */
function ActionStack ($, params) {
    var self = {
        'className' : 'ActionStack'
        };
    var properties = {};
    var status = {
            actionStackCursor : 0, // This is an index of current state in actionStack
            disableRedo : false,
            disableUndo : false
        };
    var lock = {
            disableRedo : false,
            disableUndo : false
        };
    var actionStack = [];

    // jQuery dom objects
    var $buttonRedo;
    var $buttonUndo;


    ////////////////////////////////////////
    // Private Functions
    ////////////////////////////////////////
    function init (params) {
        // Initialization function
        if (svl.ui && svl.ui.actionStack) {
          // $buttonRedo = $(params.domIds.redoButton);
          // $buttonUndo = $(params.domIds.undoButton);
          $buttonRedo = svl.ui.actionStack.redo;
          $buttonUndo = svl.ui.actionStack.undo;
          $buttonRedo.css('opacity', 0.5);
          $buttonUndo.css('opacity', 0.5);

          // Attach listeners to buttons
          $buttonRedo.bind('click', buttonRedoClick);
          $buttonUndo.bind('click', buttonUndoClick);
        }
    }


    function buttonRedoClick () {
        if (!status.disableRedo) {
          if ('tracker' in svl) {
            svl.tracker.push('Click_Redo');
          }
            self.redo();
        }
    }


    function buttonUndoClick () {
        if (!status.disableUndo) {
          if ('tracker' in svl) {
            svl.tracker.push('Click_Undo');
          }
            self.undo();
        }
    }

    ////////////////////////////////////////
    // Public methods
    ////////////////////////////////////////
    self.disableRedo = function () {
        if (!lock.disableRedo) {
            status.disableRedo = true;
            if (svl.ui && svl.ui.actionStack) {
              $buttonRedo.css('opacity', 0.5);
            }
            return this;
        } else {
            return false;
        }
    };


    self.disableUndo = function () {
        if (!lock.disableUndo) {
            status.disableUndo = true;
            if (svl.ui && svl.ui.actionStack) {
              $buttonUndo.css('opacity', 0.5);
            }
            return this;
        } else {
            return false;
        }
    };


    self.enableRedo = function () {
        if (!lock.disableRedo) {
            status.disableRedo = false;
            if (svl.ui && svl.ui.actionStack) {
              $buttonRedo.css('opacity', 1);
            }
            return this;
        } else {
            return false;
        }
    };


    self.enableUndo = function () {
        if (!lock.disableUndo) {
            status.disableUndo = false;
            if (svl.ui && svl.ui.actionStack) {
              $buttonUndo.css('opacity', 1);
            }
            return this;
        } else {
            return false;
        }
    };

    self.getStatus = function(key) {
        if (!(key in status)) {
            console.warn("You have passed an invalid key for status.")
        }
        return status[key];
    };

    self.lockDisableRedo = function () {
        lock.disableRedo = true;
        return this;
    };


    self.lockDisableUndo = function () {
        lock.disableUndo = true;
        return this;
    };


    self.pop = function () {
        // Delete the last action
        if (actionStack.length > 0) {
            status.actionStackCursor -= 1;
            actionStack.splice(status.actionStackCursor);
        }
        return this;
    };


    self.push = function (action, label) {
        var availableActionList = ['addLabel', 'deleteLabel'];
        if (availableActionList.indexOf(action) === -1) {
            throw self.className + ": Illegal action.";
        }

        var actionItem = {
            'action' : action,
            'label' : label,
            'index' : status.actionStackCursor
        };
        if (actionStack.length !== 0 &&
            actionStack.length > status.actionStackCursor) {
            // Delete all the action items after the cursor before pushing the new acitonItem
            actionStack.splice(status.actionStackCursor);
        }
        actionStack.push(actionItem);
        status.actionStackCursor += 1;
        return this;
    };


    self.redo = function () {
        // Redo an action
        if (!status.disableRedo) {
            if (actionStack.length > status.actionStackCursor) {
                var actionItem = actionStack[status.actionStackCursor];
                if (actionItem.action === 'addLabel') {
                  if ('tracker' in svl) {
                    svl.tracker.push('Redo_AddLabel', {labelId: actionItem.label.getProperty('labelId')});
                  }
                    actionItem.label.setStatus('deleted', false);
                } else if (actionItem.action === 'deleteLabel') {
                  if ('tracker' in svl) {
                    svl.tracker.push('Redo_RemoveLabel', {labelId: actionItem.label.getProperty('labelId')});
                  }
                    actionItem.label.setStatus('deleted', true);
                    actionItem.label.setVisibility('hidden');
                }
                status.actionStackCursor += 1;
            }
            if ('canvas' in svl) {
              svl.canvas.clear().render2();
            }
        }
    };

    self.size = function () {
        // return the size of the stack

        return actionStack.length;
    };

    self.undo = function () {
        // Undo an action
        if (!status.disableUndo) {
            status.actionStackCursor -= 1;
            if(status.actionStackCursor >= 0) {
                var actionItem = actionStack[status.actionStackCursor];
                if (actionItem.action === 'addLabel') {
                  if ('tracker' in svl) {
                    svl.tracker.push('Undo_AddLabel', {labelId: actionItem.label.getProperty('labelId')});
                  }
                    actionItem.label.setStatus('deleted', true);
                } else if (actionItem.action === 'deleteLabel') {
                  if ('tracker' in svl) {
                    svl.tracker.push('Undo_RemoveLabel', {labelId: actionItem.label.getProperty('labelId')});
                  }
                    actionItem.label.setStatus('deleted', false);
                    actionItem.label.setVisibility('visible');
                }
            } else {
                status.actionStackCursor = 0;
            }

            if ('canvas' in svl) {
              svl.canvas.clear().render2();
            }
        }
    };


    self.unlockDisableRedo = function () {
        lock.disableRedo = false;
        return this;
    };


    self.unlockDisableUndo = function () {
        lock.disableUndo = false;
        return this;
    };

    self.getLock = function(key) {
        if (!(key in lock)) {
          console.warn("You have passed an invalid key for status.")
        }
        return lock[key];
    }

    self.updateOpacity = function () {
        // Change opacity
        if (svl.ui && svl.ui.actionStack) {
          if (status.actionStackCursor < actionStack.length) {
              $buttonRedo.css('opacity', 1);
          } else {
              $buttonRedo.css('opacity', 0.5);
          }

          if (status.actionStackCursor > 0) {
              $buttonUndo.css('opacity', 1);
          } else {
              $buttonUndo.css('opacity', 0.5);
          }

          // if the status is set to disabled, then set the opacity of buttons to 0.5 anyway.
          if (status.disableUndo) {
              $buttonUndo.css('opacity', 0.5);
          }
          if (status.disableRedo) {
              $buttonRedo.css('opacity', 0.5);
          }
        }
    };
    ////////////////////////////////////////
    // Initialization
    ////////////////////////////////////////
    init(params);

    return self;
}

function getBusStopPositionLabel() {
    return {
        'NextToCurb' : {
            'id' : 'NextToCurb',
            'label' : 'Next to curb'
        },
        'AwayFromCurb' : {
            'id' : 'AwayFromCurb',
            'label' : 'Away from curb'
        },
        'None' : {
            'id' : 'None',
            'label' : 'Not provided'
        }
    }
}


function getHeadingEstimate(SourceLat, SourceLng, TargetLat, TargetLng) {
    // This function takes a pair of lat/lng coordinates.
    //
    if (typeof SourceLat !== 'number') {
        SourceLat = parseFloat(SourceLat);
    }
    if (typeof SourceLng !== 'number') {
        SourceLng = parseFloat(SourceLng);
    }
    if (typeof TargetLng !== 'number') {
        TargetLng = parseFloat(TargetLng);
    }
    if (typeof TargetLat !== 'number') {
        TargetLat = parseFloat(TargetLat);
    }

    var dLng = TargetLng - SourceLng;
    var dLat = TargetLat - SourceLat;

    if (dLat === 0 || dLng === 0) {
        return 0;
    }

    var angle = toDegrees(Math.atan(dLng / dLat));
    //var angle = toDegrees(Math.atan(dLat / dLng));

    return 90 - angle;
}


function getLabelCursorImagePath() {
    return {
        'Walk' : {
            'id' : 'Walk',
            'cursorImagePath' : undefined
        },
        'StopSign' : {
            'id' : 'StopSign',
            'cursorImagePath' : 'public/img/cursors/Cursor_BusStop2.png'
        },
        'StopSign_OneLeg' : {
            'id' : 'StopSign_OneLeg',
            'cursorImagePath' : 'public/img/cursors/Cursor_BusStop2.png'
        },
        'StopSign_TwoLegs' : {
            'id' : 'StopSign_TwoLegs',
            'cursorImagePath' : 'public/img/cursors/Cursor_BusStop2.png'
        },
        'StopSign_Column' : {
            'id' : 'StopSign_Column',
            'cursorImagePath' : 'public/img/cursors/Cursor_BusStop2.png'
        },
        'StopSign_None' : {
            'id' : 'StopSign_None',
            'cursorImagePath' : 'public/img/cursors/Cursor_BusStop2.png'
        },
        'Landmark_Shelter' : {
            'id' : 'Landmark_Shelter',
            'cursorImagePath' : 'public/img/cursors/Cursor_BusStopShelter2.png'
        },
        'Landmark_Bench' : {
            'id' : 'Landmark_Bench',
            'cursorImagePath' : 'public/img/cursors/Cursor_Bench2.png'
        },
        'Landmark_TrashCan' : {
            'id' : 'Landmark_TrashCan',
            'cursorImagePath' : 'public/img/cursors/Cursor_TrashCan3.png'
        },
        'Landmark_MailboxAndNewsPaperBox' : {
            'id' : 'Landmark_MailboxAndNewsPaperBox',
            'cursorImagePath' : 'public/img/cursors/Cursor_Mailbox2.png'
        },
        'Landmark_OtherPole' : {
            'id' : 'Landmark_OtherPole',
            'cursorImagePath' : 'public/img/cursors/Cursor_OtherPole.png'
        }
    }
}


//
// Returns image paths corresponding to each label type.
//
function getLabelIconImagePath(labelType) {
    return {
        'Walk' : {
            'id' : 'Walk',
            'iconImagePath' : undefined
        },
        'StopSign' : {
            'id' : 'StopSign',
            'iconImagePath' : 'public/img/icons/Icon_BusStop.png'
        },
        'StopSign_OneLeg' : {
            'id' : 'StopSign_OneLeg',
            'iconImagePath' : 'public/img/icons/Icon_BusStopSign_SingleLeg.png'
        },
        'StopSign_TwoLegs' : {
            'id' : 'StopSign_TwoLegs',
            'iconImagePath' : 'public/img/icons/Icon_BusStopSign_TwoLegged.png'
        },
        'StopSign_Column' : {
            'id' : 'StopSign_Column',
            'iconImagePath' : 'public/img/icons/Icon_BusStopSign_Column.png'
        },
        'StopSign_None' : {
            'id' : 'StopSign_None',
            'iconImagePath' : 'public/img/icons/Icon_BusStop.png'
        },
        'Landmark_Shelter' : {
            'id' : 'Landmark_Shelter',
            'iconImagePath' : 'public/img/icons/Icon_BusStopShelter.png'
        },
        'Landmark_Bench' : {
            'id' : 'Landmark_Bench',
            'iconImagePath' : 'public/img/icons/Icon_Bench.png'
        },
        'Landmark_TrashCan' : {
            'id' : 'Landmark_TrashCan',
            'iconImagePath' : 'public/img/icons/Icon_TrashCan2.png'
        },
        'Landmark_MailboxAndNewsPaperBox' : {
            'id' : 'Landmark_MailboxAndNewsPaperBox',
            'iconImagePath' : 'public/img/icons/Icon_Mailbox2.png'
        },
        'Landmark_OtherPole' : {
            'id' : 'Landmark_OtherPole',
            'iconImagePath' : 'public/img/icons/Icon_OtherPoles.png'
        }
    }
}


//
// This function is used in OverlayMessageBox.js.
//
function getLabelInstructions () {
    return {
        'Walk' : {
            'id' : 'Walk',
            'instructionalText' : 'Explore mode: Find the closest bus stop and label surrounding landmarks',
            'textColor' : 'rgba(255,255,255,1)'
        },
        'StopSign' : {
            'id' : 'StopSign',
            'instructionalText' : 'Label mode: Locate and click at the bottom of the <span class="underline">stop sign</span>',
            'textColor' : 'rgba(255,255,255,1)'
        },
        'StopSign_OneLeg' : {
            'id' : 'StopSign_OneLeg',
            'instructionalText' : 'Label mode: Locate and click at the bottom of the <span class="underline">bus stop sign</span>',
            'textColor' : 'rgba(255,255,255,1)'
        },
        'StopSign_TwoLegs' : {
            'id' : 'StopSign_TwoLegs',
            'instructionalText' :'Label mode: Locate and click at the bottom of the <span class="underline">bus stop sign</span>',
            'textColor' :'rgba(255,255,255,1)'
        },
        'StopSign_Column' : {
            'id' : 'StopSign_Column',
            'instructionalText' : 'Label mode: Locate and click at the bottom of the <span class="underline">bus stop sign</span>',
            'textColor' : 'rgba(255,255,255,1)'
        },
        'Landmark_Shelter' : {
            'id' : 'Landmark_Shelter',
            'instructionalText' : 'Label mode: Locate and click at the bottom of the <span class="underline">bus shelter</span>',
            'textColor' : 'rgba(255,255,255,1)'
        },
        'Landmark_Bench' : {
            'id' : 'Landmark_Bench',
            'instructionalText' : 'Label mode: Locate and click at the bottom of the <span class="underline">bench</span> nearby a bus stop',
            'textColor' : 'rgba(255,255,255,1)'
        },
        'Landmark_TrashCan' : {
            'id' : 'Landmark_TrashCan',
            'instructionalText' : 'Label mode: Locate and click at the bottom of the <span class="underline">trash can</span> nearby a bus stop',
            'textColor' : 'rgba(255,255,255,1)'
        },
        'Landmark_MailboxAndNewsPaperBox' : {
            'id' : 'Landmark_MailboxAndNewsPaperBox',
            'instructionalText' : 'Label mode: Locate and click at the bottom of the <span class="underline">mailbox or news paper box</span> nearby a bus stop',
            'textColor' : 'rgba(255,255,255,1)'
        },
        'Landmark_OtherPole' : {
            'id' : 'Landmark_OtherPole',
            'instructionalText' : 'Label mode: Locate and click at the bottom of poles such as <span class="underline bold">traffic sign, traffic light, and light pole</span> nearby a bus stop',
            'textColor' : 'rgba(255,255,255,1)'
        }
    }
}

function getRibbonConnectionPositions () {
    return {
        'Walk' : {
            'id' : 'Walk',
            'text' : 'Walk',
            'labelRibbonConnection' : '25px'
        },
        'StopSign' : {
            'id' : 'StopSign',
            'text' : 'Stop Sign',
            'labelRibbonConnection' : '112px'
        },
        'StopSign_OneLeg' : {
            'id' : 'StopSign_OneLeg',
            'text' : 'One-leg Stop Sign',
            'labelRibbonConnection' : '112px'
        },
        'StopSign_TwoLegs' : {
            'id' : 'StopSign_TwoLegs',
            'text' : 'Two-leg Stop Sign',
            'labelRibbonConnection' : '112px'
        },
        'StopSign_Column' : {
            'id' : 'StopSign_Column',
            'text' : 'Column Stop Sign',
            'labelRibbonConnection' : '112px'
        },
        'Landmark_Shelter' : {
            'id' : 'Landmark_Shelter',
            'text' : 'Bus Shelter',
            'labelRibbonConnection' : '188px'
        },
        'Landmark_Bench' : {
            'id' : 'Landmark_Bench',
            'text' : 'Bench',
            'labelRibbonConnection' : '265px'
        },
        'Landmark_TrashCan' : {
            'id' : 'Landmark_TrashCan',
            'text' : 'Trash Can',
            'labelRibbonConnection' : '338px'
        },
        'Landmark_MailboxAndNewsPaperBox' : {
            'id' : 'Landmark_MailboxAndNewsPaperBox',
            'labelRibbonConnection' : '411px'
        },
        'Landmark_OtherPole' : {
            'id' : 'Landmark_OtherPole',
            'labelRibbonConnection' : '484px'
        }
    }
}

// Colors selected from
// http://colorbrewer2.org/
// - Number of data classes: 4
// - The nature of data: Qualitative
// - Color scheme 1: Paired - (166, 206, 227), (31, 120, 180), (178, 223, 138), (51, 160, 44)
// - Color scheme 2: Set2 - (102, 194, 165), (252, 141, 98), (141, 160, 203), (231, 138, 195)
// I'm currently using Set 2
function getLabelDescriptions () {
    return {
        'Walk' : {
            'id' : 'Walk',
            'text' : 'Walk'
        },
        'StopSign' : {
            'id' : 'StopSign',
            'text' : 'Bus Stop Sign'
        },
        'StopSign_OneLeg' : {
            'id' : 'StopSign_OneLeg',
            'text' : 'One-leg Stop Sign'
        },
        'StopSign_TwoLegs' : {
            'id' : 'StopSign_TwoLegs',
            'text' : 'Two-leg Stop Sign'
        },
        'StopSign_Column' : {
            'id' : 'StopSign_Column',
            'text' : 'Column Stop Sign'
        },
        'StopSign_None' : {
            'id' : 'StopSign_None',
            'text' : 'Not provided'
        },
        'Landmark_Shelter' : {
            'id' : 'Landmark_Shelter',
            'text' : 'Bus Stop Shelter'
        },
        'Landmark_Bench' : {
            'id' : 'Landmark_Bench',
            'text' : 'Bench'
        },
        'Landmark_TrashCan' : {
            'id' : 'Landmark_TrashCan',
            'text' : 'Trash Can / Recycle Can'
        },
        'Landmark_MailboxAndNewsPaperBox' : {
            'id' : 'Landmark_MailboxAndNewsPaperBox',
            'text' : 'Mailbox / News Paper Box'
        },
        'Landmark_OtherPole' : {
            'id' : 'Landmark_OtherPole',
            'text' : 'Traffic Sign / Pole'
        }
    }
}

function getLabelColors () {
    return colorScheme2();
}

function colorScheme1 () {
    return {
        'Walk' : {
            'id' : 'Walk',
            'fillStyle' : 'rgba(0, 0, 0, 0.9)'
        },
        'StopSign' : {
            'id' : 'StopSign',
            'fillStyle' : 'rgba(102, 194, 165, 0.9)'
        },
        'StopSign_OneLeg' : {
            'id' : 'StopSign_OneLeg',
            'fillStyle' : 'rgba(102, 194, 165, 0.9)'
        },
        'StopSign_TwoLegs' : {
            'id' : 'StopSign_TwoLegs',
            'fillStyle' : 'rgba(102, 194, 165, 0.9)'
        },
        'StopSign_Column' : {
            'id' : 'StopSign_Column',
            'fillStyle' : 'rgba(102, 194, 165, 0.9)'
        },
        'StopSign_None' : {
            'id' : 'StopSign_None',
            'fillStyle' : 'rgba(102, 194, 165, 0.9'
        },
        'Landmark_Shelter' : {
            'id' : 'Landmark_Shelter',
            'fillStyle' : 'rgba(252, 141, 98, 0.9)'
        },
        'Landmark_Bench' : {
            'id' : 'Landmark_Bench',
            'fillStyle' : 'rgba(141, 160, 203, 0.9)'
        },
        'Landmark_TrashCan' : {
            'id' : 'Landmark_TrashCan',
            'fillStyle' : 'rgba(231, 138, 195, 0.9)'
        }
    }
}

//
// http://www.colourlovers.com/business/trends/branding/7880/Papeterie_Haute-Ville_Logo
function colorScheme2 () {
    return {
        'Walk' : {
            'id' : 'Walk',
            'fillStyle' : 'rgba(0, 0, 0, 0.9)'
        },
        'StopSign' : {
            'id' : 'StopSign',
            'fillStyle' : 'rgba(0, 161, 203, 0.9)'
        },
        'StopSign_OneLeg' : {
            'id' : 'StopSign_OneLeg',
            'fillStyle' : 'rgba(0, 161, 203, 0.9)'
        },
        'StopSign_TwoLegs' : {
            'id' : 'StopSign_TwoLegs',
            'fillStyle' : 'rgba(0, 161, 203, 0.9)'
        },
        'StopSign_Column' : {
            'id' : 'StopSign_Column',
            'fillStyle' : 'rgba(0, 161, 203, 0.9)'
        },
        'Landmark_Shelter' : {
            'id' : 'Landmark_Shelter',
            'fillStyle' : 'rgba(215, 0, 96, 0.9)'
        },
        'Landmark_Bench' : {
            'id' : 'Landmark_Bench',
            // 'fillStyle' : 'rgba(229, 64, 40, 0.9)' // Kind of hard to distinguish from pink
            // 'fillStyle' : 'rgba(209, 209, 2, 0.9)' // Puke-y
            'fillStyle' : 'rgba(252, 217, 32, 0.9)'
        },
        'Landmark_TrashCan' : {
            'id' : 'Landmark_TrashCan',
            'fillStyle' : 'rgba(97, 174, 36, 0.9)'
        },
        'Landmark_MailboxAndNewsPaperBox' : {
            'id' : 'Landmark_MailboxAndNewsPaperBox',
            'fillStyle' : 'rgba(67, 113, 190, 0.9)'
        },
        'Landmark_OtherPole' : {
            'id' : 'Landmark_OtherPole',
            'fillStyle' : 'rgba(249, 79, 101, 0.9)'
        }
    }
}

//
//http://www.colourlovers.com/fashion/trends/street-fashion/7896/Floral_Much
function colorScheme3 () {
    return {
        'Walk' : {
            'id' : 'Walk',
            'fillStyle' : 'rgba(0, 0, 0, 0.9)'
        },
        'StopSign' : {
            'id' : 'StopSign',
            'fillStyle' : 'rgba(97, 210, 214, 0.9)'
        },
        'StopSign_OneLeg' : {
            'id' : 'StopSign_OneLeg',
            'fillStyle' : 'rgba(97, 210, 214, 0.9)'
        },
        'StopSign_TwoLegs' : {
            'id' : 'StopSign_TwoLegs',
            'fillStyle' : 'rgba(97, 210, 214, 0.9)'
        },
        'StopSign_Column' : {
            'id' : 'StopSign_Column',
            'fillStyle' : 'rgba(97, 210, 214, 0.9)'
        },
        'Landmark_Shelter' : {
            'id' : 'Landmark_Shelter',
            'fillStyle' : 'rgba(237, 20, 111, 0.9)'
        },
        'Landmark_Bench' : {
            'id' : 'Landmark_Bench',
            'fillStyle' : 'rgba(237, 222, 69, 0.9)'
        },
        'Landmark_TrashCan' : {
            'id' : 'Landmark_TrashCan',
            'fillStyle' : 'rgba(155, 240, 233, 0.9)'
        }
    }
}

//
// http://www.colourlovers.com/business/trends/branding/7884/Small_Garden_Logo
function colorScheme4 () {
    return {
        'Walk' : {
            'id' : 'Walk',
            'fillStyle' : 'rgba(0, 0, 0, 0.9)'
        },
        'StopSign' : {
            'id' : 'StopSign',
            'fillStyle' : 'rgba(252, 217, 32, 0.9)'
        },
        'StopSign_OneLeg' : {
            'id' : 'StopSign_OneLeg',
            'fillStyle' : 'rgba(252, 217, 32, 0.9)'
        },
        'StopSign_TwoLegs' : {
            'id' : 'StopSign_TwoLegs',
            'fillStyle' : 'rgba(252, 217, 32, 0.9)'
        },
        'StopSign_Column' : {
            'id' : 'StopSign_Column',
            'fillStyle' : 'rgba(252, 217, 32, 0.9)'
        },
        'Landmark_Shelter' : {
            'id' : 'Landmark_Shelter',
            'fillStyle' : 'rgba(229, 59, 81, 0.9)'
        },
        'Landmark_Bench' : {
            'id' : 'Landmark_Bench',
            'fillStyle' : 'rgba(60, 181, 181, 0.9)'
        },
        'Landmark_TrashCan' : {
            'id' : 'Landmark_TrashCan',
            'fillStyle' : 'rgba(236, 108, 32, 0.9)'
        }
    }
}

//
// http://www.colourlovers.com/business/trends/branding/7874/ROBAROV_WEBDESIGN
function colorScheme5 () {
    return {
        'Walk' : {
            'id' : 'Walk',
            'fillStyle' : 'rgba(0, 0, 0, 0.9)'
        },
        'StopSign' : {
            'id' : 'StopSign',
            'fillStyle' : 'rgba(208, 221, 43, 0.9)'
        },
        'StopSign_OneLeg' : {
            'id' : 'StopSign_OneLeg',
            'fillStyle' : 'rgba(208, 221, 43, 0.9)'
        },
        'StopSign_TwoLegs' : {
            'id' : 'StopSign_TwoLegs',
            'fillStyle' : 'rgba(208, 221, 43, 0.9)'
        },
        'StopSign_Column' : {
            'id' : 'StopSign_Column',
            'fillStyle' : 'rgba(208, 221, 43, 0.9)'
        },
        'Landmark_Shelter' : {
            'id' : 'Landmark_Shelter',
            'fillStyle' : 'rgba(152, 199, 61, 0.9)'
        },
        'Landmark_Bench' : {
            'id' : 'Landmark_Bench',
            'fillStyle' : 'rgba(0, 169, 224, 0.9)'
        },
        'Landmark_TrashCan' : {
            'id' : 'Landmark_TrashCan',
            'fillStyle' : 'rgba(103, 205, 220, 0.9)'
        }
    }
}

//
//http://www.colourlovers.com/print/trends/magazines/7834/Print_Design_Annual_2010
function colorScheme6 () {
    return {
        'Walk' : {
            'id' : 'Walk',
            'fillStyle' : 'rgba(0, 0, 0, 0.9)'
        },
        'StopSign' : {
            'id' : 'StopSign',
            'fillStyle' : 'rgba(210, 54, 125, 0.9)'
        },
        'StopSign_OneLeg' : {
            'id' : 'StopSign_OneLeg',
            'fillStyle' : 'rgba(210, 54, 125, 0.9)'
        },
        'StopSign_TwoLegs' : {
            'id' : 'StopSign_TwoLegs',
            'fillStyle' : 'rgba(210, 54, 125, 0.9)'
        },
        'StopSign_Column' : {
            'id' : 'StopSign_Column',
            'fillStyle' : 'rgba(210, 54, 125, 0.9)'
        },
        'Landmark_Shelter' : {
            'id' : 'Landmark_Shelter',
            'fillStyle' : 'rgba(188, 160, 0, 0.9)'
        },
        'Landmark_Bench' : {
            'id' : 'Landmark_Bench',
            'fillStyle' : 'rgba(207, 49, 4, 0.9)'
        },
        'Landmark_TrashCan' : {
            'id' : 'Landmark_TrashCan',
            'fillStyle' : 'rgba(1, 142, 74, 0.9)'
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
// Global variables
////////////////////////////////////////////////////////////////////////////////
// var canvasWidth = 720;
// var canvasHeight = 480;
// var svImageHeight = 6656;
// var svImageWidth = 13312;

// Image distortion coefficient. Need to figure out how to compute these.
// It seems like these constants do not depend on browsers... (tested on Chrome, Firefox, and Safari.)
// Distortion coefficient for a window size 640x360: var alpha_x = 5.2, alpha_y = -5.25;
// Distortion coefficient for a window size 720x480:

var svl = svl || {};
svl.canvasWidth = 720;
svl.canvasHeight = 480;
svl.svImageHeight = 6656;
svl.svImageWidth = 13312;
svl.alpha_x = 4.6;
svl.alpha_y = -4.65;
svl._labelCounter = 0;
svl.getLabelCounter = function () {
    return svl._labelCounter++;
};

/**
 * A canvas module
 * @param $ {object} jQuery object
 * @param param {object} Other parameters
 * @returns {{className: string, testCases: {}}}
 * @constructor
 * @memberof svl
 */
function Canvas ($, param) {
    var self = {
            className : 'Canvas',
            testCases: {}};

        // Mouse status and mouse event callback functions
    var mouseStatus = {
            currX:0,
            currY:0,
            prevX:0,
            prevY:0,
            leftDownX:0,
            leftDownY:0,
            leftUpX:0,
            leftUpY:0,
            isLeftDown: false,
            prevMouseDownTime : 0,
            prevMouseUpTime : 0
        };
        // Properties
    var properties = {
        evaluationMode: false,
        radiusThresh: 7,
        showDeleteMenuTimeOutToken : undefined,
        tempPointRadius: 5
    };

    var pointParameters = {
        'fillStyleInnerCircle' : 'rgba(0,0,0,1)', // labelColor.fillStyle,
        'lineWidthOuterCircle' : 2,
        'iconImagePath' : undefined, // iconImagePath,
        'radiusInnerCircle' : 5, //13,
        'radiusOuterCircle' : 6, //14,
        'strokeStyleOuterCircle' : 'rgba(255,255,255,1)',
        'storedInDatabase' : false
    };

    var status = {
        'currentLabel' : null,
        'disableLabelDelete' : false,
        'disableLabelEdit' : false,
        'disableLabeling' : false,
        'disableWalking' : false,
        'drawing' : false,
        'lockCurrentLabel' : false,
        'lockDisableLabelDelete' : false,
        'lockDisableLabelEdit' : false,
        'lockDisableLabeling' : false,
        svImageCoordinatesAdjusted: false,
        totalLabelCount: 0,
        'visibilityMenu' : 'hidden'
    };

    var lock = {
        showLabelTag: false
    };

    // Canvas context
    var canvasProperties = {'height':0, 'width':0};
    var ctx;

    var tempPath = [];

    // Right click menu
    var rightClickMenu = undefined;

    // Path elements
    var systemLabels = [];
    var labels = [];

    // jQuery doms
    var $canvas = $("#labelCanvas").length === 0 ? null : $("#labelCanvas");
    var $divLabelDrawingLayer = $("div#labelDrawingLayer").length === 0 ? null : $("div#labelDrawingLayer");
    var $divHolderLabelDeleteIcon = $("#Holder_LabelDeleteIcon").length === 0 ? null : $("#Holder_LabelDeleteIcon");
    var $divHolderLabelEditIcon = $("#Holder_LabelEditIcon").length === 0 ? null : $("#Holder_LabelEditIcon");
    var $labelDeleteIcon = $("#LabelDeleteIcon").length === 0 ? null : $("#LabelDeleteIcon");

    ////////////////////////////////////////
    // Private Functions
    ////////////////////////////////////////
    // Initialization
    function _init (param) {
        var el = document.getElementById("label-canvas");
        ctx = el.getContext('2d');
        canvasProperties.width = el.width;
        canvasProperties.height = el.height;

        if (param && 'evaluationMode' in param) {
            properties.evaluationMode = param.evaluationMode;
        }

        // Attach listeners to dom elements
        if ($divLabelDrawingLayer) {
          $divLabelDrawingLayer.bind('mousedown', drawingLayerMouseDown);
          $divLabelDrawingLayer.bind('mouseup', drawingLayerMouseUp);
          $divLabelDrawingLayer.bind('mousemove', drawingLayerMouseMove);
        }
        if ($labelDeleteIcon) {
          $labelDeleteIcon.bind("click", labelDeleteIconClick);
        }
    }

    function closeLabelPath() {
        svl.tracker.push('LabelingCanvas_FinishLabeling');
        var labelType = svl.ribbon.getStatus('selectedLabelType');
        var labelColor = getLabelColors()[labelType];
        var labelDescription = getLabelDescriptions()[svl.ribbon.getStatus('selectedLabelType')];
        var iconImagePath = getLabelIconImagePath()[labelDescription.id].iconImagePath;

        pointParameters.fillStyleInnerCircle = labelColor.fillStyle;
        pointParameters.iconImagePath = iconImagePath;

        var pathLen = tempPath.length;
        var points = [];
        var pov = svl.getPOV();
        var i;

        for (i = 0; i < pathLen; i++) {
            points.push(new Point(tempPath[i].x, tempPath[i].y, pov, pointParameters));
        }
        var path = new Path(points, {});
        var latlng = getPosition();
        var param = {
            canvasWidth: svl.canvasWidth,
            canvasHeight: svl.canvasHeight,
            canvasDistortionAlphaX: svl.alpha_x,
            canvasDistortionAlphaY: svl.alpha_y,
            labelId: svl.getLabelCounter(),
            labelType: labelDescription.id,
            labelDescription: labelDescription.text,
            labelFillStyle: labelColor.fillStyle,
            panoId: getPanoId(),
            panoramaLat: latlng.lat,
            panoramaLng: latlng.lng,
            panoramaHeading: pov.heading,
            panoramaPitch: pov.pitch,
            panoramaZoom: pov.zoom,
            svImageWidth: svl.svImageWidth,
            svImageHeight: svl.svImageHeight,
            svMode: 'html4'
        };
        if (("panorama" in svl) && ("getPhotographerPov" in svl.panorama)) {
            var photographerPov = svl.panorama.getPhotographerPov();
            param.photographerHeading = photographerPov.heading;
            param.photographerPitch = photographerPov.pitch;
        }

        var label = Label(path, param);
        if (label) {
            status.currentLabel = new Label(path, param)
            labels.push(status.currentLabel);
            svl.actionStack.push('addLabel', status.currentLabel);
        } else {
            throw "Failed to add a new label.";
        }

        // Initialize the tempPath
        tempPath = [];
        svl.ribbon.backToWalk();

        //
        // Review label correctness if this is a ground truth insertion task.
        if (("goldenInsertion" in svl) &&
            svl.goldenInsertion &&
            svl.goldenInsertion.isRevisingLabels()) {
            svl.goldenInsertion.reviewLabels();
        }
    }

    function drawingLayerMouseDown (e) {
        // This function is fired when at the time of mouse-down
        mouseStatus.isLeftDown = true;
        mouseStatus.leftDownX = mouseposition(e, this).x;
        mouseStatus.leftDownY = mouseposition(e, this).y;

        if (!properties.evaluationMode) {
            svl.tracker.push('LabelingCanvas_MouseDown', {x: mouseStatus.leftDownX, y: mouseStatus.leftDownY});
        }

        mouseStatus.prevMouseDownTime = new Date().getTime();
    }

    /**
     */
    function drawingLayerMouseUp (e) {
        // This function is fired when at the time of mouse-up
        var currTime;

        mouseStatus.isLeftDown = false;
        mouseStatus.leftUpX = mouseposition(e, this).x;
        mouseStatus.leftUpY = mouseposition(e, this).y;

        currTime = new Date().getTime();

        if (!properties.evaluationMode) {
            if (!status.disableLabeling &&
                currTime - mouseStatus.prevMouseUpTime > 300) {
                // currTime - mouseStatus.prevMouseDownTime < 400) {
                ///!isOn(mouseStatus.leftUpX, mouseStatus.leftUpY)) {
                // This part is executed by a single click
                var iconImagePath;
                var label;
                var latlng;
                var pointParameters;
                var labelColor;
                var labelDescription;

                if (svl.ribbon) {
                    // labelColor = getLabelColors()[svl.ribbon.getStatus('selectedLabelType')];
                    var labelType = svl.ribbon.getStatus('selectedLabelType');
                    var labelDescriptions = getLabelDescriptions();
                    labelDescription = labelDescriptions[labelType];
                    // iconImagePath = getLabelIconImagePath()[labelDescription.id].iconImagePath;

                    // Define point parameters to draw

                    if (!status.drawing) {
                        // Start drawing a path if a user hasn't started to do so.
                        status.drawing = true;
                        if ('tracker' in svl && svl.tracker) {
                            svl.tracker.push('LabelingCanvas_StartLabeling');
                        }

                        var point = {x: mouseStatus.leftUpX, y: mouseStatus.leftUpY};
                        tempPath.push(point);
                    } else {
                        // Close the current path if there are more than 2 points in the tempPath and
                        // the user clicks on a point near the initial point.
                        var closed = false;
                        var pathLen = tempPath.length;
                        if (pathLen > 2) {
                            var r = Math.sqrt(Math.pow((tempPath[0].x - mouseStatus.leftUpX), 2) + Math.pow((tempPath[0].y - mouseStatus.leftUpY), 2));
                            if (r < properties.radiusThresh) {
                                closed = true;
                                status.drawing = false;
                                closeLabelPath();
                            }
                        }

                        //
                        // Otherwise add a new point
                        if (!closed) {
                            var point = {x: mouseStatus.leftUpX, y: mouseStatus.leftUpY};
                            tempPath.push(point);
                        }
                    }
                } else {
                    throw self.className + ' drawingLayerMouseUp(): ribbon not defined.';
                }

                self.clear();
                self.setVisibilityBasedOnLocation('visible', getPanoId());
                self.render2();
            } else if (currTime - mouseStatus.prevMouseUpTime < 400) {
                // This part is executed for a double click event
                // If the current status.drawing = true, then close the current path.
                var pathLen = tempPath.length;
                if (status.drawing && pathLen > 2) {
                    status.drawing = false;

                    closeLabelPath();
                    self.clear();
                    self.setVisibilityBasedOnLocation('visible', getPanoId());
                    self.render2();
                }
            }
        } else {
            // If it is an evaluation mode, do... (nothing)
        }

        svl.tracker.push('LabelingCanvas_MouseUp', {x: mouseStatus.leftUpX, y: mouseStatus.leftUpY});
        mouseStatus.prevMouseUpTime = new Date().getTime();
        mouseStatus.prevMouseDownTime = 0;
    }

    /**
     */
    function drawingLayerMouseMove (e) {
        // This function is fired when mouse cursor moves
        // over the drawing layer.
        var mousePosition = mouseposition(e, this);
        mouseStatus.currX = mousePosition.x;
        mouseStatus.currY = mousePosition.y;

        // Change a cursor according to the label type.
        // $(this).css('cursor', )
        if ('ribbon' in svl) {
            var cursorImagePaths = svl.misc.getLabelCursorImagePath();
            var labelType = svl.ribbon.getStatus('mode');
            if (labelType) {
                var cursorImagePath = cursorImagePaths[labelType].cursorImagePath;
                var cursorUrl = "url(" + cursorImagePath + ") 6 25, auto";

                if (rightClickMenu && rightClickMenu.isAnyOpen()) {
                    cursorUrl = 'default';
                }

                $(this).css('cursor', cursorUrl);
            }
        } else {
            throw self.className + ': Import the RibbonMenu.js and instantiate it!';
        }


        if (!status.drawing) {
            var ret = isOn(mouseStatus.currX, mouseStatus.currY);
            if (ret && ret.className === 'Path') {
                self.showLabelTag(status.currentLabel);
                ret.renderBoundingBox(ctx);
            } else {
                self.showLabelTag(undefined);
            }
        }
        self.clear();
        self.render2();
        mouseStatus.prevX = mouseposition(e, this).x;
        mouseStatus.prevY = mouseposition(e, this).y;
    }

    /**
     */
    function imageCoordinates2String (coordinates) {
        if (!(coordinates instanceof Array)) {
            throw self.className + '.imageCoordinates2String() expects Array as an input';
        }
        if (coordinates.length === 0) {
            throw self.className + '.imageCoordinates2String(): Empty array';
        }
        var ret = '';
        var i ;
        var len = coordinates.length;

        for (i = 0; i < len; i += 1) {
            ret += parseInt(coordinates[i].x) + ' ' + parseInt(coordinates[i].y) + ' ';
        }

        return ret;
    }

    /**
      *
      */
    function labelDeleteIconClick () {
        // Deletes the current label
        if (!status.disableLabelDelete) {
            svl.tracker.push('Click_LabelDelete');
            var currLabel = self.getCurrentLabel();
            if (!currLabel) {
                //
                // Sometimes (especially during ground truth insertion if you force a delete icon to show up all the time),
                // currLabel would not be set properly. In such a case, find a label underneath the delete icon.
                var x = $divHolderLabelDeleteIcon.css('left');
                var y = $divHolderLabelDeleteIcon.css('top');
                x = x.replace("px", "");
                y = y.replace("px", "");
                x = parseInt(x, 10) + 5;
                y = parseInt(y, 10) + 5;
                var item = isOn(x, y);
                if (item && item.className === "Point") {
                    var path = item.belongsTo();
                    currLabel = path.belongsTo();
                } else if (item && item.className === "Label") {
                    currLabel = item;
                } else if (item && item.className === "Path") {
                    currLabel = item.belongsTo();
                }
            }

            if (currLabel) {
                self.removeLabel(currLabel);
                svl.actionStack.push('deleteLabel', self.getCurrentLabel());
                $divHolderLabelDeleteIcon.css('visibility', 'hidden');
                // $divHolderLabelEditIcon.css('visibility', 'hidden');


                //
                // If showLabelTag is blocked by GoldenInsertion (or by any other object), unlock it as soon as
                // a label is deleted.
                if (lock.showLabelTag) {
                    self.unlockShowLabelTag();
                }
            }
        }
    }

    /**
     *
     */
    function renderTempPath() {
        // This method renders a line from the last point in tempPath to current mouse point.

        if (!svl.ribbon) {
            // return if the ribbon menu is not correctly loaded.
            return false;
        }

        var i = 0;
        var pathLen = tempPath.length;
        var labelColor = getLabelColors()[svl.ribbon.getStatus('selectedLabelType')];

        var pointFill = labelColor.fillStyle;
        pointFill = svl.util.color.changeAlphaRGBA(pointFill, 0.5);


        // Draw the first line.
        ctx.strokeStyle = 'rgba(255,255,255,1)';
        ctx.lineWidth = 2;
        if (pathLen > 1) {
            var curr = tempPath[1];
            var prev = tempPath[0];
            var r = Math.sqrt(Math.pow((tempPath[0].x - mouseStatus.currX), 2) + Math.pow((tempPath[0].y - mouseStatus.currY), 2));

            // Change the circle radius of the first point depending on the distance between a mouse cursor and the point coordinate.
            if (r < properties.radiusThresh && pathLen > 2) {
                svl.util.shape.lineWithRoundHead(ctx, prev.x, prev.y, 2 * properties.tempPointRadius, curr.x, curr.y, properties.tempPointRadius, 'both', 'rgba(255,255,255,1)', pointFill, 'none', 'rgba(255,255,255,1)', pointFill);
            } else {
                svl.util.shape.lineWithRoundHead(ctx, prev.x, prev.y, properties.tempPointRadius, curr.x, curr.y, properties.tempPointRadius, 'both', 'rgba(255,255,255,1)', pointFill, 'none', 'rgba(255,255,255,1)', pointFill);
            }
        }

        // Draw the lines in between
        for (i = 2; i < pathLen; i++) {
            var curr = tempPath[i];
            var prev = tempPath[i-1];
            svl.util.shape.lineWithRoundHead(ctx, prev.x, prev.y, 5, curr.x, curr.y, 5, 'both', 'rgba(255,255,255,1)', pointFill, 'none', 'rgba(255,255,255,1)', pointFill);
        }

        if (r < properties.radiusThresh && pathLen > 2) {
            svl.util.shape.lineWithRoundHead(ctx, tempPath[pathLen-1].x, tempPath[pathLen-1].y, properties.tempPointRadius, tempPath[0].x, tempPath[0].y, 2 * properties.tempPointRadius, 'both', 'rgba(255,255,255,1)', pointFill, 'none', 'rgba(255,255,255,1)', pointFill);
        } else {
            svl.util.shape.lineWithRoundHead(ctx, tempPath[pathLen-1].x, tempPath[pathLen-1].y, properties.tempPointRadius, mouseStatus.currX, mouseStatus.currY, properties.tempPointRadius, 'both', 'rgba(255,255,255,1)', pointFill, 'stroke', 'rgba(255,255,255,1)', pointFill);
        }
        return;
    }

    ////////////////////////////////////////
    // Public methods
    ////////////////////////////////////////
    /**
     * Cancel drawing while use is drawing a label
     * @method
     */
    function cancelDrawing () {
        // This method clears a tempPath and cancels drawing. This method is called by Keyboard when esc is pressed.
        if ('tracker' in svl && svl.tracker) {
            svl.tracker.push("LabelingCanvas_CancelLabeling");
        }

        tempPath = [];
        status.drawing = false;
        self.clear().render2();
        return this;
    }

    /**
     * Clear what's on the canvas.
     * @method
     */
    function clear () {
        // Clears the canvas
        if (ctx) {
          ctx.clearRect(0, 0, canvasProperties.width, canvasProperties.height);
        } else {
          console.warn('The ctx is not set.')
        }
        return this;
    }

    /**
     *
     * @method
     */
    function disableLabelDelete () {
        if (!status.lockDisableLabelDelete) {
            status.disableLabelDelete = true;
            return this;
        }
        return false;
    }

    /**
     * @method
     * @return {boolean}
     */
    function disableLabelEdit () {
       if (!status.lockDisableLabelEdit) {
           status.disableLabelEdit = true;
           return this;
       }
       return false;
    }

    /**
     * @method
     */
    function disableLabeling () {
        // Check right-click-menu visibility
        // If any of menu is visible, disable labeling
        if (!status.lockDisableLabeling) {
            status.disableLabeling = true;
            /*
            var menuOpen = rightClickMenu.isAnyOpen();
            if (menuOpen) {
                status.disableLabeling = true;
            } else {
                status.disableLabeling = false;
            }
            */
            return this;
        }
        return false;
    }

    /**
     * @method
     */
    function enableLabelDelete () {
        if (!status.lockDisableLabelDelete) {
            status.disableLabelDelete = false;
            return this;
        }
        return false;
    }

    /**
     * @method
     */
    function enableLabelEdit () {
        if (!status.lockDisableLabelEdit) {
            status.disableLabelEdit = false;
            return this;
        }
        return false;
    }

    /**
     * @method
     */
    function enableLabeling () {
        // Check right-click-menu visiibliey
        // If all of the right click menu are hidden,
        // enable labeling
        if (!status.lockDisableLabeling) {
            status.disableLabeling = false;
            return this;
        }
        return false;
    }

    /**
     * @method
     */
    function getCurrentLabel () {
        return status.currentLabel;
    }

    /**
     * @method
     */
    function getLabels (target) {
        // This method returns a deepcopy of labels stored in this canvas.
        if (!target) {
            target = 'user';
        }

        if (target === 'system') {
            return self.getSystemLabels(false);
            // return $.extend(true, [], systemLabels);
        } else {
            return self.getUserLabels(false);
            // $.extend(true, [], labels);
        }
    }

    /**
     * @method
     */
    function getLock (key) {
      return lock[key];
    }

    /**
     * @method
     */
    function getNumLabels () {
        var len = labels.length;
        var i;
        var total = 0;
        for (i =0; i < len; i++) {
            if (!labels[i].isDeleted() && labels[i].isVisible()) {
                total++;
            }
        }
        return total;
    }

    /**
     * @method
     */
    function getRightClickMenu () {
        return rightClickMenu;
    }

    /**
     * @method
     */
    function getStatus (key) {
      if (!(key in status)) {
        console.warn("You have passed an invalid key for status.")
      }
        return status[key];
    }

    /**
     * @method
     */
    function getSystemLabels (reference) {
        // This method returns system labels. If refrence is true, then it returns reference to the labels.
        // Otherwise it returns deepcopy of labels.
        if (!reference) {
            reference = false;
        }

        if (reference) {
            return systemLabels;
        } else {
            return $.extend(true, [], systemLabels);
        }
    }

    /**
     * @method
     */
    function getUserLabelCount () {
        var labels = self.getUserLabels();
        labels = labels.filter(function (label) {
            return !label.isDeleted() && label.isVisible();
        })
        return labels.length;
    }

    /**
     * @method
     */
    function getUserLabels (reference) {
        // This method returns user labels. If reference is true, then it returns reference to the labels.
        // Otherwise it returns deepcopy of labels.
        if (!reference) {
            reference = false;
        }

        if (reference) {
            return labels;
        } else {
            return $.extend(true, [], labels);
        }
    }

    /**
     * @method
     */
    function hideDeleteLabel (x, y) {
        rightClickMenu.hideDeleteLabel();
        return this;
    }

    function hideRightClickMenu () {
        rightClickMenu.hideBusStopType();
        rightClickMenu.hideBusStopPosition();
        return this;
    }

    /**
     * @method
     */
    function insertLabel (labelPoints, target) {
        // This method takes a label data (i.e., a set of point coordinates, label types, etc) and
        // and insert it into the labels array so the Canvas will render it
        if (!target) {
            target = 'user';
        }

        var i;
        var labelColors = svl.misc.getLabelColors();
        var iconImagePaths = svl.misc.getIconImagePaths();
        var length = labelPoints.length;
        var pointData;
        var pov;
        var point;
        var points = [];

        for (i = 0; i < length; i += 1) {
            pointData = labelPoints[i];
            pov = {
                heading: pointData.originalHeading,
                pitch: pointData.originalPitch,
                zoom: pointData.originalZoom
            };
            point = new Point();

            if ('PhotographerHeading' in pointData && pointData.PhotographerHeading &&
                'PhotographerPitch' in pointData && pointData.PhotographerPitch) {
                point.setPhotographerPov(parseFloat(pointData.PhotographerHeading), parseFloat(pointData.PhotographerPitch));
            }

            point.resetSVImageCoordinate({
                x: parseInt(pointData.svImageX, 10),
                y: parseInt(pointData.svImageY, 10)
            });
            point.resetProperties({
                fillStyleInnerCircle : labelColors[pointData.LabelType].fillStyle,
                lineWidthOuterCircle : 2,
                iconImagePath : iconImagePaths[pointData.LabelType].iconImagePath,
                originalCanvasCoordinate: pointData.originalCanvasCoordinate,
                originalHeading: pointData.originalHeading,
                originalPitch: pointData.originalPitch,
                originalZoom: pointData.originalZoom,
                pov: pov,
                radiusInnerCircle : 5, // 13,
                radiusOuterCircle : 6, // 14,
                strokeStyleOuterCircle : 'rgba(255,255,255,1)',
                storedInDatabase : false
            });

            points.push(point)
        }

        var param = {};
        var path;
        var labelDescriptions = svl.misc.getLabelDescriptions();

        path = new Path(points);

        param.canvasWidth = svl.canvasWidth;
        param.canvasHeight = svl.canvasHeight;
        param.canvasDistortionAlphaX = svl.alpha_x;
        param.canvasDistortionAlphaY = svl.alpha_y;
        param.labelId = labelPoints[0].LabelId;
        param.labelerId = labelPoints[0].AmazonTurkerId
        param.labelType = labelPoints[0].LabelType;
        param.labelDescription = labelDescriptions[param.labelType].text;
        param.labelFillStyle = labelColors[param.labelType].fillStyle;
        param.panoId = labelPoints[0].LabelGSVPanoramaId;
        param.panoramaLat = labelPoints[0].Lat;
        param.panoramaLng = labelPoints[0].Lng;
        param.panoramaHeading = labelPoints[0].heading;
        param.panoramaPitch = labelPoints[0].pitch;
        param.panoramaZoom = labelPoints[0].zoom;

        param.svImageWidth = svl.svImageWidth;
        param.svImageHeight = svl.svImageHeight;
        param.svMode = 'html4';

        if (("PhotographerPitch" in labelPoints[0]) && ("PhotographerHeading" in labelPoints[0])) {
            param.photographerHeading = labelPoints[0].PhotographerHeading;
            param.photographerPitch = labelPoints[0].PhotographerPitch;
        }

        var newLabel = new Label(path, param);

        if (target === 'system') {
            systemLabels.push(newLabel);
        } else {
            labels.push(newLabel);
        }
    }


    /**
     * @method
     * @return {boolean}
     */
    function isDrawing () {
        // This method returns the current status drawing.
        return status.drawing;
    }

    /**
    *
    * @method
    */
    function isOn (x, y) {
        // This function takes cursor coordinates x and y on the canvas.
        // Then returns an object right below the cursor.
        // If a cursor is not on anything, return false.
        var i, lenLabels, ret;
        lenLabels = labels.length;

        ret = false;
        for (i = 0; i < lenLabels; i += 1) {
            // Check labels, paths, and points to see if they are
            // under a mouse cursor
            ret = labels[i].isOn(x, y);
            if (ret) {
                status.currentLabel = labels[i];
                return ret;
            }
        }
        return false;
    }

    /**
     * @method
     */
    function lockCurrentLabel () {
        status.lockCurrentLabel = true;;
        return this;
    }

    /**
     * @method
     */
    function lockDisableLabelDelete () {
        status.lockDisableLabelDelete = true;;
        return this;
    };

    /**
     * @method
     */
    function lockDisableLabelEdit () {
        status.lockDisableLabelEdit = true;
        return this;
    }

    /**
     * @method
     */
    function lockDisableLabeling () {
        status.lockDisableLabeling = true;
        return this;
    }

    /**
     * @method
     */
    function lockShowLabelTag () {
        // This method locks showLabelTag
        lock.showLabelTag = true;
        return this;
    }

    /**
     * @method
     */
    function pushLabel (label) {
        status.currentLabel = label;
        labels.push(label);
        if (svl.actionStack) {
            svl.actionStack.push('addLabel', label);
        }
        return this;
    }

    /**
     * This method removes all the labels stored in the labels array.
     * @method
     */
    function removeAllLabels () {
        // This method removes all the labels.
        // This method is mainly for testing.
        labels = [];
        return this;
    }

    /**
     *
     * @method
     */
    function removeLabel (label) {
        // This function removes a passed label and its child path and points
        // var labelIndex = labels.indexOf(label);

        if (!label) {
            return false;
        }
        svl.tracker.push('RemoveLabel', {labelId: label.getProperty('labelId')});

        label.setStatus('deleted', true);
        label.setStatus('visibility', 'hidden');
        // I do not want to actually remove this label, but set the flag as
        // deleted
        // label.removePath();
        // labels.remove(labelIndex);

        //
        // Review label correctness if this is a ground truth insertion task.
        if (("goldenInsertion" in svl) &&
            svl.goldenInsertion &&
            svl.goldenInsertion.isRevisingLabels()) {
            svl.goldenInsertion.reviewLabels();
        }

        self.clear();
        self.render2();
        return this;
    }

    /**
     * @method
     */
    function render () {
        // KH. Deprecated.
        // Renders labels and pathes (as well as points in each path.)
        var pov = svl.getPOV();
        // renderLabels(pov, ctx);
        return this;
    }

    /**
     * @method
     */
    function render2 () {
      if (!ctx) {
        // JavaScript warning
        // http://stackoverflow.com/questions/5188224/throw-new-warning-in-javascript
        console.warn('The ctx is not set.')
        return this;
      }
        var i;
        var label;
        var lenLabels;
        var labelCount = {
            Landmark_Bench : 0,
            Landmark_Shelter: 0,
            Landmark_TrashCan: 0,
            Landmark_MailboxAndNewsPaperBox: 0,
            Landmark_OtherPole: 0,
            StopSign : 0,
            CurbRamp: 0,
            NoCurbRamp: 0
        };
        status.totalLabelCount = 0;
        var pov = svl.getPOV();


        //
        // The image coordinates of the points in system labels shift as the projection parameters (i.e., heading and pitch) that
        // you can get from Street View API change. So adjust the image coordinate
        // Note that this adjustment happens only once
        if (!status.svImageCoordinatesAdjusted) {
            var currentPhotographerPov = svl.panorama.getPhotographerPov();
            if (currentPhotographerPov && 'heading' in currentPhotographerPov && 'pitch' in currentPhotographerPov) {
                var j;
                //
                // Adjust user labels
                lenLabels = labels.length;
                for (i = 0; i < lenLabels; i += 1) {
                    // Check if the label comes from current SV panorama
                    label = labels[i];
                    var points = label.getPoints(true)
                    var pointsLen = points.length;

                    for (j = 0; j < pointsLen; j++) {
                        var pointData = points[j].getProperties();
                        var svImageCoordinate = points[j].getGSVImageCoordinate();
                        if ('photographerHeading' in pointData && pointData.photographerHeading) {
                            var deltaHeading = currentPhotographerPov.heading - pointData.photographerHeading;
                            var deltaPitch = currentPhotographerPov.pitch - pointData.photographerPitch;
                            var x = (svImageCoordinate.x + (deltaHeading / 360) * svl.svImageWidth + svl.svImageWidth) % svl.svImageWidth;
                            var y = svImageCoordinate.y + (deltaPitch / 90) * svl.svImageHeight;
                            points[j].resetSVImageCoordinate({x: x, y: y})
                        }
                    }
                }

                //
                // Adjust system labels
                lenLabels = systemLabels.length;
                for (i = 0; i < lenLabels; i += 1) {
                    // Check if the label comes from current SV panorama
                    label = systemLabels[i];
                    var points = label.getPoints(true)
                    var pointsLen = points.length;

                    for (j = 0; j < pointsLen; j++) {
                        var pointData = points[j].getProperties();
                        var svImageCoordinate = points[j].getGSVImageCoordinate();
                        if ('photographerHeading' in pointData && pointData.photographerHeading) {
                            var deltaHeading = currentPhotographerPov.heading - pointData.photographerHeading;
                            var deltaPitch = currentPhotographerPov.pitch - pointData.photographerPitch;
                            var x = (svImageCoordinate.x + (deltaHeading / 360) * svl.svImageWidth + svl.svImageWidth) % svl.svImageWidth;
                            var y = svImageCoordinate.y + (deltaPitch / 180) * svl.svImageHeight;
                            points[j].resetSVImageCoordinate({x: x, y: y})
                        }
                    }
                }
                status.svImageCoordinatesAdjusted = true;
            }
        }

        //
        // Render user labels
        lenLabels = labels.length;
        for (i = 0; i < lenLabels; i += 1) {
            // Check if the label comes from current SV panorama
            label = labels[i];

            // If it is an evaluation mode, let a label not render a bounding box and a delete button.
            if (properties.evaluationMode) {
                label.render(ctx, pov, true);
            } else {
                label.render(ctx, pov);
            }

            if (label.isVisible() && !label.isDeleted()) {
                labelCount[label.getLabelType()] += 1;
                status.totalLabelCount += 1;
            }
        }

        //
        // Render system labels
        lenLabels = systemLabels.length;
        for (i = 0; i < lenLabels; i += 1) {
            // Check if the label comes from current SV panorama
            label = systemLabels[i];

            // If it is an evaluation mode, let a label not render a bounding box and a delete button.
            if (properties.evaluationMode) {
                label.render(ctx, pov, true);
            } else {
                label.render(ctx, pov);
            }
        }

        //
        // Draw a temporary path from the last point to where a mouse cursor is.
        if (status.drawing) {
            renderTempPath();
        }

        //
        // Check if the user audited all the angles or not.
        if ('form' in svl) {
            svl.form.checkSubmittable();
        }

        if ('progressPov' in svl) {
            svl.progressPov.updateCompletionRate();
        }

        //
        // Update the landmark counts on the right side of the interface.
        if (svl.labeledLandmarkFeedback) {
            svl.labeledLandmarkFeedback.setLabelCount(labelCount);
        }

        //
        // Update the opacity of undo and redo buttons.
        if (svl.actionStack) {
            svl.actionStack.updateOpacity();
        }

        //
        // Update the opacity of Zoom In and Zoom Out buttons.
        if (svl.zoomControl) {
            svl.zoomControl.updateOpacity();
        }

        //
        // This like of code checks if the golden insertion code is running or not.
        if ('goldenInsertion' in svl && svl.goldenInsertion) {
            svl.goldenInsertion.renderMessage();
        }
        return this;
    }

    /**
     * @method
     */
    function renderBoundingBox (path) {
        path.renderBoundingBox(ctx);
        return this;
    }

    /**
     * @method
     */
    function setCurrentLabel (label) {
        if (!status.lockCurrentLabel) {
            status.currentLabel = label;
            return this;
        }
        return false;
    }

    /**
     * @method
     */
    function setStatus (key, value) {
        // This function is allows other objects to access status
        // of this object
        if (key in status) {
            if (key === 'disableLabeling') {
                if (typeof value === 'boolean') {
                    if (value) {
                        self.disableLabeling();
                    } else {
                        self.enableLabeling();
                    }
                    return this;
                } else {
                    return false;
                }
            } else if (key === 'disableMenuClose') {
                if (typeof value === 'boolean') {
                    if (value) {
                        self.disableMenuClose();
                    } else {
                        self.enableMenuClose();
                    }
                    return this;
                } else {
                    return false;
                }
            } else if (key === 'disableLabelDelete') {
                if (value === true) {
                    self.disableLabelDelete();
                } else if (value === false) {
                    self.enableLabelDelete();
                }
            } else {
                status[key] = value;
            }
        } else {
            throw self.className + ": Illegal status name.";
        }
    }

    /**
     * @method
     */
    function showLabelTag (label) {
        // This function sets the passed label's tagVisiblity to 'visible' and all the others to
        // 'hidden'.
        if (!lock.showLabelTag) {
            var i;
            var labelLen;
            var isAnyVisible = false;
            labelLen = labels.length;
            if (label) {
                for (i = 0; i < labelLen; i += 1) {
                    //if (labels[i] === label) {
                    if (labels[i].getLabelId() === label.getLabelId()) {
                        labels[i].setTagVisibility('visible');
                        isAnyVisible = true;
                    } else {
                        labels[i].setTagVisibility('hidden');
                        labels[i].resetTagCoordinate();
                    }
                }
            } else {
                for (i = 0; i < labelLen; i++) {
                    labels[i].setTagVisibility('hidden');
                    labels[i].resetTagCoordinate();
                }
                $divHolderLabelDeleteIcon.css('visibility', 'hidden');
            }
            // If any of the tags is visible, show a deleting icon on it.
            if (!isAnyVisible) {
                $divHolderLabelDeleteIcon.css('visibility', 'hidden');
            }
            self.clear().render2();
            return this;
        }
    }

    /**
     * @method
     */
    function setTagVisibility (labelIn) {
        // Deprecated
        return self.showLabelTag(labelIn);
    }

    /**
     * @method
     */
    function setVisibility (visibility) {
        var i = 0;
        var labelLen = 0;

        labelLen = labels.length;
        for (i = 0; i < labelLen; i += 1) {
            labels[i].unlockVisibility().setVisibility('visible');
        }
        return this;
    }

    /**
     * @method
     */
    function setVisibilityBasedOnLocation (visibility) {
        var i = 0;
        var labelLen = 0;

        labelLen = labels.length;
        for (i = 0; i < labelLen; i += 1) {
            labels[i].setVisibilityBasedOnLocation(visibility, getPanoId());
        }
        return this;
    }

    /**
     * @method
     */
    function setVisibilityBasedOnLabelerId (visibility, LabelerIds, included) {
        // This function should not be used in labeling interfaces, but only in evaluation interfaces.
        // Set labels that are not in LabelerIds hidden
        var i = 0;
        var labelLen = 0;

        labelLen = labels.length;
        for (i = 0; i < labelLen; i += 1) {
            labels[i].setVisibilityBasedOnLabelerId(visibility, LabelerIds, included);
        }
        return this;
    }

    /**
     * @method
     */
    function setVisibilityBasedOnLabelerIdAndLabelTypes (visibility, table, included) {
        var i = 0;
        var labelLen = 0;

        labelLen = labels.length;
        for (i = 0; i < labelLen; i += 1) {
            labels[i].setVisibilityBasedOnLabelerIdAndLabelTypes(visibility, table, included);
        }
        return this;
    }

    /**
     * @method
     */
    function showDeleteLabel (x, y) {
        rightClickMenu.showDeleteLabel(x, y);
    }

    /**
     * @method
     */
    function unlockCurrentLabel () {
        status.lockCurrentLabel = false;
        return this;
    }

    /**
     * @method
     */
    function unlockDisableLabelDelete () {
        status.lockDisableLabelDelete = false;
        return this;
    }

    /**
     * @method
     */
    function unlockDisableLabelEdit () {
        status.lockDisableLabelEdit = false;
        return this;
    }

    /**
     * @method
     */
    function unlockDisableLabeling () {
        status.lockDisableLabeling = false;
        return this;
    }

    /**
     * @method
     */
    function unlockShowLabelTag () {
        // This method locks showLabelTag
        lock.showLabelTag = false;
        return this;
    }

    // Initialization
    _init(param);

    // Put public methods to self and return them.
    self.cancelDrawing = cancelDrawing;
    self.clear = clear;
    self.disableLabelDelete = disableLabelDelete;
    self.disableLabelEdit = disableLabelEdit;
    self.disableLabeling = disableLabeling;
    self.enableLabelDelete = enableLabelDelete;
    self.enableLabelEdit = enableLabelEdit;
    self.enableLabeling = enableLabeling;
    self.getCurrentLabel = getCurrentLabel
    self.getLabels = getLabels;
    self.getLock = getLock;
    self.getNumLabels = getNumLabels;
    self.getRightClickMenu = getRightClickMenu;
    self.getStatus = getStatus;
    self.getSystemLabels = getSystemLabels;
    self.getUserLabelCount = getUserLabelCount;
    self.getUserLabels = getUserLabels;
    self.hideDeleteLabel = hideDeleteLabel;
    self.hideRightClickMenu = hideRightClickMenu;
    self.insertLabel = insertLabel;
    self.isDrawing = isDrawing;
    self.isOn = isOn;
    self.lockCurrentLabel = lockCurrentLabel;
    self.lockDisableLabelDelete = lockDisableLabelDelete;
    self.lockDisableLabelEdit = lockDisableLabelEdit;
    self.lockDisableLabeling = lockDisableLabeling;
    self.lockShowLabelTag = lockShowLabelTag;
    self.pushLabel = pushLabel;
    self.removeAllLabels = removeAllLabels;
    self.removeLabel = removeLabel;
    self.render2 = render2;
    self.renderBoundingBox = renderBoundingBox;
    self.setCurrentLabel = setCurrentLabel;
    self.setStatus = setStatus;
    self.showLabelTag = showLabelTag;
    self.setTagVisibility = setTagVisibility;
    self.setVisibility = setVisibility;
    self.setVisibilityBasedOnLocation = setVisibilityBasedOnLocation;
    self.setVisibilityBasedOnLabelerId = setVisibilityBasedOnLabelerId;
    self.setVisibilityBasedOnLabelerIdAndLabelTypes = setVisibilityBasedOnLabelerIdAndLabelTypes;
    self.showDeleteLabel = showDeleteLabel;
    self.unlockCurrentLabel = unlockCurrentLabel;
    self.unlockDisableLabelDelete = unlockDisableLabelDelete;
    self.unlockDisableLabelEdit = unlockDisableLabelEdit;
    self.unlockDisableLabeling = unlockDisableLabeling;
    self.unlockShowLabelTag = unlockShowLabelTag;

    return self;
}

var svl = svl || {};

/**
 * @memberof svl
 * @constructor
 */
function ExampleWindow ($, params) {
    var api = {
            className : 'ExampleWindow'
        };
    var properties = {
            exampleCategories : ['StopSign_OneLeg', 'StopSign_TwoLegs', 'StopSign_Column', 'NextToCurb', 'AwayFromCurb']
        };
    var status = {
            open : false
        };

        // jQuery elements
    var $divHolderExampleWindow;
    var $divHolderCloseButton;
    var $divExampleOneLegStopSign;
    var $divExampleTwoLegStopSign;
    var $divExampleColumnStopSign;
    var $divExampleNextToCurb;
    var $divExampleAwayFromCurb;
    var exampleWindows = {};

    ////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////
    function init (params) {
        // Initialize jQuery elements
        $divHolderExampleWindow = $(params.domIds.holder);
        $divHolderCloseButton = $(params.domIds.closeButtonHolder);
        $divExampleOneLegStopSign = $(params.domIds.StopSign_OneLeg);
        $divExampleTwoLegStopSign = $(params.domIds.StopSign_TwoLegs);
        $divExampleColumnStopSign = $(params.domIds.StopSign_Column);
        $divExampleNextToCurb = $(params.domIds.NextToCurb);
        $divExampleAwayFromCurb = $(params.domIds.AwayFromCurb);

        exampleWindows = {
            StopSign_OneLeg : $divExampleOneLegStopSign,
            StopSign_TwoLegs : $divExampleTwoLegStopSign,
            StopSign_Column : $divExampleColumnStopSign,
            NextToCurb : $divExampleNextToCurb,
            AwayFromCurb : $divExampleAwayFromCurb
        };

        // Add listeners
        $divHolderCloseButton.bind({
            click : api.close,
            mouseenter : closeButtonMouseEnter,
            mouseleave : closeButtonMouseLeave
        });
    }


    function closeButtonMouseEnter () {
        // A callback function that is invoked when a mouse cursor enters the X sign.
        // This function changes a cursor to a pointer.
        $(this).css({
            cursor : 'pointer'
        });
        return this;
    }


    function closeButtonMouseLeave () {
        // A callback function that is invoked when a mouse cursor leaves the X sign.
        // This function changes a cursor to a 'default'.
        $(this).css({
            cursor : 'default'
        });
        return this;
    }


    ////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////
    api.close = function () {
        // Hide the example window.
        status.open = false;
        $divHolderExampleWindow.css({
            visibility : 'hidden'
        });
        $.each(exampleWindows, function (i, v) {
            v.css({visibility:'hidden'});
        });
        return this;
    };


    api.isOpen = function () {
        return status.open;
    };


    api.show = function (exampleCategory) {
        // Show the example window.
        // Return false if the passed category is not know.
        if (properties.exampleCategories.indexOf(exampleCategory) === -1) {
            return false;
        }

        status.open = true;
        $divHolderExampleWindow.css({
            visibility : 'visible'
        });

        $.each(exampleWindows, function (i, v) {
            console.log(i);
            if (i === exampleCategory) {
                v.css({visibility:'visible'});
            } else {
                v.css({visibility:'hidden'});
            }
        });

        return this;
    };

    ////////////////////////////////////////
    // Initialization
    ////////////////////////////////////////
    init(params);
    return api;
}

var svl = svl || {};

/**
 * A form module
 * @param $ {object} jQuery object
 * @param params {object} Other parameters
 * @returns {{className: string}}
 * @constructor
 * @memberof svl
 */
function Form ($, params) {
    var self = {
        'className' : 'Form'
    };

    var properties = {
        commentFieldMessage: undefined,
        isAMTTask : false,
        isPreviewMode : false,
        previousLabelingTaskId: undefined,
        dataStoreUrl : undefined,
        onboarding : false,
        taskRemaining : 0,
        taskDescription : undefined,
        taskPanoramaId: undefined,
        hitId : undefined,
        assignmentId: undefined,
        turkerId: undefined,
        userExperiment: false
    };
    var status = {
        disabledButtonMessageVisibility: 'hidden',
        disableSkipButton : false,
        disableSubmit : false,
        radioValue: undefined,
        skipReasonDescription: undefined,
        submitType: undefined,
        taskDifficulty: undefined,
        taskDifficultyComment: undefined
    };
    var lock = {
        disableSkipButton : false,
        disableSubmit : false
    };

    // jQuery doms
    var $form;
    var $textieldComment;
    var $btnSubmit;
    var $btnSkip;
    var $btnConfirmSkip;
    var $btnCancelSkip;
    var $radioSkipReason;
    var $textSkipOtherReason;
    var $divSkipOptions;
    var $pageOverlay;
    var $taskDifficultyWrapper;
    var $taskDifficultyOKButton;

    var messageCanvas;

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////////////////////////////////////////////
    function _init (params) {
        var hasGroupId = getURLParameter('groupId') !== "";
        var hasHitId = getURLParameter('hitId') !== "";
        var hasWorkerId = getURLParameter('workerId') !== "";
        var assignmentId = getURLParameter('assignmentId');

        properties.onboarding = params.onboarding;
        properties.dataStoreUrl = params.dataStoreUrl;

        if (('assignmentId' in params) && params.assignmentId) {
            properties.assignmentId = params.assignmentId;
        }
        if (('hitId' in params) && params.hitId) {
            properties.hitId = params.hitId;
        }
        if (('turkerId' in params) && params.turkerId) {
            properties.turkerId = params.turkerId;
        }

        if (('userExperiment' in params) && params.userExperiment) {
            properties.userExperiment = true;
        }

        //
        // initiailze jQuery elements.
        $form = $("#BusStopLabelerForm");
        $textieldComment = svl.ui.form.commentField; //$("#CommentField");
        $btnSubmit = svl.ui.form.submitButton;
        $btnSkip = svl.ui.form.skipButton;
        $btnConfirmSkip = $("#BusStopAbsence_Submit");
        $btnCancelSkip = $("#BusStopAbsence_Cancel");
        $radioSkipReason = $('.Radio_BusStopAbsence');
        $textSkipOtherReason = $("#Text_BusStopAbsenceOtherReason");
        $divSkipOptions = $("#Holder_SkipOptions");
        $pageOverlay = $("#page-overlay-holder");


        if (properties.userExperiment) {
            $taskDifficultyOKButton = $("#task-difficulty-button");
            $taskDifficultyWrapper = $("#task-difficulty-wrapper");
        }


        $('input[name="assignmentId"]').attr('value', properties.assignmentId);
        $('input[name="workerId"]').attr('value', properties.turkerId);
        $('input[name="hitId"]').attr('value', properties.hitId);


        if (assignmentId && assignmentId === 'ASSIGNMENT_ID_NOT_AVAILABLE') {
            properties.isPreviewMode = true;
            properties.isAMTTask = true;
            self.unlockDisableSubmit().disableSubmit().lockDisableSubmit();
            self.unlockDisableSkip().disableSkip().lockDisableSkip();
        } else if (hasWorkerId && !assignmentId) {
            properties.isPreviewMode = false;
            properties.isAMTTask = false;
        } else if (!assignmentId && !hasHitId && !hasWorkerId) {
            properties.isPreviewMode = false;
            properties.isAMTTask = false;
        } else {
            properties.isPreviewMode = false;
            properties.isAMTTask = true;
        }

        //
        // Check if this is a sandbox task or not
        properties.isSandbox = false;
        if (properties.isAMTTask) {
            if (document.referrer.indexOf("workersandbox.mturk.com") !== -1) {
                properties.isSandbox = true;
                $form.prop("action", "https://workersandbox.mturk.com/mturk/externalSubmit");
            }
        }

        //
        // Check if this is a preview and, if so, disable submission and show a message saying
        // this is a preview.
        if (properties.isAMTTask && properties.isPreviewMode) {
            var dom = '<div class="amt-preview-warning-holder">' +
                '<div class="amt-preview-warning">' +
                'Warning: you are on a Preview Mode!' +
                '</div>' +
                '</div>';
            $("body").append(dom);
            self.disableSubmit();
            self.lockDisableSubmit();
        }

        // if (!('onboarding' in svl && svl.onboarding)) {
        //     messageCanvas = new Onboarding(params, $)
        // }

        //
        // Insert texts in a textfield
        properties.commentFieldMessage = $textieldComment.attr('title');
        $textieldComment.val(properties.commentFieldMessage);

        //
        // Disable Submit button so turkers cannot submit without selecting
        // a reason for not being able to find the bus stop.
        disableConfirmSkip();

        //
        // Attach listeners
        $textieldComment.bind('focus', focusCallback); // focusCallback is in Utilities.js
        $textieldComment.bind('blur', blurCallback); // blurCallback is in Utilities.js
        $form.bind('submit', formSubmit);
        $btnSkip.bind('click', openSkipWindow);
        $btnConfirmSkip.on('click', skipSubmit);
        $btnCancelSkip.on('click', closeSkipWindow);
        $radioSkipReason.on('click', radioSkipReasonClicked);
        // http://stackoverflow.com/questions/11189136/fire-oninput-event-with-jquery
        if ($textSkipOtherReason.get().length > 0) {
            $textSkipOtherReason[0].oninput = skipOtherReasonInput;
        }

        if (properties.userExperiment) {
            $taskDifficultyOKButton.bind('click', taskDifficultyOKButtonClicked);
        }

    }

    function compileSubmissionData() {
        // This method gathers all the data needed for submission.
        var data = {};
        var hitId;
        var assignmentId;
        var turkerId;
        var taskGSVPanoId = svl.map.getInitialPanoId();


        hitId = properties.hitId ? properties.hitId : getURLParameter("hitId");
        assignmentId = properties.assignmentId? properties.assignmentId : getURLParameter("assignmentId");
        turkerId = properties.turkerId ? properties.turkerId : getURLParameter("workerId");

        if (!turkerId) {
            turkerId = 'Test_Kotaro';
        }
        if (!hitId) {
            hitId = 'Test_Hit';
        }
        if (!assignmentId) {
            assignmentId = 'Test_Assignment';
        }

        data.assignment = {
            amazon_turker_id : turkerId,
            amazon_hit_id : hitId,
            amazon_assignment_id : assignmentId,
            interface_type : 'StreetViewLabeler',
            interface_version : '3',
            completed : 0,
            need_qualification : 0,
            task_description : properties.taskDescription
        };

        data.labelingTask = {
            task_panorama_id: properties.taskPanoramaId,
            task_gsv_panorama_id : taskGSVPanoId,
            no_label : 0,
            description: "",
            previous_labeling_task_id: properties.previousLabelingTaskId
        };

        data.labelingTaskEnvironment = {
            browser: getBrowser(),
            browser_version: getBrowserVersion(),
            browser_width: $(window).width(),
            browser_height: $(window).height(),
            screen_width: screen.width,
            screen_height: screen.height,
            avail_width: screen.availWidth,		// total width - interface (taskbar)
            avail_height: screen.availHeight,		// total height - interface };
            operating_system: getOperatingSystem()
        };

        data.userInteraction = svl.tracker.getActions();

        data.labels = [];
        var labels = svl.canvas.getLabels();
        for(var i = 0; i < labels.length; i += 1) {
            var label = labels[i];
            var prop = label.getProperties();
            var points = label.getPath().getPoints();
            var pathLen = points.length;

            var temp = {
                deleted : label.isDeleted() ? 1 : 0,
                label_id : label.getLabelId(),
                label_type : label.getLabelType(),
                label_gsv_panorama_id : prop.panoId,
                label_points : [],
                label_additional_information : undefined
            };

            if (("photographerHeading" in prop) && ("photographerPitch" in prop)) {
                temp.photographer_heading = prop.photographerHeading,
                temp.photographer_pitch = prop.photographerPitch
            }

            for (var j = 0; j < pathLen; j += 1) {
                var point = points[j];
                var gsvImageCoordinate = point.getGSVImageCoordinate();
                var pointParam = {
                    svImageX : gsvImageCoordinate.x,
                    svImageY : gsvImageCoordinate.y,
                    originalCanvasX: point.originalCanvasCoordinate.x,
                    originalCanvasY: point.originalCanvasCoordinate.y,
                    originalHeading: point.originalPov.heading,
                    originalPitch: point.originalPov.pitch,
                    originalZoom : point.originalPov.zoom,
                    canvasX : point.canvasCoordinate.x,
                    canvasY : point.canvasCoordinate.y,
                    heading : point.pov.heading,
                    pitch : point.pov.pitch,
                    zoom : point.pov.zoom,
                    lat : prop.panoramaLat,
                    lng : prop.panoramaLng,
                    svImageHeight : prop.svImageHeight,
                    svImageWidth : prop.svImageWidth,
                    canvasHeight : prop.canvasHeight,
                    canvasWidth : prop.canvasWidth,
                    alphaX : prop.canvasDistortionAlphaX,
                    alphaY : prop.canvasDistortionAlphaY
                };
                temp.label_points.push(pointParam);
            }

            data.labels.push(temp)
        }

        if (data.labels.length === 0) {
            data.labelingTask.no_label = 0;
        }

        //
        // Add the value in the comment field if there are any.
        var comment = $textieldComment.val();
        data.comment = undefined;
        if (comment &&
            comment !== $textieldComment.attr('title')) {
            data.comment = $textieldComment.val();
        }
        return data;
    }


    function disableConfirmSkip () {
        // This method disables the confirm skip button
        $btnConfirmSkip.attr('disabled', true);
        $btnConfirmSkip.css('color', 'rgba(96,96,96,0.5)');
    }


    function enableConfirmSkip () {
        // This method enables the confirm skip button
        $btnConfirmSkip.attr('disabled', false);
        $btnConfirmSkip.css('color', 'rgba(96,96,96,1)');
    }

    function formSubmit (e) {
        // This is a callback function that will be invoked when a user hit a submit button.
        if (!properties.isAMTTask || properties.taskRemaining > 1) {
            e.preventDefault();
        }

        var url = properties.dataStoreUrl;
        var data = {};

        if (status.disableSubmit) {
            showDisabledSubmitButtonMessage();
            return false;
        }

        // temp
        window.location.reload();

        //
        // If this is a task with ground truth labels, check if users made any mistake.
        if ('goldenInsertion' in svl && svl.goldenInsertion) {
            var numMistakes = svl.goldenInsertion.reviewLabels();
            self.disableSubmit().lockDisableSubmit();
            self.disableSkip().lockDisableSkip();
            return false;
        }

        //
        // Disable a submit button and other buttons so turkers cannot submit labels more than once.
        //$btnSubmit.attr('disabled', true);
        //$btnSkip.attr('disabled', true);
        $btnConfirmSkip.attr('disabled', true);
        $pageOverlay.css('visibility', 'visible');


        //
        // If this is a user experiment
        if (properties.userExperiment) {
            if (!status.taskDifficulty) {
                status.submitType = 'submit';
                $taskDifficultyWrapper.css('visibility', 'visible');
                return false;
            }
        }

        //
        // Submit collected data if a user is not in onboarding mode.
        if (!properties.onboarding) {
            svl.tracker.push('TaskSubmit');

            data = compileSubmissionData();

            if (status.taskDifficulty != undefined) {
                data.taskDifficulty = status.taskDifficulty;
                data.labelingTask.description = "TaskDifficulty:" + status.taskDifficulty;
                if (status.taskDifficultyComment) {
                    data.comment = "TaskDifficultyCommentField:" + status.taskDifficultyComment + ";InterfaceCommentField:" + data.comment
                }
            }

            try {
                $.ajax({
                    async: false,
                    url: url,
                    type: 'post',
                    data: data,
                    dataType: 'json',
                    success: function (result) {
                        if (result.error) {
                            console.log(result.error);
                        }
                    },
                    error: function (result) {
                        throw result;
                        // console.error(result);
                    }
                });
            } catch (e) {
                console.error(e);
                return false;
            }

            if (properties.taskRemaining > 1) {
                window.location.reload();
                return false;
            } else {
                if (properties.isAMTTask) {
                    return true;
                } else {
                    window.location.reload();
                    //window.location = '/';
                    return false;
                }
            }
        }
        return false;
    }

    function goldenInsertionSubmit () {
        // This method submits the labels that a user provided on golden insertion task and refreshes the page.
        if ('goldenInsertion' in svl && svl.goldenInsertion) {
            svl.tracker.push('GoldenInsertion_Submit');
            var url = properties.dataStoreUrl;
            var data;
            svl.goldenInsertion.disableOkButton();

            data = compileSubmissionData();
            data.labelingTask.description = "GoldenInsertion";

            try {
                $.ajax({
                    async: false,
                    url: url,
                    type: 'post',
                    data: data,
                    dataType: 'json',
                    success: function (result) {
                        if (((typeof result) == 'object') && ('error' in result) && result.error) {
                            console.log(result.error);
                        }
                    },
                    error: function (result) {
                        throw result;
                        // console.error(result);
                    }
                });
            } catch (e) {
                console.error(e);
                return false;
            }

            window.location.reload();
        } else {
            throw self.className + ": This method cannot be called without GoldenInsertion";
        }
        return false;
    }

    function showDisabledSubmitButtonMessage () {
        // This method is called from formSubmit method when a user clicks the submit button evne then have
        // not looked around and inspected the entire panorama.
        var completionRate = parseInt(svl.progressPov.getCompletionRate() * 100, 10);

        if (!('onboarding' in svl && svl.onboarding) &&
            (completionRate < 100)) {
            var message = "You have inspected " + completionRate + "% of the scene. Let's inspect all the corners before you submit the task!";
            var $OkBtn;

            //
            // Clear and render the onboarding canvas
            var $divOnboardingMessageBox = undefined; //
            messageCanvas.clear();
            messageCanvas.renderMessage(300, 250, message, 350, 140);
            messageCanvas.renderArrow(650, 282, 710, 282);

            if (status.disabledButtonMessageVisibility === 'hidden') {
                status.disabledButtonMessageVisibility = 'visible';
                var okButton = '<button id="TempOKButton" class="button bold" style="left:20px;position:relative; width:100px;">OK</button>';
                $divOnboardingMessageBox.append(okButton);
                $OkBtn = $("#TempOKButton");
                $OkBtn.bind('click', function () {
                    //
                    // Remove the OK button and clear the message.
                    $OkBtn.remove();
                    messageCanvas.clear();
                    status.disabledButtonMessageVisibility = 'hidden';
                })
            }
        }
    }

    function skipSubmit (e) {
        // To prevent a button in a form to fire form submission, add onclick="return false"
        // http://stackoverflow.com/questions/932653/how-to-prevent-buttons-from-submitting-forms
        if (!properties.isAMTTask || properties.taskRemaining > 1) {
            e.preventDefault();
        }



        var url = properties.dataStoreUrl;
        var data = {};
        //
        // If this is a task with ground truth labels, check if users made any mistake.
        if ('goldenInsertion' in svl && svl.goldenInsertion) {
            self.disableSubmit().lockDisableSubmit();
            $btnSkip.attr('disabled', true);
            $btnConfirmSkip.attr('disabled', true);
            $divSkipOptions.css({
                visibility: 'hidden'
            });
            var numMistakes = svl.goldenInsertion.reviewLabels()
            return false;
        }

        //
        // Disable a submit button.
        $btnSubmit.attr('disabled', true);
        $btnSkip.attr('disabled', true);
        $btnConfirmSkip.attr('disabled', true);
        $pageOverlay.css('visibility', 'visible');


        //
        // If this is a user experiment, run the following lines
        if (properties.userExperiment) {
            if (!status.taskDifficulty) {
                status.submitType = 'skip';
                $taskDifficultyWrapper.css('visibility', 'visible');
                return false;
            }
        }
        //
        // Set a value for skipReasonDescription.
        if (status.radioValue === 'Other:') {
            status.skipReasonDescription = "Other: " + $textSkipOtherReason.val();
        }

        // Submit collected data if a user is not in oboarding mode.
        if (!properties.onboarding) {
            svl.tracker.push('TaskSubmitSkip');

            //
            // Compile the submission data with compileSubmissionData method,
            // then overwrite a part of the compiled data.
            data = compileSubmissionData()
            data.noLabels = true;
            data.labelingTask.no_label = 1;
            data.labelingTask.description = status.skipReasonDescription;

            if (status.taskDifficulty != undefined) {
                data.taskDifficulty = status.taskDifficulty;
                data.labelingTask.description = "TaskDifficulty:" + status.taskDifficulty;
                if (status.taskDifficultyComment) {
                    data.comment = "TaskDifficultyCommentField:" + status.taskDifficultyComment + ";InterfaceCommentField:" + data.comment
                }
            }

            try {
                $.ajax({
                    async: false,
                    url: url,
                    type: 'post',
                    data: data,
                    success: function (result) {
                        if (result.error) {
                            console.log(result.error);
                        }
                    },
                    error: function (result) {
                        throw result;
                        // console.error(self.className, result);
                    }
                });
            } catch (e) {
                console.error(e);
                return false;
            }

            if (properties.taskRemaining > 1) {
                window.location.reload();
                return false;
            } else {
                if (properties.isAMTTask) {
                    // $form.submit();
                    document.getElementById("BusStopLabelerForm").submit();
                    return true;
                } else {
                    // window.location = '/';
                    window.location.reload();
                    return false;
                }
            }

        }
        return false;
    }


    function openSkipWindow (e) {
        e.preventDefault();

        if (status.disableSkip) {
            showDisabledSubmitButtonMessage();
        } else {
            svl.tracker.push('Click_OpenSkipWindow');
            $divSkipOptions.css({
                visibility: 'visible'
            });
        }
        return false;
    }


    function closeSkipWindow (e) {
        // This method closes the skip menu.
        e.preventDefault(); // Do not submit the form!

        svl.tracker.push('Click_CloseSkipWindow');

        $divSkipOptions.css({
            visibility: 'hidden'
        });
        return false;
    }


    function radioSkipReasonClicked () {
        // This function is invoked when one of a radio button is clicked.
        // If the clicked radio button is 'Other', check if a user has entered a text.
        // If the text is entered, then enable submit. Otherwise disable submit.
        status.radioValue = $(this).attr('value');
        svl.tracker.push('Click_SkipRadio', {RadioValue: status.radioValue});

        if (status.radioValue !== 'Other:') {
            status.skipReasonDescription = status.radioValue;
            enableConfirmSkip();
        } else {
            var textValue = $textSkipOtherReason.val();
            if (textValue) {
                enableConfirmSkip();
            } else {
                disableConfirmSkip();
            }
        }
    }

    function skipOtherReasonInput () {
        // This function is invoked when the text is entered in Other field.
        if (status.radioValue && status.radioValue === 'Other:') {
            var textValue = $textSkipOtherReason.val();
            if (textValue) {
                enableConfirmSkip();
            } else {
                disableConfirmSkip();
            }
        }
    }

    function taskDifficultyOKButtonClicked (e) {
        // This is used in the user experiment script
        // Get checked radio value
        // http://stackoverflow.com/questions/4138859/jquery-how-to-get-selected-radio-button-value
        status.taskDifficulty = parseInt($('input[name="taskDifficulty"]:radio:checked').val(), 10);
        status.taskDifficultyComment = $("#task-difficulty-comment").val();
        status.taskDifficultyComment = (status.taskDifficultyComment != "") ? status.taskDifficultyComment : undefined;
        console.log(status.taskDifficultyComment);


        if (status.taskDifficulty) {
            if (('submitType' in status) && status.submitType == 'submit') {
                formSubmit(e);
            } else if (('submitType' in status) && status.submitType == 'skip') {
                skipSubmit(e);
            }
        }
    }
    ////////////////////////////////////////////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////////////////////////////////////////////
    self.checkSubmittable = function () {
        // This method checks whether users can submit labels or skip this task by first checking if they
        // assessed all the angles of the street view.
        // Enable/disable form a submit button and a skip button
        if ('progressPov' in svl && svl.progressPov) {
            var completionRate = svl.progressPov.getCompletionRate();
        } else {
            var completionRate = 0;
        }

        var labelCount = svl.canvas.getNumLabels();

        if (1 - completionRate < 0.01) {
            if (labelCount > 0) {
                self.enableSubmit();
                self.disableSkip();
            } else {
                self.disableSubmit();
                self.enableSkip();
            }
            return true;
        } else {
            self.disableSubmit();
            self.disableSkip();
            return false;
        }
    };

    self.compileSubmissionData = function () {
        // This method returns the return value of a private method compileSubmissionData();
        return compileSubmissionData();
    }

    self.disableSubmit = function () {
        if (!lock.disableSubmit) {
            status.disableSubmit = true;
            //  $btnSubmit.attr('disabled', true);
            $btnSubmit.css('opacity', 0.5);
            return this;
        }
        return false;
    };


    self.disableSkip = function () {
        if (!lock.disableSkip) {
            status.disableSkip = true;
            // $btnSkip.attr('disabled', true);
            $btnSkip.css('opacity', 0.5);
            return this;
        }
        return false;
    };


    self.enableSubmit = function () {
        if (!lock.disableSubmit) {
            status.disableSubmit = false;
            // $btnSubmit.attr('disabled', false);
            $btnSubmit.css('opacity', 1);
            return this;
        }
        return false;
    };


    self.enableSkip = function () {
        if (!lock.disableSkip) {
            status.disableSkip = false;
            // $btnSkip.attr('disabled', false);
            $btnSkip.css('opacity', 1);
            return this;
        }
        return false;
    };

    self.goldenInsertionSubmit = function () {
        // This method allows GoldenInsetion to submit the task.
        return goldenInsertionSubmit();
    };

    self.isPreviewMode = function () {
        // This method returns whether the task is in preview mode or not.
        return properties.isPreviewMode;
    };

    self.lockDisableSubmit = function () {
        lock.disableSubmit = true;
        return this;
    };


    self.lockDisableSkip = function () {
        lock.disableSkip = true;
        return this;
    };

    self.setPreviousLabelingTaskId = function (val) {
        // This method sets the labelingTaskId
        properties.previousLabelingTaskId = val;
        return this;
    };

    self.setTaskDescription = function (val) {
        // This method sets the taskDescription
        properties.taskDescription = val;
        return this;
    };


    self.setTaskRemaining = function (val) {
        // This method sets the number of remaining tasks
        properties.taskRemaining = val;
        return this;
    };

    self.setTaskPanoramaId = function (val) {
        // This method sets the taskPanoramaId. Note it is not same as the GSV panorama id.
        properties.taskPanoramaId = val;
        return this;
    };


    self.unlockDisableSubmit = function () {
        lock.disableSubmit = false;
        return this;
    };


    self.unlockDisableSkip = function () {
        lock.disableSkipButton = false;
        return this;
    };

    _init(params);
    return self;
}

var svl = svl || {};

/**
 *
 * @param param {object}
 * @param $ {object} jQuery object
 * @returns {{className: string}}
 * @constructor
 */
function GoldenInsertion (param, $) {
    var oPublic = {
        className: 'GoldenInsertion'
    };
    var properties = {
        cameraMovementDuration: 500, // 500 ms
        curbRampThreshold: 0.35,
        goldenLabelVisibility: 'hidden',
        noCurbRampThreshold: 0.1
    };
    var status = {
        boxMessage: "",
        currentLabel: undefined,
        hasMistake: false,
        revisingLabels: false
    };
    var lock = {};
    var domOKButton = '<button id="GoldenInsertionOkButton" class="button" style="">OK</button>';

    var onboarding; // This variable will hold an onboarding object

    var $buttonCurbRamp;
    var $buttonNoCurbRamp;

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////////////////////////////////////////////
    function _init (param) {
        if ('goldenLabelVisibility' in param) {
            properties.goldenLabelVisibility = param.goldenLabelVisibility;
        }

        onboarding = new Onboarding(param, $);
        $buttonCurbRamp = $("#ModeSwitchButton_CurbRamp");
        $buttonNoCurbRamp = $("#ModeSwitchButton_NoCurbRamp");
    }

    function clear () {
        // This method clears the object status and cleans up the instruction canvas.
        status.currentLabel = undefined;
        onboarding.clear();
    }

    function clickOK () {
        // This is a callback function that is invoked when a user clicked an OK button on the final message.
        if ('form' in svl && svl.form) {
            svl.form.goldenInsertionSubmit();
        } else {
            throw oPublic.className + ": Cannnot submit without a Form object.";
        }
    }

    function compare(label1, label2) {
        // A comparison function used to sort a list of labels based on its relativeHeading.
        if (label1.relativeHeading < label2.relativeHeading) {
            return -1;
        } else if (label1.relativeHeading > label2.relativeHeading) {
            return 1
        } else {
            return 0;
        }
    }

    function reviseFalseNegative (label) {
        // This method sets the camera angle to a false negative label and asks a user to label it.
        if (('canvas' in svl && svl.canvas) &&
            ('map' in svl && svl.map)) {
            svl.tracker.push('GoldenInsertion_ReviseFalseNegative');
            var labelId = label.getLabelId();
            var systemLabels = svl.canvas.getSystemLabels(true);
            var systemLabelIndex;
            var systemLabelsLength = systemLabels.length;

            //
            // Find a reference to the right user label
            for (systemLabelIndex = 0; systemLabelIndex < systemLabelsLength; systemLabelIndex++) {
                if (labelId == systemLabels[systemLabelIndex].getLabelId()) {
                    label = systemLabels[systemLabelIndex];
                    label.unlockVisibility().setVisibility('visible').lockVisibility();
                    // label.unlockTagVisibility().setTagVisibility('visible').lockTagVisibility();
                } else {
                    systemLabels[systemLabelIndex].unlockVisibility().setVisibility('hidden').lockVisibility();
                    // systemLabels[systemLabelIndex].unlockTagVisibility().setTagVisibility('hidden').lockTagVisibility();
                }
            }

            //
            // Set the pov so the user can see the label.
            var pov = label.getLabelPov();
            var labelType = label.getLabelType();
            status.currentLabel = label;

            if (labelType === "CurbRamp") {
                // status.boxMessage = "You did not label this <b>curb ramp</b>. Please draw an outline around it by clicking the <b>Curb Ramp</b> button.";
                status.boxMessage = "You did not label this <b>curb ramp</b>. Please draw an outline around it.";
            } else {
                // status.boxMessage = "You did not label this <b>missing curb ramp</b>. Please draw an outline around it by clicking the <b>Missing Curb Ramp</b> button.";
                status.boxMessage = "You did not label this <b>missing curb ramp</b>. Please draw an outline around it.";
            }

            svl.messageBox.hide();
            svl.map.setPov(pov, properties.cameraMovementDuration, function () {
                status.currentLabel = label;
                showMessage();
                //
                // Automatically switch to the CurbRamp or NoCurbRamp labeling mode based on the given label type.
                if (labelType === 'CurbRamp') {
                    svl.ribbon.modeSwitch('CurbRamp');
                } else if (labelType === 'NoCurbRamp') {
                    svl.ribbon.modeSwitch('NoCurbRamp');
                }
            });
            var blue = 'rgba(0,0,255, 0.5)';
            label.fill(blue).blink(5); // True is set to fade the color at the end.
        }
    }

    function reviseFalsePositive (label, overlap) {
        // This method sets the camera angle to a false positive label and asks a user to delete the false positive label.
        if (!overlap || typeof overlap !== "number") {
            overlap = 0;
        }
        if (('canvas' in svl && svl.canvas) &&
            ('map' in svl && svl.map)) {
            svl.tracker.push('GoldenInsertion_ReviseFalsePositive');
            var labelId = label.getLabelId();
            var userLabels = svl.canvas.getUserLabels(true);
            var userLabelIndex;
            var userLabelsLength = svl.canvas.getUserLabelCount();

            //
            // Find a reference to the right user label
            for (userLabelIndex = 0; userLabelIndex < userLabelsLength; userLabelIndex++) {
                if (labelId == userLabels[userLabelIndex].getLabelId()) {
                    label = userLabels[userLabelIndex];
                    break;
                }
            }

            //
            // Set the pov so the user can see the label.
            var pov = label.getLabelPov();
            var labelType = label.getLabelType();
            status.currentLabel = label;

            if (labelType === "CurbRamp") {
                // status.boxMessage = "You did not label this <b>curb ramp</b>. Please draw an outline around it by clicking the <b>Curb Ramp</b> button.";
                if (overlap > 0) {
                    status.boxMessage = "This label does not precisely outline the <b>curb ramp</b>. Mouse over the label and click " +
                        "<img src=\"public/img/icons/Sidewalk/Icon_Delete.svg\" class=\"MessageBoxIcons\"/> " +
                        "to delete.";
                } else {
                    status.boxMessage = "There does not appear to be a curb ramp to label here. Mouse over the label and click " +
                        "<img src=\"public/img/icons/Sidewalk/Icon_Delete.svg\" class=\"MessageBoxIcons\"/> " +
                        "to delete.";
                }
            } else {
                // status.boxMessage = "You did not label this <b>missing curb ramp</b>. Please draw an outline around it by clicking the <b>Missing Curb Ramp</b> button.";
                if (overlap > 0) {
                    status.boxMessage = "Your label is not on a <b>missing curb ramp</b>. Mouse over the label and click " +
                        "<img src=\"public/img/icons/Sidewalk/Icon_Delete.svg\" class=\"MessageBoxIcons\"/> " +
                        "to delete.";
                } else {
                    status.boxMessage = "There does not appear to be any missing curb ramp to label here. Mouse over the label and click " +
                        "<img src=\"public/img/icons/Sidewalk/Icon_Delete.svg\" class=\"MessageBoxIcons\"/> " +
                        "to delete.";
                }
            }

//            if (labelType === "CurbRamp") {
//                var message = "This label does not precisely outline the curb ramp. Please delete the label by clicking the " +
//                    "<img src=\"public/img/icons/Sidewalk/Icon_Delete.svg\" class=\"MessageBoxIcons\"/> " +
//                    "button and try outlining.";
//            } else {
//                var message = "Your label is not on a missing curb ramp. Please delete the label by clicking " +
//                    "<img src=\"public/img/icons/Sidewalk/Icon_Delete.svg\" class=\"MessageBoxIcons\"/> " +
//                    "on the label.";
//            }

            //
            // Change the pov, then invoke a callback function to show an message.
            // Ask an user to delete the label that is wrong.
            // Keep checking if the user deleted the label or not by counting the number of user labels.
            // Move on once the user have corrected the mistake.
            svl.messageBox.hide();
            svl.map.setPov(pov, properties.cameraMovementDuration, function () {
                status.currentLabel = label;
                showMessage();
            });
            // label.highlight().blink(5, true); // The second argument is set to true so the label will fade at the end.
            var red = 'rgba(255, 0, 0, 0.7)';
            label.fill(red).blink(5);
        }
    }

    function reviewLabels () {
        // Deprecated. Use reviewLabels2
        // This method reviews if user provided labels align well with system provided (golden/ground truth) labels.
        // This method extract system labels and user labels from svl.canvas, then compares overlap.
        // Finally it returns the number of mistakes identified.
        if (('canvas' in svl && svl.canvas) &&
            ('form' in svl && svl.form) &&
            ('map' in svl && svl.map)) {
            var userLabels = svl.canvas.getLabels('user');
            var systemLabels = svl.canvas.getLabels('system');
            var userLabelIndex;
            var systemLabelIndex;

            //
            // Clear anything from previous review.
            clear();

            //
            // Filter user labels
            userLabels = userLabels.filter(function (label) {
                return !label.isDeleted() && label.isVisible();
            });

            var userLabelsLength = svl.canvas.getUserLabelCount();
            var systemLabelsLength = systemLabels.length;
            var falseNegativeLabels = []; // This array stores ids of missed system labels.
            var falsePositiveLabels = []; // This array stores ids of false user labels.

            var overlap;
            var labelType;
            var doesOverlap;

            //
            // Check if a user has labeled something that is not a curb ramp or not a missing curb ramp (False positive)
            for (userLabelIndex = 0; userLabelIndex < userLabelsLength; userLabelIndex++) {
                overlap = 0;
                doesOverlap = false;
                for (systemLabelIndex = 0; systemLabelIndex < systemLabelsLength; systemLabelIndex++) {
                    if (!userLabels[userLabelIndex].isDeleted() && userLabels[userLabelIndex].isVisible()) {
                        if (userLabels[userLabelIndex].getLabelType() == systemLabels[systemLabelIndex].getLabelType()) {
                            overlap = userLabels[userLabelIndex].overlap(systemLabels[systemLabelIndex]);
                            labelType = userLabels[userLabelIndex].getLabelType();
                            if (labelType == "CurbRamp" && overlap > properties.curbRampThreshold) {
                                doesOverlap = true;
                                break;
                            } else if (labelType == "NoCurbRamp" && overlap > properties.noCurbRampThreshold) {
                                doesOverlap = true;
                                break;
                            }
                        }
                    }
                }
                if (!doesOverlap) {
                    falsePositiveLabels.push(userLabels[userLabelIndex]);
                }
            }

            //
            // Check if a user has missed to label some of system labels (False negatives)
            for (systemLabelIndex = 0; systemLabelIndex < systemLabelsLength; systemLabelIndex++) {
                overlap = 0;
                doesOverlap = false;
                for (userLabelIndex = 0; userLabelIndex < userLabelsLength; userLabelIndex++) {
                    if (!userLabels[userLabelIndex].isDeleted() && userLabels[userLabelIndex].isVisible()) {

                        if (userLabels[userLabelIndex].getLabelType() == systemLabels[systemLabelIndex].getLabelType()) {
                            overlap = userLabels[userLabelIndex].overlap(systemLabels[systemLabelIndex]);
                            labelType = userLabels[userLabelIndex].getLabelType();
                            if (labelType == "CurbRamp" && overlap > properties.curbRampThreshold) {
                                doesOverlap = true;
                                break;
                            } else if (labelType == "NoCurbRamp" && overlap > properties.noCurbRampThreshold) {
                                doesOverlap = true;
                                break;
                            }
                        }
                    }
                }
                if (!doesOverlap) {
                    falseNegativeLabels.push(systemLabels[systemLabelIndex]);
                }
            }

            //
            // Walk through the mistakes if there are any mistakes
            var numFalseNegatives = falseNegativeLabels.length;
            var numFalsePositives = falsePositiveLabels.length;
            var numMistakes = numFalseNegatives + numFalsePositives;
            if (numMistakes > 0) {
                status.hasMistake = true;
                if (numFalsePositives > 0) {
                    reviseFalsePositive(falsePositiveLabels[0]);
                } else if (numFalseNegatives > 0) {
                    reviseFalseNegative(falseNegativeLabels[0]);
                }
                return numMistakes;
            } else {
                // Change the message depending on whether s/he has made a misatke or not.
                var domSpacer = "<div style='height: 10px'></div>"
                if (status.hasMistake) {
                    var message = "Great, you corrected all the mistakes! Now, let's move on to the next task. " +
                        "Please try to be as accurate as possible. Your labels will be used to make our cities better " +
                        "and more accessible.<br/>" + domSpacer + domOKButton;
                } else {
                    var message = "Fantastic! You labeled everything correctly! Let's move on to the next task. <br />" + domSpacer + domOKButton;
                }
                var messageBoxX = 0;
                var messageBoxY = 320;
                var width = 720;
                var height = null;
                svl.messageBox.setMessage(message).setPosition(messageBoxX, messageBoxY, width, height, true).show();
                $("#GoldenInsertionOkButton").bind('click', clickOK);
                return 0;
            }
        }
        return false;
    }

    function reviewLabels2 () {
        // This method reviews if user provided labels align well with system provided (golden/ground truth) labels.
        // This method extract system labels and user labels from svl.canvas, then compares overlap.
        if (('canvas' in svl && svl.canvas) &&
            ('form' in svl && svl.form) &&
            ('map' in svl && svl.map) &&
            ('panorama' in svl && svl.panorama)) {
            svl.tracker.push('GoldenInsertion_ReviewLabels');
            var userLabels = svl.canvas.getLabels('user');
            var systemLabels = svl.canvas.getLabels('system');
            var allLabels = [];
            var userLabelIndex;
            var systemLabelIndex;

            //
            // Clear anything from previous review.
            clear();

            //
            // Filter user labels
            userLabels = userLabels.filter(function (label) {
                return !label.isDeleted() && label.isVisible();
            });


            var _userLabels = userLabels.map(function (label) {
                label.labeledBy = "user";
                return label;
            });
            var _systemLabels = systemLabels.map(function (label) {
                label.labeledBy = "system";
                return label;
            });
            var allLabels = _userLabels.concat(_systemLabels);
            allLabels = allLabels.map(function (label) {
                var currentHeading = svl.panorama.getPov().heading;
                var labelHeading = label.getLabelPov().heading; //label.//label.getProperty("panoramaHeading");
                var weight = 10; // Add a weight to system labels so they tend to be corrected after correcting user labels.
                label.relativeHeading = parseInt((labelHeading - currentHeading + 360) % 360);
                label.relativeHeading = (label.relativeHeading < 360 - label.relativeHeading) ? label.relativeHeading : 360 - label.relativeHeading;
                label.relativeHeading = (label.labeledBy === "system") ? label.relativeHeading + weight : label.relativeHeading;
                return label;
            });
            //
            // Sort an array of objects by values of the objects
            // http://stackoverflow.com/questions/1129216/sorting-objects-in-an-array-by-a-field-value-in-javascript
            allLabels.sort(compare);


            var overlap;


            //
            // Check if the user has labeled curb ramps and missing curb ramps correctly.
            var allLabelsLength = allLabels.length;
            var i;
            var j;
            var len;
            var correctlyLabeled;
            for (i = 0; i < allLabelsLength; i++) {
                if (("correct" in allLabels[i]) && allLabels[i]["correct"]) {
                    continue;
                } else {
                    correctlyLabeled = false;
                    var maxOverlap = 0;
                    if (allLabels[i].labeledBy === "user") {
                        // compare the user label with all the system labels to see if it is a true positive label.
                        len = systemLabels.length;
                        for (j = 0; j < len; j++) {
                            if (allLabels[i].getLabelType() === systemLabels[j].getLabelType()) {
                                overlap = allLabels[i].overlap(systemLabels[j]);

                                if (overlap > maxOverlap) {
                                    maxOverlap = overlap;
                                }


                                if ((allLabels[i].getLabelType() === "CurbRamp" && overlap > properties.curbRampThreshold) ||
                                    (allLabels[i].getLabelType() === "NoCurbRamp" && overlap > properties.noCurbRampThreshold)) {
                                    allLabels[i].correct = true;
                                    systemLabels[j].correct = true;
                                    correctlyLabeled = true;
                                    break;
                                }
                            }
                        }
                        if (!correctlyLabeled) {
                            if (!status.hasMistake) {
                                // Before moving on to the correction phase, show a message that tells
                                // the user we will guide them to correct labels.
                                showPreLabelCorrectionMesseage(reviseFalsePositive, {label: allLabels[i], overlap: maxOverlap});
                                status.hasMistake = true;
                            } else {
                                reviseFalsePositive(allLabels[i], maxOverlap);
                            }
                            return;
                        }
                    } else {
                        // Compare the system label with all the user labels to see if the user has missed to label this
                        // this system label.
                        len = userLabels.length;
                        for (j = 0; j < len; j++) {
                            if (allLabels[i].getLabelType() === userLabels[j].getLabelType()) {
                                overlap = allLabels[i].overlap(userLabels[j]);
                                if ((allLabels[i].getLabelType() === "CurbRamp" && overlap > properties.curbRampThreshold) ||
                                    (allLabels[i].getLabelType() === "NoCurbRamp" && overlap > properties.noCurbRampThreshold)) {
                                    allLabels[i].correct = true;
                                    userLabels[j].correct = true;
                                    correctlyLabeled = true;
                                    break;
                                }
                            }
                        }
                        if (!correctlyLabeled) {
                            if (!status.hasMistake) {
                                // Before moving on to the correction phase, show a message that tells
                                // the user we will guide them to correct labels.
                                showPreLabelCorrectionMesseage(reviseFalseNegative, {label: allLabels[i]});
                                status.hasMistake = true;
                            } else {
                                reviseFalseNegative(allLabels[i]);
                            }
                            return;
                        }
                    }
                }
            }

            //
            // Change the message depending on whether s/he has made a misatke or not.
            var domSpacer = "<div style='height: 10px'></div>"
            if (status.hasMistake) {
                var message = "Great, you corrected all the mistakes! Please try to be as accurate as possible. " +
                    "Your labels will be used to make our cities better and more accessible." +
                    "Now, let's move on to the next task. <br/>" + domSpacer + domOKButton;
            } else {
                var message = "Fantastic! You labeled everything correctly! Let's move on to the next task. <br />" + domSpacer + domOKButton;
            }
            var messageBoxX = 0;
            var messageBoxY = 320;
            var width = 700;
            var height = null;
            svl.messageBox.setMessage(message).setPosition(messageBoxX, messageBoxY, width, height, true).show();
            $("#GoldenInsertionOkButton").bind('click', clickOK);
            return;
        }
        return;
    }

    function showMessage() {
        // Show a message and ask an user to provide a label the label they missed to label.
        // Keep checking if they provided a new label or not. Until they provide the label, disable submit.
        // Once they provide a label, review other labels.
        //
        // This method assumes that status.currentLabel and status.boxMessage are set.
        onboarding.clear();

        var boundingbox = status.currentLabel.getBoundingBox();
        var messageBoxX = boundingbox.x + boundingbox.width + 50;
        var messageBoxY = boundingbox.y + boundingbox.height / 2 + 60;
        svl.messageBox.setMessage(status.boxMessage).setPosition(messageBoxX, messageBoxY).show();

        //
        // Show a "click here" message and bind events to mode switch buttons.

        // onboarding.renderArrow(x, y - 50, x, y - 20, {arrowWidth: 3});
        onboarding.renderArrow(messageBoxX, boundingbox.y + boundingbox.height / 2 + 10, messageBoxX - 25, boundingbox.y + (boundingbox.height / 2), {arrowWidth: 3});
        // onboarding.renderArrow(messageBoxX, y - 50, messageBoxX - 25, y - 80, {arrowWidth: 3});
        // onboarding.renderCanvasMessage(x - (boundingbox.width / 2) - 150, y - 60, "Trace an outline similar to this one.", {fontSize: 18, bold: true});
    }

    function showPreLabelCorrectionMesseage(callback, params) {
        // Before moving on to the correction phase, show a message that tells
        // the user we will guide them to correct labels.
        if (!params) {
            return false;
        }
        if (!("label" in params) || !params.label) {
            return false;
        }

        var domSpacer = "<div style='height: 10px'></div>"
        var message = "<img src=\"public/img/icons/Icon_WarningSign.svg\" class=\"MessageBoxIcons\" style=\"height:30px; width:30px; top:6px;\"/> " +
            "Uh oh, looks like there is a problem with your labels. Let's see if we can fix this. <br />" + domSpacer + domOKButton;
        var messageBoxX = 0;
        var messageBoxY = 320;
        var width = 720;
        var height = null;
        svl.messageBox.setMessage(message).setPosition(messageBoxX, messageBoxY, width, height, true).show();
        $("#GoldenInsertionOkButton").bind('click', function () {
            svl.messageBox.hide();
            if ("overlap" in params) {
                callback(params.label, params.overlap);
            } else {
                callback(params.label);
            }
        });
    }


    ////////////////////////////////////////////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////////////////////////////////////////////
    oPublic.disableOkButton = function () {
        // This method disables the OK button.
        $("#GoldenInsertionOkButton").unbind('click');
        $("#GoldenInsertionOkButton").css('opacity', 0.7);
    };

    oPublic.getGoldenLabelVisibility = function () {
        // This method returns the visibility of golden labels.
        return properties.goldenLabelVisibility;
    };

    oPublic.isRevisingLabels = function () {
        // This function is called in Canvas to check whether the user should be revising
        // the false labels. See removeLabel amd closePath methods.
        return status.revisingLabels;
    };

    oPublic.renderMessage = function () {
        // This is a function that is executed from Map.js's viewControlLayerMouseMove()
        if (status.currentLabel && status.boxMessage !== "") {
            showMessage();
        }
        return;
    };

    oPublic.reviewLabels = function () {
        status.revisingLabels = true;
        return reviewLabels2();
    };

    _init(param);
    return oPublic;
}

svl.formatRecordsToGoldenLabels = function (records) {
    // This method takes records from database and format it into labels that the Canvas object can read.
    var i;
    var goldenLabels = {};
    var recordsLength = records.length;

    //
    // Group label points by label id
    var labelId;
    var panoId;
    var lat;
    var lng;
    var deleted;
    for (i = 0; i < recordsLength; i++) {
        //
        // Set pano id
        if ('LabelGSVPanoramaId' in records[i]) {
            panoId = records[i].LabelGSVPanoramaId;
        } else if ('GSVPanoramaId' in records[i]) {
            panoId = records[i].GSVPanoramaId;
        } else {
            panoId = undefined;
        }

        //
        // set latlng
        if ('Lat' in records[i]) {
            lat = records[i].Lat;
        } else if ('labelLat' in records[i]) {
            lat = records[i].labelLat;
        } else {
            lat = undefined;
        }
        if ('Lng' in records[i]) {
            lng = records[i].Lng;
        } else if ('labelLng' in records[i]) {
            lng = records[i].labelLng;
        } else {
            lng = undefined;
        }

        if (records[i].Deleted != "1") {
            labelId = records[i].LabelId;
            if (!(labelId in goldenLabels)) {
                goldenLabels[labelId] = [];
            }

            var temp = {
                AmazonTurkerId: records[i].AmazonTurkerId,
                LabelId: records[i].LabelId,
                LabelGSVPanoramaId: panoId,
                LabelType: records[i].LabelType,
                LabelPointId: records[i].LabelPointId,
                svImageX: records[i].svImageX,
                svImageY: records[i].svImageY,
                originalCanvasCoordinate: {x: records[i].originalCanvasX, y: records[i].originalCanvasY},
                originalHeading: records[i].originalHeading,
                originalPitch: records[i].originalPitch,
                originalZoom: records[i].originalZoom,
                heading: records[i].heading,
                pitch: records[i].pitch,
                zoom: records[i].zoom,
                Lat: lat,
                Lng: lng
            };

            if ('PhotographerHeading' in records[i] && 'PhotographerPitch' in records[i]) {
                temp.PhotographerHeading = parseFloat(records[i].PhotographerHeading);
                temp.PhotographerPitch = parseFloat(records[i].PhotographerPitch);
            }
            goldenLabels[labelId].push(temp);
        }
    }

    var ret = [];
    for (labelId in goldenLabels) {
        ret.push(goldenLabels[labelId]);
    }
    return ret;
};

svl.formatRecordsToLabels = svl.formatRecordsToGoldenLabels;

var svl = svl || {};

/**
 * A Keyboard module
 * @param $
 * @returns {{className: string}}
 * @constructor
 * @memberof svl
 */
function Keyboard ($) {
    var oPublic = {
            className : 'Keyboard'
        };
    var status = {
        focusOnTextField: false,
        shiftDown: false
    };

    var $textareaComment;
    var $taskDifficultyComment;
    var $inputSkipOther;

    function init () {
        $textareaComment = (svl.ui.form.commentField.length) > 0 ? svl.ui.form.commentField : null;
        $taskDifficultyComment = ($("#task-difficulty-comment").length > 0) ? $("#task-difficulty-comment") : null;
        $inputSkipOther = ($("#Text_BusStopAbsenceOtherReason").length > 0) ? $("#Text_BusStopAbsenceOtherReason") : null;

        if ($textareaComment) {
          $textareaComment.bind('focus', textFieldFocus);
          $textareaComment.bind('blur', textFieldBlur);
        }

        if ($taskDifficultyComment) {
            $taskDifficultyComment.bind('focus', textFieldFocus);
            $taskDifficultyComment.bind('blur', textFieldBlur);
        }

        if ($inputSkipOther) {
          $inputSkipOther.bind('focus', textFieldFocus);
          $inputSkipOther.bind('blur', textFieldBlur);
        }

        $(document).bind('keyup', documentKeyUp);
        $(document).bind('keydown', documentKeyDown);
        $(document).bind('mouseup', mouseUp);
    }

    function documentKeyDown(e) {
        // The callback method that is triggered with a keyUp event.
        if (!status.focusOnTextField) {
          if ('tracker' in svl) {
            svl.tracker.push('KeyDown', {'keyCode': e.keyCode});
          }
            switch (e.keyCode) {
                case 16:
                    // "Shift"
                    status.shiftDown = true;
                    break;
            }
        }
    }

    function documentKeyUp (e) {
        // console.log(e.keyCode);

        // This is a callback method that is triggered when a keyDown event occurs.
        if (!status.focusOnTextField) {
          if ('tracker' in svl) {
            svl.tracker.push('KeyUp', {'keyCode': e.keyCode});
          }
            switch (e.keyCode) {
                case 16:
                    // "Shift"
                    status.shiftDown = false;
                    break;
                case 27:
                    // "Escape"
                    svl.canvas.cancelDrawing();
                    break;
                case 67:
                    // "c" for CurbRamp. Switch the mode to the CurbRamp labeling mode.
                    svl.ribbon.modeSwitchClick("CurbRamp");
                    break
                case 69:
                    // "e" for Explore. Switch the mode to Walk (camera) mode.
                    svl.ribbon.modeSwitchClick("Walk");
                    break;
                case 77:
                    // "m" for MissingCurbRamp. Switch the mode to the MissingCurbRamp labeling mode.
                    svl.ribbon.modeSwitchClick("NoCurbRamp");
                    break;
                case 90:
                    // "z" for zoom. By default, it will zoom in. If "shift" is down, it will zoom out.
                    if (status.shiftDown) {
                        // Zoom out
                        if ("zoomControl" in svl) {
                            svl.zoomControl.zoomOut();
                        }
                    } else {
                        // Zoom in
                        if ("zoomControl" in svl)
                            svl.zoomControl.zoomIn();
                    }
            }
        }
    }

    function mouseUp (e) {
        // A call back method for mouseup. Capture a right click and do something.
        // Capturing right click in javascript.
        // http://stackoverflow.com/questions/2405771/is-right-click-a-javascript-event
        var isRightMB;
        e = e || window.event;

        if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
            isRightMB = e.which == 3;
        else if ("button" in e)  // IE, Opera
            isRightMB = e.button == 2;

        if (isRightMB) {
            oPublic.clearShiftDown();
        }
    }

    function textFieldBlur () {
        // This is a callback function called when any of the text field is blurred.
        status.focusOnTextField = false
    }

    function textFieldFocus () {
        // This is a callback function called when any of the text field is focused.
        status.focusOnTextField = true;
    }

    ////////////////////////////////////////
    // Public methods
    ////////////////////////////////////////
    oPublic.clearShiftDown = function () {
        // This method turn status.shiftDown to false.
        status.shiftDown = false;
        return this;
    };

    oPublic.getStatus = function (key) {
        if (!(key in status)) {
          console.warn("You have passed an invalid key for status.")
        }
        return status[key];
    };

    oPublic.isShiftDown = function () {
        // This method returns whether a shift key is currently pressed or not.
        return status.shiftDown;
    };

    oPublic.setStatus = function (key, value) {
      if (key in status) {
        status[key] = value;
      }
      return this;
    };

    init();
    return oPublic;
}

var svl = svl || {};

/**
 * A Label module.
 * @param pathIn
 * @param params
 * @returns {*}
 * @constructor
 * @memberof svl
 */
function Label (pathIn, params) {
    var oPublic = {
        className: 'Label'
    };

    // Path
    var path = undefined;

    var properties = {
        canvasWidth: undefined,
        canvasHeight: undefined,
        canvasDistortionAlphaX: undefined,
        canvasDistortionAlphaY: undefined,
        labelerId : 'DefaultValue',
        labelId: 'DefaultValue',
        labelType: undefined,
        labelDescription: undefined,
        labelFillStyle: undefined,
        panoId: undefined,
        panoramaLat: undefined,
        panoramaLng: undefined,
        panoramaHeading: undefined,
        panoramaPitch: undefined,
        panoramaZoom: undefined,
        photographerHeading: undefined,
        photographerPitch: undefined,
        svImageWidth: undefined,
        svImageHeight: undefined,
        svMode: undefined,
        tagHeight: 20,
        tagWidth: 1,
        tagX: -1,
        tagY: -1
    };

    var status = {
        'deleted' : false,
        'tagVisibility' : 'visible',
        'visibility' : 'visible'
    };

    var lock = {
        tagVisibility: false,
        visibility : false
    };


    //
    // Private functions
    //
    function init (param, pathIn) {
        try {
            if (!pathIn) {
                var errMsg = 'The passed "path" is empty.';
                throw errMsg;
            } else {
                path = pathIn;
            }
            for (attrName in properties) {
                // It is ok if some attributes are not passed as parameters
                if ((attrName === 'tagHeight' ||
                     attrName === 'tagWidth' ||
                     attrName === 'tagX' ||
                     attrName === 'tagY' ||
                     attrName === 'labelerId' ||
                     attrName === 'photographerPov' ||
                     attrName === 'photographerHeading' ||
                     attrName === 'photographerPitch'
                    ) &&
                    !param[attrName]) {
                    continue;
                }

                // Check if all the necessary properties are set in param.
                // Checking paroperties:
                // http://www.nczonline.net/blog/2010/07/27/determining-if-an-object-property-exists/
                if (!(attrName in param)) {
                    var errMsg = '"' + attrName + '" is not in the passed parameter.';
                    throw errMsg;
                }
                properties[attrName] = param[attrName];
            }

            // If the labelType is a "Stop Sign", do not show a tag
            // as a user has to select which type of a stop sign it is
            // (e.g. One-leg, Two-leg, etc)
            // if (properties.labelProperties.labelType === "StopSign") {
            if (false) {
                status.tagVisibility = 'hidden';
            }

            // Set belongs to of the path.
            path.setBelongsTo(oPublic);

            return true;
        } catch (e) {
            console.error(oPublic.className, ':', 'Error initializing the Label object.', e);
            return false;
        }
    };

    function renderTag(ctx) {
        // This function renders a tag on a canvas to show a property of the label
        if (arguments.length !== 3) {
            return false;
        }
        var boundingBox = path.getBoundingBox();

        // Prepare a label message
        var msg = properties.labelDescription;
        var messages = msg.split('\n');

        if (properties.labelerId !== 'DefaultValue') {
            messages.push('Labeler: ' + properties.labelerId);
        }

        ctx.font = '10.5pt Calibri';
        var height = properties.tagHeight * messages.length;
        var width = -1;
        for (var i = 0; i < messages.length; i += 1) {
            var w = ctx.measureText(messages[i]).width + 5;
            if (width < w) {
                width = w;
            }
        }
        properties.tagWidth = width;

        var tagX;
        var tagY;
        ctx.save();
        ctx.lineWidth = 3.5;
        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.strokeStyle = 'rgba(255,255,255,1)';
        ctx.beginPath();
        var connectorX = 15;
        if (connectorX > boundingBox.width) {
            connectorX = boundingBox.width - 1;
        }

        if (boundingBox.x < 5) {
            tagX = 5;
        } else {
            tagX = boundingBox.x;
        }

        if (boundingBox.y + boundingBox.height < 400) {
            ctx.moveTo(tagX + connectorX, boundingBox.y + boundingBox.height);
            ctx.lineTo(tagX + connectorX, boundingBox.y + boundingBox.height + 10);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
            tagY = boundingBox.y + boundingBox.height + 10;
        } else {
            ctx.moveTo(tagX + connectorX, boundingBox.y);
            ctx.lineTo(tagX + connectorX, boundingBox.y - 10);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
            // tagX = boundingBox.x;
            tagY = boundingBox.y - height - 20;
        }


        var r = 3;
        var paddingLeft = 16;
        var paddingRight = 30;
        var paddingBottom = 10;

        // Set rendering properties
        ctx.save();
        ctx.lineCap = 'square';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; // point.getProperty('fillStyleInnerCircle');
        ctx.strokeStyle = 'rgba(255,255,255,1)'; // point.getProperty('strokeStyleOuterCircle');
        //point.getProperty('lineWidthOuterCircle');

        // Draw a tag
        ctx.beginPath();
        ctx.moveTo(tagX, tagY);
        ctx.lineTo(tagX + width + paddingLeft + paddingRight, tagY);
        ctx.lineTo(tagX + width + paddingLeft + paddingRight, tagY + height + paddingBottom);
        ctx.lineTo(tagX, tagY + height + paddingBottom);
        ctx.lineTo(tagX, tagY);
//        ctx.moveTo(tagX, tagY - r);
//        ctx.lineTo(tagX + width - r, tagY - r);
//        ctx.arc(tagX + width, tagY, r, 3 * Math.PI / 2, 0, false); // Corner
//        ctx.lineTo(tagX + width + r, tagY + height - r);
//        ctx.arc(tagX + width, tagY + height, r, 0, Math.PI / 2, false); // Corner
//        ctx.lineTo(tagX + r, tagY + height + r);
//        ctx.arc(tagX, tagY + height, r, Math.PI / 2, Math.PI, false); // Corner
//        ctx.lineTo(tagX - r, tagY); // Corner

        ctx.fill();
        ctx.stroke()
        ctx.closePath();
        ctx.restore();

        // Render an icon and a message
        ctx.save();
        ctx.fillStyle = '#000';
        var labelType = properties.labelType;
        var iconImagePath = getLabelIconImagePath()[labelType].iconImagePath;
        var imageObj;
        var imageHeight;
        var imageWidth;
        var imageX;
        var imageY;
        imageObj = new Image();
        imageHeight = imageWidth = 25;
        imageX =  tagX + 5;
        imageY = tagY + 2;

        //imageObj.onload = function () {

        ///            };
        // ctx.globalAlpha = 0.5;
        imageObj.src = iconImagePath;
        ctx.drawImage(imageObj, imageX, imageY, imageHeight, imageWidth);

        for (var i = 0; i < messages.length; i += 1) {
            ctx.fillText(messages[i], tagX + paddingLeft + 20, tagY + 20 + 20 * i);
        }
        // ctx.fillText(msg, tagX, tagY + 17);
        ctx.restore();

        return;
    };

    function showDelete() {
        if (status.tagVisibility !== 'hidden') {
            var boundingBox = path.getBoundingBox();
            var x = boundingBox.x + boundingBox.width - 20;
            var y = boundingBox.y;

            // Show a delete button
            var $divHolderLabelDeleteIcon = $("#Holder_LabelDeleteIcon");
            $divHolderLabelDeleteIcon.css({
                'visibility': 'visible',
                'left' : x, // + width - 5,
                'top' : y
            });
        }
    };

    ////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////

    oPublic.blink = function (numberOfBlinks, fade) {
        // Blink (highlight and fade) the color of this label. If fade is true, turn the label into gray;
        if (!numberOfBlinks) {
            numberOfBlinks = 3;
        } else if (numberOfBlinks < 0) {
            numberOfBlinks = 0;
        }
        var interval;
        var highlighted = true;
        var path = oPublic.getPath();
        var points = path.getPoints();

        var i;
        var len = points.length;

        var fillStyle = 'rgba(200,200,200,0.1)';
        var fillStyleHighlight = path.getFillStyle();

        interval = setInterval(function () {
            if (numberOfBlinks > 0) {
                if (highlighted) {
                    highlighted = false;
                    path.setFillStyle(fillStyle);
                    for (i = 0; i < len; i++) {
                        points[i].setFillStyle(fillStyle);
                    }
                    svl.canvas.clear().render2();
                } else {
                    highlighted = true;
                    path.setFillStyle(fillStyleHighlight);
                    for (i = 0; i < len; i++) {
                        points[i].setFillStyle(fillStyleHighlight);
                    }
                    svl.canvas.clear().render2();
                    numberOfBlinks -= 1;
                }
            } else {
                if (fade) {
                    path.setFillStyle(fillStyle);
                    for (i = 0; i < len; i++) {
                        points[i].setFillStyle(fillStyle);
                    }
                    svl.canvas.clear().render2();
                }

                oPublic.setAlpha(0.05);
                svl.canvas.clear().render2();
                window.clearInterval(interval);
            }
        }, 500);

        return this;
    };

    oPublic.fadeFillStyle = function (mode) {
        // This method turn the associated Path and Points into gray.
        var path = oPublic.getPath();
        var points = path.getPoints()
        var i = 0;
        var len = points.length;
        var fillStyle = undefined;

        if (!mode) {
            mode = 'default';
        }

        if (mode === 'gray') {
            fillStyle = 'rgba(200,200,200,0.5)';
        } else {
            // fillStyle = path.getFillStyle();
            // fillStyle = svl.util.color.changeDarknessRGBA(fillStyle, 0.9);
            // fillStyle = svl.util.color.changeAlphaRGBA(fillStyle, 0.1);
            fillStyle = 'rgba(255,165,0,0.8)';
        }
        path.setFillStyle(fillStyle);
        for (; i < len; i++) {
            points[i].setFillStyle(fillStyle);
        }
        return this;
    };

    oPublic.getBoundingBox = function (pov) {
        // This method returns the boudning box of the label's outline.
        var path = oPublic.getPath();
        return path.getBoundingBox(pov);
    };

    oPublic.getCoordinate = function () {
        // This function returns the coordinate of a point.
        if (path && path.points.length > 0) {
            var pov = path.getPOV();
            return $.extend(true, {}, path.points[0].getCanvasCoordinate(pov));
        }
        return path;
    };

    oPublic.getGSVImageCoordinate = function () {
        // This function return the coordinate of a point in the GSV image coordinate.
        if (path && path.points.length > 0) {
            return path.points[0].getGSVImageCoordinate();
        }
    };

    oPublic.getImageCoordinates = function () {
        // This function returns
        if (path) {
            return path.getImageCoordinates();
        }
        return false;
    };

    oPublic.getLabelId = function () {
        // This function returns labelId property
        return properties.labelId;
    };

    oPublic.getLabelType = function () {
        // This function returns labelType property
        return properties.labelType;
    };

    oPublic.getPath = function (reference) {
        // This function returns the coordinate of a point.
        // If reference is true, return a reference to the path instead of a copy of the path
        if (path) {
            if (reference) {
                return path;
            } else {
                return $.extend(true, {}, path);
            }
        }
        return false;
    };

    oPublic.getPoint = function () {
        // This function returns the coordinate of the first point in the path.
        if (path && path.points.length > 0) {
            return path.points[0];
        }
        return path;
    };

    oPublic.getPoints = function (reference) {
        // This function returns the point objects that constitute the path
        // If reference is set to true, return the reference to the points
        if (path) {
            return path.getPoints(reference);
        } else {
            return false;
        }
    };

    oPublic.getLabelPov = function () {
        // Return the pov of this label
        var heading;//  = parseInt(properties.panoramaHeading, 10);
        var pitch = parseInt(properties.panoramaPitch, 10);
        var zoom = parseInt(properties.panoramaZoom, 10);

        var points = oPublic.getPoints();
        var svImageXs = points.map(function(point) {return point.svImageCoordinate.x;});

        if (svImageXs.max() - svImageXs.min() > (svl.svImageWidth / 2)) {
            svImageXs = svImageXs.map(function (x) {
                if (x < (svl.svImageWidth / 2)) {
                    x += svl.svImageWidth;
                }
                return x;
            })
            var labelSvImageX = parseInt(svImageXs.mean(), 10) % svl.svImageWidth;
        } else {
            var labelSvImageX = parseInt(svImageXs.mean(), 10);
        }
        heading = parseInt((labelSvImageX / svl.svImageWidth) * 360, 10) % 360;

        return {
            heading: parseInt(heading, 10),
            pitch: pitch,
            zoom: zoom
        };
    };

    oPublic.getProperties = function () {
        // Return the deep copy of the properties object,
        // so the caller can only modify properties from
        // setProperties() (which I have not implemented.)
        //
        // JavaScript Deepcopy
        // http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-a-javascript-object
        return $.extend(true, {}, properties);
    };

    oPublic.getProperty = function (propName) {
        if (!(propName in properties)) {
            return false;
        }
        return properties[propName];
    };

    oPublic.getstatus = function (key) {
        return status[key];
    }

    oPublic.getVisibility = function () {
        return status.visibility;
    };

    oPublic.fill = function (fill) {
        // This method changes the fill color of the path and points that constitute the path.
        var path = oPublic.getPath();
        var points = path.getPoints()
        var i = 0;
        var len = points.length;

        path.setFillStyle(fill);
        for (; i < len; i++) {
            points[i].setFillStyle(fill);
        }
        return this;
    };

    oPublic.highlight = function () {
        // This method changes the fill color of the path and points to orange.
        var fillStyle = 'rgba(255,165,0,0.8)';
        return oPublic.fill(fillStyle);
    };

    oPublic.isDeleted = function () {
        return status.deleted;
    };


    oPublic.isOn = function (x, y) {
        // This function checks if a path is under a cursor
        if (status.deleted ||
            status.visibility === 'hidden') {
            return false;
        }

        var result = path.isOn(x, y);
        if (result) {
            return result;
        } else {
            return false;

            var margin = 20;
            if (properties.tagX - margin < x &&
                properties.tagX + properties.tagWidth + margin > x &&
                properties.tagY - margin < y &&
                properties.tagY + properties.tagHeight + margin > y) {
                // The mouse cursor is on the tag.
                return this;
            } else {
                return false;
            }
        }
    };


    oPublic.isVisible = function () {
        // This method returns the visibility of this label.
        if (status.visibility === 'visible') {
            return true;
        } else {
            return false;
        }
    };

    oPublic.lockTagVisibility = function () {
        lock.tagVisibility = true;
        return this;
    };


    oPublic.lockVisibility = function () {
        lock.visibility = true;
        return this;
    };

    oPublic.overlap = function (label, mode) {
        // This method calculates the area overlap between this label and another label passed as an argument.
        if (!mode) {
            mode = "boundingbox";
        }

        if (mode !== "boundingbox") {
            throw oPublic.className + ": " + mobede + " is not a valid option.";
        }
        var path1 = oPublic.getPath();
        var path2 = label.getPath();

        return path1.overlap(path2, mode);
    };

    oPublic.removePath = function () {
        // This function removes the path and points in the path.
        path.removePoints();
        path = undefined;
    };


    oPublic.render = function (ctx, pov, evaluationMode) {
        if (!evaluationMode) {
            evaluationMode = false;
        }

        if (!status.deleted &&
            status.visibility === 'visible') {
            // Render a tag
            // Get a text to render (e.g, attribute type), and
            // canvas coordinate to render the tag.
            if(status.tagVisibility === 'visible') {
                var labelType =  properties.labelDescription;

                if (!evaluationMode) {
                    renderTag(ctx);
                    path.renderBoundingBox(ctx);
                    showDelete();
                    //showDelete(path);
                }
            }

            // Render a path
            path.render2(ctx, pov);
        }
        return this;
    };

    oPublic.resetFillStyle = function () {
        // This method turn the fill color of associated Path and Points into their original color.
        var path = oPublic.getPath();
        var points = path.getPoints()
        var i = 0;
        var len = points.length;
        path.resetFillStyle();
        for (; i < len; i++) {
            points[i].resetFillStyle();
        }
        return this;
    };

    oPublic.resetTagCoordinate = function () {
        // This function sets properties.tag.x and properties.tag.y to 0
        properties.tagX = 0;
        properties.tagY = 0;
        return this;
    };

    oPublic.setAlpha = function (alpha) {
        // This method changes the alpha channel of the fill color of the path and points that constitute the path.
        var path = oPublic.getPath();
        var points = path.getPoints()
        var i = 0;
        var len = points.length;
        var fill = path.getFillStyle();

        fill = svl.util.color.changeAlphaRGBA(fill, 0.3);

        path.setFillStyle(fill);
        for (; i < len; i++) {
            points[i].setFillStyle(fill);
        }
        return this;
    };

    oPublic.setIconPath = function (iconPath) {
        // This function sets the icon path of the point this label holds.
        if (path && path.points[0]) {
            var point = path.points[0];
            point.setIconPath(iconPath);
            return this;
        }
        return false;
    };


    oPublic.setLabelerId = function (labelerIdIn) {
        properties.labelerId = labelerIdIn;
        return this;
    };


    oPublic.setStatus = function (key, value) {
        if (key in status) {
            if (key === 'visibility' &&
                (value === 'visible' || value === 'hidden')) {
                // status[key] = value;
                oPublic.setVisibility(value);
            } else if (key === 'tagVisibility' &&
                (value === 'visible' || value === 'hidden')) {
                oPublic.setTagVisibility(value);
            } else if (key === 'deleted' && typeof value === 'boolean') {
                status[key] = value;
            }
        }
    };


    oPublic.setTagVisibility = function (visibility) {
        if (!lock.tagVisibility) {
            if (visibility === 'visible' ||
                visibility === 'hidden') {
                status['tagVisibility'] = visibility;
            }
        }
        return this;
    };


    oPublic.setSubLabelDescription = function (labelType) {
        // This function sets the sub label type of this label.
        // E.g. for a bus stop there are StopSign_OneLeg
        var labelDescriptions = getLabelDescriptions();
        var labelDescription = labelDescriptions[labelType].text;
        properties.labelProperties.subLabelDescription = labelDescription;
        return this;
    };


    oPublic.setVisibility = function (visibility) {
        if (!lock.visibility) {
            status.visibility = visibility;
        }
        return this;
    };


    oPublic.setVisibilityBasedOnLocation = function (visibility, panoId) {
        if (!status.deleted) {
            if (panoId === properties.panoId) {
                // oPublic.setStatus('visibility', visibility);
                oPublic.setVisibility(visibility);
            } else {
                visibility = visibility === 'visible' ? 'hidden' : 'visible';
                // oPublic.setStatus('visibility', visibility);
                oPublic.setVisibility(visibility);
            }
        }
        return this;
    };


    oPublic.setVisibilityBasedOnLabelerId = function (visibility, labelerIds, included) {
        // if included is true and properties.labelerId is in labelerIds, then set this
        // label's visibility to the passed visibility
        if (included === undefined) {
            if (labelerIds.indexOf(properties.labelerId) !== -1) {
                oPublic.unlockVisibility().setVisibility(visibility).lockVisibility();
            } else {
                visibility = visibility === 'visible' ? 'hidden' : 'visible';
                oPublic.unlockVisibility().setVisibility(visibility).lockVisibility();
            }
        } else {
            if (included) {
                if (labelerIds.indexOf(properties.labelerId) !== -1) {
                    oPublic.unlockVisibility().setVisibility(visibility).lockVisibility();
                }
            } else {
                if (labelerIds.indexOf(properties.labelerId) === -1) {
                    oPublic.unlockVisibility().setVisibility(visibility).lockVisibility();
                }
            }
        }

        return this;
    };


    oPublic.setVisibilityBasedOnLabelerIdAndLabelTypes = function (visibility, tables, included) {
        var i;
        var tablesLen = tables.length;
        var matched = false;

        for (i = 0; i < tablesLen; i += 1) {
            if (tables[i].userIds.indexOf(properties.labelerId) !== -1) {
                if (tables[i].labelTypesToRender.indexOf(properties.labelProperties.labelType) !== -1) {
                    matched = true;
                }
            }
        }
        if (included === undefined) {
            if (matched) {
                oPublic.unlockVisibility().setVisibility(visibility).lockVisibility();
            } else {
                visibility = visibility === 'visible' ? 'hidden' : 'visible';
                oPublic.unlockVisibility().setVisibility(visibility).lockVisibility();
            }
        } else {
            if (included) {
                if (matched) {
                    oPublic.unlockVisibility().setVisibility(visibility).lockVisibility();
                }
            } else {
                if (!matched) {
                    oPublic.unlockVisibility().setVisibility(visibility).lockVisibility();
                }
            }
        }
    };


    oPublic.unlockTagVisibility = function () {
        lock.tagVisibility = false;
        return this;
    };


    oPublic.unlockVisibility = function () {
        lock.visibility = false;
        return this;
    };

    ////////////////////////////////////////
    // Tests
    ////////////////////////////////////////
    oPublic.runTestCases = function () {
        module('Label tests');

        test('functioning', function () {
            ok(true, 'Test');
        });
    };

    //
    // Initialize
    //
    if (!init(params, pathIn)) {
        return false;
    }
    return oPublic;
}

var svl = svl || {};

/**
 * A LabelLandmarkFeedback module
 * @param $ {object} jQuery object
 * @param params {object} Other parameters
 * @returns {{className: string}}
 * @constructor
 * @memberof svl
 */
function LabeledLandmarkFeedback ($, params) {
    var self = { className : 'LabeledLandmarkFeedback' };
    var properties = {};
    var status = {};

    // jQuery eleemnts
    var $labelCountCurbRamp;
    var $labelCountNoCurbRamp;
    var $submittedLabelMessage;

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////////////////////////////////////////////
    function _init (params) {
      //
      // Initialize the jQuery DOM elements
      if (svl.ui && svl.ui.ribbonMenu) {
        $labelCountCurbRamp = svl.ui.labeledLandmark.curbRamp;
        $labelCountNoCurbRamp = svl.ui.labeledLandmark.noCurbRamp;
        $submittedLabelMessage = svl.ui.labeledLandmark.submitted;

        $labelCountCurbRamp.html(0);
        $labelCountNoCurbRamp.html(0);
      }
    }


    ////////////////////////////////////////////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////////////////////////////////////////////
    self.setLabelCount = function (labelCount) {
        // This method takes labelCount object that holds label names with
        // corresponding label counts. This function sets the label counts
        // that appears in the feedback window.
        if (svl.ui && svl.ui.ribbonMenu) {
          $labelCountCurbRamp.html(labelCount['CurbRamp']);
          $labelCountNoCurbRamp.html(labelCount['NoCurbRamp']);
        }
        return this;
    };

    self.setSubmittedLabelMessage = function (param) {
        // This method takes a param and sets the submittedLabelCount
        if (!param) {
            return this;
        }
        if (svl.ui && svl.ui.ribbonMenu) {
          if ('message' in param) {
              $submittedLabelMessage.html(message);
          } else if ('numCurbRampLabels' in param && 'numMissingCurbRampLabels' in param) {
              var message = "You've submitted <b>" +
                  param.numCurbRampLabels +
                  "</b> curb ramp labels and <br /><b>" +
                  param.numMissingCurbRampLabels +
                  "</b> missing curb ramp labels.";
              $submittedLabelMessage.html(message);
          }
        }
        return this;
    };

    _init(params);
    return self;
}

/** @namespace */
var svl = svl || {};

/**
 * The main module of SVLabel
 * @param $: jQuery object
 * @param param: other parameters
 * @returns {{moduleName: string}}
 * @constructor
 * @memberof svl
 */
function Main ($, param) {
    var self = {moduleName: 'MainUI'};
    var properties = {};
    var status = {};

    ////////////////////////////////////////
    // Private Functions
    ////////////////////////////////////////
    function _init (param) {
      // Instantiate objects.
      param = param || {};
      svl.ui = new UI($);
      svl.tracker = new Tracker();
      svl.keyboard = new Keyboard($);
      svl.canvas = new Canvas($);
      svl.form = new Form($, param.form);
      svl.examples = undefined
      svl.overlayMessageBox = new OverlayMessageBox($);
      svl.missionDescription = new MissionDescription($, param.missionDescription);
      svl.labeledLandmarkFeedback = new LabeledLandmarkFeedback($);
      svl.qualificationBadges = undefined;
      svl.progressFeedback = new ProgressFeedback($);
      svl.actionStack = new ActionStack($);
      svl.ribbon = new RibbonMenu($);
      svl.messageBox = new MessageBox($);
      svl.zoomControl = new ZoomControl($);
      svl.tooltip = undefined;
      svl.onboarding = undefined;
      svl.progressPov = new ProgressPov($);


      svl.form.disableSubmit();
      svl.tracker.push('TaskStart');
      //
      // Set map parameters and instantiate it.
      var mapParam = {};
      mapParam.canvas = svl.canvas;
      mapParam.overlayMessageBox = svl.overlayMessageBox;

      var SVLat;
      var SVLng;
      var currentProgress;
      var panoId = '_AUz5cV_ofocoDbesxY3Kw';

      var task = null;
      var nearbyPanoIds = [];
      var totalTaskCount = -1;
      var taskPanoramaId = '';
      var taskRemaining = -1;
      var taskCompleted = -1;
      var isFirstTask = false;

      totalTaskCount = 1; // taskSpecification.numAllTasks;
      taskRemaining = 1; // taskSpecification.numTasksRemaining;
      taskCompleted = totalTaskCount - taskRemaining;
      currentProgress = taskCompleted / totalTaskCount;

      svl.form.setTaskRemaining(taskRemaining);
      svl.form.setTaskDescription('TestTask');
      svl.form.setTaskPanoramaId(panoId);
      SVLat = parseFloat(38.894799); // Todo
      SVLng = parseFloat(-77.021906); // Todo
      currentProgress = parseFloat(currentProgress);

      mapParam.Lat = SVLat;
      mapParam.Lng = SVLng;
      mapParam.panoramaPov = {
          heading: 0,
          pitch: -10,
          zoom: 1
      };
      mapParam.taskPanoId = panoId;
      nearbyPanoIds = [mapParam.taskPanoId];
      mapParam.availablePanoIds = nearbyPanoIds;

      svl.missionDescription.setCurrentStatusDescription('Your mission is to ' +
          '<span class="bold">find and label</span> presence and absence of curb ramps at intersections.');
      svl.progressFeedback.setProgress(currentProgress);
      svl.progressFeedback.setMessage("You have finished " + (totalTaskCount - taskRemaining) +
          " out of " + totalTaskCount + ".");

      if (isFirstTask) {
          svl.messageBox.setPosition(10, 120, width=400, height=undefined, background=true);
          svl.messageBox.setMessage("<span class='bold'>Remember, label all the landmarks close to the bus stop.</span> " +
              "Now the actual task begins. Click OK to start the task.");
          svl.messageBox.appendOKButton();
          svl.messageBox.show();
      } else {
          svl.messageBox.hide();
      }

      // Instantiation
      svl.map = new Map(mapParam);
      svl.map.setStatus('hideNonavailablePanoLinks', true);
    }

    ////////////////////////////////////////
    // Public Functions
    ////////////////////////////////////////

    _init(param);
    return self;
}

var svl = svl || {};
var panorama;
svl.panorama = panorama;

////////////////////////////////////////
// Street View Global functions that can
// be accessed from anywhere
////////////////////////////////////////
// Get the camera point-of-view (POV)
// http://www.geocodezip.com/v3_Streetview_lookAt.html?lat=34.016673&lng=-118.501322&zoom=18&type=k


//
// Helper functions
//
function getPanoId() {
    if (svl.panorama) {
        var panoId = svl.panorama.getPano();
        return panoId;
    } else {
        throw 'getPanoId() (in Map.js): panorama not defined.'
    }
}
svl.getPanoId = getPanoId;


function getPosition() {
    if (svl.panorama) {
        var pos = svl.panorama.getPosition();
        if (pos) {
            var ret = {
                'lat' : pos.lat(),
                'lng' : pos.lng()
            };
            return ret;
        }
    } else {
        throw 'getPosition() (in Map.js): panorama not defined.';
    }
}
svl.getPosition = getPosition;


function getPOV() {
    if (svl.panorama) {
        var pov = svl.panorama.getPov();

        // Pov can be less than 0. So adjust it.
        while (pov.heading < 0) {
            pov.heading += 360;
        }

        // Pov can be more than 360. Adjust it.
        while (pov.heading > 360) {
            pov.heading -= 360;
        }
        return pov;
    } else {
        throw 'getPOV() (in Map.js): panoarama not defined.';
    }
}
svl.getPOV = getPOV;


function getLinks () {
    if (svl.panorama) {
        var links = svl.panorama.getLinks();
        return links;
    } else {
        throw 'getLinks() (in Map.js): panorama not defined.';
    }
}
svl.getLinks = getLinks;

//
// Fog related variables.
var fogMode = true;
var fogSet = false;
var current;
var first;
var previousPoints = [];
var radius = .1;
var isNotfirst = 0;
var paths;
svl.fog = undefined;;
var au = [];
var pty = [];
//au = adjustFog(fog, current.lat(), current.lng(), radius);
var polys = [];


/**
 * The Map module.
 * @param params {object} Other parameters
 * @returns {{className: string}}
 * @constructor
 * @memberof svl
 */
function Map (params) {
    var self = {className: 'Map'};
    var canvas;
    var overlayMessageBox;
    var className = 'Map';

    var mapIconInterval = undefined;
    var lock = {
        renderLabels : false
    };
    var markers = [];
    // properties
    var properties = {
        browser : 'unknown',
        latlng : {
            lat : undefined,
            lng : undefined
        },
        initialPanoId : undefined,
        panoramaPov : {
            heading : 359,
            pitch : -10,
            zoom : 1
        },
        maxPitch: 0,
        minPitch: -35,
        minHeading: undefined,
        maxHeading: undefined,
        mode : 'Labeling',
        isInternetExplore: undefined
    };
    var status = {
        availablePanoIds : undefined,
        currentPanoId: undefined,
        disableWalking : false,
        hideNonavailablePanoLinks : false,
        lockDisableWalking : false,
        panoLinkListenerSet: false,
        svLinkArrowsLoaded : false
    };

        // Street view variables
    var panoramaOptions;

        // Mouse status and mouse event callback functions
    var mouseStatus = {
            currX:0,
            currY:0,
            prevX:0,
            prevY:0,
            leftDownX:0,
            leftDownY:0,
            leftUpX:0,
            leftUpY:0,
            isLeftDown:false
        };

    // Maps variables
    var fenway;
    var map;
    var mapOptions;
    var mapStyleOptions;
    var fogParam = {
        interval: undefined,
        ready: undefined
    };
    var svgListenerAdded = false;

    // Street View variables
    var streetViewInit = undefined;

    // jQuery doms
    var $canvas;
    var $divLabelDrawingLayer;
    var $divPano;
    var $divStreetViewHolder;
    var $divViewControlLayer;
    var $spanModeSwitchWalk;
    var $spanModeSwitchDraw;


    ////////////////////////////////////////
    // Initialization
    ////////////////////////////////////////
    // Map UI setting
    // http://www.w3schools.com/googleAPI/google_maps_controls.asp
    if (params.panoramaPov) {
        properties.panoramaPov = params.panoramaPov;
    } else {
        properties.panoramaPov = {
            heading: 0,
            pitch: 0,
            zoom: 1
        };
    }
    if (params.latlng) {
        properties.latlng = params.latlng;
    } else if (('Lat' in params) && ('Lng' in params)) {
        properties.latlng = {'lat': params.Lat, 'lng': params.Lng};
    } else {
        throw self.className + ': latlng not defined.';
    }

    // fenway = new google.maps.LatLng(params.targetLat, params.targetLng);
    fenway = new google.maps.LatLng(properties.latlng.lat, properties.latlng.lng);

    mapOptions = {
        center: fenway,
        mapTypeControl:false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        maxZoom : 20,
        minZoom : 14,
        overviewMapControl:false,
        panControl:false,
        rotateControl:false,
        scaleControl:false,
        streetViewControl:true,
        zoomControl:false,
        zoom: 18
    };

    var mapCanvas = document.getElementById("google-maps");
    map = new google.maps.Map(mapCanvas, mapOptions);

    // Styling google map.
    // http://stackoverflow.com/questions/8406636/how-to-remove-all-from-google-map
    // http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html
    mapStyleOptions = [
        {
            featureType: "all",
            stylers: [
                { visibility: "off" }
            ]
        },
        {
            featureType: "road",
            stylers: [
                { visibility: "on" }
            ]
        },
        {
            "elementType": "labels",
            "stylers": [
                { "visibility": "off" }
            ]
        }
    ];


    map.setOptions({styles: mapStyleOptions});

    function init(params) {
        self.properties = properties; // Make properties public.
        properties.browser = getBrowser();

        // canvas = params.canvas;
        overlayMessageBox = params.overlayMessageBox;


        // Set GSV panorama options
        // To not show StreetView controls, take a look at the following gpage
        // http://blog.mridey.com/2010/05/controls-in-maps-javascript-api-v3.html
        //
        // This is awesome... There is a hidden option called 'mode' in the SV panoramaOption.
        // https://groups.google.com/forum/?fromgroups=#!topic/google-maps-js-api-v3/q-SjeW19TJw
        if (params.taskPanoId) {
            panoramaOptions = {
                mode : 'html4',
                // position: fenway,
                pov: properties.panoramaPov,
                pano: params.taskPanoId
            };
        } else if (params.Lat && params.Lng) {
            fenway = new google.maps.LatLng(params.Lat, params.Lng);
            panoramaOptions = {
                mode : 'html4',
                position: fenway,
                pov: properties.panoramaPov
            };

            throw self.className + ' init(): Specifying a dropping point with a latlng coordinate is no longer a good idea. It does not drop the pegman on the specified position.';
        } else {
            throw self.className + ' init(): The pano id nor panorama position is give. Cannot initialize the panorama.';
        }

        var panoCanvas = document.getElementById('pano');
        svl.panorama = new google.maps.StreetViewPanorama(panoCanvas,panoramaOptions);
        svl.panorama.set('addressControl', false);
        svl.panorama.set('clickToGo', false);
        svl.panorama.set('disableDefaultUI', true);
        svl.panorama.set('linksControl', true);
        svl.panorama.set('navigationControl', false);
        svl.panorama.set('panControl', false);
        svl.panorama.set('zoomControl', false);

        properties.initialPanoId = params.taskPanoId;
        $canvas = svl.ui.map.canvas;
        $divLabelDrawingLayer = svl.ui.map.drawingLayer;
        $divPano = svl.ui.map.pano;
        $divStreetViewHolder = svl.ui.map.streetViewHolder;
        $divViewControlLayer = svl.ui.map.viewControlLayer;
        $spanModeSwitchWalk = svl.ui.map.modeSwitchWalk;
        $spanModeSwitchDraw = svl.ui.map.modeSwitchDraw;

        // Set so the links to panoaramas that are not listed on availablePanoIds will be removed
        status.availablePanoIds = params.availablePanoIds;

        // Attach listeners to dom elements
        $divViewControlLayer.bind('mousedown', viewControlLayerMouseDown);
        $divViewControlLayer.bind('mouseup', viewControlLayerMouseUp);
        $divViewControlLayer.bind('mousemove', viewControlLayerMouseMove);
        $divViewControlLayer.bind('mouseleave', viewControlLayerMouseLeave);


        // Add listeners to the SV panorama
        // https://developers.google.com/maps/documentation/javascript/streetview#StreetViewEvents
        google.maps.event.addListener(svl.panorama, "pov_changed", povUpdated);
        google.maps.event.addListener(svl.panorama, "position_changed", povUpdated);
        google.maps.event.addListener(svl.panorama, "pano_changed", updateMap);

        // Connect the map view and panorama view
        map.setStreetView(svl.panorama);

        // Set it to walking mode initially.
        google.maps.event.addListenerOnce(svl.panorama, "pano_changed", self.modeSwitchWalkClick);

        streetViewInit = setInterval(initStreetView, 100);

        //
        // Set the fog parameters
        // Comment out to disable the fog feature.
        if ("onboarding" in svl &&
            svl.onboarding &&
            svl.onboarding.className === "Onboarding_LabelingCurbRampsDifficultScene") { //"zoomViewAngles" in params) {
            fogParam.zoomViewAngles = [Math.PI / 2, Math.PI / 4, Math.PI / 8];
        }
        fogParam.interval = setInterval(initFog, 250);

        // Hide the dude on the top-left of the map.
        mapIconInterval = setInterval(removeIcon, 0.2);

        //
        // For Internet Explore, append an extra canvas in viewControlLayer.
        properties.isInternetExplore = $.browser['msie'];
        if (properties.isInternetExplore) {
            $divViewControlLayer.append('<canvas width="720px" height="480px"  class="Window_StreetView" style=""></canvas>');
        }
    }

    function removeIcon() {
        var doms = $('.gmnoprint');
        if (doms.length > 0) {
            window.clearInterval(mapIconInterval);
            $.each($('.gmnoprint'), function (i, v) {
                var $images = $(v).find('img');
                if ($images) {
                    $images.css('visibility', 'hidden');
                }
            });
        }
    }

    ////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////
    function disableWalking () {
        // This method hides links on SV and disables users from walking.
        if (!status.lockDisableWalking) {
            // Disable clicking links and changing POV
            hideLinks();
            $spanModeSwitchWalk.css('opacity', 0.5);
            status.disableWalking = true;
        }
    }

    function enableWalking () {
        // This method shows links on SV and enables users to walk.
        if (!status.lockDisableWalking) {
            // Enable clicking links and changing POV
            showLinks();
            $spanModeSwitchWalk.css('opacity', 1);
            status.disableWalking = false;
        }
    }

    function fogUpdate () {
        var pov = svl.getPOV();

        if (pov) {
            var heading = pov.heading;
            var dir = heading * (Math.PI / 180);
            svl.fog.updateFromPOV(current, radius, dir, Math.PI/2);
        }
        return;
    }

    function getPanoramaLayer () {
        // Returns a panorama dom element that is dynamically created by GSV API
        return $divPano.children(':first').children(':first').children(':first').children(':eq(5)');
    }

    function getLinkLayer () {
        // Get svg element (arrows) in Street View.
        return $divPano.find('svg').parent();
    }

    function hideLinks () {
        // Hide links by chaging the svg path elements' visibility to hidden.
        if (properties.browser === 'chrome') {
            // Somehow chrome does not allow me to select path
            // and fadeOut. Instead, I'm just manipulating path's style
            // and making it hidden.
            $('path').css('visibility', 'hidden');
        } else {
            // $('path').fadeOut(1000);
            $('path').css('visibility', 'hidden');
        }
    }

    function makeLinksClickable () {
        // Bring the layer with arrows forward.
        var $links = getLinkLayer();
        $divViewControlLayer.append($links);

        if (properties.browser === 'mozilla') {
            // A bug in Firefox? The canvas in the div element with the largest z-index.
            $divViewControlLayer.append($canvas);
        } else if (properties.browser === 'msie') {
            $divViewControlLayer.insertBefore($divLabelDrawingLayer);
        }
    }

    function initFog () {
        // Initialize the fog on top of the map.
        if (current) {
            fogParam.center = current;
            fogParam.radius = 200;

            current = svl.panorama.getPosition();
            svl.fog = new Fog(map, fogParam);
            fogSet = true;
            window.clearInterval(fogParam.interval);
            fogUpdate();
        }
    }

    function initStreetView () {
        // Initialize the Street View interface
        var numPath = $divViewControlLayer.find("path").length;
        if (numPath !== 0) {
            status.svLinkArrowsLoaded = true;
            window.clearTimeout(streetViewInit);
        }

        if (!status.svLinkArrowsLoaded) {
            hideLinks();
        }
    }

    function povUpdated () {
        // This is a callback function that is fired when pov is changed
        if (svl.canvas) {
            var latlng = getPosition();
            var heading = svl.getPOV().heading;

            svl.canvas.clear();

            if (status.currentPanoId !== svl
              .getPanoId()) {
            	svl.canvas.setVisibilityBasedOnLocation('visible', svl.getPanoId());
            }
            status.currentPanoId = svl.getPanoId();


            if (properties.mode === 'Evaluation') {
                myTables.updateCanvas();
            }
            svl.canvas.render2();
        }


        // Sean & Vicki Fog code
        if (fogMode && "fog" in svl) {
            current = svl.panorama.getPosition();
            if (current) {
                if (!fogSet) {

                } else {
                    fogUpdate();
                    // var dir = heading * (Math.PI / 180);
                    // fog.updateFromPOV(current, radius, dir, Math.PI/2);
                }
           }
         }

        // Add event listener to svg. Disable walking to far.
        if ($('svg')[0]) {
            if (!svgListenerAdded) {
                svgListenerAdded = true;
                $('svg')[0].addEventListener('mousedown', function (e) {
                    showLinks();
                });
            }
        }
    }

    function setViewControlLayerCursor(type) {
        switch(type) {
            case 'ZoomOut':
                $divViewControlLayer.css("cursor", "url(img/cursors/Cursor_ZoomOut.png) 4 4, move");
                break;
            case 'OpenHand':
                $divViewControlLayer.css("cursor", "url(img/cursors/openhand.cur) 4 4, move");
                break;
            case 'ClosedHand':
                $divViewControlLayer.css("cursor", "url(img/cursors/closedhand.cur) 4 4, move");
                break;
            default:
                $divViewControlLayer.css("cursor", "default");
        }
    }

    function showLinks (delay) {
        // Show links

        // This is kind of redundant, but as long as the link arrows have not been
        // moved to user control layer, keep calling the modeSwitchWalkClick()
        // to bring arrows to the top layer. Once loaded, move svLinkArrowsLoaded to true.
        if (!status.svLinkArrowsLoaded) {
            var numPath = $divViewControlLayer.find("path").length;
            if (numPath === 0) {
                makeLinksClickable();
            } else {
                status.svLinkArrowsLoaded = true;
            }
        }

        if (status.hideNonavailablePanoLinks &&
            status.availablePanoIds) {
            $.each($('path'), function (i, v) {
                if ($(v).attr('pano')) {
                    var panoId = $(v).attr('pano');
                    var idx = status.availablePanoIds.indexOf(panoId);

                    if (idx === -1) {
                        $(v).prev().prev().remove();
                        $(v).prev().remove();
                        $(v).remove();
                    } else {
                        //if (properties.browser === 'chrome') {
                        // Somehow chrome does not allow me to select path
                        // and fadeOut. Instead, I'm just manipulating path's style
                        // and making it hidden.
                        $(v).prev().prev().css('visibility', 'visible');
                        $(v).prev().css('visibility', 'visible');
                        $(v).css('visibility', 'visible');
                    }
                }
            });
        } else {
            if (properties.browser === 'chrome') {
                // Somehow chrome does not allow me to select path
                // and fadeOut. Instead, I'm just manipulating path's style
                // and making it hidden.
                $('path').css('visibility', 'visible');
            } else {
                if (!delay) {
                    delay = 0;
                }
                // $('path').show();
                $('path').css('visibility', 'hidden');
            }
        }
    }

    function updateMap () {
        // This function updates the map pane.
        if (svl.panorama) {
            var panoramaPosition = svl.panorama.getPosition();
            map.setCenter(panoramaPosition);

            if (svl.canvas) {
                svl.canvas.clear();
                svl.canvas.setVisibilityBasedOnLocation('visible', svl.getPanoId());
                if (properties.mode === 'Evaluation') {
                    myTables.updateCanvas();
                }
                svl.canvas.render2();
            }

            if (fogSet) {
                fogUpdate();
            }
        } else {
            throw self.className + ' updateMap(): panorama not defined.';
        }
    }

    function updatePov (dx, dy) {
        // Update POV of Street View as a user drag a mouse cursor.
        if (svl.panorama) {
            var pov = svl.panorama.getPov(),
                alpha = 0.25;

            pov.heading -= alpha * dx;
            pov.pitch += alpha * dy;

            //
            // View port restriction.
            // Do not allow users to look up the sky or down the ground.
            // If specified, do not allow users to turn around too much by restricting the heading angle.
            if (pov.pitch > properties.maxPitch) {
                pov.pitch = properties.maxPitch;
            } else if (pov.pitch < properties.minPitch) {
                pov.pitch = properties.minPitch;
            }

            if (properties.minHeading && properties.maxHeading) {
                if (properties.minHeading <= properties.maxHeading) {
                    if (pov.heading > properties.maxHeading) {
                        pov.heading = properties.maxHeading;
                    } else if (pov.heading < properties.minHeading) {
                        pov.heading = properties.minHeading;
                    }
                } else {
                    if (pov.heading < properties.minHeading &&
                        pov.heading > properties.maxHeading) {
                        if (Math.abs(pov.heading - properties.maxHeading) < Math.abs(pov.heading - properties.minHeading)) {
                            pov.heading = properties.maxHeading;
                        } else {
                            pov.heading = properties.minHeading;
                        }
                    }
                }
            }

            //
            // Set the property this object. Then update the Street View image
            properties.panoramaPov = pov;
            svl.panorama.setPov(pov);
        } else {
            throw className + ' updatePov(): panorama not defined!';
        }
    }

    function viewControlLayerMouseDown (e) {
        // This is a callback function that is fired with the mouse down event
        // on the view control layer (where you control street view angle.)
        mouseStatus.isLeftDown = true;
        mouseStatus.leftDownX = mouseposition(e, this).x;
        mouseStatus.leftDownY = mouseposition(e, this).y;

        if (!status.disableWalking) {
            // Setting a cursor
            // http://www.jaycodesign.co.nz/css/cross-browser-css-grab-cursors-for-dragging/
            try {
                if (!svl.keyboard.isShiftDown()) {
                    setViewControlLayerCursor('ClosedHand');
                    // $divViewControlLayer.css("cursor", "url(public/img/cursors/openhand.cur) 4 4, move");
                } else {
                    setViewControlLayerCursor('ZoomOut');
                }
            } catch (e) {
                console.error(e);
            }
        }

        // Adding delegation on SVG elements
        // http://stackoverflow.com/questions/14431361/event-delegation-on-svg-elements
        // Or rather just attach a listener to svg and check it's target.
        if (!status.panoLinkListenerSet) {
            try {
                $('svg')[0].addEventListener('click', function (e) {
                    var targetPanoId = e.target.getAttribute('pano');
                    if (targetPanoId) {
                        svl.tracker.push('WalkTowards', {'TargetPanoId': targetPanoId});
                    }
                });
                status.panoLinkListenerSet = true;
            } catch (err) {

            }
        }

        svl.tracker.push('ViewControl_MouseDown', {x: mouseStatus.leftDownX, y:mouseStatus.leftDownY});
    }

    function viewControlLayerMouseUp (e) {
        // This is a callback function that is called with mouse up event on
        // the view control layer (where you change the Google Street view angle.
        var currTime;

        mouseStatus.isLeftDown = false;
        mouseStatus.leftUpX = mouseposition(e, this).x;
        mouseStatus.leftUpY = mouseposition(e, this).y;
        svl.tracker.push('ViewControl_MouseUp', {x:mouseStatus.leftUpX, y:mouseStatus.leftUpY});

        if (!status.disableWalking) {
            // Setting a mouse cursor
            // http://www.jaycodesign.co.nz/css/cross-browser-css-grab-cursors-for-dragging/
            try {
                if (!svl.keyboard.isShiftDown()) {
                    setViewControlLayerCursor('OpenHand');
                    // $divViewControlLayer.css("cursor", "url(public/img/cursors/openhand.cur) 4 4, move");
                } else {
                    setViewControlLayerCursor('ZoomOut');
                }
            } catch (e) {
                console.error(e);
            }
        }

        currTime = new Date().getTime();

        if (currTime - mouseStatus.prevMouseUpTime < 300) {
            // Double click
            // canvas.doubleClickOnCanvas(mouseStatus.leftUpX, mouseStatus.leftDownY);
            svl.tracker.push('ViewControl_DoubleClick');
            if (svl.keyboard.isShiftDown()) {
                // If Shift is down, then zoom out with double click.
                svl.zoomControl.zoomOut();
                svl.tracker.push('ViewControl_ZoomOut');
            } else {
                // If Shift is up, then zoom in wiht double click.
                // svl.zoomControl.zoomIn();
                svl.zoomControl.pointZoomIn(mouseStatus.leftUpX, mouseStatus.leftUpY);
                svl.tracker.push('ViewControl_ZoomIn');
            }
        }



        mouseStatus.prevMouseUpTime = currTime;
    }

    function viewControlLayerMouseMove (e) {
        // This is a callback function that is fired when a user moves a mouse on the
        // view control layer where you change the pov.
        mouseStatus.currX = mouseposition(e, this).x;
        mouseStatus.currY = mouseposition(e, this).y;

        //
        // Show a link and fade it out
        if (!status.disableWalking) {
            showLinks(2000);
            if (!mouseStatus.isLeftDown) {
                try {
                    if (!svl.keyboard.isShiftDown()) {
                        setViewControlLayerCursor('OpenHand');
                        // $divViewControlLayer.css("cursor", "url(public/img/cursors/openhand.cur) 4 4, move");
                    } else {
                        setViewControlLayerCursor('ZoomOut');
                    }
            } catch (e) {
                    console.error(e);
                }
            } else {

            }
        } else {
            setViewControlLayerCursor('default');
            // $divViewControlLayer.css("cursor", "default");
        }

        if (mouseStatus.isLeftDown &&
            status.disableWalking === false) {
            //
            // If a mouse is being dragged on the control layer, move the sv image.
            var dx = mouseStatus.currX - mouseStatus.prevX;
            var dy = mouseStatus.currY - mouseStatus.prevY;
            var pov = svl.getPOV();
            var zoom = pov.zoom;
            var zoomLevel = svl.zoomFactor[zoom];

            dx = dx / (2 * zoomLevel);
            dy = dy / (2 * zoomLevel);

            //
            // It feels the panning is a little bit slow, so speed it up by 50%.
            dx *= 1.5;
            dy *= 1.5;

            updatePov(dx, dy);
        }

        //
        // Show label delete menu
        if ('canvas' in svl && svl.canvas) {
            var item = svl.canvas.isOn(mouseStatus.currX,  mouseStatus.currY);
            if (item && item.className === "Point") {
                var path = item.belongsTo();
                var selectedLabel = path.belongsTo();

                svl.canvas.setCurrentLabel(selectedLabel);
                svl.canvas.showLabelTag(selectedLabel);
                svl.canvas.clear();
                svl.canvas.render2();
            } else if (item && item.className === "Label") {
                var selectedLabel = item;
                svl.canvas.setCurrentLabel(selectedLabel);
                svl.canvas.showLabelTag(selectedLabel);
            } else if (item && item.className === "Path") {
                var label = item.belongsTo();
                svl.canvas.clear();
                svl.canvas.render2();
                svl.canvas.showLabelTag(label);
            }
            else {
                // canvas.hideDeleteLabel();
                svl.canvas.showLabelTag(undefined);
                svl.canvas.setCurrentLabel(undefined);
            }
        }

        mouseStatus.prevX = mouseposition(e, this).x;
        mouseStatus.prevY = mouseposition(e, this).y;
    }

    function viewControlLayerMouseLeave (e) {
        mouseStatus.isLeftDown = false;
    }

    function showDeleteLabelMenu () {
        var item = canvas.isOn(mouseStatus.currX,  mouseStatus.currY);
        if (item && item.className === "Point") {
            var selectedLabel = item.belongsTo().belongsTo();
            if (selectedLabel === canvas.getCurrentLabel()) {
                canvas.showDeleteLabel(mouseStatus.currX, mouseStatus.currY);
            }
        }
    }

    ////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////
    self.disableWalking = function () {
        if (!status.lockDisableWalking) {
            disableWalking();
            return this;
        } else {
            return false;
        }
    };

    self.enableWalking = function () {
        // This method enables users to walk and change the camera angle.
        if (!status.lockDisableWalking) {
            enableWalking();
            return this;
        } else {
            return false;
        }
    };

    self.getInitialPanoId = function () {
        // This method returns the panorama id of the position this user is dropped.
        return properties.initialPanoId;
    };

    self.getMaxPitch = function () {
        // This method returns a max pitch
        return properties.maxPitch;
    };

    self.getMinPitch = function () {
        // This method returns a min pitch
        return properties.minPitch;
    };

    self.getProperty = function (prop) {
        // This method returns a value of a specified property.
        if (prop in properties) {
            return properties[prop];
        } else {
            return false;
        }
    };

    self.hideLinks = function () {
        // This method hides links (arrows to adjacent panoramas.)
        hideLinks();
        return this;
    };

    self.lockDisableWalking = function () {
        // This method locks status.disableWalking
        status.lockDisableWalking = true;
        return this;
    };

    self.lockRenderLabels = function () {
        lock.renderLabels = true;
        return this;
    };

    self.modeSwitchWalkClick = function () {
        // This function brings a div element for drawing labels in front of
        // $svPanoramaLayer = getPanoramaLayer();
        // $svPanoramaLayer.append($divLabelDrawingLayer);
        $divViewControlLayer.css('z-index', '1');
        $divLabelDrawingLayer.css('z-index','0');
        if (!status.disableWalking) {
            // Show the link arrows on top of the panorama
            showLinks();
            // Make links clickable
            makeLinksClickable();
        }
    };

    self.modeSwitchLabelClick = function () {
        // This function
        $divLabelDrawingLayer.css('z-index','1');
        $divViewControlLayer.css('z-index', '0');
        // $divStreetViewHolder.append($divLabelDrawingLayer);

        if (properties.browser === 'mozilla') {
            // A bug in Firefox? The canvas in the div element with the largest z-index.
            $divLabelDrawingLayer.append($canvas);
        }

        hideLinks();

    };

    self.plotMarkers = function () {
        // Examples for plotting markers:
        // https://google-developers.appspot.com/maps/documentation/javascript/examples/icon-complex?hl=fr-FR
        if (canvas) {
            var labels = undefined;
            var labelsLen = 0;
            var prop = undefined;
            var labelType = undefined;
            var latlng = undefined;
            labels = canvas.getLabels();
            labelsLen = labels.length;

            //
            // Clear the map first
            for (var i = 0; i < markers.length; i += 1) {
                markers[i].setMap(null);
            }

            markers = [];
            // Then plot markers
            for (i = 0; i < labelsLen; i++) {
                prop = labels[i].getProperties();
                labelType = prop.labelProperties.labelType;
                latlng = prop.panoramaProperties.latlng;
                if (prop.labelerId.indexOf('Researcher') !== -1) {
                    // Skip researcher labels
                    continue;
                }

                var myLatLng =  new google.maps.LatLng(latlng.lat, latlng.lng);
                var marker = new google.maps.Marker({
                    position: myLatLng,
                    map: map,
                    zIndex: i
                });
                markers.push(marker);
            }
        }
        return false;
    };

    self.setHeadingRange = function (range) {
        // This method sets the minimum and maximum heading angle that users can adjust the Street View camera.
        properties.minHeading = range[0];
        properties.maxHeading = range[1];
        return this;
    };

    self.setMode = function (modeIn) {
        properties.mode = modeIn;
        return this;
    };

    self.setPitchRange = function (range) {
        // This method sets the minimum and maximum pitch angle that users can adjust the Street View camera.
        properties.minPitch = range[0];
        properties.maxPitch = range[1];
        return this;
    };

    self.setPov = function (pov, duration, callback) {
        // Change the pov.
        // If a transition duration is set, smoothly change the pov over the time specified (milli-sec)
        if (('panorama' in svl) && svl.panorama) {
            var currentPov = svl.panorama.getPov();
            var end = false;
            var interval;

            pov.heading = parseInt(pov.heading, 10);
            pov.pitch = parseInt(pov.pitch, 10);
            pov.zoom = parseInt(pov.zoom, 10);

            //
            // Pov restriction
            if (pov.pitch > properties.maxPitch) {
                pov.pitch = properties.maxPitch;
            } else if (pov.pitch < properties.minPitch) {
                pov.pitch = properties.minPitch;
            }

            if (properties.minHeading && properties.maxHeading) {
                if (properties.minHeading <= properties.maxHeading) {
                    if (pov.heading > properties.maxHeading) {
                        pov.heading = properties.maxHeading;
                    } else if (pov.heading < properties.minHeading) {
                        pov.heading = properties.minHeading;
                    }
                } else {
                    if (pov.heading < properties.minHeading &&
                        pov.heading > properties.maxHeading) {
                        if (Math.abs(pov.heading - properties.maxHeading) < Math.abs(pov.heading - properties.minHeading)) {
                            pov.heading = properties.maxHeading;
                        } else {
                            pov.heading = properties.minHeading;
                        }
                    }
                }
            }

            if (duration) {
                var timeSegment = 25; // 25 milli-sec

                // Get how much angle you change over timeSegment of time.
                var cw = (pov.heading - currentPov.heading + 360) % 360;
                var ccw = 360 - cw;
                var headingDelta;
                var headingIncrement;
                if (cw < ccw) {
                    headingIncrement = cw * (timeSegment / duration);
                } else {
                    headingIncrement = (-ccw) * (timeSegment / duration);
                }

                var pitchIncrement;
                var pitchDelta = pov.pitch - currentPov.pitch;
                pitchIncrement = pitchDelta * (timeSegment / duration);


                interval = window.setInterval(function () {
                    var headingDelta = pov.heading - currentPov.heading;
                    if (Math.abs(headingDelta) > 1) {
                        //
                        // Update heading angle and pitch angle
                        /*
                        var angle = (360 - pov.heading) + currentPov.heading;
                        if (angle < 180 || angle > 360) {
                            currentPov.heading -= headingIncrement;
                        } else {
                            currentPov.heading += headingIncrement;
                        }
                        */
                        currentPov.heading += headingIncrement;
                        currentPov.pitch += pitchIncrement;
                        currentPov.heading = (currentPov.heading + 360) % 360; //Math.ceil(currentPov.heading);
                        currentPov.pitch = currentPov.pitch; // Math.ceil(currentPov.pitch);
                        svl.panorama.setPov(currentPov);
                    } else {
                        //
                        // Set the pov to adjust the zoom level. Then clear the interval.
                        // Invoke a callback function if there is one.
                        if (!pov.zoom) {
                            pov.zoom = 1;
                        }
                        //pov.heading = Math.ceil(pov.heading);
                        //pov.pitch = Math.ceil(pov.pitch);
                        svl.panorama.setZoom(pov.zoom);
                        window.clearInterval(interval);
                        if (callback) {
                            callback();
                        }
                    }
                }, timeSegment);


            } else {
                svl.panorama.setPov(pov);
            }
        }

        return this;
    };

    self.setStatus = function (key, value) {
        // This funciton sets the current status of the instantiated object
        if (key in status) {


            // if the key is disableWalking, invoke walk disabling/enabling function
            if (key === "disableWalking") {
                if (typeof value === "boolean") {
                    if (value) {
                        disableWalking();
                    } else {
                        enableWalking();
                    }
                } else {
                    return false
                }
            } else {
                status[key] = value;
            }
            return this;
        }
        return false;
    };

    self.unlockDisableWalking = function () {
        status.lockDisableWalking = false;
        return this;
    };

    self.unlockRenderLabels = function () {
        lock.renderLabels = false;
        return this;
    };

    self.test = function () {
        canvas.testCases.renderLabels();
    };

    init(params);
    return self;
}

var svl = svl || {};

/**
 * A MessageBox module
 * @param $
 * @param param
 * @returns {{className: string}}
 * @constructor
 * @memberof svl
 */
function MessageBox ($, param) {
    var self = {className: 'MessageBox'};
    var OKButton = '<button id="MessageBoxOkButton" class="button" style="position: absolute; bottom: 10px; left: 10px;">OK</button>';

    // jQuery elements
    var $divMessageBoxHolder;
    var $divMessageBox;


    function init () {
        $divMessageBoxHolder = $("#message-box-holder");
        $divMessageBox = $("#message-box");
    }

    self.setMessage = function (message) {
        $divMessageBox.html(message);
        return this;
    };

    self.setPosition = function (x, y, width, height, background) {
        if (x && typeof x == 'number') {
            x = x + 'px';
        }
        if (y && typeof y === 'number') {
            y = y + 'px';
        }

        if (!width) {
            width = '240px';
        } else if (typeof width === 'number') {
            width = width + 'px';
        }

        if (height && typeof height === 'number') {
            height = height + 'px';
        }

        if (!background) {
            background = false;
        }

        if (background) {
            $divMessageBoxHolder.css({
                height: '100%',
                left: '0px',
                top: '0px',
                visibility: 'visible',
                width: '100%',
                zIndex: 1000
            });
            $divMessageBox.css({
                left: x,
                top: y,
                width: width,
                zIndex: 1000
            });
            if (height) {
                $divMessageBox.css('height', height);
            }
        } else {
            $divMessageBoxHolder.css({
                height: '1px',
                left: x,
                top: y,
                width: '1px',
                zIndex: 1000
            });
            $divMessageBox.css({
                left: '0px',
                top: '0px',
                width: width
            });
            if (height) {
                $divMessageBox.css('height', height);
            }
        }
        return this;
    };

    self.appendOKButton = function (message) {
        $divMessageBox.css('padding-bottom', '50px');
        $divMessageBox.append(OKButton);

        $("#MessageBoxOkButton").on('click', function () {
            if ('tracker' in svl && svl.tracker) {
                if (message) {
                    svl.tracker.push('MessageBox_ClickOk', {message: message});
                } else {
                    svl.tracker.push('MessageBox_ClickOk');
                }
            }
            $divMessageBoxHolder.css({
                visibility: 'hidden'
            });
            $divMessageBox.css({
                'padding-bottom': '',
                'visibility' : 'hidden'
            });
            $("#MessageBoxOkButton").remove();
        });
    };

    self.hide = function () {
        // This method hides the message box.
        $divMessageBox.css('visibility', 'hidden');
        $divMessageBoxHolder.css('visibility', 'hidden');
        return this;
    };

    self.show = function (disableOtherInteraction) {
        // This method shows a messaage box on the page.
        if (!disableOtherInteraction) {
            disableOtherInteraction = false;
        }

        $divMessageBox.css('visibility', 'visible');
        if (disableOtherInteraction) {
            $divMessageBoxHolder.css('visibility', 'visible');
        }
        return this;
    };

    init();
    return self;
}

var svl = svl || {};

/**
 * A MissionDescription module
 * @param $
 * @param params
 * @returns {{className: string}}
 * @constructor
 * @memberof svl
 */
function MissionDescription ($, params) {
    var self = {
        className : 'MissionDescription'
    };
    var properties = {};
    var status = {};

    // jQuery elements
    var $currentStatusDescription;

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////////////////////////////////////////////
    function init (params) {
        // Initialize DOM elements
        if (svl.ui && svl.ui.missinDescription) {
          // $currentStatusDescription = $(params.domIds.descriptionMessage);
          $currentStatusDescription = svl.ui.missinDescription.description;
          $currentStatusDescription.html(params.description);
        }
    }


    ////////////////////////////////////////////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////////////////////////////////////////////
    /**
     * The method sets what's shown in the current status pane in the interface
     * @param description {string} A string (or html) to put.
     * @returns {self}
     */
    function setCurrentStatusDescription (description) {
      if (svl.ui && svl.ui.missinDescription) {
        $currentStatusDescription.html(description);
      }
      return this;
    }

    self.setCurrentStatusDescription = setCurrentStatusDescription;
    init(params);
    return self;
}

var svl = svl || {};

/**
 *
 * @param $ {object} jQuery object
 * @param params {object} other parameters
 * @returns {{className: string}}
 * @constructor
 * @memberof svl
 */
function OverlayMessageBox ($, params) {
    var self = {
            'className' : 'OverlayMessageBox'
        };
    var properties = {
            'visibility' : 'visible'
        };
    var status = {};

    var $divOverlayMessage;
    var $divOverlayMessageBox;

    ////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////
    function init() {
        // Initialization function.
        if (svl.ui && svl.ui.overlayMessage) {
          $divOverlayMessage = svl.ui.overlayMessage.message;
          $divOverlayMessageBox = svl.ui.overlayMessage.box;

          self.setMessage('Walk');
        }

    }

    ////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////
    self.setMessage = function (mode, message) {
        var instructions = svl.misc.getLabelInstructions(),
            labelColors = svl.misc.getLabelColors();

        if ((mode in instructions) &&
            (mode in labelColors)) {
            // Set the box color.
            var modeColor = labelColors[mode];
            var backgroundColor = changeAlphaRGBA(modeColor.fillStyle, 0.85);
            backgroundColor = changeDarknessRGBA(backgroundColor, 0.35);
            $divOverlayMessageBox.css({
                'background' : backgroundColor
            });
            $divOverlayMessage.css({
                'color' : instructions[mode].textColor
            });

            // Set the instructional message.
            if (message) {
                // Manually set a message.
                $divOverlayMessage.html(message);
            } else {
                // Otherwise use the pre set message
                $divOverlayMessage.html('<strong>' + instructions[mode].instructionalText + '</strong>');
            }
            return this;
        } else {
            return false;
        }
    };

    self.setVisibility = function (val) {
        // Set the visibility to visible or hidden.
        if (val === 'visible' || val === 'hidden') {
            properties.visibility = val;
        }
        return this;
    };

    ////////////////////////////////////////
    // Initialization
    ////////////////////////////////////////
    init();

    return self;
}

var svl = svl || {};

/**
 *
 * @param points
 * @param params
 * @returns {{className: string, points: undefined}}
 * @constructor
 * @memberof svl
 */
function Path (points, params) {
    // Path object constructor
    // This class object holds an array of Point objects.
    //
    // For canvas properties, take a look at:
    // https://developer.mozilla.org/en-US/docs/HTML/Canvas/Tutorial/Applying_styles_and_colors
    //
    var oPublic = {
         className : 'Path',
         points : undefined
    };
    var belongsTo;
    var properties = {
        fillStyle: 'rgba(255,255,255,0.5)',
        lineCap : 'round', // ['butt','round','square']
        lineJoin : 'round', // ['round','bevel','miter']
        lineWidth : '3',
        numPoints: points.length,
        originalFillStyle: undefined,
        originalStrokeStyle: undefined,
        strokeStyle : 'rgba(255,255,255,1)',
        strokeStyle_bg : 'rgba(255,255,255,1)' //potentially delete
    };
    var status = {
        visibility: 'visible'
    };

    ////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////
    function _init(points, params) {
        var lenPoints;
        var i;
        oPublic.points = points;
        lenPoints = points.length;

        // Set belongs to of the points
        for (i = 0; i < lenPoints; i += 1) {
            points[i].setBelongsTo(oPublic);
        };

        if (params) {
            for (var attr in params) {
                if (attr in properties) {
                    properties[attr] = params[attr];
                };
            };
        };

        properties.fillStyle = changeAlphaRGBA(points[0].getProperty('fillStyleInnerCircle'), 0.5);
        properties.originalFillStyle = properties.fillStyle;
        properties.originalStrokeStyle = properties.strokeStyle;
    }

    function getLineWidth () {
      // return line width
      return properties.lineWidth;
    }
    function getFill() {
      // get fill
      return properties.fillStyle;
    }

    function setFill(fill) {
      properties.fillStyle = fill;
    }

    function getBoundingBox(povIn) {
      // This function checks if a mouse cursor is on any of a points and return
      var j;
      var len;
      var canvasCoords;
      var pov = povIn ? povIn : getPOV(); // Todo. Get rid of the getPOV() global function.
      var xMax = -1;
      var xMin = 1000000;
      var yMax = -1;
      var yMin = 1000000;

      //
      // Check on points
      canvasCoords = getCanvasCoordinates(pov);
      len = canvasCoords.length;

      for (j = 0; j < len; j += 1) {
        var coord = canvasCoords[j];

        if (coord.x < xMin) {
          xMin = coord.x;
        }
        if (coord.x > xMax) {
          xMax = coord.x;
        }
        if (coord.y < yMin) {
          yMin = coord.y;
        }
        if (coord.y > yMax) {
          yMax = coord.y;
        }
      }

      return {
        x: xMin,
        y: yMin,
        width: xMax - xMin,
        height: yMax - yMin
      };
    }

    function getSvImageBoundingBox() {
      // this method returns a bounding box in terms of svImage coordinates.
      var i;
      var coord;
      var coordinates = getImageCoordinates();
      var len = coordinates.length;
      var xMax = -1;
      var xMin = 1000000;
      var yMax = -1000000;
      var yMin = 1000000;
      var boundary = false;

      //
      // Check if thie is an boundary case
      for (i = 0; i < len; i++) {
        coord = coordinates[i];
        if (coord.x < xMin) {
          xMin = coord.x;
        }
        if (coord.x > xMax) {
          xMax = coord.x;
        }
        if (coord.y < yMin) {
          yMin = coord.y;
        }
        if (coord.y > yMax) {
          yMax = coord.y;
        }
      }

      if (xMax - xMin > 5000) {
        boundary = true;
        xMax = -1;
        xMin = 1000000;

        for (i = 0; i < len; i++) {
          coord = coordinates[i];
          if (coord.x > 6000) {
            if (coord.x < xMin) {
              xMin = coord.x;
            }
          } else {
            if (coord.x > xMax){
              xMax = coord.x;
            }
          }
        }
      }

      //
      // If the path is on boundary, swap xMax and xMin.
      if (boundary) {
        return {
          x: xMin,
          y: yMin,
          width: (svl.svImageWidth - xMin) + xMax,
          height: yMax - yMin,
          boundary: true
        }
      } else {
        return {
          x: xMin,
          y: yMin,
          width: xMax - xMin,
          height: yMax - yMin,
          boundary: false
        }
      }
    }

    function getCanvasCoordinates (pov) {
        // Get canvas coordinates of points that constitute the path.
        var imCoords = getImageCoordinates();
        var i;
        var len = imCoords.length;
        var canvasCoord;
        var canvasCoords = [];
        var min = 10000000;
        var max = -1;

        for (i = 0; i < len; i += 1) {
            if (min > imCoords[i].x) {
                min = imCoords[i].x;
            }
            if (max < imCoords[i].x) {
                max = imCoords[i].x;
            }
        }
        // Note canvasWidthInGSVImage is approximately equals to the image width of GSV image that fits in one canvas view
        var canvasWidthInGSVImage = 3328;
        for (i = 0; i < len; i += 1) {
            if (pov.heading < 180) {
                if (max > svl.svImageWidth - canvasWidthInGSVImage) {
                    if (imCoords[i].x > canvasWidthInGSVImage) {
                        imCoords[i].x -= svl.svImageWidth;
                    }
                }
            } else {
                if (min < canvasWidthInGSVImage) {
                    if (imCoords[i].x < svl.svImageWidth - canvasWidthInGSVImage) {
                        imCoords[i].x += svl.svImageWidth;
                    }
                }
            }
            canvasCoord = svl.gsvImageCoordinate2CanvasCoordinate(imCoords[i].x, imCoords[i].y, pov);
            canvasCoords.push(canvasCoord);
        }

        return canvasCoords;
    }


    function getImageCoordinates() {
        var i;
        var len = oPublic.points.length;
        var coords = [];
        for (i = 0; i < len; i += 1) {
            coords.push(oPublic.points[i].getGSVImageCoordinate());
                }
        return coords;
    }

    function getPoints() {
        return points;
      // return point objects in this path
      // Todo
    }

    function renderBoundingBox (ctx) {
        // This function takes a bounding box returned by a method getBoundingBox()
        var boundingBox = getBoundingBox();

        ctx.save();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255,255,255,1)';
        ctx.beginPath();
        ctx.moveTo(boundingBox.x, boundingBox.y);
        ctx.lineTo(boundingBox.x + boundingBox.width, boundingBox.y);
        ctx.lineTo(boundingBox.x + boundingBox.width, boundingBox.y + boundingBox.height);
        ctx.lineTo(boundingBox.x, boundingBox.y + boundingBox.height);
        ctx.lineTo(boundingBox.x, boundingBox.y);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();

        return;
    }

    ////////////////////////////////////////
    // oPublic functions
    ////////////////////////////////////////
    oPublic.belongsTo = function () {
        // This function returns which object (i.e. Label) this Path
        // belongs to.
        if (belongsTo) {
            return belongsTo;
        } else {
            return false;
        }
    };

    oPublic.getPOV = function() {
        return points[0].getPOV();
    }

    oPublic.getBoundingBox = function (pov) {
        // Get a bounding box of this path
        return getBoundingBox(pov);
    };

    oPublic.getLineWidth = function () {
      // get line width
      return getLineWidth();
    };

    oPublic.getFill = function () {
      return getFill();
    };

    oPublic.getFillStyle = function () {
        // Get the fill style.
        return properties.fillStyle;
    };


    oPublic.getSvImageBoundingBox = function () {
        // Get a boudning box
        return getSvImageBoundingBox();
    };


    oPublic.getImageCoordinates = function () {
        // Get the image coordinates of the path.
        return getImageCoordinates();
    };


    oPublic.getPoints = function (reference) {
        // This function returns oPublic.points.
        if (!reference) {
            reference = false;
        }

        if (reference) {
            return oPublic.points;
        } else {
            return $.extend(true, [], oPublic.points);
        }

        // return oPublic.points;
    };


    oPublic.isOn = function (x, y) {
        // This function checks if a mouse cursor is on any of a points and return
        // a point if the cursor is indeed on the point.
        // Otherwise, this function checks if the mouse cursor is on a bounding box
        // of this path. If the cursor is on the bounding box, then this function
        // returns this path object.
        var boundingBox;
        var i;
        var j;
        var point;
        var pointsLen;
        var result;

        //
        // Check if the passed point (x, y) is on any of points.
        pointsLen = oPublic.points.length;
        for (j = 0; j < pointsLen; j += 1) {
            point = oPublic.points[j];
            result = point.isOn(x, y);
            if (result) {
                return result;
            }
        }

        //
        // Check if the passed point (x, y) is on a path bounding box
        boundingBox = getBoundingBox();
        if (boundingBox.x < x &&
            boundingBox.x + boundingBox.width > x &&
            boundingBox.y < y &&
            boundingBox.y + boundingBox.height > y) {
            return this;
        } else {
            return false;
        }
    };

    oPublic.overlap = function (path, mode) {
        // This method calculates the area overlap between this path and another pathpassed as an argument.
        if (!mode) {
            mode = "boundingbox";
        }

        var overlap = 0;

        if (mode === "boundingbox") {
            var boundingbox1 = getSvImageBoundingBox();
            var boundingbox2 = path.getSvImageBoundingBox();
            var xOffset;
            var yOffset;

            //
            // Check if a bounding box is on a boundary
            if (!(boundingbox1.boundary && boundingbox2.boundary)) {
                if (boundingbox1.boundary) {
                    boundingbox1.x = boundingbox1.x - svl.svImageWidth;
                    if (boundingbox2.x > 6000) {
                        boundingbox2.x = boundingbox2.x - svl.svImageWidth;
                    }
                } else if (boundingbox2.boundary) {
                    boundingbox2.x = boundingbox2.x - svl.svImageWidth;
                    if (boundingbox1.x > 6000) {
                        boundingbox1.x = boundingbox1.x - svl.svImageWidth;
                    }
                }
            }


            if (boundingbox1.x < boundingbox2.x) {
                xOffset = boundingbox1.x;
            } else {
                xOffset = boundingbox2.x;
            }
            if (boundingbox1.y < boundingbox2.y) {
                yOffset = boundingbox1.y;
            } else {
                yOffset = boundingbox2.y;
            }

            boundingbox1.x -= xOffset;
            boundingbox2.x -= xOffset;
            boundingbox1.y -= yOffset;
            boundingbox2.y -= yOffset;

            var b1x1 = boundingbox1.x
            var b1x2 = boundingbox1.x + boundingbox1.width;
            var b1y1 = boundingbox1.y;
            var b1y2 = boundingbox1.y + boundingbox1.height;
            var b2x1 = boundingbox2.x
            var b2x2 = boundingbox2.x + boundingbox2.width;
            var b2y1 = boundingbox2.y;
            var b2y2 = boundingbox2.y + boundingbox2.height;
            var row = 0;
            var col = 0;
            var rowMax = (b1x2 < b2x2) ? b2x2 : b1x2;
            var colMax = (b1y2 < b2y2) ? b2y2 : b1y2;
            var countUnion = 0;
            var countIntersection = 0;
            var isOnB1 = false;
            var isOnB2 = false;

            for (row = 0; row < rowMax; row++) {
                for (col = 0; col < colMax; col++) {
                    isOnB1 = (b1x1 < row && row < b1x2) && (b1y1 < col && col < b1y2);
                    isOnB2 = (b2x1 < row && row < b2x2) && (b2y1 < col && col < b2y2);
                    if (isOnB1 && isOnB2) {
                        countIntersection += 1;
                    }
                    if (isOnB1 || isOnB2) {
                        countUnion += 1;
                    }
                }
            }
            overlap = countIntersection / countUnion;
        }

        return overlap;
    };

    oPublic.removePoints = function () {
        // This method remove all the points in the list points.
        oPublic.points = undefined;
    };

    oPublic.render2 = function (ctx, pov) {
        return oPublic.render(pov, ctx);
    };

    oPublic.render = function (pov, ctx) {
        // This method renders a path.
        //
        // Deprecated: Use render2
        if (status.visibility === 'visible') {
            var pathLen;
            var point;
            var j;

            pathLen = oPublic.points.length;

            // Get canvas coordinates to render a path.
            var canvasCoords = getCanvasCoordinates(pov);

            // Render fills
            point = oPublic.points[0];
            ctx.save();
            ctx.beginPath();

            if (!properties.fillStyle) {
                properties.fillStyle = changeAlphaRGBA(point.getProperty('fillStyleInnerCircle'), 0.5);
                properties.originalFillStyle = properties.fillStyle;
                ctx.fillStyle = properties.fillStyle;
            } else {
                ctx.fillStyle = properties.fillStyle;
            }

            // ctx.moveTo(point.getCanvasCoordinate(pov).x, point.getCanvasCoordinate(pov).y);
            ctx.moveTo(canvasCoords[0].x, canvasCoords[0].y);
            for (j = 1; j < pathLen; j += 1) {
                // ctx.lineTo(point.getCanvasCoordinate(pov).x, point.getCanvasCoordinate(pov).y);
                ctx.lineTo(canvasCoords[j].x, canvasCoords[j].y);
            }
            // point = oPublic.points[0];
            // ctx.lineTo(point.getCanvasCoordinate(pov).x, point.getCanvasCoordinate(pov).y);
            ctx.lineTo(canvasCoords[0].x, canvasCoords[0].y);
            ctx.fill();
            ctx.closePath();
            ctx.restore();

            // Render points
            for (j = 0; j < pathLen; j += 1) {
                point = oPublic.points[j];
                point.render(pov, ctx);
            }

            // Render lines
            for (j = 0; j < pathLen; j += 1) {
                if (j > 0) {
                    var currCoord = canvasCoords[j];
                    var prevCoord = canvasCoords[j - 1];
                } else {
                    var currCoord = canvasCoords[j];
                    var prevCoord = canvasCoords[pathLen - 1];
                }
                var r = point.getProperty('radiusInnerCircle');
                ctx.save();
                ctx.strokeStyle = properties.strokeStyle;
                svl.util.shape.lineWithRoundHead(ctx, prevCoord.x, prevCoord.y, r, currCoord.x, currCoord.y, r);
                ctx.restore();
            }
        }
    };

    oPublic.renderBoundingBox = function (ctx) {
        renderBoundingBox(ctx);
    };

    oPublic.resetFillStyle = function () {
        // This method changes the value of fillStyle to its original fillStyle value
        properties.fillStyle = properties.originalFillStyle;
        return this;
    };

    oPublic.resetStrokeStyle = function () {
        // This method resets the strokeStyle to its original value
        properties.strokeStyle = properties.originalStrokeStyle;
        return this;
    };

    oPublic.setFill = function(fill) {
        // console.log(fill[1]);
        // console.log(fill.substring(4, fill.length-1));
        if(fill.substring(0,4)=='rgba'){
            setFill(fill);
        }
        else{
            setFill('rgba'+fill.substring(3,fill.length-1)+',0.5)');
        }
        return this;
    };

    oPublic.setBelongsTo = function (obj) {
        belongsTo = obj;
        return this;
    };

    oPublic.setLineWidth = function (lineWidth) {
        if(!isNaN(lineWidth)){
            properties.lineWidth  = ''+lineWidth;
        }
        return this;
    };

    oPublic.setFillStyle = function (fill) {
        // This method sets the fillStyle of the path
        if(fill!=undefined){
            properties.fillStyle = fill;
        };
        return this;
    };

    oPublic.setStrokeStyle = function (stroke) {
        // This method sets the strokeStyle of the path
        properties.strokeStyle = stroke;
        return this;
    };

    oPublic.setVisibility = function (visibility) {
        // This method sets the visibility of a path (and points that cons
        if (visibility === 'visible' || visibility === 'hidden') {
            status.visibility = visibility;
        }
        return this;
    };

    // Initialize
    _init(points, params);

    return oPublic;
}

var svl = svl || {};

/**
 *
 * @param x
 * @param y
 * @param pov
 * @param params
 * @returns {{className: string, svImageCoordinate: undefined, canvasCoordinate: undefined, originalCanvasCoordinate: undefined, pov: undefined, originalPov: undefined}}
 * @constructor
 * @memberof svl
 */
function Point (x, y, pov, params) {
  'use strict';
    // Point object constructor.
    //
    // Parameters:
    // - x: x-coordinate of the point on a canvas
    // - y: y-coordinate of the point on a canvas
    if(params.fillStyle==undefined){
        params.fillStyle = 'rgba(255,255,255,0.5)';
    }
    var self = {
            className : 'Point',
            svImageCoordinate : undefined,
            canvasCoordinate : undefined,
            originalCanvasCoordinate : undefined,
            pov : undefined,
            originalPov : undefined
        };
    var belongsTo = undefined;
    var properties = {
        fillStyleInnerCircle: params.fillStyle,
        lineWidthOuterCircle: 2,
        iconImagePath: undefined,
        originalFillStyleInnerCircle: undefined,
        originalStrokeStyleOuterCircle: undefined,
        radiusInnerCircle: 4,
        radiusOuterCircle: 5,
        strokeStyleOuterCircle: 'rgba(255,255,255,1)', // 'rgba(30,30,30,1)',
        storedInDatabase: false
    };
    var unnessesaryProperties = ['originalFillStyleInnerCircle', 'originalStrokeStyleOuterCircle'];
    var status = {
            'deleted' : false,
            'visibility' : 'visible',
            'visibilityIcon' : 'visible'
    };

    function _init (x, y, pov, params) {
        // Convert a canvas coordinate (x, y) into a sv image coordinate
        // Note, svImageCoordinate.x varies from 0 to svImageWidth and
        // svImageCoordinate.y varies from -(svImageHeight/2) to svImageHeight/2.

        //
        // Adjust the zoom level
        var zoom = pov.zoom;
        var zoomFactor = svl.zoomFactor[zoom];
        var svImageHeight = svl.svImageHeight;
        var svImageWidth = svl.svImageWidth;
        self.svImageCoordinate = {};
        self.svImageCoordinate.x = svImageWidth * pov.heading / 360 + (svl.alpha_x * (x - (svl.canvasWidth / 2)) / zoomFactor);
        self.svImageCoordinate.y = (svImageHeight / 2) * pov.pitch / 90 + (svl.alpha_y * (y - (svl.canvasHeight / 2)) / zoomFactor);
        // svImageCoordinate.x could be negative, so adjust it.
        if (self.svImageCoordinate.x < 0) {
            self.svImageCoordinate.x = self.svImageCoordinate.x + svImageWidth;
        }
        // Keep the original canvas coordinate and
        // canvas pov just in case.
        self.canvasCoordinate = {
            x : x,
            y : y
        };
        self.originalCanvasCoordinate = {
            x : x,
            y : y
        };
        self.pov = {
            heading : pov.heading,
            pitch : pov.pitch,
            zoom : pov.zoom
        };
        self.originalPov = {
            heading : pov.heading,
            pitch : pov.pitch,
            zoom : pov.zoom
        };

        // Set properties
        for (var propName in properties) {
            // It is ok if iconImagePath is not specified
            if(propName === "iconImagePath") {
                if (params.iconImagePath) {
                    properties.iconImagePath = params.iconImagePath;
                } else {
                    continue;
                }
            }

            if (propName in params) {
                properties[propName] = params[propName];
            } else {
                // See if this property must be set.
                if (unnessesaryProperties.indexOf(propName) === -1) {
                    // throw self.className + ': "' + propName + '" is not defined.';
                }
            }
        }

        properties.originalFillStyleInnerCircle = properties.fillStyleInnerCircle;
        properties.originalStrokeStyleOuterCircle = properties.strokeStyleOuterCircle;
        return true;
    }


    function _init2 () {
        return true;
    }

    function getCanvasX () {
      return self.canvasCoordinate.x;
    }

    function getCanvasY () {
      return self.canvasCoordinate.y;
    }

    function getFill () {
        // return the fill color of this point
      return properties.fillStyleInnerCircle;
    }
    function getPOV () {
        return pov;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////////////////////////////////////////////
    self.belongsTo = function () {
        // This function returns an object directly above this object.
        // I.e., it returns which path it belongs to.
        if (belongsTo) {
            return belongsTo;
        } else {
            return false;
        }
    };

    self.getPOV = function() {
        return getPOV();
    };

    self.getCanvasCoordinate = function (pov) {
        // This function takes current pov of the Street View as a parameter
        // and returns a canvas coordinate of a point.

        //
        // POV adjustment
        self.canvasCoordinate = svl.gsvImageCoordinate2CanvasCoordinate(self.svImageCoordinate.x, self.svImageCoordinate.y, pov);
        return svl.gsvImageCoordinate2CanvasCoordinate(self.svImageCoordinate.x, self.svImageCoordinate.y, pov);
    };

    self.getCanvasX = getCanvasX;
    self.getCanvasY = getCanvasY;
    self.getFill = getFill;

    self.getFillStyle = function () {
        // Get the fill style.
        // return properties.fillStyle;
        return  getFill();
    };

    self.getGSVImageCoordinate = function () {
        return $.extend(true, {}, self.svImageCoordinate);
    };

    self.getProperty = function (name) {
        if (!(name in properties)) {
            throw self.className + ' : A property name "' + name + '" does not exist in properties.';
        }
        return properties[name];
    };


    self.getProperties = function () {
        // Return the deep copy of the properties object,
        // so the caller can only modify properties from
        // setProperties() (which I have not implemented.)
        //
        // JavaScript Deepcopy
        // http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-a-javascript-object
        return $.extend(true, {}, properties);
    };


    self.isOn = function (x, y) {
        var margin = properties.radiusOuterCircle / 2 + 3;
        if (x < self.canvasCoordinate.x + margin &&
            x > self.canvasCoordinate.x - margin &&
            y < self.canvasCoordinate.y + margin &&
            y > self.canvasCoordinate.y - margin) {
            return this;
        } else {
            return false;
        }
    };


    /**
     *
     * @param pov
     * @param ctx
     */
    self.render = function (pov, ctx) {
        // Render points
        if (status.visibility === 'visible') {
            var coord;
            var x;
            var y;
            var r = properties.radiusInnerCircle;
            coord = self.getCanvasCoordinate(pov);
            x = coord.x;
            y = coord.y;

            ctx.save();
            ctx.strokeStyle = properties.strokeStyleOuterCircle;
            ctx.lineWidth = properties.lineWidthOuterCircle;
            ctx.beginPath();
            ctx.arc(x, y, properties.radiusOuterCircle, 2 * Math.PI, 0, true);
            ctx.closePath();
            ctx.stroke();
            ctx.fillStyle = properties.fillStyleInnerCircle; // changeAlphaRGBA(properties.fillStyleInnerCircle, 0.5);
            ctx.beginPath();
            ctx.arc(x, y, properties.radiusInnerCircle, 2 * Math.PI, 0, true);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

    };

    self.resetFillStyle = function () {
        // This method reverts the fillStyle property to its original value
        properties.fillStyleInnerCircle = properties.originalFillStyleInnerCircle;
        return this;
    };

    self.resetSVImageCoordinate = function (coord) {
        // Set the svImageCoordinate
        self.svImageCoordinate = coord;
        self.canvasCoordinate = {x : 0, y: 0};
        return this;
    };

    self.resetStrokeStyle = function () {
        // This method resets the strokeStyle to its original value
        properties.strokeStyleOuterCircle = properties.originalStrokeStyleOuterCircle;
        return this;
    };

    self.setBelongsTo = function (obj) {
        // This function sets which object (Path)
        // The point belongs to.
        belongsTo = obj;
        return this;
    };

    self.setFillStyle = function (value) {
        // This method sets the fill style of inner circle to the specified value
        properties.fillStyleInnerCircle = value;
        return this;
    };

    self.setIconPath = function (iconPath) {
        properties.iconImagePath = iconPath;
        return this;
    };

    self.setPhotographerPov = function (heading, pitch) {
        // this method sets the photographerHeading and photographerPitch
        properties.photographerHeading = heading;
        properties.photographerPitch = pitch;
        return this;
    };

    self.setProperties = function (params) {
        // This function resets all the properties specified in params.
        for (var key in params) {
            if (key in properties) {
                properties[key] = params[key];
            }
        }

        if ('originalCanvasCoordinate' in params) {
            self.originalCanvasCoordinate = params.originalCanvasCoordinate;
        }

        //
        // Set pov parameters
        self.pov = self.pov || {};
        if ('pov' in params) {
            self.pov = params.pov;
        }

        if ('heading' in params) {
            self.pov.heading = params.heading;
        }

        if ('pitch' in params) {
            self.pov.pitch = params.pitch;
        }

        if ('zoom' in params) {
            self.pov.zoom = params.zoom;
        }

        //
        // Set original pov parameters
        self.originalPov = self.originalPov || {};
        if ('originalHeading' in params) {
            self.originalPov.heading = params.originalHeading;
        }

        if ('originalPitch' in params) {
            self.originalPov.pitch = params.originalPitch;
        }

        if ('originalZoom' in params) {
            self.originalPov.zoom = params.originalZoom;
        }


        if (!properties.originalFillStyleInnerCircle) {
            properties.originalFillStyleInnerCircle = properties.fillStyleInnerCircle;
        }
        if (!properties.originalStrokeStyleOuterCircle) {
            properties.originalStrokeStyleOuterCircle = properties.strokeStyleOuterCircle;
        }
        return this;
    };

    self.setStrokeStyle = function (val) {
        // This method sets the strokeStyle of an outer circle to val
        properties.strokeStyleOuterCircle = val;
        return this;
    };

    self.setVisibility = function (visibility) {
        // This method sets the visibility of a path (and points that cons
        if (visibility === 'visible' || visibility === 'hidden') {
            status.visibility = visibility;
        }
        return this;
    };

    // Todo. Deprecated method. Get rid of this later.
    self.resetProperties = self.setProperties;

    ////////////////////////////////////////////////////////////////////////////////
    // Initialization
    ////////////////////////////////////////////////////////////////////////////////
    var argLen = arguments.length;
    if (argLen === 4) {
        _init(x, y, pov, params);
    } else {
        _init2();
    }

    return self;
}


svl.gsvImageCoordinate2CanvasCoordinate = function (xIn, yIn, pov) {
    // This function takes the current pov of the Street View as a parameter
    // and returns a canvas coordinate of a point (xIn, yIn).
    var x;
    var y;
    var zoom = pov.zoom;
    var svImageWidth = svl.svImageWidth * svl.zoomFactor[zoom];
    var svImageHeight = svl.svImageHeight * svl.zoomFactor[zoom];

    xIn = xIn * svl.zoomFactor[zoom];
    yIn = yIn * svl.zoomFactor[zoom];

    x = xIn - (svImageWidth * pov.heading) / 360;
    x = x / svl.alpha_x + svl.canvasWidth / 2;

    //
    // When POV is near 0 or near 360, points near the two vertical edges of
    // the SV image does not appear. Adjust accordingly.
    var edgeOfSvImageThresh = 360 * svl.alpha_x * (svl.canvasWidth / 2) / (svImageWidth) + 10;

    if (pov.heading < edgeOfSvImageThresh) {
        // Update the canvas coordinate of the point if
        // its svImageCoordinate.x is larger than svImageWidth - alpha_x * (svl.canvasWidth / 2).
        if (svImageWidth - svl.alpha_x * (svl.canvasWidth / 2) < xIn) {
            x = (xIn - svImageWidth) - (svImageWidth * pov.heading) / 360;
            x = x / svl.alpha_x + svl.canvasWidth / 2;
        }
    } else if (pov.heading > 360 - edgeOfSvImageThresh) {
        if (svl.alpha_x * (svl.canvasWidth / 2) > xIn) {
            x = (xIn + svImageWidth) - (svImageWidth * pov.heading) / 360;
            x = x / svl.alpha_x + svl.canvasWidth / 2;
        }
    }

    y = yIn - (svImageHeight / 2) * (pov.pitch / 90);
    y = y / svl.alpha_y + svl.canvasHeight / 2;


    //
    // Adjust the zoom level
    //
    //var zoomFactor = svl.zoomFactor[zoom];
    //x = x * zoomFactor;
    //y = y * zoomFactor;


    return {x : x, y : y};
};

svl.zoomFactor = {
    1: 1,
    2: 2.1,
    3: 4,
    4: 8,
    5: 16
};

var svl = svl || {};

/**
 *
 * @param $
 * @param params
 * @returns {{className: string}}
 * @constructor
 */
function ProgressFeedback ($, params) {
    var self = {
        className : 'ProgressFeedback'
    };
    var properties = {
        progressBarWidth : undefined
    };
    var status = {
        progress : undefined
    };

    // jQuery elements
    var $progressBarContainer;
    var $progressBarFilled;
    var $progressMessage;

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////////////////////////////////////////////
    function init (params) {
        $progressBarContainer = $("#ProgressBarContainer");
        $progressBarFilled = $("#ProgressBarFilled");
        $progressMessage = $("#Progress_Message");

        properties.progressBarWidth = $progressBarContainer.width();

        if (params && params.message) {
            self.setMessage(params.message);
        } else {
            self.setMessage('');
        }

        self.setProgress(0);
    }


    ////////////////////////////////////////////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////////////////////////////////////////////
    self.setMessage = function (message) {
        // This function sets a message box in the feedback area.
        $progressMessage.html(message);
    };


    self.setProgress = function (progress) {
        // Check if the passed argument is a number. If not, try parsing it as a
        // float value. If it fails (if parseFloat returns NaN), then throw an error.
        if (typeof progress !== "number") {
            progress = parseFloat(progress);
        }

        if (progress === NaN) {
            throw new TypeError(self.className + ': The passed value cannot be parsed.');
        }

        if (progress > 1) {
            progress = 1.0;
            console.error(self.className + ': You can not pass a value larger than 1 to setProgress.');
        }

        status.progress = progress;

        if (properties.progressBarWidth) {
            var r;
            var g;
            var color;

            if (progress < 0.5) {
                r = 255;
                g = parseInt(255 * progress * 2);
            } else {
                r = parseInt(255 * (1 - progress) * 2);
                g = 255;
            }

            color = 'rgba(' + r + ',' + g + ',0,1)';
            $progressBarFilled.css({
                background: color,
                width: progress * properties.progressBarWidth
            });
        }

        return this;
    };

    init(params);
    return self;
}

var svl = svl || {};

/**
 *
 * @param $
 * @param param
 * @returns {{className: string}}
 * @constructor
 */
function ProgressPov ($, param) {
    var oPublic = {className: 'ProgressPov'};
    var status = {
        currentCompletionRate: 0,
        previousHeading: 0,
        surveyedAngles: undefined
    };
    var properties = {};

    var $divCurrentCompletionRate;
    var $divCurrentCompletionBar;
    var $divCurrentCompletionBarFiller;

    ////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////
    function _init(param) {
        $divCurrentCompletionRate = svl.ui.progressPov.rate;
        $divCurrentCompletionBar = svl.ui.progressPov.bar;
        $divCurrentCompletionBarFiller = svl.ui.progressPov.filler;

        //
        // Fill in the surveyed angles
        status.surveyedAngles = new Array(100);
        for (var i=0; i < 100; i++) {
            status.surveyedAngles[i] = 0;
        }

        if (param && param.pov) {
            status.previousHeading = param.pov.heading;
        } else {
            try {
                var pov = svl.getPov();
                status.previousHeading = pov.heading;
            } catch (e) {
                status.previousHeading = 0;
            }
        }


        printCompletionRate();
    }

    function printCompletionRate () {
        // This method prints what percent of the intersection the user has observed.
        var completionRate = oPublic.getCompletionRate() * 100;
        completionRate = completionRate.toFixed(0, 10);
        completionRate = completionRate + "%";
        $divCurrentCompletionRate.html(completionRate);
        return this;
    }

    function oneDimensionalMorphology (arr, radius) {
        if (!radius) {
            radius = 5;
        }

        var newArr = new Array(arr.length);
        var len = arr.length;
        var i;
        var r;
        var rIndex;

        for (i = 0; i < len; i++) {
            newArr[i] = 0;
        }

        //
        // Expand
        for (i = 0; i < len; i++) {
            if (arr[i] == 1) {
                newArr[i] = 1;
                for (r = 1; r < radius; r++) {
                    rIndex = (i + r + len) % len;
                    newArr[rIndex] = 1;
                    rIndex = (i - r + len) % len;
                    newArr[rIndex] = 1;
                }
            }
        }

        var arr = $.extend(true, [], newArr);

        //
        // Contract
        for (i = 0; i < len; i++) {
            if (arr[i] == 0) {
                newArr[i] = 0;
                for (r = 1; r < radius; r++) {
                    rIndex = (i + r + len) % len;
                    newArr[rIndex] = 0;
                    rIndex = (i - r + len) % len;
                    newArr[rIndex] = 0;
                }
            }
        }

        return newArr;
    }

    function updateCompletionBar () {
        // This method updates the filler of the completion bar
        var completionRate = oPublic.getCompletionRate();
        var r;
        var g;
        var color;

        var colorIntensity = 255;
        if (completionRate < 0.5) {
            r = colorIntensity;
            g = parseInt(colorIntensity * completionRate * 2);
        } else {
            r = parseInt(colorIntensity * (1 - completionRate) * 2);
            g = colorIntensity;
        }

        color = 'rgba(' + r + ',' + g + ',0,1)';

        completionRate *=  100;
        completionRate = completionRate.toFixed(0, 10);
        completionRate -= 0.8;
        completionRate = completionRate + "%";
        $divCurrentCompletionBarFiller.css({
            background: color,
            width: completionRate
        });
    }

    function updateCompletionRate () {
        // This method updates the printed completion rate and the bar.
        printCompletionRate();
        updateCompletionBar();
    }

    ////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////
    oPublic.getCompletionRate = function () {
        // This method returns what percent of the intersection the user has observed.
        try {
            if (status.currentCompletionRate < 1) {
                var headingRange = 25;
                var pov = svl.getPOV();
                var heading = pov.heading;
                var headingMin = (heading - headingRange + 360) % 360;
                var headingMax = (heading + headingRange) % 360;
                var indexMin = Math.floor(headingMin / 360 * 100);
                var indexMax = Math.floor(headingMax / 360 * 100);
                var i = 0;
                if (indexMin < indexMax) {
                    for (i = indexMin; i < indexMax; i++) {
                        status.surveyedAngles[i] = 1;
                    }
                } else {
                    for (i = indexMin; i < 100; i++) {
                        status.surveyedAngles[i] = 1;
                    }
                    for (i = 0; i < indexMax; i++) {
                        status.surveyedAngles[i] = 1;
                    }
                }

                //
                // Added Aug 28th.
                // Todo. The part above is redundunt. Fix it later.
                // Fill in gaps in surveyedAngles
                var indexCenter = Math.floor(heading / 360 * 100);
                var previousHeading = status.previousHeading;
                if (heading !== previousHeading) {
                    var previousIndex = Math.floor(previousHeading / 360 * 100);
                    var delta = heading - previousHeading;
                    // if ((delta > 0 && delta < 359) || delta < -359) {
                    if ((delta > 0 && delta < 300) || delta < -300) {
                        // Fill in the gap from left to right
                        for (i = previousIndex;;i++) {
                            if (i == status.surveyedAngles.length) {
                                i = 0;
                            }
                            status.surveyedAngles[i] = 1;
                            if (i == indexCenter) {
                                break;
                            }

                        }
                    } else {
                        // Fill in the gap from right to left.
                        for (i = previousIndex;;i--) {
                            if (i == -1) {
                                i = status.surveyedAngles.length - 1;
                            }
                            status.surveyedAngles[i] = 1;
                            if (i == indexCenter) {
                                break;
                            }

                        }
                    }
                }

                // status.surveyedAngles = oneDimensionalMorphology(status.surveyedAngles);

                var total = status.surveyedAngles.reduce(function(a, b) {return a + b});
                status.currentCompletionRate = total / 100;

                status.previousHeading = heading;
                return total / 100;
            } else {
                return 1;
            }
        } catch (e) {
            return 0;
        }
    };

    oPublic.setCompletedHeading = function (range) {
        // This method manipulates the surveyed angle
        var headingMin = range[0];
        var headingMax = range[1];

        var indexMin = Math.floor(headingMin / 360 * 100);
        var indexMax = Math.floor(headingMax / 360 * 100);

        var i;
        for (i = indexMin; i < indexMax; i++) {
            status.surveyedAngles[i] = 1;
        }

        return this;
    };

    oPublic.updateCompletionRate = function () {
          return updateCompletionRate();
    };

    _init(param);
    return oPublic;
}

var svl = svl || {};

/**
 *
 * @param $
 * @param params
 * @returns {{className: string}}
 * @constructor
 * @memberof svl
 */
function QualificationBadges ($, params) {
    var self = { className : 'QualificationBadges' };
    var properties = {
        badgeClassName : 'Badge',
        badgePlaceHolderImagePath : "public/img/badges/EmptyBadge.png",
        busStopAuditorImagePath : "public/img/badges/Onboarding_BusStopExplorerBadge_Orange.png",
        busStopExplorerImagePath : "public/img/badges/Onboarding_BusStopInspector_Green.png"
    };
    var status = {};

    // jQuery elements
    var $badgeImageHolderBusStopAuditor;
    var $badgeImageHolderBusStopExplorer;

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////////////////////////////////////////////
    function _init (params) {
        $badgeImageHolderBusStopAuditor = $("#BadgeImageHolder_BusStopAuditor");
        $badgeImageHolderBusStopExplorer = $("#BadgeImageHolder_BusStopExplorer");

        // Set the badge field with place holders.
        $badgeImageHolderBusStopAuditor.html('<img src="' + properties.badgePlaceHolderImagePath +
            '" class="' + properties.badgeClassName + '">');
        $badgeImageHolderBusStopExplorer.html('<img src="' + properties.badgePlaceHolderImagePath +
            '" class="' + properties.badgeClassName + '">');
    }


    ////////////////////////////////////////////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////////////////////////////////////////////
    self.giveBusStopAuditorBadge = function () {
        $badgeImageHolderBusStopAuditor.html('<img src="' + properties.busStopAuditorImagePath +
            '" class="' + properties.badgeClassName + '">');
        return this;
    };


    self.giveBusStopExplorerBadge = function () {
        $badgeImageHolderBusStopExplorer.html('<img src="' + properties.busStopExplorerImagePath +
            '" class="' + properties.badgeClassName + '">')
    };

    _init(params);
    return self;
}

var svl = svl || {};

/**
 *
 * @param $
 * @param params
 * @returns {{className: string}}
 * @constructor
 * @memberof svl
 */
function RibbonMenu ($, params) {
    var self = {className: 'RibbonMenu'};
    var properties = {
        borderWidth : "3px",
        modeSwitchDefaultBorderColor : "rgba(200,200,200,0.75)",
        originalBackgroundColor: "white"
    };
    var status = {
            'disableModeSwitch' : false,
            'lockDisableModeSwitch' : false,
            'mode' : 'Walk',
            'selectedLabelType' : undefined
        };

    // jQuery DOM elements
    var $divStreetViewHolder;
    var $ribbonButtonBottomLines;
    var $ribbonConnector;
    var $spansModeSwitches;


    ////////////////////////////////////////
    // Private Functions
    ////////////////////////////////////////
    function _init () {
        //
        /// Set some of initial properties
        var browser = getBrowser();
        if (browser === 'mozilla') {
            properties.originalBackgroundColor = "-moz-linear-gradient(center top , #fff, #eee)";
        } else if (browser === 'msie') {
            properties.originalBackgroundColor = "#ffffff";
        } else {
            properties.originalBackgroundColor = "-webkit-gradient(linear, left top, left bottom, from(#fff), to(#eee))";
        }


        var labelColors = svl.misc.getLabelColors();

        //
        // Initialize the jQuery DOM elements
        if (svl.ui && svl.ui.ribbonMenu) {
          // $divStreetViewHolder = $("#Holder_StreetView");

          $divStreetViewHolder = svl.ui.ribbonMenu.streetViewHolder;
          // $ribbonButtonBottomLines = $(".RibbonModeSwitchHorizontalLine");
          $ribbonButtonBottomLines = svl.ui.ribbonMenu.bottonBottomBorders;
          // $ribbonConnector = $("#StreetViewLabelRibbonConnection");
          $ribbonConnector = svl.ui.ribbonMenu.connector;
          // $spansModeSwitches = $('span.modeSwitch');
          $spansModeSwitches = svl.ui.ribbonMenu.buttons;

          //
          // Initialize the color of the lines at the bottom of ribbon menu icons
          $.each($ribbonButtonBottomLines, function (i, v) {
              var labelType = $(v).attr("value");
              var color = labelColors[labelType].fillStyle;
              if (labelType === 'Walk') {
                  $(v).css('width', '56px');
              }

              $(v).css('border-top-color', color);
              $(v).css('background', color);
          });

          setModeSwitchBorderColors(status.mode);
          setModeSwitchBackgroundColors(status.mode);

          $spansModeSwitches.bind('click', modeSwitchClickCallback);
          $spansModeSwitches.bind({
              'mouseenter': modeSwitchMouseEnter,
              'mouseleave': modeSwitchMouseLeave
          });
        }
    }

    function modeSwitch (mode) {
        // This is a callback method that is invoked with a ribbon menu button click
        var labelType;

        if (typeof mode === 'string') {
            labelType = mode;
        } else {
            labelType = $(this).attr('val');
        }

        if (status.disableModeSwitch === false) {
            // Check if a bus stop sign is labeled or not.
            // If it is not, do not allow a user to switch to modes other than
            // Walk and StopSign.
            var labelColors;
            var ribbonConnectorPositions;
            var borderColor;

            //
            // Whenever the ribbon menu is clicked, cancel drawing.
            if ('canvas' in svl && svl.canvas && svl.canvas.isDrawing()) {
                svl.canvas.cancelDrawing();
            }


            labelColors = getLabelColors();
            ribbonConnectorPositions = getRibbonConnectionPositions();
            borderColor = labelColors[labelType].fillStyle;

            if ('map' in svl && svl.map) {
                if (labelType === 'Walk') {
                    // Switch to walking mode.
                    self.setStatus('mode', 'Walk');
                    self.setStatus('selectedLabelType', undefined);
                    if (svl.map) {
                      svl.map.modeSwitchWalkClick();
                    }
                } else {
                    // Switch to labeling mode.
                    self.setStatus('mode', labelType);
                    self.setStatus('selectedLabelType', labelType);
                    if (svl.map) {
                      svl.map.modeSwitchLabelClick();
                    }
                }
            }
            // Set border color

            if (svl.ui && svl.ui.ribbonMenu) {
              setModeSwitchBorderColors(labelType);
              setModeSwitchBackgroundColors(labelType);
              $ribbonConnector.css("left", ribbonConnectorPositions[labelType].labelRibbonConnection);
              $ribbonConnector.css("border-left-color", borderColor);
              $divStreetViewHolder.css("border-color", borderColor);
            }

            // Set the instructional message
            if (svl.overlayMessageBox) {
                svl.overlayMessageBox.setMessage(labelType);
            }
        }
    }

    function modeSwitchClickCallback () {
        if (status.disableModeSwitch === false) {
            var labelType;
            labelType = $(this).attr('val');

            //
            // If allowedMode is set, mode ('walk' or labelType) except for
            // the one set is not allowed
            if (status.allowedMode && status.allowedMode !== labelType) {
                return false;
            }

            //
            // Track the user action
            svl.tracker.push('Click_ModeSwitch_' + labelType);
            modeSwitch(labelType);
        }
    }

    function modeSwitchMouseEnter () {
        if (status.disableModeSwitch === false) {
            // Change the background color and border color of menu buttons
            // But if there is no Bus Stop label, then do not change back ground colors.
            var labelType = $(this).attr("val");

            //
            // If allowedMode is set, mode ('walk' or labelType) except for
            // the one set is not allowed
            if (status.allowedMode && status.allowedMode !== labelType) {
                return false;
            }
            setModeSwitchBackgroundColors(labelType);
            setModeSwitchBorderColors(labelType);
        }
    }

    function modeSwitchMouseLeave () {
        if (status.disableModeSwitch === false) {
            setModeSwitchBorderColors(status.mode);
            setModeSwitchBackgroundColors(status.mode);
        }
    }

    function setModeSwitchBackgroundColors (mode) {
        // background: -moz-linear-gradient(center top , #fff, #eee);
        // background: -webkit-gradient(linear, left top, left bottom, from(#fff), to(#eee));
        if (svl.ui && svl.ui.ribbonMenu) {
          var labelType;
          var labelColors;
          var borderColor;
          var browser;
          var backgroundColor;

          labelColors = getLabelColors();
          borderColor = labelColors[mode].fillStyle;

          $.each($spansModeSwitches, function (i, v) {
              labelType = $(v).attr('val');
              if (labelType === mode) {
                  if (labelType === 'Walk') {
                      backgroundColor = "#ccc";
                  } else {
                      backgroundColor = borderColor;
                  }
                  $(this).css({
                      "background" : backgroundColor
                  });
              } else {
                  backgroundColor = properties.originalBackgroundColor;
                  if (labelType !== status.mode) {
                      // Change background color if the labelType is not the currently selected mode.
                      $(this).css({
                          "background" : backgroundColor
                      });
                  }
              }
          });
      }
      return this;
    }

    function setModeSwitchBorderColors (mode) {
        // This method sets the border color of the ribbon menu buttons
        if (svl.ui && svl.ui.ribbonMenu) {
          var labelType, labelColors, borderColor;
          labelColors = getLabelColors();
          borderColor = labelColors[mode].fillStyle;

          $.each($spansModeSwitches, function (i, v) {
              labelType = $(v).attr('val');
              if (labelType=== mode) {
                  $(this).css({
                      "border-color" : borderColor,
                      "border-style" : "solid",
                      "border-width": properties.borderWidth
                  });
              } else {
                  if (labelType !== status.mode) {
                      // Change background color if the labelType is not the currently selected mode.
                      $(this).css({
                          "border-color" : properties.modeSwitchDefaultBorderColor,
                          "border-style" : "solid",
                          "border-width": properties.borderWidth
                      });

                  }
              }
          });
        }
        return this;
    }

    ////////////////////////////////////////
    // Public Functions
    ////////////////////////////////////////
    self.backToWalk = function () {
        // This function simulates the click on Walk icon
        modeSwitch('Walk');
        return this;
    };


    self.disableModeSwitch = function () {
        if (!status.lockDisableModeSwitch) {
            status.disableModeSwitch = true;
            if (svl.ui && svl.ui.ribbonMenu) {
              $spansModeSwitches.css('opacity', 0.5);
            }
        }
        return this;
    };

    self.disableLandmarkLabels = function () {
        // This function dims landmark labels and
        // also set status.disableLandmarkLabels to true
        if (svl.ui && svl.ui.ribbonMenu) {
          $.each($spansModeSwitches, function (i, v) {
              var labelType = $(v).attr('val');
              if (!(labelType === 'Walk' ||
                  labelType === 'StopSign' ||
                  labelType === 'Landmark_Shelter')
                  ) {
                  $(v).css('opacity', 0.5);
              }
          });
        }
        status.disableLandmarkLabels = true;
        return this;
    };

    self.enableModeSwitch = function () {
        // This method enables mode switch.
        if (!status.lockDisableModeSwitch) {
            status.disableModeSwitch = false;
            if (svl.ui && svl.ui.ribbonMenu) {
              $spansModeSwitches.css('opacity', 1);
            }
        }
        return this;
    };

    self.enableLandmarkLabels = function () {
      if (svl.ui && svl.ui.ribbonMenu) {
        $.each($spansModeSwitches, function (i, v) {
            var labelType = $(v).attr('val');
            $(v).css('opacity', 1);
        });
      }
      status.disableLandmarkLabels = false;
      return this;
    };


    self.lockDisableModeSwitch = function () {
        status.lockDisableModeSwitch = true;
        return this;
    };

    self.modeSwitch = function (labelType) {
        // This function simulates the click on a mode switch icon
        modeSwitch(labelType);
    };

    self.modeSwitchClick = function (labelType) {
        // This function simulates the click on a mode switch icon
        // Todo. Deprecated. Delete when you will refactor this code.
        modeSwitch(labelType);
    };


    self.getStatus = function(key) {
            if (key in status) {
                return status[key];
            } else {
              console.warn(self.className, 'You cannot access a property "' + key + '".');
              return undefined;
            }
    };

    self.setAllowedMode = function (mode) {
        // This method sets the allowed mode.
        status.allowedMode = mode;
        return this;
    };

    self.setStatus = function(name, value) {
        try {
            if (name in status) {
                if (name === 'disableModeSwitch') {
                    if (typeof value === 'boolean') {
                        if (value) {
                            self.disableModeSwitch();
                        } else {
                            self.enableModeSwitch();
                        }
                        return this;
                    } else {
                        return false
                    }
                } else {
                    status[name] = value;
                    return this;
                }
            } else {
                var errMsg = '"' + name + '" is not a modifiable status.';
                throw errMsg;
            }
        } catch (e) {
            console.error(self.className, e);
            return false;
        }

    };

    self.unlockDisableModeSwitch = function () {
        status.lockDisableModeSwitch = false;
        return this;
    };


    _init(params);

    return self;
}

var svl = svl || {};

/**
 *
 * @param params
 * @returns {{className: string}}
 * @constructor
 * @memberof svl
 */
function RightClickMenu (params) {
    var oPublic = {
        'className' : 'RightClickMenu'
        };
    var properties = {

        };
    var status = {
            'currentLabel' : undefined,
            'disableLabelDelete' : false,
            'disableMenuClose' : false,
            'disableMenuSelect' : false,
            'lockDisableMenuSelect' : false,
            'visibilityDeleteMenu' : 'hidden',
            'visibilityBusStopLabelMenu' : 'hidden',
            'visibilityBusStopPositionMenu' : 'hidden',
            'menuPosition' : {
                'x' : -1,
                'y' : -1
            }
        };
    var mouseStatus = {
            currX:0,
            currY:0,
            prevX:0,
            prevY:0,
            leftDownX:0,
            leftDownY:0,
            leftUpX:0,
            leftUpY:0,
            mouseDownOnBusStopLabelMenuBar : false,
            mouseDownOnBusStopPositionMenuBar : false
        };
    var canvas;
    var ribbonMenu;

        // jQuery doms
    // Todo. Do not hard cord dom ids.
    var $divLabelMenu;
    var $divLabelMenuBar;
    var $divDeleteLabelMenu;
    var $divHolderRightClickMenu;
    var $radioBusStopSignTypes;
    var $deleteMenuDeleteButton;
    var $deleteMenuCancelButton;
    var $divBusStopLabelMenuItems;
    var $divBusStopPositionMenu;
    var $divBusStopPositionMenuBar;
    var $divBusStopPositionMenuItems;
    var $btnBusStopPositionMenuBack;
    var $divHolderLabelMenuClose;
    var $divHolderPositionMenuClose;
    var $menuBars;
    var $spanHolderBusStopLabelMenuQuestionMarkIcon;
    var $spanHolderBusStopPositionMenuQuestionMarkIcon;


    ////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////
    function init (params) {
        canvas = params.canvas;
        ribbonMenu = params.ribbonMenu;

        // Todo. Do not hard cord dom ids.
        $divLabelMenu = $("div#labelDrawingLayer_LabelMenu");
        $divLabelMenuBar = $("#labelDrawingLayer_LabelMenuBar");
        $divDeleteLabelMenu = $("div#LabelDeleteMenu");
        $divHolderRightClickMenu = $("div#Holder_RightClickMenu");
        $radioBusStopSignTypes = $("input.Radio_BusStopType");
        $deleteMenuDeleteButton = $("button#LabelDeleteMenu_DeleteButton");
        $deleteMenuCancelButton = $("button#LabelDeleteMenu_CancelButton");

        $divBusStopLabelMenuItems = $(".BusStopLabelMenuItem");
        $divHolderLabelMenuClose = $("#Holder_BusStopLabelMenuOptionCloseIcon");


        // Bus stop relative position menu
        $divBusStopPositionMenu = $("#BusStopPositionMenu");
        $divBusStopPositionMenuBar = $("#BusStopPositionMenu_MenuBar");
        $divBusStopPositionMenuItems = $(".BusStopPositionMenu_MenuItem");
        $btnBusStopPositionMenuBack = $("#BusStopPositinoMenu_BackButton");
        $divHolderPositionMenuClose = $("#Holder_BusStopPositionMenuCloseIcon");

        $menuBars = $(".RightClickMenuBar");

        $spanHolderBusStopLabelMenuQuestionMarkIcon = $('.Holder_BusStopLabelMenuQuestionMarkIcon');
        $spanHolderBusStopPositionMenuQuestionMarkIcon = $('.Holder_BusStopPositionMenuQuestionMarkIcon');

        // Attach listenters
        // $radioBusStopSignTypes.bind('mousedown', radioBusStopSignTypeMouseUp);
        // $deleteMenuDeleteButton.bind('mousedown', deleteMenuDeleteClicked);
        // $deleteMenuCancelButton.bind('mousedown', deleteMenuCancelClicked);

        // Bus stop label menu listeners
        $divBusStopLabelMenuItems.bind('mouseup', divBusStopLabelMenuItemsMouseUp);
        $divBusStopLabelMenuItems.bind('mouseenter', divBusStopLabelMenuItemsMouseEnter);
        $divBusStopLabelMenuItems.bind('mouseleave', divBusStopLabelMenuItemsMouseLeave);

        // Bus stop label menu menu-bar
        $divLabelMenuBar.bind('mousedown', divBusStopLabelMenuBarMouseDown);
        $divLabelMenuBar.bind('mouseup', divBusStopLabelMenuBarMouseUp);
        $divLabelMenuBar.bind('mousemove', divBusStopLabelMenuBarMouseMove);
        $divHolderLabelMenuClose.bind('click', divBusHolderLabelMenuCloseClicked);
        $divHolderLabelMenuClose.bind('mouseenter', divBusHolderLabelMenuCloseMouseEnter);
        $divHolderLabelMenuClose.bind('mouseleave', divBusHolderLabelMenuCloseMouseLeave);

        // Position menu listeners
        $divBusStopPositionMenuItems.bind('mouseup', divBusStopPositionMenuItemsMouseUp);
        $divBusStopPositionMenuItems.bind('mouseenter', divBusStopPositionMenuItemsMouseEnter);
        $divBusStopPositionMenuItems.bind('mouseleave', divBusStopPositionMenuItemsMouseLeave);

        $divBusStopPositionMenuBar.bind('mousedown', divBusStopPositionMenuBarMouseDown);
        $divBusStopPositionMenuBar.bind('mouseup', divBusStopPositionMenuBarMouseUp);
        $divBusStopPositionMenuBar.bind('mousemove', divBusStopPositionMenuBarMouseMove);
        $divHolderPositionMenuClose.bind('click', divBusHolderPositionMenuCloseClicked);
        $divHolderPositionMenuClose.bind('mouseenter', divBusHolderPositionMenuCloseMouseEnter);
        $divHolderPositionMenuClose.bind('mouseleave', divBusHolderPositionMenuCloseMouseLeave);


        // Question marks
        $spanHolderBusStopLabelMenuQuestionMarkIcon.bind({
            'mouseenter' : questionMarkMouseEnter,
            'mouseleave' : questionMarkMouseLeave,
            'mouseup' : questionMarkMouseUp
        });
        $spanHolderBusStopPositionMenuQuestionMarkIcon.bind({
            'mouseenter' : questionMarkMouseEnter,
            'mouseleave' : questionMarkMouseLeave,
            'mouseup' : questionMarkMouseUp
        });
        // menu bars
        $menuBars.bind('mouseenter', menuBarEnter);


        $btnBusStopPositionMenuBack.bind('click', busStopPositionMenuBackButtonClicked);
    }

    function questionMarkMouseEnter (e) {
        $(this).find('.tooltip').css('visibility', 'visible');
    }

    function questionMarkMouseLeave () {
        $(this).find('.tooltip').css('visibility', 'hidden');
    }

    function questionMarkMouseUp (e) {
        // Stopping propagation
        // http://stackoverflow.com/questions/13988427/add-event-listener-to-child-whose-parent-has-event-disabled
        e.stopPropagation();
        var category = $(this).parent().attr('value');
        myExamples.show(category);
    }

    function radioBusStopSignTypeMouseUp (e) {
        // This function is invoked when a user click a radio button in
        // the menu.
        // Show current bus stop label's tag and set subLabelType
        // (e.g. one-leg stop sign, two-leg stop sign)
        // canvas.getCurrentLabel().setStatus('visibilityTag', 'visible');
        oPublic.hideBusStopType();

        // Set the subLabelType of the label (e.g. "StopSign_OneLeg"
        var subLabelType = $(this).attr("val");
        canvas.getCurrentLabel().setSubLabelDescription(subLabelType);
        canvas.clear().render();

        // Snap back to walk mode.
        myMenu.backToWalk();
    }


    ////////////////////////////////////////
    // Private Functions (Bus stop label menu)
    ////////////////////////////////////////
    function menuBarEnter () {
        $(this).css('cursor', 'url(public/img/cursors/openhand.cur) 4 4, move');
    }


    function divBusStopLabelMenuItemsMouseUp () {
        if (!status.disableMenuSelect) {
            // This function is invoked when a user click on a bus stop label menu
            var color, iconImagePath, subLabelType, $menuItem;
            color = getLabelColors()['StopSign'].fillStyle;
            // currentLabel.setStatus('visibilityTag', 'visible');


            // Give a slight mouse click feedback to a user
            $menuItem = $(this);
            $menuItem.css('background','transparent');

            setTimeout(function () {
                $menuItem.css('background', color);
                setTimeout(function() {
                    $menuItem.css('background', 'transparent');

                    // Hide the menu
                    oPublic.hideBusStopType();

                    subLabelType = $menuItem.attr("value");
                    if (!subLabelType) {
                        subLabelType = 'StopSign';
                    }

                    // Set the subLabelType of the label (e.g. "StopSign_OneLeg"
                    status.currentLabel.setSubLabelDescription(subLabelType);
                    iconImagePath = getLabelIconImagePath()[subLabelType].iconImagePath;
                    status.currentLabel.setIconPath(iconImagePath);

                    canvas.clear().render();

                    showBusStopPositionMenu();
                }, 100)
            },100);
        }
    }


    function divBusStopLabelMenuItemsMouseEnter () {
        if (!status.disableMenuSelect) {
            var color = getLabelColors()['StopSign'].fillStyle;
            $(this).css({
                'background': color,
                'cursor' : 'pointer'
            });
            return this;
        }
        return false;
    }


    function divBusStopLabelMenuItemsMouseLeave () {
        if (!status.disableMenuSelect) {
            $(this).css({
                'background' : 'transparent',
                'cursor' : 'default'
            });
            return this;
        }
    }


    //
    // Bus stop label menu menu bar
    //
    function divBusStopLabelMenuBarMouseDown () {
        mouseStatus.mouseDownOnBusStopLabelMenuBar = true;
        $(this).css('cursor', 'url(public/img/cursors/closedhand.cur) 4 4, move');
    }


    function divBusStopLabelMenuBarMouseUp () {
        mouseStatus.mouseDownOnBusStopLabelMenuBar = false;
        $(this).css('cursor', 'url(public/img/cursors/openhand.cur) 4 4, move');
    }


    function divBusStopLabelMenuBarMouseMove (e) {
        if (mouseStatus.mouseDownOnBusStopLabelMenuBar) {
            var left = $divLabelMenu.css('left');
            var top = $divLabelMenu.css('top');
            var dx, dy;

            top = parseInt(top.replace("px", ""));
            left = parseInt(left.replace("px",""));

            dx = e.pageX - mouseStatus.prevX;
            dy = e.pageY - mouseStatus.prevY;
            left += dx;
            top += dy;

            // console.log(left, top, dx, dy);

            $divLabelMenu.css({
                'left' : left,
                'top' : top
            });
        }
        mouseStatus.prevX = e.pageX;
        mouseStatus.prevY = e.pageY;
    }


    function divBusHolderLabelMenuCloseClicked () {
        // Label menu close is clicked
        // First close the menu, then delete the generated label.
        if (!status.disableMenuClose) {
            var prop;

            // Check if Bus stop type and bus stop position is set.
            // If not, set the label as deleted, so when a user do
            // Undo -> Redo the label will be treated as deleted and won't show up
            if (status.currentLabel) {
                prop = status.currentLabel.getProperties();
                if (prop.labelProperties.busStopPosition === 'DefaultValue' ||
                    prop.labelProperties.subLabelDescription === 'DefaultValue') {
                    myCanvas.removeLabel(status.currentLabel);
                    myActionStack.pop();
                }
            }
            mouseStatus.mouseDownOnBusStopLabelMenuBar = false;
            oPublic.hideBusStopType();
            canvas.enableLabeling();
            myMenu.setStatus('disableModeSwitch', false);
        }
    }


    function divBusHolderLabelMenuCloseMouseEnter () {
        if (!status.disableMenuClose) {
            $(this).css('cursor', 'pointer');
        }
    }


    function divBusHolderLabelMenuCloseMouseLeave () {
        $(this).css('cursor', 'default');
    }


    ////////////////////////////////////////
    // Private Functions (Bus stop position menu)
    ////////////////////////////////////////
    function divBusStopPositionMenuItemsMouseUp () {
        if (!status.disableMenuSelect) {
            // Set label values
            var busStopPosition, color, currentLabel, $menuItem;
            color = getLabelColors()['StopSign'].fillStyle;

            status.currentLabel.setStatus('visibilityTag', 'visible');

            $menuItem = $(this);
            $menuItem.css('background','transparent');

            // Set bus stop position (e.g. Next
            busStopPosition = $menuItem.attr('value');
            status.currentLabel.setBusStopPosition(busStopPosition);

            setTimeout(function () {
                $menuItem.css('background', color);
                setTimeout(function() {
                    $menuItem.css('background', 'transparent');

                    // Close the menu
                    hideBusStopPositionMenu();
                    // Snap back to walk mode.
                    myMap.enableWalking();
                    myMenu.backToWalk();
                    // myMap.setStatus('disableWalking', false);
                }, 100)
            },100);
        }
    }


    function divBusStopPositionMenuItemsMouseEnter () {
        if (!status.disableMenuSelect) {
            var color = getLabelColors()['StopSign'].fillStyle;
            $(this).css({
                'background': color,
                'cursor' : 'pointer'
            });
            return this;
        }
    }


    function divBusStopPositionMenuItemsMouseLeave () {
        if (!status.disableMenuSelect) {
            $(this).css({
                'background': 'transparent',
                'cursor' : 'default'
            });
            return this;
        }
    }


    function divBusHolderPositionMenuCloseMouseEnter () {
        if (!status.disableMenuClose) {
            $(this).css({
                'cursor' : 'pointer'
            });
        }
    }


    function divBusHolderPositionMenuCloseMouseLeave () {
        $(this).css({
            'cursor' : 'default'
        });
    }


    function divBusHolderPositionMenuCloseClicked () {
        // Label position menu close is clicked
        // First close the menu, then delete the generated label.
        if (!status.disableMenuClose &&
            status.currentLabel) {
            var prop;

            // Check if Bus stop type and bus stop position is set.
            // If not, set the label as deleted, so when a user do
            // Undo -> Redo the label will be treated as deleted and won't show up
            prop = status.currentLabel.getProperties();
            if (prop.labelProperties.busStopPosition === 'DefaultValue' ||
                prop.labelProperties.subLabelDescription === 'DefaultValue') {
                myCanvas.removeLabel(status.currentLabel);
                myActionStack.pop();
            }

            // Hide the menu
            mouseStatus.mouseDownOnBusStopPositionMenuBar = false;
            hideBusStopPositionMenu();
            canvas.enableLabeling();
            myMenu.setStatus('disableModeSwitch', false);
        }
    }


    //
    // Menu bar
    //
    function divBusStopPositionMenuBarMouseDown (e) {
        mouseStatus.mouseDownOnBusStopPositionMenuBar = true;
        $(this).css('cursor', 'url(public/img/cursors/closedhand.cur) 4 4, move');
    }


    function divBusStopPositionMenuBarMouseUp (e) {
        mouseStatus.mouseDownOnBusStopPositionMenuBar = false;
        $(this).css('cursor', 'url(public/img/cursors/openhand.cur) 4 4, move');
    }


    function divBusStopPositionMenuBarMouseMove (e) {
        if (mouseStatus.mouseDownOnBusStopPositionMenuBar) {
            var left = $divBusStopPositionMenu.css('left');
            var top = $divBusStopPositionMenu.css('top');
            var dx, dy;

            top = parseInt(top.replace("px", ""));
            left = parseInt(left.replace("px",""));

            dx = e.pageX - mouseStatus.prevX;
            dy = e.pageY - mouseStatus.prevY;
            left += dx;
            top += dy;

            // console.log(left, top, dx, dy);

            $divBusStopPositionMenu.css({
                'left' : left,
                'top' : top
            });
        }
        mouseStatus.prevX = e.pageX;
        mouseStatus.prevY = e.pageY;
    }

    function hideBusStopPositionMenu () {
        status.visibilityBusStopPositionMenu = 'hidden';

        $divHolderRightClickMenu.css('visibility', 'hidden');
        $divBusStopPositionMenu.css('visibility', 'hidden');

        if (oPublic.isAllClosed()) {
            canvas.setStatus('disableLabeling', false);
            myMenu.setStatus('disableModeSwitch', false);

            status.disableLabelDelete = false;
            status.currentLabel = undefined;

            myActionStack.unlockDisableRedo().enableRedo().lockDisableRedo();
            myActionStack.unlockDisableUndo().enableUndo().lockDisableUndo();
            myForm.unlockDisableSubmit().enableSubmit().lockDisableSubmit();
            myForm.unlockDisableNoBusStopButton().enableNoBusStopButton().lockDisableNoBusStopButton();
        }
    }


    function showBusStopPositionMenu () {
        var menuX = status.menuPosition.x,
            menuY = status.menuPosition.y;
        status.visibilityBusStopPositionMenu = 'visible';

        // Show the right-click menu layer
        // $divHolderRightClickMenu.css('visibility', 'visible');


        // Set the menu bar color
        $divBusStopPositionMenuBar.css({
            'background' : getLabelColors()['StopSign'].fillStyle
        });


        // If menu position is to low or to much towards right,
        // adjust the position
        if (menuX > 400) {
            menuX -= 300;
        }
        if (menuY > 300) {
            menuY -= 200;
        }

        // Show the bus stop position menu
        $divBusStopPositionMenu.css({
            'visibility': 'visible',
            'position' : 'absolute',
            'left' : menuX,
            'top' : menuY,
            'z-index' : 4
        });

        canvas.setStatus('visibilityMenu', 'visible');
        canvas.disableLabeling();
        myMenu.setStatus('disableModeSwitch', true);
        myActionStack.unlockDisableRedo().disableRedo().lockDisableRedo();
        myActionStack.unlockDisableUndo().disableUndo().lockDisableUndo();
    }


    //
    // Back button
    //
    function busStopPositionMenuBackButtonClicked () {
        // Hide bus stop position menu and show sign label menu.
        var currentLabel = status.currentLabel;
        hideBusStopPositionMenu();
        oPublic.showBusStopType(currentLabel.getCoordinate().x, currentLabel.getCoordinate().y);
    }


    ////////////////////////////////////////
    // Private Functions (Deleting labels)
    ////////////////////////////////////////
    function deleteMenuDeleteClicked() {
        canvas.removeLabel(canvas.getCurrentLabel());
        oPublic.hideDeleteLabel();
        myActionStack.push('deleteLabel', canvas.getCurrentLabel());
    }


    function deleteMenuCancelClicked () {
        oPublic.hideDeleteLabel();
    }


    ////////////////////////////////////////
    // oPublic functions
    ////////////////////////////////////////
    oPublic.close = function () {
        // Esc pressed. close all menu windows
        divBusHolderLabelMenuCloseClicked();
        divBusHolderPositionMenuCloseClicked();
    };


    oPublic.disableMenuClose = function () {
        status.disableMenuClose = true;
        return this;
    };


    oPublic.disableMenuSelect = function () {
        if (!status.lockDisableMenuSelect) {
            status.disableMenuSelect = true;
        }
        return this;
    };


    oPublic.enableMenuClose = function () {
        status.disableMenuClose = false;
        return this;
    };


    oPublic.enableMenuSelect = function () {
        if (!status.lockDisableMenuSelect) {
            status.disableMenuSelect = false;
        }
        return this;
    };


    oPublic.getMenuPosition = function () {
        return {
            x : status.menuPosition.x,
            y : status.menuPosition.y
        };
    };


    oPublic.hideBusStopPosition = function () {
        // Hide the right click menu for choosing a bus stop position.
        hideBusStopPositionMenu();
        return this;
    };


    oPublic.hideBusStopType = function () {
        // Hide the right click menu for choosing a bus stop type.

        // Hide the right-click menu layer
        $divHolderRightClickMenu.css('visibility', 'hidden');

        // Hide the bus stop label menu
        $divLabelMenu.css('visibility', 'hidden');
        status.visibilityBusStopLabelMenu = 'hidden';

        canvas.setStatus('visibilityMenu', 'hidden');

        if (oPublic.isAllClosed()) {
            myActionStack.unlockDisableRedo().enableRedo().lockDisableRedo();
            myActionStack.unlockDisableUndo().enableUndo().lockDisableUndo();
            myForm.unlockDisableSubmit().disableSubmit().lockDisableSubmit();
            myForm.unlockDisableNoBusStopButton().disableNoBusStopButton().lockDisableNoBusStopButton();
        }
    };


    oPublic.hideDeleteLabel = function () {
        // Hide the right-click menu layer
        $divHolderRightClickMenu.css('visibility', 'hidden');
        status.visibilityDeleteMenu = 'hidden';

        $divDeleteLabelMenu.css('visibility', 'hidden');
        canvas.setStatus('visibilityMenu', 'hidden');

        if (oPublic.isAllClosed()) {
            canvas.enableLabeling();
            myMenu.setStatus('disableModeSwitch', false);
        }
    };


    oPublic.isAllClosed = function () {
        // This function checks if all the menu windows are hidden and return true/false
        if (status.visibilityBusStopLabelMenu === 'hidden' &&
            status.visibilityDeleteMenu === 'hidden' &&
            status.visibilityBusStopPositionMenu === 'hidden') {
            return true;
        } else {
            return false;
        }
    };


    oPublic.isAnyOpen = function () {
        // This function checks if any menu windows is open and return true/false
        return !oPublic.isAllClosed();
    };


    oPublic.lockDisableMenuSelect = function () {
        status.lockDisableMenuSelect = true;
        return this;
    };

    oPublic.setStatus = function (key, value) {
        if (key in status) {
            if (key === 'disableMenuClose') {
                if (typeof value === 'boolean') {
                    if (value) {
                        oPublic.enableMenuClose();
                    } else {
                        oPublic.disableMenuClose();
                    }
                    return this;
                } else {
                    return false;
                }
            } else {
                status[key] = value;
                return this;
            }
        }
        return false;
    };


    oPublic.showBusStopType = function (x, y) {
        status.currentLabel = canvas.getCurrentLabel();

        if (status.currentLabel &&
            status.currentLabel.getLabelType() === 'StopSign') {
            // Show bus stop label menu
            var menuX, menuY;

            // Show the right-click menu layer
            $divHolderRightClickMenu.css('visibility', 'visible');
            status.visibilityBusStopLabelMenu = 'visible';

            // Set the menu bar color
            $divLabelMenuBar.css({
                'background' : getLabelColors()['StopSign'].fillStyle
            });


            menuX = x + 25;
            menuY = y + 25;

            // If menu position is to low or to much towards right,
            // adjust the position
            if (menuX > 400) {
                menuX -= 300;
            }
            if (menuY > 300) {
                menuY -= 200;
            }

            status.menuPosition.x = menuX;
            status.menuPosition.y = menuY;

            // Show the bus stop label menu
            $divLabelMenu.css({
                'visibility' : 'visible',
                'position' : 'absolute',
                'left' : menuX,
                'top' : menuY,
                'z-index' : 4
            });
            status.visibilityBusStopLabelMenu = 'visible';

            canvas.setStatus('visibilityMenu', 'visible');
            canvas.setStatus('disableLabeling', true);
            canvas.disableLabeling();
            myMap.setStatus('disableWalking', true);
            myMenu.setStatus('disableModeSwitch', true);
        }

    };


    oPublic.showDeleteLabel = function (x, y) {
        // This function shows a menu to delete a label that is in
        // canvas and under the current cursor location (x, y)
        var menuX, menuY;

        if (!status.disableLabelDelete) {
            // Show the right-click menu layer
            $divHolderRightClickMenu.css('visibility', 'visible');


            menuX = x - 5;
            menuY = y - 5

            $divDeleteLabelMenu.css({
                'visibility' : 'visible',
                'position' : 'absolute',
                'left' : menuX,
                'top' : menuY,
                'z-index' : 4
            });
            status.visibilityDeleteMenu = 'visible';

            status.visibilityMenu = 'visible';
            status.disableLabeling = true;
            // myMap.setStatus('disableWalking', true);
            myMenu.setStatus('disableModeSwitch', true);
        }
    };


    oPublic.unlockDisableMenuSelect = function () {
        status.lockDisableMenuSelect = false;
        return this;
    };

    ////////////////////////////////////////
    // Initialization
    ////////////////////////////////////////
    init(params);
    return oPublic;
}

var svl = svl || {};

/**
 *
 * @param $
 * @param param
 * @returns {{className: string}}
 * @constructor
 * @memberof svl
 */
function Tooltip ($, param) {
    var self = {className: 'Tooltip'};
    var properties = {};
    var status = {};

    var $divToolTip;

    ////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////
    function _init(param) {
        $divToolTip = $(param.domIds.tooltipHolder);
    }

    ////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////
    self.show = function (message) {
        $divToolTip.html(message);
        $divToolTip.css('visibility', 'visible');
    };

    self.hide = function () {
        $divToolTip.css('visibility', 'hidden');
    };

    _init(param);
    return self;
}

var svl = svl || {};

/**
 *
 * @returns {{className: string}}
 * @constructor
 * @memberof svl
 */
function Tracker () {
    var self = {className: 'Tracker'};
    var actions = [];
    var availableActionTypes = [
        'TaskStart',
        'TaskSubmit',
        'TaskSubmitSkip',
        'Click_ModeSwitch_Walk',
        'Click_ModeSwitch_CurbRamp',
        'Click_ModeSwitch_NoCurbRamp',
        'Click_Undo',
        'Click_Redo',
        'Click_ZoomIn',
        'Click_ZoomOut',
        'Click_LabelDelete',
        'Click_LabelEdit',
        'Click_Path',
        'Click_OpenSkipWindow',
        'Click_CloseSkipWindow',
        'Click_SkipRadio',
        'LabelingCanvas_MouseUp',
        'LabelingCanvas_MouseDown',
        'LabelingCanvas_CancelLabeling',
        'LabelingCanvas_StartLabeling',
        'LabelingCanvas_FinishLabeling',
        'ViewControl_MouseDown',
        'ViewControl_MouseUp',
        'ViewControl_DoubleClick',
        'ViewControl_ZoomIn',
        'ViewControl_ZoomOut',
        'WalkTowards',
        'KeyDown',
        'KeyUp',
        'RemoveLabel',
        'Redo_AddLabel',
        'Redo_RemoveLabel',
        'Undo_AddLabel',
        'Undo_RemoveLabel',
        'MessageBox_ClickOk',
        'GoldenInsertion_Submit',
        'GoldenInsertion_ReviewLabels',
        'GoldenInsertion_ReviseFalseNegative',
        'GoldenInsertion_ReviseFalsePositive',
        'Onboarding1_Start',
        'Onboarding1_FirstCorner_IntroduceCurbRamps',
        'Onboarding1_FirstCorner_LabelTheFirstCurbRamps',
        'Onboarding1_FirstCorner_RedoLabelingTheFirstCurbRamps',
        'Onboarding1_FirstCorner_SwitchTheModeToCurbRampForLabelTheSecondCurbRamps',
        'Onboarding1_FirstCorner_LabelTheSecondCurbRamps',
        'Onboarding1_FirstCorner_RedoLabelingTheSecondCurbRamps',
        'Onboarding1_GrabAndDragToMoveToTheNextCorner',
        'Onboarding1_KeepDragging',
        'Onboarding1_SecondCorner_ModeSwitchToCurbRamps',
        'Onboarding1_SecondCorner_LabelTheCurbRamps',
        'Onboarding1_SecondCorner_RedoLabelingTheThirdCurbRamps',
        'Onboarding1_SecondCorner_IntroductionToAMissingCurbRamp',
        'Onboarding1_SecondCorner_LabelTheMissingCurbRamp',
        'Onboarding1_SecondCorner_RedoLabelingTheMissingCurbRamps',
        'Onboarding1_DoneLabelingAllTheCorners_EndLabeling',
        'Onboarding1_Submit',
        'Onboarding2_Start',
        'Onboarding2_FirstCorner_IntroduceMissingCurbRamps',
        'Onboarding2_FirstCorner_LabelTheMissingCurbRamps',
        'Onboarding2_FirstCorner_RedoLabelingTheMissingCurbRamps',
        'Onboarding2_FirstCorner_V2_LabelTheFirstMissingCurbRamps',
        'Onboarding2_FirstCorner_V2_RedoLabelingTheFirstMissingCurbRamps',
        'Onboarding2_FirstCorner_V2_ModeSwitchToMissingCurbRamp',
        'Onboarding2_FirstCorner_V2_LabelTheSecondMissingCurbRamps',
        'Onboarding2_FirstCorner_V2_RedoLabelingTheSecondMissingCurbRamps',
        'Onboarding2_FirstCorner_MissingCurbRampExampleLabels',
        'Onboarding2_GrabAndDragToTheSecondCorner',
        'Onboarding2_KeepDraggingToTheSecondCorner',
        'Onboarding2_SecondCorner_ModeSwitchToCurbRamp',
        'Onboarding2_SecondCorner_LabelTheCurbRamp',
        'Onboarding2_SecondCorner_RedoLabelingTheCurbRamps',
        'Onboarding2_SecondCorner_ExamplesOfDiagonalCurbRamps',
        'Onboarding2_RemindAboutTheCompletionRateMeter',
        'Onboarding2_GrabAndDragToTheThirdCorner',
        'Onboarding2_KeepDraggingToTheThirdCorner',
        'Onboarding2_ThirdCorner_FirstZoomIn',
        'Onboarding2_ThirdCorner_FirstModeSwitchToCurbRamp',
        'Onboarding2_ThirdCorner_LabelTheFirstCurbRamp',
        'Onboarding2_ThirdCorner_RedoLabelingTheFirstCurbRamps',
        'Onboarding2_ThirdCorner_AdjustTheCameraAngle',
        'Onboarding2_ThirdCorner_KeepAdjustingTheCameraAngle',
        'Onboarding2_ThirdCorner_SecondZoomIn',
        'Onboarding2_ThirdCorner_SecondModeSwitchToCurbRamp',
        'Onboarding2_ThirdCorner_LabelTheSecondCurbRamps',
        'Onboarding2_ThirdCorner_RedoLabelingTheSecondCurbRamps',
        'Onboarding2_ThirdCorner_FirstZoomOut',
        'Onboarding2_ThirdCorner_SecondZoomOut',
        'Onboarding2_GrabAndDragToTheFourthCorner',
        'Onboarding2_KeepDraggingToTheFourthCorner',
        'Onboarding2_FourthCorner_IntroduceOcclusion',
        'Onboarding2_DoneLabelingAllTheCorners_EndLabeling',
        'Onboarding2_Submit',
        'Onboarding3_Start',
        'Onboarding3_ShowNorthSideOfTheIntersection',
        'Onboarding3_GrabAndDrag',
        'Onboarding3_KeepDragging',
        'Onboarding3_SouthSideOfTheIntersection',
        'Onboarding3_GrabAndDragToNorth',
        'Onboarding3_ClickSkip',
        'Onboarding3_SelectSkipOption',
        'Onboarding3_ClickSkipOk',
        'Onboarding3_finalMessage',
        'Onboarding3_Submit',
        'OnboardingQuickCheck_nextClick',
        'OnboardingQuickCheck_clickQuickCheckImages',
        'OnboardingQuickCheck_submitClick',
        'OnboardingQuickCheck_submit'
    ];

    var undefinedMsg = 'undefined';

    ////////////////////////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////////////////////////
    self.getActions = function () {
        return actions;
    };

    self.getAvailableActionTypes = function () {
      var tempArray = availableActionTypes.slice(0);
      return tempArray;
    };

    self.push = function (action, param) {
        // This function pushes action type, time stamp, current pov, and current panoId
        // into actions list.
        if (availableActionTypes.indexOf(action) === -1) {
            console.warn('Unknown action: ' + action);
            return false;
        } else {
            var pov;
            var latlng;
            var panoId;
            var dump;
            var x;
            var y;
            var note;

            if (param) {
                if (('x' in param) && ('y' in param)) {
                    note = 'x:' + param.x + ',y:' + param.y;
                } else if ('TargetPanoId' in param) {
                    note = param.TargetPanoId;
                } else if ('RadioValue' in param) {
                    note = param.RadioValue;
                } else if ('keyCode' in param) {
                    note = 'keyCode:' + param.keyCode;
                } else if ('errorType' in param) {
                    note = 'errorType:' + param.errorType;
                } else if ('quickCheckImageId' in param) {
                    note = param.quickCheckImageId;
                } else if ('quickCheckCorrectness' in param) {
                    note = param.quickCheckCorrectness;
                } else if ('labelId' in param) {
                    note = 'labelId:' + param.labelId;
                } else {
                    note = undefinedMsg;
                }
            } else {
                note = undefinedMsg;
            }

            //
            // Initialize variables. Note you cannot get pov, panoid, or position
            // before the map and SV load.
            try {
                pov = svl.getPOV();
            } catch (err) {
                pov = {
                    heading: undefinedMsg,
                    pitch: undefinedMsg,
                    zoom: undefinedMsg
                }
            }

            try {
                latlng = getPosition();
            } catch (err) {
                latlng = {
                    lat: undefinedMsg,
                    lng: undefinedMsg
                };
            }
            if (!latlng) {
                latlng = {
                    lat: undefinedMsg,
                    lng: undefinedMsg
                };
            }

            try {
                panoId = getPanoId();
            } catch (err) {
                panoId = undefinedMsg;
            }

            dump = {
                actionType : action,
                heading: pov.heading,
                lat: latlng.lat,
                lng: latlng.lng,
                panoId: panoId,
                pitch: pov.pitch,
                timestamp: new Date().getTime(),
                zoom: pov.zoom,
                note: note
            };
            actions.push(dump);
            return this;
        }
    };

    return self;
}

var svl = svl || {};

/**
 * A UI class
 * @param $
 * @param params
 * @returns {{moduleName: string}}
 * @constructor
 * @memberof svl
 */
function UI ($, params) {
    var self = {moduleName: 'MainUI'};
    self.streetViewPane = {};
    params = params || {};

    ////////////////////////////////////////
    // Private Functions
    ////////////////////////////////////////
    function _init (params) {
      // Todo. Use better templating techniques rather so it's prettier!

      self.actionStack = {};
      self.actionStack.holder = $("#action-stack-control-holder");
      self.actionStack.holder.append('<button id="undo-button" class="button action-stack-button" value="Undo"><img src="img/icons/Icon_Undo.png" class="action-stack-icons" alt="Undo" /><br /><small>Undo</small></button>');
      self.actionStack.holder.append('<button id="redo-button" class="button action-stack-button" value="Redo"><img src="img/icons/Icon_Redo.png" class="action-stack-icons" alt="Redo" /><br /><small>Redo</small></button>');
      self.actionStack.redo = $("#redo-button");
      self.actionStack.undo = $("#undo-button");

      // LabeledLandmarkFeedback DOMs
      $labelCountCurbRamp = $("#LabeledLandmarkCount_CurbRamp");
      $labelCountNoCurbRamp = $("#LabeledLandmarkCount_NoCurbRamp");
      $submittedLabelMessage = $("#LabeledLandmarks_SubmittedLabelCount");

      self.labeledLandmark = {};
      self.labeledLandmark.curbRamp = $labelCountCurbRamp;
      self.labeledLandmark.noCurbRamp = $labelCountNoCurbRamp;
      self.labeledLandmark.submitted = $submittedLabelMessage;

      // Map DOMs
      self.map = {};
      self.map.canvas = $("canvas#labelCanvas");
      self.map.drawingLayer = $("div#labelDrawingLayer");
      self.map.pano = $("div#pano");
      self.map.streetViewHolder = $("div#streetViewHolder");
      self.map.viewControlLayer = $("div#viewControlLayer");
      self.map.modeSwitchWalk = $("span#modeSwitchWalk");
      self.map.modeSwitchDraw = $("span#modeSwitchDraw");
      self.googleMaps = {};
      self.googleMaps.holder = $("#google-maps-holder");
      self.googleMaps.holder.append('<div id="google-maps" class="google-maps-pane" style=""></div><div id="google-maps-overlay" class="google-maps-pane" style="z-index: 1"></div>')

      // MissionDescription DOMs
      self.missinDescription = {};
      self.missinDescription.description = $("#CurrentStatus_Description");

      // OverlayMessage
      self.overlayMessage = {};
      self.overlayMessage.holder = $("#overlay-message-holder");
      self.overlayMessage.holder.append("<span id='overlay-message-box'><span id='overlay-message'>Walk</span></span>");
      self.overlayMessage.box = $("#overlay-message-box");
      self.overlayMessage.message = $("#overlay-message");

      // ProgressPov
      self.progressPov = {};
      self.progressPov.holder = $("#progress-pov-holder");
      self.progressPov.holder.append("<div id='progress-pov-label' class='bold'>Observed area:</div>");
      self.progressPov.holder.append("<div id='progress-pov-current-completion-bar'></div>");
      self.progressPov.holder.append("<div id='progress-pov-current-completion-bar-filler'></div>");
      self.progressPov.holder.append("<div id='progress-pov-current-completion-rate'>Hi</div>");
      self.progressPov.rate = $("#progress-pov-current-completion-rate");
      self.progressPov.bar = $("#progress-pov-current-completion-bar");
      self.progressPov.filler = $("#progress-pov-current-completion-bar-filler");

      // Ribbon menu DOMs
      $divStreetViewHolder = $("#Holder_StreetView");
      $ribbonButtonBottomLines = $(".RibbonModeSwitchHorizontalLine");
      $ribbonConnector = $("#StreetViewLabelRibbonConnection");
      $spansModeSwitches = $('span.modeSwitch');

      self.ribbonMenu = {};
      self.ribbonMenu.streetViewHolder = $divStreetViewHolder;
      self.ribbonMenu.buttons = $spansModeSwitches;
      self.ribbonMenu.bottonBottomBorders = $ribbonButtonBottomLines;
      self.ribbonMenu.connector = $ribbonConnector;

      // Zoom control
      self.zoomControl = {};
      self.zoomControl.holder = $("#zoom-control-holder");
      self.zoomControl.holder.append('<button id="zoom-in-button" class="button zoom-control-button"><img src="img/icons/ZoomIn.svg" class="zoom-button-icon" alt="Zoom in"><br /><small>Zoom In</small></button>');
      self.zoomControl.holder.append('<button id="zoom-out-button" class="button zoom-control-button"><img src="img/icons/ZoomOut.svg" class="zoom-button-icon" alt="Zoom out"><br /><small>Zoom Out</small></button>');
      self.zoomControl.zoomIn = $("#zoom-in-button");
      self.zoomControl.zoomOut = $("#zoom-out-button");

      // Form
      self.form = {};
      self.form.holder = $("#form-holder");
      self.form.commentField = $("#comment-field");
      self.form.skipButton = $("#skip-button");
      self.form.submitButton = $("#submit-button");

      self.onboarding = {};
      self.onboarding.holder = $("#onboarding-holder");
      if ("onboarding" in params && params.onboarding) {
        self.onboarding.holder.append("<div id='Holder_OnboardingCanvas'><canvas id='onboardingCanvas' width='720px' height='480px'></canvas><div id='Holder_OnboardingMessageBox'><div id='Holder_OnboardingMessage'></div></div></div>");
      }

    }

    _init(params);
    return self;
}

var svl = svl || {};

/**
 * Validator
 * @param param
 * @param $
 * @returns {{className: string}}
 * @constructor
 * @memberof svl
 */
function Validator (param, $) {
    var oPublic = {
        'className' : 'Validator'
    };
    var properties = {
        onboarding: false
    };
    var status = {
        allLabelsHaveBeenValidated: false,
        disableAgreeButton: false,
        disableDisagreeButton: false,
        disableRadioButtons: false,
        menuBarMouseDown: false,
        radioCurrentLabelCheckState: 'ShowLabel',
        radioCurrentLabelHoverState: 'ShowLabel'
    };
    var mouse = {
        menuBarMouseDownX: undefined,
        menuBarMouseDownY: undefined,
        menuBarMouseUpX: undefined,
        menuBarMouseUpY: undefined,
        menuBarPrevX: undefined,
        menuBarPrevY: undefined
    };
    var currentLabel = undefined;
    var labels = [];

    var $divHolderValidation;
    var $divValidationMenuBar;
    var $divValidationDialogWindow;
    var $validationLabelMessage;
    var $btnAgree;
    var $btnDisagree;
    var $spansValidationCurrentLabeliVisibility;
    var $radioValidationCurrentLabelVisibility;
    var $spanNumCompletedTasks;
    var $spanNumTotalTasks;
    var $divProgressBarFiller;

    ////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////
    function currentLabelVisibilitySpanMousein (e) {
        // This is a mousein callback method for spans that hold ShowLabel/HideLabel radio buttons
        var $span = $(this);
        var radioValue = $span.attr("value"); // $span.find('input').attr('value');

        $span.css('background', 'rgba(230, 230, 230, 1)');
        status.radioCurrentLabelHoverState = radioValue;

        highlightCurrentLabel();
    }

    function currentLabelVisibilitySpanMouseout (e) {
        // This is a mouseout callback method for spans that hold ShowLabel/HideLabel radio buttons
        var $span = $(this);
        $span.css('background', 'transparent');
        status.radioCurrentLabelHoverState = 'ShowLabel';
        highlightCurrentLabel();
    }

    function currentLabelVisibilityRadioMousedown (e) {
        // This is a mousedown callback method for ShowLabel/HideLabel checkboxes.
        var radioValue = $(this).attr('value');
        status.radioCurrentLabelCheckState = radioValue;
        highlightCurrentLabel();
    }

    function getBoundingBox(povIn) {
        // This function takes
        var j;
        var len;
        var canvasCoords;
        var pov = povIn;
        var xMax = -1;
        var xMin = 1000000;
        var yMax = -1;
        var yMin = 1000000;

        // Check on points
        canvasCoords = getCanvasCoordinates(pov);
        len = canvasCoords.length;

        for (j = 0; j < len; j += 1) {
            var coord = canvasCoords[j];

            if (coord.x < xMin) {
                xMin = coord.x;
            }
            if (coord.x > xMax) {
                xMax = coord.x;
            }
            if (coord.y < yMin) {
                yMin = coord.y;
            }
            if (coord.y > yMax) {
                yMax = coord.y;
            }
        }

        return {
            x: xMin,
            y: yMin,
            width: xMax - xMin,
            height: yMax - yMin
        };
    }

    function getCanvasCoordinates (pov, imCoords) {
        // Get canvas coordinates of points that constitute the label.
        // param imCoords: a list of image coordinates, i.e., [{x: xVal, y: yVal}, ...]
        // var imCoords = getImageCoordinates();
        var i;
        var len = imCoords.length;
        var canvasCoord;
        var canvasCoords = [];

        var min = 10000000;
        var max = -1;

        for (i = 0; i < len; i += 1) {
            if (min > imCoords[i].x) {
                min = imCoords[i].x;
            }
            if (max < imCoords[i].x) {
                max = imCoords[i].x;
            }
        }

        // Note canvasWidthInGSVImage is approximately equals to the image width of GSV image that fits in one canvas view
        var canvasWidthInGSVImage = 3328;
        for (i = 0; i < len; i += 1) {
            if (pov.heading < 180) {
                if (max > svl.svImageWidth - canvasWidthInGSVImage) {
                    if (imCoords[i].x > canvasWidthInGSVImage) {
                        imCoords[i].x -= svl.svImageWidth;
                    }
                }
            } else {
                if (min < canvasWidthInGSVImage) {
                    if (imCoords[i].x < svl.svImageWidth - canvasWidthInGSVImage) {
                        imCoords[i].x += svl.svImageWidth;
                    }
                }
            }
            canvasCoord = svl.gsvImageCoordinate2CanvasCoordinate(imCoords[i].x, imCoords[i].y, pov);
            canvasCoords.push(canvasCoord);
        }

        return canvasCoords;
    }

    function getLabelBottom(label) {
        // This method gets the largest y-coordinate (i.e., closest to the bottom of the canvas) of label points
        //
        var i;
        var len = label.points.length;
        var pov = svl.getPOV();
//        {
//            heading: parseFloat(label.points[0].heading),
//            pitch: parseFloat(label.points[0].pitch),
//            zoom: parseFloat(label.points[0].zoom)
//        };

        // Format a label points.
        var point = undefined;
        var points = [];
        for (i = 0; i < len; i++) {
            point = {
                x: parseInt(label.points[i].svImageX),
                y: parseInt(label.points[i].svImageY)
            };
            points.push(point)
        }

        // Get the min
        var canvasCoordinates = getCanvasCoordinates(pov, points);

        var coord;
        var maxY = -1;
        for (i = 0; i < len; i++) {
            coord = canvasCoordinates[i];
            if (maxY < coord.y) {
                maxY = coord.y;
            }
        }
        return maxY;
    }

    function getLabelLeft(label) {
        // This method gets the smallest x-coordinate of label points
        //
        var i;
        var len = label.points.length;
        var pov = {
            heading: parseFloat(label.points[0].heading),
            pitch: parseFloat(label.points[0].pitch),
            zoom: parseFloat(label.points[0].zoom)
        };

        // Format a label points.
        var point = undefined;
        var points = [];
        for (i = 0; i < len; i++) {
            point = {
                x: parseInt(label.points[i].svImageX),
                y: parseInt(label.points[i].svImageY)
            };
            points.push(point)
        }

        // Get the min
        var canvasCoordinates = getCanvasCoordinates(pov, points);

        var coord;
        var minX = 1000000;
        for (i = 0; i < len; i++) {
            coord = canvasCoordinates[i];
            if (minX > coord.x) {
                minX = coord.x;
            }
        }
        return minX;
    }

    function getNextLabel () {
        // Get the next label that is not validated (i.e., label.validated == false)
        // This method returns false if all the labels have been validated.
        var i;
        var len = labels.length;
        var label;
        var allLabelsHaveBeenValidated = true;
        for (i = 0; i < len; i++) {
            label = labels[i];
            if (!label.validated) {
                allLabelsHaveBeenValidated = false;
                break;
            }
        }

        if (allLabelsHaveBeenValidated) {
            status.allLabelsHaveBeenValidated = allLabelsHaveBeenValidated;
            return false;
        } else {
            return label;
        }
    }

    function getNumTasksDone () {
        // Get number of tasks that are done.
        var i;
        var numTotalTasks = labels.length;
        var numTasksDone = 0;
        for (i = 0; i < numTotalTasks; i ++) {
            if (labels[i].validated) {
                numTasksDone += 1;
            }
        }
        return numTasksDone;
    }

    function hideDialogWindow () {
        // Hide the dialog box
        $divValidationDialogWindow.css('visibility', 'hidden');
    }

    function highlightCurrentLabel () {
        // Highlight the current label and dim the rest by changing the label properties
        if (!currentLabel) {
            throw oPublic.className + ': highlightCurrentLabel(): currentLabel is not set.';
        }
        var i;
        var j;
        var len;
        var canvasLabels;
        var canvasLabel;
        var canvasPath;
        var pathPoints;
        var pathPointsLen;

        if (svl.canvas) {
            var showLabel = undefined;
            canvasLabels = svl.canvas.getLabels();
            len = canvasLabels.length;

            // Decided whether currentLabel should be visible or not.
//            if (status.radioCurrentLabelHoverState) {
//                if (status.radioCurrentLabelHoverState === 'ShowLabel') {
//                    showLabel = true;
//                } else {
//                    showLabel = false;
//                }
//            } else {
//                if (status.radioCurrentLabelCheckState === 'ShowLabel') {
//                    showLabel = true;
//                } else {
//                    showLabel = false;
//                }
//            }
            if (status.radioCurrentLabelHoverState === 'ShowLabel') {
                showLabel = true;
            } else {
                showLabel = false;
            }

            for (i = 0; i < len; i ++) {
                canvasLabel = canvasLabels[i];
                canvasPath = canvasLabel.getPath(true); // Get a reference to the currentPath
                if (currentLabel.meta.labelId === canvasLabels[i].getProperty("labelId") &&
                    showLabel) {
                    // Highlight the label
                    // Change the fill and stroke color of a path to the original color (green and white)
                    // canvasPath.resetFillStyle();
                    // canvasPath.resetStrokeStyle();
                    canvasLabel.setVisibility('visible');

                    // Change the fill and stroke color of points to the original color
                    pathPoints = canvasPath.points;
                    pathPointsLen = pathPoints.length;
                    for (j = 0; j < pathPointsLen; j++) {
                        pathPoints[j].resetFillStyle();
                        pathPoints[j].resetStrokeStyle();
                    }
                } else {
                    // Dim the label
                    // Make fill and stroke of a path invisible
                    // canvasPath.setFillStyle('rgba(255,255,255,0)');
                    // canvasPath.setStrokeStyle('rgba(255,255,255,0)');
                    canvasLabel.setVisibility('hidden');

                    // Change the fill and stroke color of points invisible
                    pathPoints = canvasPath.points;
                    pathPointsLen = pathPoints.length;
                    for (j = 0; j < pathPointsLen; j++) {
                        pathPoints[j].setFillStyle('rgba(255,255,255,0)');
                        pathPoints[j].setStrokeStyle('rgba(255,255,255,0)');
                    }
                }

            }
            svl.canvas.clear();
            svl.canvas.render2();
        } else {
            throw oPublic.className + ': highlightCurrentLabel(): canvas is not defined.';
        }
    }

    function init(param) {
        properties.previewMode = param.previewMode;

        $divHolderValidation = $(param.domIds.holder);
        $divValidationDialogWindow = $("#ValidationDialogWindow");
        $divValidationMenuBar = $("#ValidationDialogWindowMenuBar");
        $validationLabelMessage = $("#ValidationLabelValue");
        $btnAgree = $("#ValidationButtonAgree");
        $btnDisagree =$("#ValidationButtonDisagree");
        $spansValidationCurrentLabeliVisibility = $(".SpanValidationCurrentLabeliVisibility");
        $radioValidationCurrentLabelVisibility = $(".RadioValidationCurrentLabelVisibility");

        $spanNumCompletedTasks = $("#NumCompletedTasks");
        $spanNumTotalTasks = $("#NumTotalTasks");
        $divProgressBarFiller = $("#ProgressBarFiller");

        // Attach listeners
        $divValidationMenuBar.on({
            mousedown: validationMenuBarMousedown,
            mouseleave: validationMenuBarMouseleave,
            mousemove: validationMenuBarMousemove,
            mouseup: validationMenuBarMouseup
        });

        $spansValidationCurrentLabeliVisibility.hover(currentLabelVisibilitySpanMousein, currentLabelVisibilitySpanMouseout);
        $radioValidationCurrentLabelVisibility.on('mousedown', currentLabelVisibilityRadioMousedown);

        $btnAgree.on('click', validationButtonAgreeClick);
        $btnDisagree.on('click', validationButtonDisagreeClick);

        hideDialogWindow();
        updateProgress();

        svl.ui.googleMaps.holder.css('visibility', 'hidden');
        // $("#google-maps-holder").css('visibility', 'hidden');
    }

    function showDialogWindow (timelapse) {
        // This method shows a dialog window to ask a user whether a current label is valid/invalid label.
        // If timelapse is specified, wait for timelapse milli-seconds to show the window.
        if (typeof(timelapse) !== "number") {
            console.error(oPublic.className, 'A parameter of showDialogWindow() should be in milli-seconds (number).');
            timelapse = undefined;
        }

        if (currentLabel) {
            var maxY = getLabelBottom(currentLabel); // Get the largest y-coordinate (i.e., closest to the bottom of the canvas) of label points
            var minX = getLabelLeft(currentLabel); // Get the smallest x-coordinate
            var message;

            if (currentLabel.meta.labelType === 'CurbRamp') {
                message = "We believe the green box (label) is correctly placed on a curb ramp in this image. Do you agree?";
                // message = 'We believe the <span class="bold">green box is placed on a curb ramp</span> in this image.';
            } else {
                message = 'We believe <span class="bold">there should be a curb ramp</span> under the highlighted area.';
            }
            $validationLabelMessage.html(message);
            // console.log(currentLabel.meta.labelType);

            if (timelapse) {
            // if (false) {
                setTimeout(function () {
                    // Recalculate. Hm, then the previous calculation is redundant.
                    maxY = getLabelBottom(currentLabel);
                    minX = getLabelLeft(currentLabel);
                    $divValidationDialogWindow.css({
                        left: minX,
                        top: maxY + 20,
                        visibility: 'visible'
                    });
                }, timelapse);

            } else {
                $divValidationDialogWindow.css({
                    left: minX,
                    top: maxY + 20,
                    visibility: 'visible'
                });
            }
        }
    }

    function updateProgress () {
        // This method updates the number of completed tasks and the progress bar in the interface.
        var numTotalTasks = labels.length;
        var numTasksDone = 0;
        numTasksDone = getNumTasksDone();

        $spanNumCompletedTasks.text(numTasksDone);
        $spanNumTotalTasks.text(numTotalTasks);

        var widthRatio = numTasksDone / numTotalTasks;
        var widthPercentage = parseInt(widthRatio * 100, 10) + '%'

        var r;
        var g;
        var rgbValue;
        if (widthRatio < 0.5) {
            r = 255;
            g = parseInt(255 * widthRatio * 2);
        } else {
            r = parseInt(255 * (1 - widthRatio) * 2);
            g = 255;
        }
        rgbValue = 'rgb(' + 4 + ',' + g + ', 0)';

        $divProgressBarFiller.css({
            background: rgbValue,
            width: widthPercentage
        });
    }

    function validationButtonAgreeClick () {
        // A callback function for click on an Agree button
        if (!currentLabel) {
            // if a current label is not set, set one.
            currentLabel = getNextLabel();
            if (!currentLabel) {
                // Todo. Navigate to submit validations
            }
        }
        currentLabel.validated = true;
        currentLabel.validationLabel = 'Agree';


        // svl.validatorForm.submit(); // Debug

        oPublic.validateNext();
        updateProgress();

        //
        // Return when everything is verified
        if (properties.onboarding) {
            return false;
        }
        if (getNumTasksDone() < labels.length) {
            return false;
        } else {
            if (properties.previewMode) {
                // Not a preview mode
                window.location.reload();
                return false;
            } else {
                // Return if it is not a preview mode.
                return true;
            }
        }
    }

    function validationButtonDisagreeClick () {
        // A callback function for click on a Disagree button
        if (!currentLabel) {
            // if a current label is not set, set one...
            currentLabel = getNextLabel();
            if (!currentLabel) {
                // Todo. Navigate to submit validations
            }
        }
        currentLabel.validated = true;
        currentLabel.validationLabel = 'Disagree';
        oPublic.validateNext();
        updateProgress();

        //
        // Return when everything is verified
        if (properties.onboarding) {
            return false;
        }
        if (getNumTasksDone() < labels.length) {
            return false;
        } else {
            if (properties.previewMode) {
                // Not a preview mode
                window.location.reload();
                return false;
            } else {
                // Return if it is not a preview mode.
                return true;
            }
        }
    }

    function validationMenuBarMousedown (e) {
        // A callback function for mousedown on a menu bar
        var m = mouseposition(e, 'body');

        status.menuBarMouseDown = true;
        mouse.menuBarPrevX = m.x;
        mouse.menuBarPrevY = m.y;
        mouse.menuBarMouseDownX = m.x;
        mouse.menuBarMouseDownY = m.y;
    }

    function validationMenuBarMouseleave (e) {
        // A callback function for mouseleave on a menu bar
        var m = mouseposition(e, 'body');

        status.menuBarMouseDown = false;
        mouse.menuBarMouseUpX = m.x;
        mouse.menuBarMouseUpY = m.y;
    }

    function validationMenuBarMousemove (e) {
        // A callback function for mousemove on a menu bar
        var m = mouseposition(e, 'body');
        if (status.menuBarMouseDown) {
            // Move around the validation dialog window if mouse is held down on the menu bar

            if (m && m.x && m.y && mouse.menuBarPrevX && mouse.menuBarPrevX) {
                var dx = m.x - mouse.menuBarPrevX;
                var dy = m.y - mouse.menuBarPrevY;

                // Get css top/left values as number
                // http://stackoverflow.com/questions/395163/get-css-top-value-as-number-not-as-string
                var currX = parseInt($divValidationDialogWindow.css('left'), 10);
                var currY = parseInt($divValidationDialogWindow.css('top'), 10);

                $divValidationDialogWindow.css({
                    left: currX + dx,
                    top: currY + dy
                });
            }
        }

        mouse.menuBarPrevX = m.x;
        mouse.menuBarPrevY = m.y;
    }

    function validationMenuBarMouseup (e) {
        // A callback function for mouseup on a menu bar
        var m = mouseposition(e, 'body');

        status.menuBarMouseDown = false;
        mouse.menuBarMouseUpX = m.x;
        mouse.menuBarMouseUpY = m.y;
    }

    ////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////
    oPublic.disableAgreeButton = function () {
        // This method disables the Agree button.
        status.disableAgreeButton = true;
        $btnAgree.css('opacity', '0.5');
        $btnAgree.attr('disabled', true);
        return this;
    };

    oPublic.disableDisagreeButton = function () {
        // This method disables the Disagree button.
        status.disableDisagreeButton = true;
        $btnDisagree.css('opacity', '0.5');
        $btnDisagree.attr('disabled', true);
        return this;
    };

    oPublic.disableRadioButtons = function () {
        // This method disables "Show label" and "Hide label" radio buttons
        status.disableRadioButtons = true;
        $radioValidationCurrentLabelVisibility.each(function (i, v) {
            $(v).attr('disabled', true);
        });
        return this;
    };

    oPublic.enableAgreeButton = function () {
        // This method enables the Agree button.
        status.disableAgreeButton = false;
        $btnAgree.css('opacity', '1');
        $btnAgree.attr('disabled', false);
        return this;
    };

    oPublic.enableDisagreeButton = function () {
        // This method enables the Disagree button.
        status.disableDisagreeButton = false;
        $btnDisagree.css('opacity', '1');
        $btnDisagree.attr('disabled', false);
    };

    oPublic.enableRadioButtons = function () {
        // This method enables "Show label" and "Hide label" radio buttons
        status.disableRadioButtons = false;
        $radioValidationCurrentLabelVisibility.each(function (i, v) {
            $(v).attr('disabled', false);
        });
        return;
    };

    oPublic.getLabels = function () {
        // This method returns validatorLabels
        return $.extend(true, [], labels);
    };

    oPublic.hideDialogWindow = function () {
        // This method hides a dialog window
        hideDialogWindow();
        return this;
    };

    oPublic.insertLabels = function (labelPoints) {
        // This method takes a label data (i.e., a set of point coordinates, label types, etc) and
        // and insert it into the labels array so the Canvas will render it
        var labelDescriptions = svl.misc.getLabelDescriptions();

        var param = {};
        param.canvasWidth = svl.canvasWidth;
        param.canvasHeight = svl.canvasHeight;
        param.canvasDistortionAlphaX = svl.alpha_x;
        param.canvasDistortionAlphaY = svl.alpha_y;
        param.labelId = labelPoints[0].LabelId;
        param.labelType = labelPoints[0].LabelType;
        param.labelDescription = labelDescriptions[param.labelType].text;
        param.panoId = labelPoints[0].LabelGSVPanoramaId;
        param.panoramaLat = labelPoints[0].Lat;
        param.panoramaLng = labelPoints[0].Lng;
        param.panoramaHeading = labelPoints[0].heading;
        param.panoramaPitch = labelPoints[0].pitch;
        param.panoramaZoom = labelPoints[0].zoom;
        param.svImageWidth = svl.svImageWidth;
        param.svImageHeight = svl.svImageHeight;
        param.svMode = 'html4';

        var label = {
            meta: param,
            points: labelPoints,
            validated: false,
            validationLabel: undefined
        };

        labels.push(label);

        updateProgress();
    };

    oPublic.setDialogWindowBorderWidth = function (width) {
        // This method sets the border width of the dialog window.
        $divValidationDialogWindow.css('border-width', width);
        return this;
    };

    oPublic.setDialogWindowBorderColor = function (color) {
        // This method sets the border color of the dialog window.
        $divValidationDialogWindow.css('border-color', color);
        return this;
    };

    oPublic.showDialogWindow = function (timelapse) {
        // This method shows a dialog window
        showDialogWindow(timelapse);
        return this;
    };

    oPublic.sortLabels = function () {
        // This method sorts the labels by it's heading angle.
        // Sorting an array of objects
        // http://stackoverflow.com/questions/1129216/sorting-objects-in-an-array-by-a-field-value-in-javascript
        function compare (a, b) {
            if (parseInt(a.points[0].svImageX) < parseInt(b.points[0].svImageX)) {
                return -1;
            }
            if (parseInt(a.points[0].svImageX) > parseInt(b.points[0].svImageX)) {
                return 1
            }
            return 0
        }

        labels.sort(compare);
        return this;
    };

    oPublic.validateNext = function (timelapse) {
        // This method changes the heading angle so the next unvalidated label will be centered
        // on the canvas.
        // 0. Wait and see whether panorama is ready
        // 1. Check if svl.map and svl.canvas exist
        // 2. Select the target label
        // 3. Adjust the SV heading angle and pitch angle so the target label will be centered.

        if (!('map' in svl)) {
            throw oPublic.className + ': Map is not defined.';
        }
        if (!('canvas' in svl)) {
            throw oPublic.className + ': Canvas is not defined.';
        }

        currentLabel = getNextLabel();
        if (currentLabel) {
            var pov = {
                heading: parseFloat(currentLabel.meta.panoramaHeading),
                pitch: parseFloat(currentLabel.meta.panoramaPitch),
                zoom: parseFloat(currentLabel.meta.zoom)
            };

            hideDialogWindow();

            if (typeof timelapse === "number" && timelapse >= 0) {
                var changePOVDuration = 500;
                svl.map.setPov(pov, changePOVDuration);
                highlightCurrentLabel();
                showDialogWindow(changePOVDuration);
            } else {
                svl.map.setPov(pov, 500);
                highlightCurrentLabel();
                showDialogWindow(500);
            }

        } else {
            // Todo. Navigate a user to submit
            hideDialogWindow();

            if (properties.onboarding) {
                return false;
            }
            svl.validatorForm.submit();
        }

        return this;
    };

    oPublic.setOnboarding = function (val) {
        properties.onboarding = val;
    };

    ////////////////////////////////////////
    // Initialize
    ////////////////////////////////////////
    init(param);

    return oPublic;
}

var svl = svl || {};

/**
 *
 * @param param
 * @param $
 * @returns {{className: string}}
 * @constructor
 * @memberof svl
 */
function ValidatorForm (param, $) {
    var oPublic = {className: 'ValidatorForm'};
    var properties = {
        dataStoreUrl: undefined,
        onboarding: undefined,
        taskDescription: undefined,
        taskPanoramaId: undefined,
        assignmentId: undefined,
        hitId: undefined,
        turkerId: undefined
    };
    var labelBinId = undefined;

    var $btnSubmit;

    ////////////////////////////////////////
    // Private functions
    ////////////////////////////////////////
    function init (param) {
        for (attr in properties) {
            properties[attr] = param[attr];
        }
    }

    function submit () {
        // This method collects validation labels and submit the data to
        // the API specified by properties.submitURL.
        if (!('validator' in svl) || !svl.validator) {
            throw oPublic.className + ': Validator not defined.';
        }
        var taskGSVPanoId = properties.panoId;
        var url = properties.dataStoreUrl;
        var hitId;
        var assignmentId;
        var turkerId;
        var data = {};
        var i;
        var len;


        //
        hitId = properties.hitId ? properties.hitId : 'Test_Hit';
        assignmentId = properties.assignmentId? properties.assignmentId : 'Test_Assignment';
        turkerId = properties.turkerId ? properties.turkerId : 'Test_Kotaro';


        // Submit collected data if a user is not in oboarding mode.
        if (!properties.onboarding) {
            // if (true) {
            data.assignment = {
                amazon_turker_id : turkerId,
                amazon_hit_id : hitId,
                amazon_assignment_id : assignmentId,
                interface_type : 'StreetViewValidator',
                interface_version : '1',
                completed : 0,
                task_description : properties.taskDescription
            };

            data.labelBinId = labelBinId;
            data.validationTask = {
                task_panorama_id: properties.taskPanoramaId,
                task_gsv_panorama_id : taskGSVPanoId,
                description: ""
            };

            data.validationTaskEnvironment = {
                browser: getBrowser(),
                browser_version: getBrowserVersion(),
                browser_width: $(window).width(),
                browser_height: $(window).height(),
                screen_width: screen.width,
                screen_height: screen.height,
                avail_width: screen.availWidth,		// total width - interface (taskbar)
                avail_height: screen.availHeight,		// total height - interface };
                operating_system: getOperatingSystem()
            };

            //
            // Get interactions
            svl.tracker.push('TaskSubmit');
            data.userInteraction = svl.tracker.getActions();

            data.labels = [];

            // Format the validation labels
            var validatorLabels = svl.validator.getLabels();
            len = validatorLabels.length;
            for (i = 0; i < len; i++) {
                console.log(validatorLabels[i]);
                var temp = {};
                temp.labelId = validatorLabels[i].points[0].LabelId;
                temp.result = validatorLabels[i].validationLabel === "Disagree" ? 0 : 1;
                data.labels.push(temp);
            }

            // Add the value in the comment field if there are any.
//            var comment = $textieldComment.val();
//            data.comment = undefined;
//            if (comment &&
//                comment !== $textieldComment.attr('title')) {
//                data.comment = $textieldComment.val();
//            }

            // Submit data to
            try {
                $.ajax({
                    async: false,
                    url: url,
                    type: 'post',
                    data: data,
                    dataType: 'json',
                    success: function (result) {
                        if (result.error) {
                            throw result.error.message;
                        }
                    },
                    error: function (result) {
                        throw result;
                        // console.error(result);
                    }
                });
            } catch (e) {
                console.log(e);
            }



            if (properties.taskRemaining > 1) {
                window.location.reload();
            } else {
                if (properties.isAMTTask) {
                    $('input[name="assignmentId"]').attr('value', assignmentId);
                    $('input[name="workerId"]').attr('value', turkerId);
                    $('input[name="hitId"]').attr('value', hitId);
                    return true;
                } else {
                    window.location.reload();
                    //window.location = '/';
                    return false;
                }
            }

        }

        return false;
    }

    ////////////////////////////////////////
    // Public functions
    ////////////////////////////////////////
    oPublic.setLabelBinId = function (binId) {
        labelBinId = binId;
        return this;
    };

    oPublic.submit = function () {
        return submit();
    };

    ////////////////////////////////////////
    // Initialize
    ////////////////////////////////////////
    init(param);
    return oPublic;
}

var svl = svl || {};

/**
 *
 * @param $ jQuery object
 * @param param Other parameters
 * @returns {{className: string}}
 * @constructor
 * @memberof svl
 */
function ZoomControl ($, param) {
    var self = {
        'className' : 'ZoomControl'
    };
    var properties = {
        maxZoomLevel: 3,
        minZoomLevel: 1
    };
    var status = {
        disableZoomIn: false,
        disableZoomOut: false
    };
    var lock = {
        disableZoomIn: false,
        disableZoomOut: false
    };
    var actionStack = [];

    // jQuery dom objects
    var $buttonZoomIn;
    var $buttonZoomOut;

    ////////////////////////////////////////
    // Private Functions
    ////////////////////////////////////////
    function _init (param) {
        // Initialization function

        //if ('domIds' in param) {
        if (svl.ui && svl.ui.zoomControl) {
          $buttonZoomIn = svl.ui.zoomControl.zoomIn;
          $buttonZoomOut = svl.ui.zoomControl.zoomOut;
          // $buttonZoomIn = ('zoomInButton' in param.domIds) ? $(param.domIds.zoomInButton) : undefined;
          // $buttonZoomOut = ('zoomOutButton' in param.domIds) ? $(param.domIds.zoomOutButton) : undefined;
        // }
        //
        //
        // // Attach listeners to buttons
        // if ($buttonZoomIn && $buttonZoomOut) {
          $buttonZoomIn.bind('click', buttonZoomInClick);
          $buttonZoomOut.bind('click', buttonZoomOutClick);
        }
    }


    function buttonZoomInClick () {
        // This is a callback function for zoom-in button. This function increments a sv zoom level.
        if ('tracker' in svl) {
          svl.tracker.push('Click_ZoomIn');
        }

        if (!status.disableZoomIn) {
            var pov = svl.panorama.getPov();
            setZoom(pov.zoom + 1);
            svl.canvas.clear().render2();
        }
    }

    function buttonZoomOutClick () {
        // This is a callback function for zoom-out button. This function decrements a sv zoom level.
        if ('traker' in svl) {
          svl.tracker.push('Click_ZoomOut');
        }

        if (!status.disableZoomOut) {
            var pov = svl.panorama.getPov();
            setZoom(pov.zoom - 1);
            svl.canvas.clear().render2();
        }
    }

    function pointZoomIn (x, y) {
        // This method takes a (x, y) canvas point and sets a zoom level.
        if (!status.disableZoomIn) {
            // Cancel drawing when zooming in or out.
            if ('canvas' in svl) {
              svl.canvas.cancelDrawing();
            }
            if ('panorama' in svl) {
                console.log("hi");
                var currentPov = svl.panorama.getPov();
                var currentZoomLevel = currentPov.zoom;

                if (currentZoomLevel >= properties.maxZoomLevel) {
                    return false;
                }

                var width = svl.canvasWidth;
                var height = svl.canvasHeight;
                var minPitch = svl.map.getProperty('minPitch');
                var maxPitch = svl.map.getProperty('maxPitch');

                var zoomFactor = currentZoomLevel; // This needs to be fixed as it wouldn't work above level 3.
                var deltaHeading = (x - (width / 2)) / width * (90 / zoomFactor); // Ugh. Hard coding.
                var deltaPitch = - (y - (height / 2)) / height * (70 / zoomFactor); // Ugh. Hard coding.

                var pov = {};
                pov.zoom = currentZoomLevel + 1;
                pov.heading = currentPov.heading + deltaHeading;
                pov.pitch = currentPov.pitch + deltaPitch;

                //
                // Adjust the pitch angle.
                var maxPitch = svl.map.getMaxPitch();
                var minPitch = svl.map.getMinPitch();
                if (pov.pitch > maxPitch) {
                    pov.pitch = maxPitch;
                } else if (pov.pitch < minPitch) {
                    pov.pitch = minPitch;
                }

                //
                // Adjust the pitch so it won't exceed max/min pitch.
                svl.panorama.setPov(pov);
                return currentZoomLevel;
            } else {
                return false;
            }
        }
    }

    function setZoom (zoomLevelIn) {
        // This method sets the zoom level of the street view image.
        if (typeof zoomLevelIn !== "number") {
            return false;
        }

        // Cancel drawing when zooming in or out.
        if ('canvas' in svl) {
          svl.canvas.cancelDrawing();
        }

        // Set the zoom level and change the panorama properties.
        var zoomLevel = undefined;
        zoomLevelIn = parseInt(zoomLevelIn);
        if (zoomLevelIn < 1) {
            zoomLevel = 1;
        } else if (zoomLevelIn > properties.maxZoomLevel) {
            zoomLevel = properties.maxZoomLevel;
        } else {
            zoomLevel = zoomLevelIn;
        }
        svl.panorama.setZoom(zoomLevel);
        return zoomLevel;
    }

    ////////////////////////////////////////
    // Public Functions
    ////////////////////////////////////////
    /**
     * Disables zooming in
     * @method
     * @returns {self}
     */
    self.disableZoomIn = function () {
        // Enable zoom in.
        if (!lock.disableZoomIn) {
            status.disableZoomIn = true;
            if ($buttonZoomIn) {
                $buttonZoomIn.css('opacity', 0.5);
            }
        }
        return this;
    };

    self.disableZoomOut = function () {
        // Enable zoom out.
        if (!lock.disableZoomOut) {
            status.disableZoomOut = true;
            if ($buttonZoomOut) {
                $buttonZoomOut.css('opacity', 0.5);
            }
        }
        return this;
    };

    self.enableZoomIn = function () {
        // Enable zoom in.
        if (!lock.disableZoomIn) {
            status.disableZoomIn = false;
            if ($buttonZoomIn) {
                $buttonZoomIn.css('opacity', 1);
            }
        }
        return this;
    }

    self.enableZoomOut = function () {
        // Enable zoom out.
        if (!lock.disableZoomOut) {
            status.disableZoomOut = false;
            if ($buttonZoomOut) {
                $buttonZoomOut.css('opacity', 1);
            }
        }
        return this;
    };

    self.getLock = function (name) {
        if (name in lock) {
            return lock[name];
        } else {
            var errMsg = 'You cannot access a property "' + name + '".';
            throw errMsg;
        }
    }

    self.getStatus = function (name) {
        if (name in status) {
            return status[name];
        } else {
            var errMsg = 'You cannot access a property "' + name + '".';
            throw errMsg;
        }
    }

    self.getProperties = function (name) {
        if (name in properties) {
            return properties[name];
        } else {
            var errMsg = 'You cannot access a property "' + name + '".';
            throw errMsg;
        }
    }

    self.lockDisableZoomIn = function () {
        // Lock zoom in
        lock.disableZoomIn = true;
        return this;
    };

    self.lockDisableZoomOut = function () {
        // Lock zoom out.
        lock.disableZoomOut = true;
        return this;
    };

    self.updateOpacity = function () {
        var pov = svl.getPOV();

        if (pov) {
            var zoom = pov.zoom;
            //
            // Change opacity
            if (zoom >= properties.maxZoomLevel) {
                $buttonZoomIn.css('opacity', 0.5);
                $buttonZoomOut.css('opacity', 1);
            } else if (zoom <= properties.minZoomLevel) {
                $buttonZoomIn.css('opacity', 1);
                $buttonZoomOut.css('opacity', 0.5);
            } else {
                $buttonZoomIn.css('opacity', 1);
                $buttonZoomOut.css('opacity', 1);
            }
        }

        //
        // If zoom in and out are disabled, fade them out anyway.
        if (status.disableZoomIn) {
            $buttonZoomIn.css('opacity', 0.5);
        }
        if (status.disableZoomOut) {
            $buttonZoomOut.css('opacity', 0.5);
        }


        return this;
    };

    self.pointZoomIn = function (x, y) {
        // This function takes a canvas coordinate (x, y) and pass it to a private method pointZoomIn()
        if (!status.disableZoomIn) {
            return pointZoomIn(x, y);
        } else {
            return false;
        }
    };

    self.setMaxZoomLevel = function (zoomLevel) {
        // This method sets the maximum zoom level that SV can show.
        properties.maxZoomLevel = zoomLevel;
        return this;
    };

    self.setMinZoomLevel = function (zoomLevel) {
        // This method sets the minimum zoom level that SV can show.
        properties.minZoomLevel = zoomLevel;
        return this;
    };

    self.unlockDisableZoomIn = function () {
        // Lock zoom in
        lock.disableZoomIn = false;
        return this;
    };

    self.unlockDisableZoomOut = function () {
        // Lock zoom out.
        lock.disableZoomOut = false;
        return this;
    };

    self.zoomIn = function () {
        // This method is called from outside this object to zoom in to a GSV image.
        if (!status.disableZoomIn) {
            var pov = svl.panorama.getPov();
            setZoom(pov.zoom + 1);
            svl.canvas.clear().render2();
            return this;
        } else {
            return false;
        }
    };

    self.zoomOut = function () {
        // This method is called from outside this class to zoom out from a GSV image.
        if (!status.disableZoomOut) {
            // ViewControl_ZoomOut
            var pov = svl.panorama.getPov();
            setZoom(pov.zoom - 1);
            svl.canvas.clear().render2();
            return this;
        } else {
            return false;
        }
    };

    ////////////////////////////////////////
    // Initialization
    ////////////////////////////////////////
    _init(param);

    return self;
};

////////////////////////////////////////////////////////////////////////////////
// General utility functions
////////////////////////////////////////////////////////////////////////////////
//
// A cross-browser function to capture a mouse position
//
function mouseposition (e, dom) {
    var mx, my;
    //if(e.offsetX) {
        // Chrome
    //    mx = e.offsetX;
    //    my = e.offsetY;
    //} else {
        // Firefox, Safari
        mx = e.pageX - $(dom).offset().left;
        my = e.pageY - $(dom).offset().top;
    //}
    return {'x': parseInt(mx, 10) , 'y': parseInt(my, 10) };
}


//
// Object prototype
// http://www.smipple.net/snippet/insin/jQuery.fn.disableTextSelection
if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        var F = function () {};
        F.prototype = o;
        return new F();
    };
}

//
// Trim function
// Based on a code on: http://stackoverflow.com/questions/498970/how-do-i-trim-a-string-in-javascript
if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function()
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

//
// Default Text
function focusCallback() {
    if ($(this).val() === $(this).attr('title')) {
        /* if the current attribute is the default one, delete it. */
        $(this).val("");
    }
    $(this).removeClass('defaultTextActive');
}

function blurCallback() {
    if(!$(this).val()) {
        /* do following if the field is empty */
        var msg = $(this).attr('title');
        $(this).val( msg );

        $(this).addClass('defaultTextActive');
    }
}

//
// Based on a snipped posted by Eric Scheid ("ironclad") on November 17, 2000 at:
// http://www.evolt.org/article/Javascript_to_Parse_URLs_in_the_Browser/17/14435/
function getURLParameter(argName) {
    // Get the value of one of the URL parameters.  For example, if this were called
    // with the URL http://your.server.name/foo.html?bar=123 then getURLParameter("bar")
    // would return the string "123".  If the parameter is not found, this will return
    // an empty string, "".

    var argString = location.search.slice(1).split('&');
    var r = '';
    for (var i = 0; i < argString.length; i++) {
        if (argString[i].slice(0,argString[i].indexOf('=')) == argName) {
            r = argString[i].slice(argString[i].indexOf('=')+1);
            break;
        }
    }
    r = (r.length > 0  ? unescape(r).split(',') : '');
    r = (r.length == 1 ? r[0] : '')
    return r;
}

// Array Remove - By John Resig (MIT Licensed)
// http://stackoverflow.com/questions/500606/javascript-array-delete-elements
Array.prototype.remove = function(from, to) {
    // var rest = this.slice((to || from) + 1 || this.length);
    var rest = this.slice(parseInt(to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

// Array min/max
// http://stackoverflow.com/questions/1669190/javascript-min-max-array-values
Array.prototype.max = function() {
    return Math.max.apply(null, this)
};

Array.prototype.min = function() {
    return Math.min.apply(null, this)
};

Array.prototype.sum = function () {
    return this.reduce(function(a, b) { return a + b;});
};

Array.prototype.mean = function () {
    return this.sum() / this.length;
};

/*
 json2.js
 2011-10-19

 Public Domain.

 NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

 See http://www.JSON.org/js.html
 ...

 Check Douglas Crockford's code for a more recent version of json2.js
 https://github.com/douglascrockford/JSON-js/blob/master/json2.js
 */
if(typeof JSON!=="object"){JSON={}}(function(){"use strict";function f(e){return e<10?"0"+e:e}function quote(e){escapable.lastIndex=0;return escapable.test(e)?'"'+e.replace(escapable,function(e){var t=meta[e];return typeof t==="string"?t:"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+e+'"'}function str(e,t){var n,r,i,s,o=gap,u,a=t[e];if(a&&typeof a==="object"&&typeof a.toJSON==="function"){a=a.toJSON(e)}if(typeof rep==="function"){a=rep.call(t,e,a)}switch(typeof a){case"string":return quote(a);case"number":return isFinite(a)?String(a):"null";case"boolean":case"null":return String(a);case"object":if(!a){return"null"}gap+=indent;u=[];if(Object.prototype.toString.apply(a)==="[object Array]"){s=a.length;for(n=0;n<s;n+=1){u[n]=str(n,a)||"null"}i=u.length===0?"[]":gap?"[\n"+gap+u.join(",\n"+gap)+"\n"+o+"]":"["+u.join(",")+"]";gap=o;return i}if(rep&&typeof rep==="object"){s=rep.length;for(n=0;n<s;n+=1){if(typeof rep[n]==="string"){r=rep[n];i=str(r,a);if(i){u.push(quote(r)+(gap?": ":":")+i)}}}}else{for(r in a){if(Object.prototype.hasOwnProperty.call(a,r)){i=str(r,a);if(i){u.push(quote(r)+(gap?": ":":")+i)}}}}i=u.length===0?"{}":gap?"{\n"+gap+u.join(",\n"+gap)+"\n"+o+"}":"{"+u.join(",")+"}";gap=o;return i}}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(e){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(e){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;if(typeof JSON.stringify!=="function"){JSON.stringify=function(e,t,n){var r;gap="";indent="";if(typeof n==="number"){for(r=0;r<n;r+=1){indent+=" "}}else if(typeof n==="string"){indent=n}rep=t;if(t&&typeof t!=="function"&&(typeof t!=="object"||typeof t.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":e})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){function walk(e,t){var n,r,i=e[t];if(i&&typeof i==="object"){for(n in i){if(Object.prototype.hasOwnProperty.call(i,n)){r=walk(i,n);if(r!==undefined){i[n]=r}else{delete i[n]}}}}return reviver.call(e,t,i)}var j;text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(e){return"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}})()


////////////////////////////////////////////////////////////////////////////////
// Browser related functions
////////////////////////////////////////////////////////////////////////////////
//
// Get what browser the user is using.
// This code was taken from an answer in the following SO page:
// http://stackoverflow.com/questions/3303858/distinguish-chrome-from-safari-using-jquery-browser
var userAgent = navigator.userAgent.toLowerCase();

// Figure out what browser is being used
jQuery.browser = {
    version: (userAgent.match( /.+(?:rv|it|ra|ie|me)[\/: ]([\d.]+)/ ) || [])[1],
    chrome: /chrome/.test( userAgent ),
    safari: /webkit/.test( userAgent ) && !/chrome/.test( userAgent ),
    opera: /opera/.test( userAgent ),
    msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
    mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )
};

function getBrowser() {
    // Return a browser name
    var b;
    for (b in $.browser) {
        if($.browser[b] === true) {
            return b;
        };
    }
    return undefined;
}

function getBrowserVersion () {
    // Return a browser version
    return $.browser.version;
}

function getOperatingSystem () {
    var OSName="Unknown OS";
    if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
    if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
    if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
    if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";
    return OSName;
}

/** @namespace */
var svl = svl || {};
svl.util = svl.util || {};
svl.util.color = {};

svl.util.color.RGBToRGBA = function (rgb, alpha) {
    if(!alpha){
        alpha = '0.5';
    }

    var newRGBA;
    if(rgb !== undefined) {
         newRGBA = 'rgba(';
         newRGBA+=rgb.substring(4,rgb.length-1)+','+alpha+')';
    }
    return newRGBA;
};

function changeAlphaRGBA(rgba, alpha) {
    // This function updates alpha value of the given rgba value.
    // Ex. if the input is rgba(200,200,200,0.5) and alpha 0.8,
    // the out put will be rgba(200,200,200,0.8)
    var rgbaList = rgba.replace('rgba(','').replace(')','').split(",");
    if (rgbaList.length === 4 && !isNaN(parseInt(alpha))) {
        var newRgba;
        newRgba = 'rgba(' +
            rgbaList[0].trim() + ',' +
            rgbaList[1].trim() + ',' +
            rgbaList[2].trim() + ',' +
            alpha + ')';
        return newRgba;
    } else {
        return rgba;
    }
}
svl.util.color.changeAlphaRGBA = changeAlphaRGBA;

function changeDarknessRGBA(rgba, value) {
    // This function takes rgba and value as argumetns
    // rgba: a string such as "rgba(10, 20, 30, 0.5)"
    // value: a value between [0, 1]
    var rgbaList = rgba.replace('rgba(','').replace(')','').split(",");

    if (rgbaList.length === 4) {
        var r;
        var g;
        var b;
        var a;
        var hsvList;
        var newRgbList;
        var newR;
        var newG;
        var newB;
        var newRgba;
        r = parseInt(rgbaList[0].trim());
        g = parseInt(rgbaList[1].trim());
        b = parseInt(rgbaList[2].trim());
        a = rgbaList[3].trim();
        hsvList = rgbToHsv(r,g,b);

        newRgbList = hsvToRgb(hsvList[0],hsvList[1],value);
        newR = parseInt(newRgbList[0]);
        newG = parseInt(newRgbList[1]);
        newB = parseInt(newRgbList[2]);
        newRgba = 'rgba(' + newR + ',' +
            newG + ',' +
            newB + ',' +
            a + ')';
        return newRgba;
    }
    return rgba;
}
svl.util.color.changeDarknessRGBA = changeDarknessRGBA;

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   r       The red color value
 * @param   g       The green color value
 * @param   b       The blue color value
 * @return  Array           The HSL representation
 *
 * http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
 */
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}
svl.util.color.rgbToHsl = rgbToHsl;

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param     h       The hue
 * @param     s       The saturation
 * @param     l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    } else {
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [r * 255, g * 255, b * 255];
}
svl.util.color.hslToRgb = hslToRgb;

/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and v in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSV representation
 */
function rgbToHsv(r, g, b){
    r = r / 255;
    g = g / 255;
    b = b / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max === 0 ? 0 : d / max;

    if(max == min){
        h = 0; // achromatic
    }else{
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, v];
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
function hsvToRgb(h, s, v){
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch(i % 6){
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return [r * 255, g * 255, b * 255];
}

function toDegrees (angleInRadian) {
    // This function converts the angle from radian to degree.
    // http://stackoverflow.com/questions/9705123/how-can-i-get-sin-cos-and-tan-to-return-degrees-instead-of-radians
    return angleInRadian * (180 / Math.PI);
}


function toRadians (angleInDegree) {
    // This function converts the angle from degree to radian.
    // http://stackoverflow.com/questions/9705123/how-can-i-get-sin-cos-and-tan-to-return-degrees-instead-of-radians
    return angleInDegree * (Math.PI / 180);
}


function deltaLatLngToDegree (latLngOrigin, latLngCurr) {
    // This function takes two points of latlon coordinates, origin and current.
    // Returns which direction the current is relative to the origin, North begin 0 degree and the it
    // will increase counter clockwise. For example, east is 90 degree (Wow, I need a better explanation.),
    // south is 180 degree, west is 270 degree.
    //
    var deltaLat, deltaLng, theta;

    deltaLat = latLngCurr.lat - latLngOrigin.lat;
    deltaLng = latLngCurr.lng - latLngOrigin.lng;

    // Math.atan()
    // https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/atan
    if (deltaLat > 0) {
        theta = toDegrees(Math.atan(deltaLng/deltaLat));
    } else {
        theta = toDegrees(Math.PI + Math.atan(deltaLng/deltaLat));
    }

    return (360 + theta) % 360;
}


// http://clauswitt.com/simple-statistics-in-javascript.html
function Stats(arr) {
    var self = this;
    var theArray = arr || [];

    //http://en.wikipedia.org/wiki/Mean#Arithmetic_mean_.28AM.29
    self.getArithmeticMean = function() {
        var sum = 0, length = theArray.length;
        for(var i=0;i<length;i++) {
            sum += theArray[i];
        }
        return sum/length;
    }

    //http://en.wikipedia.org/wiki/Mean#Geometric_mean_.28GM.29
    self.getGeometricMean = function() {
        var product = 1, length = theArray.length;
        for(var i=0;i<length;i++) {
            product = product * theArray[i];
        }
        return Math.pow(product,(1/length));
    }

    //http://en.wikipedia.org/wiki/Mean#Harmonic_mean_.28HM.29
    self.getHarmonicMean = function() {
        var sum = 0, length = theArray.length;
        for(var i=0;i<length;i++) {
            sum += (1/theArray[i]);
        }
        return length/sum;
    }

    //http://en.wikipedia.org/wiki/Standard_deviation
    self.getStandardDeviation = function() {
        var arithmeticMean = this.getArithmeticMean();
        var sum = 0, length = theArray.length;
        for(var i=0;i<length;i++) {
            sum += Math.pow(theArray[i]-arithmeticMean, 2);
        }
        return Math.pow(sum/length, 0.5);
    }

    // Added by Kotaro
    // http://en.wikipedia.org/wiki/Standard_error
    self.getStandardError = function () {
        var stdev = this.getStandardDeviation();
        var len = theArray.length;
        var stderr = stdev / Math.sqrt(len)
        return stderr;
    };


    //http://en.wikipedia.org/wiki/Median
    self.getMedian = function() {
        var length = theArray.length;
        var middleValueId = Math.floor(length/2);
        var arr = theArray.sort(function(a, b){return a-b;});
        return arr[middleValueId];
    };


    // Added by Kotaro
    // http://stackoverflow.com/questions/1669190/javascript-min-max-array-values
    self.getMin = function () {
        return Math.min.apply(Math, theArray);
    };


    // Added by Kotaro
    // http://stackoverflow.com/questions/1669190/javascript-min-max-array-values
    self.getMax = function () {
        return Math.max.apply(Math, theArray);
    };


    self.setArray = function(arr) {
        theArray = arr;
        return self;
    }

    self.getArray = function() {
        return theArray;
    }

    return self;
}

function sleep(miliseconds) {
    var end = false;
}

function shuffle(array) {
    // This function returns a shuffled array.
    // Code from http://bost.ocks.org/mike/shuffle/
    var copy = [], n = array.length, i;

    // While there remain elements to shuffle…
    while (n) {

        // Pick a remaining element…
        i = Math.floor(Math.random() * array.length);

        // If not already shuffled, move it to the new array.
        if (i in array) {
            copy.push(array[i]);
            delete array[i];
            n--;
        }
    }

    return copy;
}

/** @namespace */
var svl = svl || {};
svl.util = svl.util || {};
svl.util.shape = {};


function lineWithRoundHead (ctx, x1, y1, r1, x2, y2, r2, sourceFormIn, sourceStrokeStyleIn, sourceFillStyleIn, targetFormIn, targetStrokeStyleIn, targetFillStyleIn) {
    // sourceStyle and targetStyle:
    // - none: do not draw anything
    // - fill: fill the circle
    // - stroke: stroke the circle
    // - both: stroke and fill
    var sourceForm = 'none';
    var targetForm = 'none';
    var sourceStrokeStyle = sourceStrokeStyleIn ? sourceStrokeStyleIn : 'rgba(255,255,255,1)';
    var sourceFillStyle = 'rgba(255,255,255,1)';
    var targetStrokeStyle = 'rgba(255,255,255,1)';
    var targetFillStyle = 'rgba(255,255,255,1)';
    if (sourceFormIn) {
        if (sourceFormIn !== 'none' &&
            sourceFormIn !== 'stroke' &&
            sourceFormIn !== 'fill' &&
            sourceFormIn !== 'both') {
            throw 'lineWithRoundHead(): ' + sourceFormIn + ' is not a valid input.';
        }
        sourceForm = sourceFormIn;
    }
    if (targetFormIn) {
        if (targetFormIn !== 'none' &&
            targetFormIn !== 'stroke' &&
            targetFormIn !== 'fill' &&
            targetFormIn !== 'both') {
            throw 'lineWithRoundHead(): ' + targetFormIn + ' is not a valid input.';
        }
        targetForm = targetFormIn;
    }
    if (sourceStrokeStyleIn) {
        sourceStrokeStyle = sourceStrokeStyleIn;
    }
    if (sourceFillStyleIn) {
        sourceFillStyle = sourceFillStyleIn;
    }
    if (targetStrokeStyleIn) {
        targetStrokeStyle = targetStrokeStyleIn;
    }
    if (targetFillStyleIn) {
        targetFillStyle = targetFillStyleIn;
    }

    var theta = Math.atan2(y2 - y1, x2 - x1);
    var lineXStart = x1 + r1 * Math.cos(theta);
    var lineYStart = y1 + r1 * Math.sin(theta);
    var lineXEnd =  x2 - r2 * Math.cos(theta);
    var lineYEnd = y2 - r2 * Math.sin(theta);

    ctx.save();
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lineXStart, lineYStart);
    ctx.lineTo(lineXEnd, lineYEnd);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();

    if (sourceForm !== 'none') {
        ctx.save();
        ctx.fillStyle = sourceFillStyle;
        ctx.strokeStyle = sourceStrokeStyle;
        ctx.beginPath();
        ctx.arc(x1, y1, r1, 0, 2 * Math.PI, true);
        if (sourceForm === 'stroke') {
            ctx.stroke();
        } else if (sourceForm === 'fill') {
            ctx.fill();
        } else if (sourceForm === 'both') {
            ctx.fill();
            ctx.stroke();
        }
        ctx.closePath();
        ctx.restore();
    }
    if (targetForm !== 'none') {
        ctx.save();
        ctx.fillStyle = targetFillStyle;
        ctx.strokeStyle = targetStrokeStyle;
        ctx.beginPath();
        ctx.arc(x2, y2, r2, 0, 2 * Math.PI, true);
        if (targetForm === 'stroke') {
            ctx.stroke();
        } else if (targetForm === 'fill') {
            ctx.fill();
        } else if (targetForm === 'both') {
            ctx.fill();
            ctx.stroke();
        }
        ctx.closePath();
        ctx.restore();
    }
    return;
}
svl.util.shape.lineWithRoundHead = lineWithRoundHead;

/** @namespace */
var svl = svl || {};
svl.misc = {};


function getHeadingEstimate(SourceLat, SourceLng, TargetLat, TargetLng) {
    // This function takes a pair of lat/lng coordinates.
    //
    if (typeof SourceLat !== 'number') {
        SourceLat = parseFloat(SourceLat);
    }
    if (typeof SourceLng !== 'number') {
        SourceLng = parseFloat(SourceLng);
    }
    if (typeof TargetLng !== 'number') {
        TargetLng = parseFloat(TargetLng);
    }
    if (typeof TargetLat !== 'number') {
        TargetLat = parseFloat(TargetLat);
    }

    var dLng = TargetLng - SourceLng;
    var dLat = TargetLat - SourceLat;

    if (dLat === 0 || dLng === 0) {
        return 0;
    }

    var angle = toDegrees(Math.atan(dLng / dLat));
    //var angle = toDegrees(Math.atan(dLat / dLng));

    return 90 - angle;
}


function getLabelCursorImagePath() {
    return {
        'Walk' : {
            'id' : 'Walk',
            'cursorImagePath' : undefined
        },
        CurbRamp: {
            id: 'CurbRamp',
            cursorImagePath : 'img/cursors/pen.png'
        },
        NoCurbRamp: {
            id: 'NoCurbRamp',
            cursorImagePath : 'img/cursors/pen.png'
        },
        Obstacle: {
          id: 'Obstacle',
          cursorImagePath : 'img/cursors/pen.png'
        },
        SurfaceProblem: {
          id: 'SurfaceProblem',
          cursorImagePath : 'img/cursors/pen.png'
        },
    }
}
svl.misc.getLabelCursorImagePath = getLabelCursorImagePath;


//
// Returns image paths corresponding to each label type.
//
function getLabelIconImagePath(labelType) {
    return {
        'Walk' : {
            'id' : 'Walk',
            'iconImagePath' : undefined
        },
        CurbRamp: {
            id: 'CurbRamp',
            iconImagePath : '../../img/Icon_CurbRamp.svg'
        },
        NoCurbRamp: {
            id: 'NoCurbRamp',
            iconImagePath : 'public/img/icons/Sidewalk/Icon_NoCurbRamp-14.svg'
        },
        Obstacle: {
          id: 'Obstacle',
          iconImagePath: null
        },
        SurfaceProblem: {
          id: 'SurfaceProblem',
          iconImagePath: null
        },
        Void: {
            id: 'Void',
            iconImagePath : null
        },
        Unclear: {
            id: 'Unclear',
            iconImagePath : null
        },
        'StopSign' : {
            'id' : 'StopSign',
            'iconImagePath' : 'public/img/icons/Icon_BusStop.png'
        },
        'StopSign_OneLeg' : {
            'id' : 'StopSign_OneLeg',
            'iconImagePath' : 'public/img/icons/Icon_BusStopSign_SingleLeg.png'
        },
        'StopSign_TwoLegs' : {
            'id' : 'StopSign_TwoLegs',
            'iconImagePath' : 'public/img/icons/Icon_BusStopSign_TwoLegged.png'
        },
        'StopSign_Column' : {
            'id' : 'StopSign_Column',
            'iconImagePath' : 'public/img/icons/Icon_BusStopSign_Column.png'
        },
        'StopSign_None' : {
            'id' : 'StopSign_None',
            'iconImagePath' : 'public/img/icons/Icon_BusStop.png'
        },
        'Landmark_Shelter' : {
            'id' : 'Landmark_Shelter',
            'iconImagePath' : 'public/img/icons/Icon_BusStopShelter.png'
        },
        'Landmark_Bench' : {
            'id' : 'Landmark_Bench',
            'iconImagePath' : 'public/img/icons/Icon_Bench.png'
        },
        'Landmark_TrashCan' : {
            'id' : 'Landmark_TrashCan',
            'iconImagePath' : 'public/img/icons/Icon_TrashCan2.png'
        },
        'Landmark_MailboxAndNewsPaperBox' : {
            'id' : 'Landmark_MailboxAndNewsPaperBox',
            'iconImagePath' : 'public/img/icons/Icon_Mailbox2.png'
        },
        'Landmark_OtherPole' : {
            'id' : 'Landmark_OtherPole',
            'iconImagePath' : 'public/img/icons/Icon_OtherPoles.png'
        }
    }
}
svl.misc.getIconImagePaths = getLabelIconImagePath;


//
// This function is used in OverlayMessageBox.js.
//
function getLabelInstructions () {
    return {
        'Walk' : {
            'id' : 'Walk',
            'instructionalText' : 'Explore mode: Find and label curb ramps at this intersection.',
            'textColor' : 'rgba(255,255,255,1)'
        },
        CurbRamp: {
            id: 'CurbRamp',
            instructionalText: 'Label mode: Locate and draw an outline around the <span class="underline">curb ramp</span>',
            textColor: 'rgba(255,255,255,1)'
        },
        NoCurbRamp: {
            id: 'NoCurbRamp',
            instructionalText: 'Label mode: Locate and draw an outline around where a <span class="underline">curb ramp is missing</span>',
            textColor: 'rgba(255,255,255,1)'
        },
        Obstacle: {
          id: 'Obstacle',
          instructionalText: 'Label mode: Locate and draw an outline around a <span class="underline">obstacle in path</span>',
          textColor: 'rgba(255,255,255,1)'
        },
        SurfaceProblem: {
          id: 'SurfaceProblem',
          instructionalText: 'Label mode: Locate and draw an outline around a <span class="underline">sidewalk surface problem</span>',
          textColor: 'rgba(255,255,255,1)'
        },
        'StopSign' : {
            'id' : 'StopSign',
            'instructionalText' : 'Label mode: Locate and click at the bottom of the <span class="underline">stop sign</span>',
            'textColor' : 'rgba(255,255,255,1)'
        },
        'StopSign_OneLeg' : {
            'id' : 'StopSign_OneLeg',
            'instructionalText' : 'Label mode: Locate and click at the bottom of the <span class="underline">bus stop sign</span>',
            'textColor' : 'rgba(255,255,255,1)'
        },
        'StopSign_TwoLegs' : {
            'id' : 'StopSign_TwoLegs',
            'instructionalText' :'Label mode: Locate and click at the bottom of the <span class="underline">bus stop sign</span>',
            'textColor' :'rgba(255,255,255,1)'
        },
        'StopSign_Column' : {
            'id' : 'StopSign_Column',
            'instructionalText' : 'Label mode: Locate and click at the bottom of the <span class="underline">bus stop sign</span>',
            'textColor' : 'rgba(255,255,255,1)'
        },
        'Landmark_Shelter' : {
            'id' : 'Landmark_Shelter',
            'instructionalText' : 'Label mode: Locate and click at the bottom of the <span class="underline">bus shelter</span>',
            'textColor' : 'rgba(255,255,255,1)'
        },
        'Landmark_Bench' : {
            'id' : 'Landmark_Bench',
            'instructionalText' : 'Label mode: Locate and click at the bottom of the <span class="underline">bench</span> nearby a bus stop',
            'textColor' : 'rgba(255,255,255,1)'
        },
        'Landmark_TrashCan' : {
            'id' : 'Landmark_TrashCan',
            'instructionalText' : 'Label mode: Locate and click at the bottom of the <span class="underline">trash can</span> nearby a bus stop',
            'textColor' : 'rgba(255,255,255,1)'
        },
        'Landmark_MailboxAndNewsPaperBox' : {
            'id' : 'Landmark_MailboxAndNewsPaperBox',
            'instructionalText' : 'Label mode: Locate and click at the bottom of the <span class="underline">mailbox or news paper box</span> nearby a bus stop',
            'textColor' : 'rgba(255,255,255,1)'
        },
        'Landmark_OtherPole' : {
            'id' : 'Landmark_OtherPole',
            'instructionalText' : 'Label mode: Locate and click at the bottom of poles such as <span class="underline bold">traffic sign, traffic light, and light pole</span> nearby a bus stop',
            'textColor' : 'rgba(255,255,255,1)'
        }
    }
}
svl.misc.getLabelInstructions = getLabelInstructions;

function getRibbonConnectionPositions () {
    return {
        'Walk' : {
            'id' : 'Walk',
            'text' : 'Walk',
            'labelRibbonConnection' : '25px'
        },
        CurbRamp: {
            id: 'CurbRamp',
            labelRibbonConnection: '112px'
        },
        NoCurbRamp: {
            id: 'NoCurbRamp',
            labelRibbonConnection: '188px'
        },
        Obstacle: {
          id: 'Obstacle',
          labelRibbonConnection: '264px'
        },
        SurfaceProblem: {
          id: 'SurfaceProblem',
          labelRibbonConnection: '340px'
        },
        'StopSign' : {
            'id' : 'StopSign',
            'text' : 'Stop Sign',
            'labelRibbonConnection' : '112px'
        },
        'StopSign_OneLeg' : {
            'id' : 'StopSign_OneLeg',
            'text' : 'One-leg Stop Sign',
            'labelRibbonConnection' : '112px'
        },
        'StopSign_TwoLegs' : {
            'id' : 'StopSign_TwoLegs',
            'text' : 'Two-leg Stop Sign',
            'labelRibbonConnection' : '112px'
        },
        'StopSign_Column' : {
            'id' : 'StopSign_Column',
            'text' : 'Column Stop Sign',
            'labelRibbonConnection' : '112px'
        },
        'Landmark_Shelter' : {
            'id' : 'Landmark_Shelter',
            'text' : 'Bus Shelter',
            'labelRibbonConnection' : '188px'
        },
        'Landmark_Bench' : {
            'id' : 'Landmark_Bench',
            'text' : 'Bench',
            'labelRibbonConnection' : '265px'
        },
        'Landmark_TrashCan' : {
            'id' : 'Landmark_TrashCan',
            'text' : 'Trash Can',
            'labelRibbonConnection' : '338px'
        },
        'Landmark_MailboxAndNewsPaperBox' : {
            'id' : 'Landmark_MailboxAndNewsPaperBox',
            'labelRibbonConnection' : '411px'
        },
        'Landmark_OtherPole' : {
            'id' : 'Landmark_OtherPole',
            'labelRibbonConnection' : '484px'
        }
    }
}

// Todo. Get rid of this global function.
function getLabelDescriptions () {
    return {
        'Walk' : {
            'id' : 'Walk',
            'text' : 'Walk'
        },
        CurbRamp: {
            id: 'CurbRamp',
            text: 'Curb Ramp'
        },
        NoCurbRamp: {
            id: 'NoCurbRamp',
            text: 'Missing Curb Ramp'
        },
        Obstacle: {
          id: 'Obstacle',
          text: 'Obstacle in a Path'
        },
        SurfaceProblem: {
          id: 'SurfaceProblem',
          text: 'Surface Problem'
        },
        Void: {
            id: 'Void',
            text: 'Void'
        },
        Unclear: {
            id: 'Unclear',
            text: 'Unclear'
        },
        'StopSign' : {
            'id' : 'StopSign',
            'text' : 'Bus Stop Sign'
        },
        'StopSign_OneLeg' : {
            'id' : 'StopSign_OneLeg',
            'text' : 'One-leg Stop Sign'
        },
        'StopSign_TwoLegs' : {
            'id' : 'StopSign_TwoLegs',
            'text' : 'Two-leg Stop Sign'
        },
        'StopSign_Column' : {
            'id' : 'StopSign_Column',
            'text' : 'Column Stop Sign'
        },
        'StopSign_None' : {
            'id' : 'StopSign_None',
            'text' : 'Not provided'
        },
        'Landmark_Shelter' : {
            'id' : 'Landmark_Shelter',
            'text' : 'Bus Stop Shelter'
        },
        'Landmark_Bench' : {
            'id' : 'Landmark_Bench',
            'text' : 'Bench'
        },
        'Landmark_TrashCan' : {
            'id' : 'Landmark_TrashCan',
            'text' : 'Trash Can / Recycle Can'
        },
        'Landmark_MailboxAndNewsPaperBox' : {
            'id' : 'Landmark_MailboxAndNewsPaperBox',
            'text' : 'Mailbox / News Paper Box'
        },
        'Landmark_OtherPole' : {
            'id' : 'Landmark_OtherPole',
            'text' : 'Traffic Sign / Pole'
        }
    }
}
svl.misc.getLabelDescriptions = getLabelDescriptions;

// Todo. Get rid of this global function.
function getLabelColors () {
    return SidewalkColorScheme();
}
svl.misc.getLabelColors = getLabelColors;


function SidewalkColorScheme () {
    return {
        'Walk' : {
            'id' : 'Walk',
            'fillStyle' : 'rgba(0, 0, 0, 0.9)'
        },
        CurbRamp: {
            id: 'CurbRamp',
            fillStyle: 'rgba(0, 244, 38, 0.9)'
        },
        NoCurbRamp: {
            id: 'NoCurbRamp',
            fillStyle: 'rgba(255, 39, 113, 0.9)'
        },
        Obstacle: {
          id: 'Obstacle',
          fillStyle: 'rgba(0, 161, 203, 0.9)'
        },
        SurfaceProblem: {
          id: 'SurfaceProblem',
          fillStyle: 'rgba(215, 0, 96, 0.9)'
        },
        Void: {
            id: 'Void',
            fillStyle: 'rgba(255, 255, 255, 0)'
        },
        Unclear: {
            id: 'Unclear',
            fillStyle: 'rgba(128, 128, 128, 0.5)'
        }
    }
}

//
// http://www.colourlovers.com/business/trends/branding/7880/Papeterie_Haute-Ville_Logo
function colorScheme2 () {
    return {
        'Walk' : {
            'id' : 'Walk',
            'fillStyle' : 'rgba(0, 0, 0, 0.9)'
        },
        CurbRamp: {
            id: 'CurbRamp',
            fillStyle: 'rgba(106, 230, 36, 0.9)'
        },
        NoCurbRamp: {
            id: 'NoCurbRamp',
            fillStyle: 'rgba(215, 0, 96, 0.9)'
        },
        'StopSign' : {
            'id' : 'StopSign',
            'fillStyle' : 'rgba(0, 161, 203, 0.9)'
        },
        'StopSign_OneLeg' : {
            'id' : 'StopSign_OneLeg',
            'fillStyle' : 'rgba(0, 161, 203, 0.9)'
        },
        'StopSign_TwoLegs' : {
            'id' : 'StopSign_TwoLegs',
            'fillStyle' : 'rgba(0, 161, 203, 0.9)'
        },
        'StopSign_Column' : {
            'id' : 'StopSign_Column',
            'fillStyle' : 'rgba(0, 161, 203, 0.9)'
        },
        'Landmark_Shelter' : {
            'id' : 'Landmark_Shelter',
            'fillStyle' : 'rgba(215, 0, 96, 0.9)'
        },
        'Landmark_Bench' : {
            'id' : 'Landmark_Bench',
            // 'fillStyle' : 'rgba(229, 64, 40, 0.9)' // Kind of hard to distinguish from pink
            // 'fillStyle' : 'rgba(209, 209, 2, 0.9)' // Puke-y
            'fillStyle' : 'rgba(252, 217, 32, 0.9)'
        },
        'Landmark_TrashCan' : {
            'id' : 'Landmark_TrashCan',
            'fillStyle' : 'rgba(97, 174, 36, 0.9)'
        },
        'Landmark_MailboxAndNewsPaperBox' : {
            'id' : 'Landmark_MailboxAndNewsPaperBox',
            'fillStyle' : 'rgba(67, 113, 190, 0.9)'
        },
        'Landmark_OtherPole' : {
            'id' : 'Landmark_OtherPole',
            'fillStyle' : 'rgba(249, 79, 101, 0.9)'
        }
    }
}
