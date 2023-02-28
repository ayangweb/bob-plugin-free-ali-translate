var config = require("./config");

function supportLanguages() {
	return config.languages.map(([language]) => language);
}

async function translate(query, completion) {
	try {
		const { text, detectFrom, detectTo } = query;

		// 获取请求参数中的语种
		const getLanguage = (detect) => {
			return config.languages.find(
				(language) => language[0] === detect
			)[1];
		};

		const srcLang = getLanguage(detectFrom);

		const tgtLang = getLanguage(detectTo);

		const result = await $http.get({
			url: "https://translate.alibaba.com/api/translate/text",
			body: {
				query: text,
				srcLang,
				tgtLang,
				domain: "general",
			},
			header: {
				Cookie: "xman_us_f=x_l=1; xman_t=V6c1xatsl3xJqeIlbQ++JhI7Btqfg488sRpAoO/5Amt7JsaysHLnVdbDg3LLo7O6; acs_usuc_t=acs_rt=87ba93aba09f4703b0d8709b8873ca8c; acs_t=jlhH5HD3A+qW6FE5oN0ZUh/hPFB54QO9BW0GhyHc8Y+1+upx+iu1wenSF5t+HHAg; xman_f=NaoZ/ox90EPhyKabS/QZYOyauY+wntq5gPQIrco4qC/RWSX454dJwEfT64fwTBnms09wRIQayGfryUGc+Neg2UMBtn0dbR5xzNuNM7JgLvOE9vsD53HiDQ==; __itrace_wid=cfacd9a5-93a4-48ae-097e-3817f7932d5a; cna=jvWAHDS/rikCAcor6mg9NxST; xlly_s=1; tfstk=ciHVBQVX9R0SL5n9J82ZT2okCFeAZLFzTLr3iFsMIAXAZ7Pci37TqGbi4cjPSSf..; l=fBQEEB8RTq2QnCxhBOfZourza77TAIRfguPzaNbMi9fP_D5p5tKfB68wRvY9CnGVEsK653--PjLJB0LnBy49lTYhxJRVakp09dTnwpzHU; isg=BPX1ocu9-k7kRB7y4UMfO7XBBHevcqmE6vdiO3cammy7ThRAO8PiVX2ImBL4DsE8",
				Origin: "https://translate.alibaba.com",
				Referer: "https://translate.alibaba.com/",
				"User-Agent":
					"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
			},
			timeout: 1000 * 60,
		});

		if (!result?.data) {
			throw new Error({ message: "bob 内部发生错误！" });
		}

		const { httpStatusCode, data, message } = result.data;

		if (httpStatusCode !== 200) throw new Error({ message });

		// 处理编码问题，比如 &#39; => '
		const toParagraphs = data.translateText
			.replace(/&#(\d+);?/g, (_, number) =>
				String.fromCharCode(parseInt(number))
			)
			.split("\n");

		completion({
			result: {
				from: srcLang,
				to: tgtLang,
				toParagraphs,
			},
		});
	} catch ({ message }) {
		completion({
			error: {
				type: "unknown",
				message,
				addtion: "如果多次请求失败，请联系插件作者！",
			},
		});
	}
}

module.exports = {
	supportLanguages,
	translate,
};
