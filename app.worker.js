var timer = 100000,
    status = !1,
    timeout = null;

function init() {
    postMessage(timer)
}

function count() {
    timer -= 1000, postMessage(timer), 0 == timer ? clearTimeout(timeout) : timeout = setTimeout("count()", 1000)
}
self.onmessage = function(t) {
  if(t.data.reset == true) {
	  clearTimeout(timeout);
	  timer = 100000;
	  postMessage(timer);
  }
    1 == t.data.status ? count() : clearTimeout(timeout)
}, init();