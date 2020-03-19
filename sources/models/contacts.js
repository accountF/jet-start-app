const dateToStr = webix.Date.dateToStr("%Y-%m-%d %H:%i");

export const dataContacts = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme: {
		$init: (item) => {
			item.value = `${item.FirstName} ${item.LastName}`;
			item.Birthday = webix.i18n.parseFormatDate(item.Birthday);
			item.StartDate = webix.i18n.parseFormatDate(item.StartDate);
		},
		$save: (item) => {
			item.Birthday = dateToStr(item.Birthday);
			item.StartDate = dateToStr(item.StartDate);
		}
	}
});
