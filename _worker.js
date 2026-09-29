export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ========== /easytv.jpg 路由：远程拉取github raw配置 ==========
    if (url.pathname === "/easytv.jpg") {
      const rawUrl = "https://raw.githubusercontent.com/reizcc/test/main/easytv.jpg";
      const resp = await fetch(rawUrl);
      if (!resp.ok) {
        return new Response("Not Found", { status: 404 });
      }
      const body = await resp.text();
      return new Response(body, {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public"
        }
      });
    }
    // ============================================================

    // 原版api反代逻辑
    const path = url.pathname;
    if (!path.startsWith("/api/")) {
      return new Response("404: Not Found", { status: 404 });
    }

    const targetUrl = path.replace("/api/", "");
    const finalUrl = decodeURIComponent(targetUrl);
    const res = await fetch(finalUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: "follow"
    });

    return new Response(res.body, {
      status: res.status,
      headers: res.headers
    });
  }
};
