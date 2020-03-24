import {JetView} from "webix-jet";
import {dataActivities} from "../models/activities";
import {dataContacts} from "../models/contacts";
import {dataActivityType} from "../models/activityType";
import formActivity from "./activities/formActivity";
import {ItemDataActivity} from "../data/itemData";

export default class Activities extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const button = {
			view: "button",
			width: 150,
			value: `<span class='webix_icon mdi mdi-plus-box'></span> ${_("Add Activity")}`,
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
				{
					id: "ContactID",
					header: [_("Contact"), {content: "selectFilter"}],
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
				{value: _("All")},
				{value: _("Overdue")},
				{value: _("Completed")},
				{value: _("Today")},
				{value: _("Tomorrow")},
				{value: _("This week")},
				{value: _("This month")}
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
		this._ = this.app.getService("locale")._;
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
				compare: (state, filter, item) => this.filterActivity(state, filter, item)
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
		webix.confirm(this._("Are you sure?")).then(() => {
			dataActivities.remove(id.row);
		});
	}

	editActivity(id) {
		const item = dataActivities.getItem(id.row);
		ItemDataActivity.setItem(item);
		ItemDataActivity.setId(id.row);
		this.window.showWindow();
	}

	filterActivity(state, filter, item) {
		const currentDate = new Date();
		const tomorrowDate = webix.Date.add(currentDate, 1, "day", true);

		const dateToStr = webix.i18n.dateFormatStr(item.DueDate);

		const weekStart = webix.Date.weekStart(currentDate);
		const weekEnd = webix.Date.add(weekStart, 8, "day", true);

		const monthStart = webix.Date.monthStart(currentDate);
		const monthEnd = webix.Date.add(monthStart, 1, "month", true);

		switch (filter) {
			case this._("All"):
				return true;
			case this._("Overdue"):
				return state === "Open" && item.DueDate < currentDate;
			case this._("Completed"):
				return state === "Close";
			case this._("Today"):
				return dateToStr === webix.i18n.dateFormatStr(currentDate);
			case this._("Tomorrow"):
				return dateToStr === webix.i18n.dateFormatStr(tomorrowDate);
			case this._("This week"):
				return item.DueDate > weekStart && item.DueDate < weekEnd;
			case this._("This month"):
				return item.DueDate > monthStart && item.DueDate < monthEnd;
			default:
				return true;
		}
	}
}
