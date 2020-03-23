export const dataStatuses = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/statuses/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme: {
		$init: (statusItem) => {
			statusItem.value = statusItem.Value;
		}
	}
});
