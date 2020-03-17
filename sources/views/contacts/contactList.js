import {JetView} from "webix-jet";
import {dataContacts} from "../../models/contacts";
import avatar from "../../data/avatar.png";

export default class ContactList extends JetView {
	config() {
		return {
			view: "list",
			localId: "contactList",
			select: true,
			width: 250,
			autoheight: false,
			template: contact => `
				<div class='container-for-image'>
					<img class='user-avatar' src=${contact.Photo || avatar} />
				</div>
				<div class='user-info'>
					<p> ${contact.value} </p>
					<p><small> ${contact.Company} </small></p>
				</div>`,
			type: {
				height: "auto"
			}
		};
	}

	init() {
		this.listComponents = this.$$("contactList");
		this.listComponents.sync(dataContacts);
		this.listComponents.attachEvent("onAfterSelect", (id) => {
			this.app.callEvent("changeUrl", [id]);
		});
		dataContacts.waitData.then(() => {
			const idFromUrl = this.getParam("id");
			const firstContact = this.listComponents.getFirstId();
			if (dataContacts.getItem(idFromUrl)) {
				this.listComponents.select(idFromUrl);
			}
			else if (!idFromUrl && dataContacts.count()) {
				this.listComponents.select(firstContact);
			}
			else if (idFromUrl && dataContacts.count() && !dataContacts.getItem(idFromUrl)) {
				webix.message("Please check data");
				this.listComponents.select(firstContact);
			}
			else {
				webix.message("Please check data");
			}
		});
	}
}
