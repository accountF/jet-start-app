export const dataStatuses = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/statuses/",
	save: "rest->http://localhost:8096/api/v1/statuses/",
	scheme: {
		$init: (obj) => {
			obj.value = obj.Value;
		},
		$change: (obj) => {
			obj.value = obj.Value;
		}
	}
});
