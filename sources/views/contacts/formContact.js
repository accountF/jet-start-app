import {JetView} from "webix-jet";
import {dataStatuses} from "../../models/statuses";
import {dataContacts} from "../../models/contacts";
import ItemDataContact from "../../data/itemDataContact";
import avatar from "../../data/avatar.png";

export default class FormContact extends JetView {
	config() {
		return {
			rows: [
				{
					view: "template",
					template: "#nameForm# contact",
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
													label: "First name",
													name: "FirstName",
													invalidMessage: "First Name must be filled in"
												},
												{
													view: "text",
													label: "Last name",
													name: "LastName",
													invalidMessage: "Last Name must be filled in"
												},
												{
													view: "datepicker",
													label: "Joining date",
													name: "StartDate",
													format: webix.i18n.longDateFormatStr
												},
												{
													view: "richselect",
													label: "Status",
													name: "StatusID",
													options: {
														view: "suggest",
														body: {
															view: "list",
															data: dataStatuses,
															template: "#value#"
														}
													},
													invalidMessage: "Status must be filled in"
												},
												{view: "text", label: "Job", name: "Job", invalidMessage: "Job must be filled in"},
												{view: "text", label: "Company", name: "Company", invalidMessage: "Company must be filled in"},
												{view: "text", label: "Website", name: "Website"},
												{view: "text", label: "Address", name: "Address"}
											]
										},
										{
											paddingX: 10,
											rows: [
												{view: "text", label: "Email", name: "Email"},
												{view: "text", label: "Skype", name: "Skype"},
												{view: "text", label: "Phone", name: "Phone"},
												{
													view: "datepicker",
													label: "Birthday",
													name: "Birthday",
													format: webix.i18n.longDateFormatStr
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
																	value: "Change photo",
																	accept: "image/png, image/gif, image/jpg, image/jpeg",
																	localId: "imageUploader",
																	link: "userImage",
																	autosend: false,
																	multiple: false
																},
																{
																	view: "button",
																	value: "Delete Photo",
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
											value: "Cancel",
											width: 150,
											click: () => this.closeForm()
										},
										{
											view: "button",
											localId: "btnAdd",
											value: "#nameButton#",
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
		this.formComponent = this.$$("formForContactData");

		this.image = this.$$("templateImage");
		const reader = new FileReader();
		this.$$("imageUploader").attachEvent("onBeforeFileAdd", (upload) => {
			reader.readAsDataURL(upload.file);
			reader.onload = () => this.image.setValues({Photo: reader.result});
		});

		const id = ItemDataContact.getId();
		const nameForm = id ? "Edit" : "Add";
		const nameButton = id ? "Save" : "Add";
		this.$$("header").setValues({nameForm});
		this.$$("btnAdd").setValue(nameButton);
		if (id) {
			let item = ItemDataContact.getItem();
			this.formComponent.setValues(item);
			this.image.setValues({Photo: item.Photo});
		}
	}

	closeForm(id) {
		this.formComponent.clear();
		this.formComponent.clearValidation();
		ItemDataContact.setId(null);
		if (id) {
			this.show(`/top/contacts?id=${id}/contacts.contactDescription`);
		}
		else {
			const idFirstItem = dataContacts.getFirstId();
			this.show(`/top/contacts?id=${idFirstItem}/contacts.contactDescription`);
		}
	}

	addNewContactOrUpdate() {
		if (this.formComponent.validate()) {
			const idFromData = ItemDataContact.getId();
			const dataFromForm = this.formComponent.getValues();
			dataFromForm.Photo = this.image.getValues().Photo;
			dataContacts.waitSave(() => {
				if (idFromData) {
					dataContacts.updateItem(dataFromForm.id, dataFromForm);
					webix.message("Contact was updated");
				}
				else {
					dataContacts.add(dataFromForm, 0);
					webix.message("Contact was added");
				}
			}).then((res) => {
				this.closeForm(res.id);
			});
		}
		else {
			webix.message("Please check fields");
		}
	}

	deletePhoto() {
		this.image.setValues({Photo: avatar});
	}
}
