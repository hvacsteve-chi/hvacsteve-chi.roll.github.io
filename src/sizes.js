var docEl = document.documentElement;
var pageWidth = docEl.clientWidth;
console.log(pageWidth + "px wide");
var hh = document.querySelector("header").clientHeight;
var mh = document.querySelector("main").clientHeight;
var fh = document.querySelector("footer").clientHeight;
var headerSpan = document.querySelector("#headerHeight");
var mainSpan = document.querySelector("#mainHeight");
var footerSpan = document.querySelector("#footerHeight");

export default function sizes() {

  headerSpan.innerText = hh + "px";
  mainSpan.innerText = mh + "px";
  footerSpan.innerText = fh + "px";

}