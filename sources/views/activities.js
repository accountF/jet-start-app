import {JetView} from "webix-jet";
import {dataActivities} from "../models/activities";
import {dataContacts} from "../models/contacts";
import {dataActivityType} from "../models/activityType";
import formForAddActivity from "./activities/formForAddActivity";
import formForEditActivity from "./activities/formForEditActivity";
import ItemData from "../data/itemData";

export default class Activities extends JetView {
	config() {
		const button = {
			view: "button",
			width: 150,
			value: "<span class='webix_icon mdi mdi-plus-box'></span> Add Activity",
			click: () => this.windowAdd.showWindow()
		};
		const table = {
			view: "datatable",
			localId: "activitiesTable",
			columns: [
				{
					id: "State",
					template: "{common.checkbox()}",
					checkValue: "Close",
					uncheckValue: "Open"
				},
				{
					id: "TypeID",
					header: ["Type", {content: "selectFilter"}],
					options: dataActivityType,
					fillspace: true,
					sort: "text"
				},
				{
					id: "DueDate",
					fillspace: true,
					header: [
						"DueDate",
						{content: "datepickerFilter",
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
					header: ["Details", {content: "textFilter"}],
					fillspace: true,
					sort: "string"
				},
				{
					id: "ContactID",
					header: ["Contact", {content: "selectFilter"}],
					options: dataContacts,
					fillspace: true,
					sort: "text"
				},
				{id: "edit", header: "", template: "{common.editIcon()}", width: 50},
				{id: "del", header: "", template: "{common.trashIcon()}", width: 50}
			],
			onClick: {
				"wxi-trash": (e, id) => this.deleteActivity(id),
				"wxi-pencil": (e, id) => this.editActivity(id)
			}
		};

		const ui = {
			rows: [
				{
					css: "placeForButtonAddActivity",
					cols: [
						{},
						button
					]
				},
				table
			]
		};
		return ui;
	}

	init() {
		this.tableComponent = this.$$("activitiesTable");
		this.show("../activities");
		webix.promise.all([
			dataContacts.waitData,
			dataActivities.waitData,
			dataActivityType.waitData
		]).then(() => {
			this.tableComponent.sync(dataActivities);
			this.windowAdd = this.ui(formForAddActivity);
			this.windowEdit = this.ui(formForEditActivity);
		});
		this.windowAdd = this.ui(formForAddActivity);
		this.windowEdit = this.ui(formForEditActivity);
	}

	deleteActivity(id) {
		webix.confirm("Are you sure?")
			.then(() => {
				dataActivities.remove(id.row);
			});
	}

	editActivity(id) {
		const item = dataActivities.getItem(id.row);
		ItemData.setItem(item);
		ItemData.setId(id.row);
		this.windowEdit.showWindow();
	}
}
