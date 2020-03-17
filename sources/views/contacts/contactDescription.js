import {JetView} from "webix-jet";
import {dataContacts} from "../../models/contacts";
import {dataStatuses} from "../../models/statuses";
import avatar from "../../data/avatar.png";

export default class ContactDescription extends JetView {
	config() {
		return {
			rows: [
				{
					css: "placeForButton",
					cols: [
						{},
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
					localId: "description",
					template: item => `
				<div class="contact-info">
					<div class="name-surname">
						<h3>${item.value}</h3>
					</div>
					<div class="details">
						<div class="details-avatar">
							<img src="${item.Photo || avatar}" />
							<p>${item.StatusValue || "-"}</p>
						</div>
						<div class="details-info">
							<p class="mdi mdi-email"> ${item.Email || "-"}</p>
							<p class="mdi mdi-skype"> ${item.Skype || "-"}</p>
							<p class="mdi mdi-tag"> ${item.Job || "-"}</p>
							<p class='mdi mdi-briefcase'> ${item.Company || "-"}</p>
						</div>
						<div class="details-info">
							<p class='mdi mdi-calendar'> ${item.Birthday || "-"}</p>
							<p class='mdi mdi-map-marker'> ${item.Address || "-"}</p>
						</div>
					</div>
				</div>`
				}
			]
		};
	}

	init() {
		this.descriptionComponent = this.$$("description");
	}

	urlChange() {
		webix.promise.all([
			dataContacts.waitData,
			dataStatuses.waitData
		]).then(() => {
			const idFromUrl = this.getParam("id");
			let item;
			if (idFromUrl && dataContacts.getItem(idFromUrl)) {
				item = webix.copy(dataContacts.getItem(idFromUrl));
				item.StatusValue = dataStatuses.getItem(item.StatusID).Value;
			}
			this.descriptionComponent.parse(item);
		});
	}
}
