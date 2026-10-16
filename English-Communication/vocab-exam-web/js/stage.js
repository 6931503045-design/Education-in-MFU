// Audience screen (monitor). Receives the lesson state from the presenter window.
(function () {
  const root = document.getElementById("stage");
  const top = document.getElementById("stage-top");
  const body = document.getElementById("stage-body");

  function render(state) {
    if (!state) return;
    const view = window.Lesson.renderStage(state);
    document.body.classList.toggle("stage-dark", view.dark);
    top.innerHTML = view.top;
    body.innerHTML = view.html;
  }

  // From the presenter: postMessage (works offline with file://) ...
  window.addEventListener("message", (e) => {
    if (e.data && e.data.type === "state") render(e.data.state);
  });
  // ... or from localStorage when opened as a normal tab on a web server.
  window.addEventListener("storage", (e) => {
    if (e.key === "stw-state" && e.newValue) render(JSON.parse(e.newValue));
  });

  const peer = window.opener || (window.parent !== window ? window.parent : null);
  if (peer) peer.postMessage({ type: "hello" }, "*");
  try {
    const saved = localStorage.getItem("stw-state");
    if (saved) render(JSON.parse(saved));
  } catch (err) { /* storage unavailable: wait for the presenter */ }

  root.addEventListener("dblclick", () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  });
})();
