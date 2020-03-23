import {JetView} from "webix-jet";
import avatar from "../data/avatar.png";
import {dataContacts} from "../models/contacts";
import {ItemDataContact} from "../data/itemData";

export default class Contacts extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
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
			label: _("Add contact"),
			type: "icon",
			icon: "wxi-plus",
			click: () => this.openForm()
		};

		const filter = {
			view: "text",
			localId: "filter",
			placeholder: _("Type something"),
			on: {
				onTimedKeyPress: () => this.filter()
			}
		};

		return {
			cols: [
				{
					rows: [filter, contactList, button]
				},
				{$subview: true}
			]
		};
	}

	init() {
		this._ = this.app.getService("locale")._;
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
				webix.message(this._("Please check data"));
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

	filter() {
		const filterValue = this.$$("filter").getValue().toLowerCase();
		this.listComponents.filter((contact) => {
			if (contact.value.toLowerCase().indexOf(filterValue) !== -1 ||
				contact.Company.toLowerCase().indexOf(filterValue) !== -1 ||
				contact.Email.toLowerCase().indexOf(filterValue) !== -1 ||
				contact.Skype.toLowerCase().indexOf(filterValue) !== -1) {
				return contact;
			} return false;
		});
	}
}
