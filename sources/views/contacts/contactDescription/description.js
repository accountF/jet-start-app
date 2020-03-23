import {JetView} from "webix-jet";
import {dataContacts} from "../../../models/contacts";
import {dataStatuses} from "../../../models/statuses";
import {ItemDataContact} from "../../../data/itemData";
import avatar from "../../../data/avatar.png";
import {dataActivities} from "../../../models/activities";
import {contactFiles} from "../../../models/contactFiles";

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
			const idContact = ItemDataContact.getId();
			let item;
			if (idContact && dataContacts.getItem(idContact)) {
				item = webix.copy(dataContacts.getItem(idContact));
				if (item.StatusID) {
					item.StatusValue = dataStatuses.getItem(item.StatusID).Value;
				}
				item.BirthdayLong = webix.i18n.longDateFormatStr(item.Birthday);
			}
			this.descriptionComponent.parse(item);
		});
	}

	openForm() {
		const idContact = ItemDataContact.getId();
		ItemDataContact.setId(idContact);
		ItemDataContact.setItem(dataContacts.getItem(idContact));
		this.show("./contacts.formContact");
	}

	deleteContact() {
		webix.confirm("Are you sure?").then(() => {
			const idContact = ItemDataContact.getId().toString();
			dataContacts.remove(idContact);
			let itemsForDelete = dataActivities.find(activity => activity.ContactID === idContact);
			itemsForDelete.forEach((item) => {
				dataActivities.remove(item.id);
			});
			let filesForDelete = contactFiles.find(file => file.ContactID === idContact);
			filesForDelete.forEach((file) => {
				contactFiles.remove(file.id);
			});
			const idFirstItem = dataContacts.getFirstId();
			if (idFirstItem) {
				ItemDataContact.setId(idFirstItem);
				this.show("/top/contacts/contacts.contactDescription");
			}
			else {
				this.show("/top/contacts");
			}
		});
	}
}
