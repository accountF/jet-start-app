import {JetView} from "webix-jet";
import {dataContacts} from "../../models/contacts";
import {dataStatuses} from "../../models/statuses";

export default class ContactDescription extends JetView {
	config() {
		return {
			localId: "description",
			view: "form",
			autoheight: false,
			elements: [{
				rows: [
					{
						cols: [
							{view: "label", name: "value"},
							{
								view: "button",
								label: "Delete",
								type: "icon",
								icon: "wxi-trash",
								width: 150
							},
							{
								view: "button",
								label: "Edit",
								type: "icon",
								icon: "mdi mdi-square-edit-outline",
								width: 150
							}
						]
					},
					{
						cols: [
							{
								rows: [
									{
										type: "clean",
										localId: "image",
										css: "userAvatar",
										template: "<img src='sources/data/avatar.png' />"
									},
									{view: "label", name: "StatusValue"}
								]
							},
							{
								rows: [
									{
										cols: [
											{
												template: "<span class='webix_icon mdi mdi-email alignment'></span>",
												borderless: true,
												width: 40
											},
											{view: "label", name: "Email"}
										]
									},
									{
										cols: [
											{
												template: "<span class='webix_icon mdi mdi-skype alignment'></span>",
												borderless: true,
												width: 40
											},
											{view: "label", name: "Skype"}
										]
									},
									{
										cols: [
											{
												template: "<span class='webix_icon mdi mdi-tag alignment'></span>",
												borderless: true,
												width: 40
											},
											{view: "label", name: "Job"}
										]
									},
									{
										cols: [
											{
												template: "<span class='webix_icon mdi mdi-briefcase alignment'></span>",
												borderless: true,
												width: 40
											},
											{view: "label", name: "Company"}
										]
									}
								]
							},
							{
								type: "clean",
								rows: [
									{
										cols: [
											{
												template: "<span class='webix_icon mdi mdi-calendar alignment'></span>",
												borderless: true,
												width: 40
											},
											{view: "label", name: "Birthday"}
										]
									},
									{
										cols: [
											{
												template: "<span class='webix_icon mdi mdi-map-marker alignment'></span>",
												borderless: true,
												width: 40
											},
											{view: "label", name: "Address"}
										]
									}
								]
							}
						]
					}
				]
			}
			]
		};
	}

	init() {
		this.descriptionComponent = this.$$("description");
	}

	urlChange(view, url) {
		webix.promise.all([
			dataContacts.waitData,
			dataStatuses.waitData
		]).then(() => {
			const idFromUrl = url[0].params.id;
			let item;
			if (idFromUrl && dataContacts.getItem(idFromUrl)) {
				item = dataContacts.getItem(idFromUrl);
				item.StatusValue = dataStatuses.getItem(item.StatusID).Value;
			}
			this.descriptionComponent.setValues(item);
		});
	}
}
