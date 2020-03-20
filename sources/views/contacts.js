import {JetView} from "webix-jet";
import avatar from "../data/avatar.png";
import {dataContacts} from "../models/contacts";
import {ItemDataContact} from "../data/itemData";

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

	init() {
		this.listComponents = this.$$("contactList");
		this.listComponents.sync(dataContacts);
		this.listComponents.attachEvent("onAfterSelect", (id) => {
			ItemDataContact.setId(id);
			this.show("./contacts.contactDescription");
		});

		dataContacts.waitData.then(() => {
			const idContact = ItemDataContact.getId();
			const idFirstContact = this.listComponents.getFirstId();
			if (dataContacts.getItem(idContact)) {
				this.listComponents.select(idContact);
			}
			else if (!idContact && dataContacts.count()) {
				ItemDataContact.setId(idFirstContact);
				this.listComponents.select(idFirstContact);
			}
			else {
				webix.message("Please check data");
			}
		});
	}

	urlChange() {
		const idContact = ItemDataContact.getId();
		if (idContact && dataContacts.getItem(idContact)) {
			this.listComponents.select(idContact);
		}
	}

	openForm() {
		this.listComponents.unselectAll();
		ItemDataContact.setId(null);
		this.show("/top/contacts/contacts.formContact");
	}
}
