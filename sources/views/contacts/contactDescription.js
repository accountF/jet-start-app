import {JetView} from "webix-jet";
import ActivitiesAndFiles from "./contactDescription/activitiesAndFiles";
import Description from "./contactDescription/description";

export default class ContactDescription extends JetView {
	config() {
		return {
			rows: [
				Description, ActivitiesAndFiles
			]
		};
	}
}
