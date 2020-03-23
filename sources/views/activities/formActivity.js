import {JetView} from "webix-jet";
import {dataContacts} from "../../models/contacts";
import {dataActivityType} from "../../models/activityType";
import {dataActivities} from "../../models/activities";
import {ItemDataActivity, ItemDataContact} from "../../data/itemData";

export default class formActivity extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		return {
			view: "window",
			localId: "windowWithForm",
			position: "center",
			head: {
				template: `#nameForm# ${_("activity")}`,
				localId: "header"
			},
			width: 500,
			body: {
				view: "form",
				localId: "form",
				elements: [
					{view: "textarea", label: _("Details"), name: "Details"},
					{
						view: "richselect",
						label: _("Type"),
						name: "TypeID",
						options: {
							view: "suggest",
							body: {
								view: "list",
								data: dataActivityType,
								template: "#value#"
							}
						},
						invalidMessage: _("Type must be filled in")
					},
					{
						view: "richselect",
						localId: "Contact",
						label: _("Contact"),
						name: "ContactID",
						options: {
							view: "suggest",
							body: {
								view: "list",
								data: dataContacts,
								template: "#FirstName#"
							}
						},
						invalidMessage: _("Contact must be filled in")
					},
					{
						cols: [
							{
								view: "datepicker",
								label: _("Date"),
								name: "DueDate",
								format: webix.i18n.longDateFormatStr
							},
							{
								view: "datepicker",
								label: _("Time"),
								name: "Time",
								type: "time",
								format: webix.i18n.timeFormat
							}
						]
					},
					{
						view: "checkbox",
						label: _("Completed"),
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
								value: _("Add"),
								click: () => this.addOrUpdateActivity()
							},
							{view: "button", value: _("Cancel"), click: () => this.closeWindow()}
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
		this._ = this.app.getService("locale")._;
		this.formComponent = this.$$("form");
		this.url = url;
	}

	showWindow(page) {
		this.getRoot().show();
		const id = ItemDataActivity.getId();
		const nameForm = id ? this._("Edit") : this._("Add");
		const nameButton = id ? this._("Save") : this._("Add");
		this.$$("header").setValues({nameForm});
		this.$$("btnAdd").setValue(nameButton);

		if (id) {
			const item = ItemDataActivity.getItem();
			item.Time = item.DueDate;
			this.formComponent.setValues(item);
		}

		if (page === "contact") {
			let idFromContact = ItemDataContact.getId().toString();
			let contactIdField = this.formComponent.elements.ContactID;
			contactIdField.setValue(idFromContact);
			contactIdField.disable();
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
			webix.message(this._("Please check fields"));
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
			if (id) {
				dataActivities.updateItem(dataFromForm.id, dataFromForm);
				webix.message(this._("Activity was updated"));
			}
			else {
				dataActivities.add(dataFromForm, 0);
				webix.message(this._("Activity was added"));
			}
			this.closeWindow();
		}
	}
}

