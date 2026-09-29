export default {
  async fetch(request, env, ctx) {
    const { cf } = request;
    const url = new URL(request.url);

    // ===== Bot检测：爬虫直接403 =====
    const botScore = cf.botManagement?.score ?? 100;
    // Bot分数低于30判定爬虫，直接拒绝
    if (botScore < 30) {
      return new Response("访问被拒绝，检测到自动化爬虫", { status: 403 });
    }

    // ===== 反代目标：github reizcc/test仓库 =====
    const targetHost = "raw.githubusercontent.com";
    url.hostname = targetHost;
    // 拼接仓库路径，把你的域名请求转发到 reizcc/test
    url.pathname = `/reizcc/test${url.pathname}`;

    const newReq = new Request(url, request);
    // 清除部分危险头
    newReq.headers.delete("host");

    // 请求上游GitHub
    const upstreamResp = await fetch(newReq);

    // 给静态资源添加缓存头，配合CF缓存规则
    const newHeaders = new Headers(upstreamResp.headers);
    if(url.pathname.match(/\.(js|css|png|jpg|svg|txt|json|md)$/)){
      newHeaders.set("Cache-Control", "public, max-age=3600");
    }

    return new Response(upstreamResp.body, {
      status: upstreamResp.status,
      headers: newHeaders
    });
  },
};
