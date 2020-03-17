const dateToStr = webix.Date.dateToStr("%d %F %Y");

export const dataContacts = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/ ",
	scheme: {
		$init: (item) => {
			item.value = `${item.FirstName} ${item.LastName}`;
			item.Birthday = dateToStr(item.Birthday);
		}
	}
});
