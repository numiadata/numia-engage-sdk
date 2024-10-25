const r = await fetch("http://localhost:8787/track", {
  headers: {
    "Content-Type": "application/json;charset=utf-8",
    Accept: "application/json",
    Authorization: "Bearer ac5e8787-e46d-4190-8369-61f24d20b9a2",
  },
  method: "POST",
  body: '{"name":"test","attributes":{"test":"test"},"meta":{"campaign":{},"page":{"path":"blank","referrer":"","search":"","title":"","url":"about:blank"},"browser":{"userAgent":"Mozilla/5.0 (X11; Darwin arm64) AppleWebKit/537.36 (KHTML, like Gecko) HappyDOM/0.0.0","screenWidth":1024,"screenHeight":768,"language":"en-US","platform":"X11; Darwin arm64","locale":"en-US"}},"timestamp":1729759584050}',
  keepalive: true,
});

console.log(r.status);
