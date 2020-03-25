import {JetView} from "webix-jet";
import {contactFiles} from "../../../models/contactFiles";
import {dataActivityType} from "../../../models/activityType";
import {dataActivities} from "../../../models/activities";
import formActivity from "../../activities/formActivity";
import {ItemDataContact, ItemDataActivity} from "../../../data/itemData";
import {dataContacts} from "../../../models/contacts";

export default class ActivitiesAndFiles extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const activities = {
			rows: [
				{
					view: "datatable",
					localId: "activitiesTable",
					select: true,
					columns: [
						{
							id: "State",
							template: "{common.checkbox()}",
							header: _("State"),
							checkValue: "Close",
							uncheckValue: "Open"
						},
						{
							id: "TypeID",
							header: [_("Type"), {content: "selectFilter"}],
							options: dataActivityType,
							fillspace: true,
							sort: "text"
						},
						{
							id: "DueDate",
							fillspace: true,
							header: [
								_("DueDate"),
								{
									content: "datepickerFilter",
									compare(cellValue, filterValue) {
										const dateToStr = webix.i18n.dateFormatStr(cellValue);
										const filterToStr = webix.i18n.dateFormatStr(filterValue);
										if (dateToStr === filterToStr) {
											return true;
										}
										return false;
									}
								}
							],
							format: webix.i18n.longDateFormatStr,
							sort: "date"
						},
						{
							id: "Details",
							header: [_("Details"), {content: "textFilter"}],
							fillspace: true,
							sort: "string"
						},
						{id: "edit", header: "", template: "{common.editIcon()}", width: 50},
						{id: "del", header: "", template: "{common.trashIcon()}", width: 50}
					],
					onClick: {
						"wxi-trash": (e, id) => this.deleteActivity(id),
						"wxi-pencil": (e, id) => this.editActivity(id)
					}
				},
				{
					cols: [
						{},
						{
							view: "button",
							width: 200,
							css: "webix_primary",
							value: `<span class='webix_icon mdi mdi-plus-box'></span> ${_("Add Activity")}`,
							click: () => this.window.showWindow("contact")
						}
					]
				}

			]
		};

		const filesTable = {
			view: "form",
			localId: "files",
			rows: [
				{
					view: "datatable",
					localId: "filesTable",
					type: "uploader",
					borderless: true,
					columns: [
						{
							id: "name",
							header: _("Name"),
							fillspace: true,
							sort: "string"
						},
						{
							id: "time",
							header: _("Date"),
							template: () => {
								const format = webix.i18n.longDateFormatStr;
								return format(new Date());
							},
							fillspace: true,
							sort: "date"
						},
						{id: "size", header: _("Size"), sort: this.sortForSize},
						{
							id: "Delete",
							header: "",
							template: "<span class='webix_icon wxi-trash'></span>",
							width: 40
						}
					],
					onClick: {
						"wxi-trash": (e, id) => this.deleteFile(id)
					}
				},
				{
					cols: [
						{},
						{
							view: "uploader",
							width: 200,
							localId: "upload",
							value: _("Upload file"),
							name: "files",
							autosend: false
						}
					]
				}
			]
		};

		return {
			rows: [
				{
					view: "tabbar",
					localId: "tab",
					value: "Activities",
					options: [
						{value: _("Activities"), id: "Activities"},
						{value: _("Files"), id: "Files"}
					]
				},
				{
					cells: [
						{localId: "Activities", rows: [activities]},
						{localId: "Files", rows: [filesTable]}
					]
				}
			]
		};
	}

	init() {
		this._ = this.app.getService("locale")._;
		this.$$("activitiesTable").sync(dataActivities);
		this.$$("filesTable").sync(contactFiles);
		this.window = this.ui(formActivity);
		this.$$("tab").attachEvent("onChange", id => this.$$(id).show());
		this.$$("upload").attachEvent("onBeforeFileAdd", (file) => {
			const idToString = ItemDataContact.getId().toString();
			const dataFile = {
				ContactID: idToString,
				name: file.name,
				date: file.file.lastModifiedDate,
				size: file.sizetext
			};
			contactFiles.add(dataFile);
		});
	}

	urlChange() {
		webix.promise.all([
			dataContacts.waitData,
			dataActivities.waitData,
			dataActivityType.waitData
		]).then(() => {
			const id = ItemDataContact.getId();
			if (id && dataContacts.getItem(id)) {
				contactFiles.data.filter(file => file.ContactID === id);
				dataActivities.data.filter((activity) => {
					if (activity.ContactID.toString() === id.toString()) {
						return activity;
					}
					return false;
				});
			}
		});
	}

	sortForSize(file1, file2) {
		return parseFloat(file1.size) - parseFloat(file2.size);
	}

	deleteFile(id) {
		this.webix.confirm(this._("Are you sure?")).then(() => {
			contactFiles.remove(id);
		});
	}

	deleteActivity(id) {
		webix.confirm(this._("Are you sure?")).then(() => {
			dataActivities.remove(id.row);
		});
	}

	editActivity(id) {
		const item = dataActivities.getItem(id.row);
		ItemDataActivity.setItem(item);
		ItemDataActivity.setId(id.row);
		this.window.showWindow("contact");
	}
}
