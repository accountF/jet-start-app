import {JetView} from "webix-jet";
import {dataContacts} from "../../../models/contacts";
import {dataStatuses} from "../../../models/statuses";
import ItemDataContact from "../../../data/itemDataContact";
import avatar from "../../../data/avatar.png";
import {dataActivities} from "../../../models/activities";

export default class Description extends JetView {
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
							width: 150,
							click: () => this.deleteContact()
						},
						{
							view: "button",
							label: "Edit",
							type: "icon",
							icon: "mdi mdi-square-edit-outline",
							width: 150,
							click: () => this.openForm()
						}
					]
				},
				{
					localId: "description",
					template: item => `
				<div class="contact-info">
					<div class="name-surname">
						<h3>${item.FirstName} ${item.LastName}</h3>
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
							<p class='mdi mdi-calendar'> ${item.BirthdayLong || "-"}</p>
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
			const idFromUrl = this.getParam("id", true);
			let item;
			if (idFromUrl && dataContacts.getItem(idFromUrl)) {
				item = webix.copy(dataContacts.getItem(idFromUrl));
				if (item.StatusID) {
					item.StatusValue = dataStatuses.getItem(item.StatusID).Value;
				}
				item.BirthdayLong = webix.i18n.longDateFormatStr(item.Birthday);
			}
			this.descriptionComponent.parse(item);
		});
	}

	openForm() {
		const idFromUrl = this.getParam("id", true);
		ItemDataContact.setId(idFromUrl);
		ItemDataContact.setItem(dataContacts.getItem(idFromUrl));
		this.show("./contacts.formContact");
	}

	deleteContact() {
		webix.confirm("Are you sure?").then(() => {
			const idFromUrl = +this.getParam("id", true);
			dataContacts.remove(idFromUrl);
			let itemsForDelete = dataActivities.find(activity => activity.ContactID === idFromUrl);
			itemsForDelete.forEach((item) => {
				dataActivities.remove(item.id);
			});
			const idFirstItem = dataContacts.getFirstId();
			if (idFirstItem) {
				this.show(`/top/contacts?id=${idFirstItem}/contacts.contactDescription`);
			}
			else {
				this.show("/top/contacts");
			}
		});
	}
}
