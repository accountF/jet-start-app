const dateToStr = webix.Date.dateToStr("%Y-%m-%d %H:%i");

export const dataActivities = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init: (item) => {
			item.DueDate = webix.i18n.parseFormatDate(item.DueDate);
		},
		$change: (item) => {
			item.DueDate = webix.i18n.parseFormatDate(item.DueDate);
		},
		$save: (item) => {
			item.DueDate = dateToStr(item.DueDate);
		}
	}
});
