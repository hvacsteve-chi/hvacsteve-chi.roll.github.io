var docEl = document.documentElement;
var pageWidth = docEl.clientWidth;
console.log(pageWidth + "px wide");

var h = document.querySelector("header");
var m = document.querySelector("main");
var f = document.querySelector("footer");

var hh = h.clientHeight;
console.log(hh + "px");
var mm = m.clientHeight;
console.log(mm + "px");
var ff = f.clientHeight;
console.log(ff + "px");


var headerSpan = document.querySelector("#headerHeight");
var mainSpan = document.querySelector("#mainHeight");
var footerSpan = document.querySelector("#footerHeight");

export default function sizes() {
  headerSpan.innerHTML = hh;
  mainSpan.innerHTML = mm;
  footerSpan.innerHTML = ff;
}
