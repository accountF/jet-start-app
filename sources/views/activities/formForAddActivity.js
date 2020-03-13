import {JetView} from "webix-jet";
import {dataContacts} from "../../models/contacts";
import {dataActivityType} from "../../models/activityType";
import {dataActivities} from "../../models/activities";
import ItemData from "../../data/itemData";

export default class formForAddActivity extends JetView {
	config() {
		return {
			view: "window",
			localId: "windowWithForm",
			position: "center",
			head: "Add Activity",
			width: 500,
			body: {
				view: "form",
				localId: "form",
				elements: [
					{view: "textarea", label: "Details", name: "Details"},
					{
						view: "richselect",
						label: "Type",
						name: "TypeID",
						options: {
							view: "suggest",
							body: {
								view: "list",
								data: dataActivityType,
								template: "#value#"
							}
						},
						invalidMessage: "Type must be filled in"
					},
					{
						view: "richselect",
						label: "Contact",
						name: "ContactID",
						options: {
							view: "suggest",
							body: {
								view: "list",
								data: dataContacts,
								template: "#FirstName#"
							}
						},
						invalidMessage: "Contact must be filled in"
					},
					{
						cols: [
							{view: "datepicker", label: "Date", name: "DueDate", format: webix.i18n.longDateFormatStr},
							{view: "datepicker", label: "Time", name: "Time", type: "time", format: webix.i18n.timeFormat}
						]
					},
					{view: "checkbox", label: "Completed", name: "State", checkValue: "Close", uncheckValue: "Open"},
					{
						cols: [
							{},
							{view: "button", value: "Add", click: () => this.addOrUpdateActivity()},
							{view: "button", value: "Cancel", click: () => this.closeWindow()}
						]
					}
				],
				rules: {
					ContactID: webix.rules.isNotEmpty,
					TypeID: webix.rules.isNotEmpty
				}

			}
		};
	}

	showWindow() {
		this.getRoot().show();
		const id = ItemData.getId();
		if (id) {
			const item = ItemData.getItem();
			item.Time = item.DueDate;
			this.$$("form").setValues(item);
		}
	}

	closeWindow() {
		this.$$("form").clear();
		ItemData.setId(null);
		this.getRoot().hide();
		this.show("./activities");
	}

	addOrUpdateActivity() {
		if (!this.$$("form").validate()) {
			webix.message("Please check fields");
		}
		else {
			const dataFromForm = this.$$("form").getValues();
			const date = dataFromForm.DueDate;
			const time = dataFromForm.Time;
			if (date && time) {
				const hours = time.getHours();
				const minutes = time.getMinutes();
				date.setHours(hours);
				date.setMinutes(minutes);
			}
			else if (time) {
				const currentDate = new Date();
				const hours = time.getHours();
				const minutes = time.getMinutes();
				currentDate.setHours(hours);
				currentDate.setMinutes(minutes);
				dataFromForm.DueDate = currentDate;
			}
			const id = ItemData.getId();
			if (id) {
				dataActivities.updateItem(dataFromForm.id, dataFromForm);
				webix.message("Activity was updated");
				ItemData.setId(null);
			}
			else {
				dataActivities.add(dataFromForm, 0);
				webix.message("Activity was added");
			}
			this.$$("form").clear();
			this.getRoot().hide();
		}
	}
}
