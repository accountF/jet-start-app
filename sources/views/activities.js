import {JetView} from "webix-jet";
import {dataActivities} from "../models/activities";
import {dataContacts} from "../models/contacts";
import {dataActivityType} from "../models/activityType";
import formActivity from "./activities/formActivity";
import {ItemDataActivity} from "../data/itemData";

export default class Activities extends JetView {
	config() {
		const button = {
			view: "button",
			width: 150,
			value: "<span class='webix_icon mdi mdi-plus-box'></span> Add Activity",
			click: () => this.window.showWindow()
		};
		const table = {
			view: "datatable",
			select: true,
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

		const tabbar = {
			view: "tabbar",
			localId: "filter",
			value: "All",
			options: [
				{value: "All"},
				{value: "Overdue"},
				{value: "Completed"},
				{value: "Today"},
				{value: "Tomorrow"},
				{value: "This week"},
				{value: "This month"}
			],
			on: {
				onChange: () => {
					this.$$("activitiesTable").filterByAll();
				}
			}
		};

		const ui = {
			rows: [
				{
					css: "placeForButton",
					cols: [
						{},
						button
					]
				},
				tabbar,
				table
			]
		};
		return ui;
	}

	init() {
		this.tableComponent = this.$$("activitiesTable");
		this.window = this.ui(formActivity);
		webix.promise.all([
			dataContacts.waitData,
			dataActivities.waitData,
			dataActivityType.waitData
		]).then(() => {
			this.tableComponent.sync(dataActivities);
			dataActivities.data.filter();
		});

		this.tableComponent.registerFilter(
			this.$$("filter"),
			{
				columnId: "State",
				compare: (state, filter, item) => {
					const currentDate = new Date();
					const tomorrowDate = webix.Date.add(currentDate, 1, "day", true);

					const dateToStr = webix.i18n.dateFormatStr(item.DueDate);

					const weekStart = webix.Date.weekStart(currentDate);
					const weekEnd = webix.Date.add(weekStart, 8, "day", true);

					const monthStart = webix.Date.monthStart(currentDate);
					const monthEnd = webix.Date.add(monthStart, 1, "month", true);

					switch (filter) {
						case "All":
							return true;
						case "Overdue":
							return state === "Open" && item.DueDate < currentDate;
						case "Completed":
							return state === "Close";
						case "Today":
							return dateToStr === webix.i18n.dateFormatStr(currentDate);
						case "Tomorrow":
							return dateToStr === webix.i18n.dateFormatStr(tomorrowDate);
						case "This week":
							return item.DueDate > weekStart && item.DueDate < weekEnd;
						case "This month":
							return item.DueDate > monthStart && item.DueDate < monthEnd;
						default:
							return true;
					}
				}
			},
			{
				getValue(node) {
					return node.getValue();
				},
				setValue(node, value) {
					node.setValue(value);
				}
			}
		);
	}

	deleteActivity(id) {
		webix.confirm("Are you sure?").then(() => {
			dataActivities.remove(id.row);
		});
	}

	editActivity(id) {
		const item = dataActivities.getItem(id.row);
		ItemDataActivity.setItem(item);
		ItemDataActivity.setId(id.row);
		this.window.showWindow();
	}
}
