import {JetView} from "webix-jet";
import ContactList from "./contacts/contactList";
import ContactDescription from "./contacts/contactDescription";


export default class Contacts extends JetView {
	config() {
		return {
			rows: [
				{cols: [ContactList, ContactDescription]}
			]
		};
	}
}
