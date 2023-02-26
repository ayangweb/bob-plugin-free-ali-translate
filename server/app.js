// 引入 koa 框架
const Koa = require("koa2");

// 引入处理 post 数据的插件
const bodyParser = require("koa-bodyparser");

// 引入 koa 路由
const KoaRouter = require("koa-router");

// 引入 axios
const axios = require("axios");

// 创建服务器实例
const app = new Koa();

// 创建路由实例
const router = new KoaRouter();

// 使用bodyParser
app.use(bodyParser());

// 使用路由
app.use(router.routes(), router.allowedMethods());

// 监听端口
app.listen("5678", () => {
	console.log("端口号为 5678 的服务器已经启动！");
});

// 翻译 api
router.post("/translate", async (ctx) => {
	// body 传 query 为要翻译的内容
	const { body } = ctx.request;

	const { data: translateResult } = await axios.get(
		"https://translate.alibaba.com/api/translate/text",
		{
			params: {
				...body,
				srcLang: "auto",
				tgtLang: "en",
				domain: "general",
			},
			headers: {
				Cookie: "xman_us_f=x_l=1; xman_t=V6c1xatsl3xJqeIlbQ++JhI7Btqfg488sRpAoO/5Amt7JsaysHLnVdbDg3LLo7O6; acs_usuc_t=acs_rt=87ba93aba09f4703b0d8709b8873ca8c; acs_t=jlhH5HD3A+qW6FE5oN0ZUh/hPFB54QO9BW0GhyHc8Y+1+upx+iu1wenSF5t+HHAg; xman_f=NaoZ/ox90EPhyKabS/QZYOyauY+wntq5gPQIrco4qC/RWSX454dJwEfT64fwTBnms09wRIQayGfryUGc+Neg2UMBtn0dbR5xzNuNM7JgLvOE9vsD53HiDQ==; __itrace_wid=cfacd9a5-93a4-48ae-097e-3817f7932d5a; cna=jvWAHDS/rikCAcor6mg9NxST; xlly_s=1; tfstk=ciHVBQVX9R0SL5n9J82ZT2okCFeAZLFzTLr3iFsMIAXAZ7Pci37TqGbi4cjPSSf..; l=fBQEEB8RTq2QnCxhBOfZourza77TAIRfguPzaNbMi9fP_D5p5tKfB68wRvY9CnGVEsK653--PjLJB0LnBy49lTYhxJRVakp09dTnwpzHU; isg=BPX1ocu9-k7kRB7y4UMfO7XBBHevcqmE6vdiO3cammy7ThRAO8PiVX2ImBL4DsE8",
				Origin: "https://translate.alibaba.com",
				Referer: "https://translate.alibaba.com/",
				"User-Agent":
					"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
			},
		}
	);

	ctx.body = translateResult.data.translateText;
});
