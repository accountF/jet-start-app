import {JetView} from "webix-jet";
import {dataContacts} from "../../models/contacts";

export default class ContactList extends JetView {
	config() {
		return {
			view: "list",
			localId: "contactList",
			select: true,
			width: 250,
			autoheight: false,
			template: "<div class='container-for-image'><img class='user-avatar' src=#Photo# /> </div><div class='user-info'><p> #value# </p><p><small> #Company# </small></p></div>",
			type: {
				height: "auto"
			}
		};
	}

	init(view, url) {
		this.listComponents = this.$$("contactList");
		this.listComponents.attachEvent("onAfterSelect", id => this.setIdIntoUrl(id));
		dataContacts.waitData.then(() => {
			this.listComponents.sync(dataContacts);

			const idFromUrl = url[0].params.id;
			if (dataContacts.getItem(idFromUrl)) {
				this.listComponents.select(idFromUrl);
			}
			else if (!idFromUrl && dataContacts.count()) {
				this.listComponents.select(this.listComponents.getFirstId());
			}
			else {
				this.show("./contacts");
				webix.message("Please choose the contact");
			}
		});
	}

	setIdIntoUrl(id) {
		this.show(`./contacts?id=${id}`);
	}
}
