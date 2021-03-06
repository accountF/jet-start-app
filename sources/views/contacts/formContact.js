import {JetView} from "webix-jet";
import {dataStatuses} from "../../models/statuses";
import {dataContacts} from "../../models/contacts";
import {ItemDataContact} from "../../data/itemData";
import avatar from "../../data/avatar.png";

export default class FormContact extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		return {
			rows: [
				{
					view: "template",
					template: `#nameForm# ${_("contact")}`,
					localId: "header",
					type: "header"
				},
				{
					view: "form",
					localId: "formForContactData",
					autoheight: false,
					elements: [
						{
							padding: 10,
							rows: [
								{
									cols: [
										{
											paddingX: 10,
											rows: [
												{
													view: "text",
													label: _("First name"),
													name: "FirstName",
													invalidMessage: _("First Name must be filled in"),
													required: true,
													labelWidth: 100
												},
												{
													view: "text",
													label: _("Last name"),
													name: "LastName",
													invalidMessage: _("Last Name must be filled in"),
													required: true,
													labelWidth: 100
												},
												{
													view: "datepicker",
													label: _("Joining date"),
													name: "StartDate",
													format: webix.i18n.longDateFormatStr,
													labelWidth: 100
												},
												{
													view: "richselect",
													label: _("Status"),
													name: "StatusID",
													options: {
														view: "suggest",
														body: {
															view: "list",
															data: dataStatuses,
															template: "#value#"
														}
													},
													invalidMessage: _("Status must be filled in"),
													required: true,
													labelWidth: 100
												},
												{view: "text", label: _("Job"), name: "Job", invalidMessage: _("Job must be filled in"), required: true, labelWidth: 100},
												{view: "text", label: _("Company"), name: "Company", invalidMessage: _("Company must be filled in"), required: true, labelWidth: 100},
												{view: "text", label: _("Website"), name: "Website", labelWidth: 100},
												{view: "text", label: _("Address"), name: "Address", labelWidth: 100}
											]
										},
										{
											paddingX: 10,
											rows: [
												{view: "text", label: _("Email"), name: "Email", labelWidth: 100},
												{view: "text", label: _("Skype"), name: "Skype", labelWidth: 100},
												{view: "text", label: _("Phone"), name: "Phone", labelWidth: 100},
												{
													view: "datepicker",
													label: _("Birthday"),
													name: "Birthday",
													format: webix.i18n.longDateFormatStr,
													labelWidth: 100
												},
												{
													cols: [
														{
															template: contact => `<img class='imagePreview' src=${contact.Photo || avatar} />`,
															name: "Photo",
															localId: "templateImage",
															borderless: true,
															height: 150
														},
														{
															rows: [
																{},
																{
																	view: "uploader",
																	value: _("Change photo"),
																	accept: "image/png, image/gif, image/jpg, image/jpeg",
																	localId: "imageUploader",
																	autosend: false,
																	multiple: false
																},
																{
																	view: "button",
																	value: _("Delete photo"),
																	click: () => this.deletePhoto()
																}
															]
														}

													]
												}
											]
										}
									]
								},
								{},
								{
									cols: [
										{},
										{
											view: "button",
											value: _("Cancel"),
											width: 150,
											click: () => this.closeForm()
										},
										{
											view: "button",
											localId: "btnAdd",
											value: _("#nameButton#"),
											width: 150,
											click: () => this.addNewContactOrUpdate()
										}
									]
								}
							]
						}
					],
					rules: {
						FirstName: webix.rules.isNotEmpty,
						LastName: webix.rules.isNotEmpty,
						StatusID: webix.rules.isNotEmpty,
						Company: webix.rules.isNotEmpty,
						Job: webix.rules.isNotEmpty
					}
				}
			]
		};
	}

	init() {
		this._ = this.app.getService("locale")._;
		this.formComponent = this.$$("formForContactData");
		this.image = this.$$("templateImage");
		const reader = new FileReader();
		this.$$("imageUploader").attachEvent("onBeforeFileAdd", (upload) => {
			reader.readAsDataURL(upload.file);
			reader.onload = () => this.image.setValues({Photo: reader.result});
		});

		const id = ItemDataContact.getId();
		const nameForm = id ? this._("Edit") : this._("Add");
		const nameButton = id ? this._("Save") : this._("Add");
		this.$$("header").setValues({nameForm});
		this.$$("btnAdd").setValue(nameButton);
		if (id) {
			let item = ItemDataContact.getItem();
			this.formComponent.setValues(item);
			this.image.setValues({Photo: item.Photo});
		}
	}

	closeForm() {
		this.formComponent.clear();
		this.formComponent.clearValidation();
		if (!ItemDataContact.getId()) {
			const idFirstItem = dataContacts.getFirstId();
			ItemDataContact.setId(idFirstItem);
		}
		this.show("/top/contacts/contacts.contactDescription");
	}

	addNewContactOrUpdate() {
		if (this.formComponent.validate()) {
			const idFromData = ItemDataContact.getId();
			const dataFromForm = this.formComponent.getValues();
			dataFromForm.Photo = this.image.getValues().Photo;
			dataContacts.waitSave(() => {
				if (idFromData) {
					dataContacts.updateItem(dataFromForm.id, dataFromForm);
					webix.message(this._("Contact was updated"));
				}
				else {
					dataContacts.add(dataFromForm, 0);
					webix.message(this._("Contact was added"));
				}
			}).then((res) => {
				ItemDataContact.setId(res.id);
				this.closeForm();
			});
		}
		else {
			webix.message(this._("Please check fields"));
		}
	}

	deletePhoto() {
		this.image.setValues({Photo: ""});
	}
}
