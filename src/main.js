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
			timeout: 1000 * 60,
		});

		if (!result?.data) throw new Error();

		const { success, message, data } = result.data;

		if (!success) throw new Error(message);

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
			},
		});
	}
}

module.exports = {
	supportLanguages,
	translate,
};
