export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ========== 新增 easytv.jpg 伪装图片JSON路由 ==========
    if (url.pathname === "/easytv.jpg") {
      // 在这里替换成你自己的TVBox JSON配置
      const tvJson = {
        "sites": [
          {"key":"easy","name":"EasyTV"}
        ]
      };
      return new Response(JSON.stringify(tvJson), {
        headers: {
          "Content-Type": "image/jpeg", // 伪装jpg图片
          "Cache-Control": "public" // 方便CF缓存规则生效
        }
      });
    }
    // =====================================================

    // 下面是原版代码，不用改动
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
