import {JetView} from "webix-jet";
import {dataContacts} from "../../models/contacts";
import {dataActivityType} from "../../models/activityType";
import {dataActivities} from "../../models/activities";
import ItemDataActivity from "../../data/itemDataActivity";

export default class formActivity extends JetView {
	config() {
		return {
			view: "window",
			localId: "windowWithForm",
			position: "center",
			head: {
				template: "#nameForm# activity",
				localId: "header"
			},
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
						localId: "Contact",
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
							{
								view: "datepicker",
								label: "Date",
								name: "DueDate",
								format: webix.i18n.longDateFormatStr
							},
							{
								view: "datepicker",
								label: "Time",
								name: "Time",
								type: "time",
								format: webix.i18n.timeFormat
							}
						]
					},
					{
						view: "checkbox",
						label: "Completed",
						name: "State",
						checkValue: "Close",
						uncheckValue: "Open"
					},
					{
						cols: [
							{},
							{
								view: "button",
								localId: "btnAdd",
								click: () => this.addOrUpdateActivity()
							},
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

	init(view, url) {
		this.formComponent = this.$$("form");
		this.window = this.$$("windowWithForm");
		this.url = url;
	}

	showWindow() {
		this.getRoot().show();
		const id = ItemDataActivity.getId();
		const nameForm = id ? "Edit" : "Add";
		const nameButton = id ? "Save" : "Add";
		this.$$("header").setValues({nameForm});
		this.$$("btnAdd").setValue(nameButton);

		if (id) {
			const item = ItemDataActivity.getItem();
			item.Time = item.DueDate;
			this.formComponent.setValues(item);
		}

		if (this.url[0].page !== "activities") {
			let idFromContact = +this.getParam("id", true);
			this.formComponent.elements.ContactID.setValue(idFromContact);
			this.formComponent.elements.ContactID.config.readonly = true;
			this.formComponent.elements.ContactID.refresh();
		}
	}

	closeWindow() {
		this.formComponent.clear();
		this.formComponent.clearValidation();
		ItemDataActivity.setId(null);
		this.getRoot().hide();
	}

	setTimeIntoDate(date, time) {
		const hours = time.getHours();
		const minutes = time.getMinutes();
		date.setHours(hours);
		date.setMinutes(minutes);
	}

	addOrUpdateActivity() {
		if (!this.formComponent.validate()) {
			webix.message("Please check fields");
		}
		else {
			const dataFromForm = this.formComponent.getValues();
			let date = dataFromForm.DueDate;
			const time = dataFromForm.Time;
			if (date && time) {
				this.setTimeIntoDate(date, time);
			}
			else if (time) {
				const currentDate = new Date();
				this.setTimeIntoDate(currentDate, time);
			}
			const id = ItemDataActivity.getId();
			dataActivities.waitSave(() => {
				if (id) {
					dataActivities.updateItem(dataFromForm.id, dataFromForm);
					webix.message("Activity was updated");
				}
				else {
					dataActivities.add(dataFromForm, 0);
					webix.message("Activity was added");
				}
			}).then(() => {
				this.closeWindow();
			});
		}
	}
}

