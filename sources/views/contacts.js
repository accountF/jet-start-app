import {JetView} from "webix-jet";
import avatar from "../data/avatar.png";
import {dataContacts} from "../models/contacts";

export default class Contacts extends JetView {
	config() {
		const contactList = {
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
											<p> ${contact.FirstName} ${contact.LastName}</p>
											<p><small> ${contact.Company} </small></p>
										</div>`,
			type: {
				height: "auto"
			}
		};
		const button = {
			view: "button",
			label: "Add contact",
			type: "icon",
			icon: "wxi-plus",
			click: () => this.openForm()
		};

		return {
			cols: [
				{
					rows: [contactList, button]
				},
				{$subview: true}
			]
		};
	}

	ready() {
		this.listComponents = this.$$("contactList");
		this.listComponents.sync(dataContacts);
		this.listComponents.attachEvent("onAfterSelect", (id) => {
			this.setParam("id", id, true);
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
			else {
				webix.message("Please check data");
			}
			this.show("./contacts.contactDescription");
		});
	}

	urlChange() {
		const idFromUrl = this.getParam("id");
		if (idFromUrl && dataContacts.getItem(idFromUrl)) {
			this.listComponents.select(idFromUrl);
		}
	}

	openForm() {
		this.listComponents.unselectAll();
		this.show("/top/contacts/contacts.formContact");
	}
}
