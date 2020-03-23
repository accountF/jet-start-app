import {JetView} from "webix-jet";
import {dataStatuses} from "../models/statuses";
import {dataActivityType} from "../models/activityType";
import Table from "./settings/tableConstructor";

export default class Settings extends JetView {
	config() {
		return {
			rows: [
				{
					view: "segmented",
					localId: "language",
					inputWidth: 250,
					align: "center",
					options: [
						{id: "en", value: "English"},
						{id: "ru", value: "Russian"}
					]
				},
				{
					rows: [
						{
							view: "segmented",
							localId: "segmentForTables",
							value: "ActivityType",
							options: [
								{value: "Activity Types", id: "ActivityType"},
								{value: "Statuses", id: "Statuses"}
							]
						},
						{
							cells: [
								{
									localId: "ActivityType",
									rows: [
										new Table(this.app, "", dataActivityType)
									]
								},
								{
									localId: "Statuses",
									rows: [
										new Table(this.app, "", dataStatuses)
									]
								}
							]
						}
					]
				}
			]
		};
	}

	init() {
		this.$$("segmentForTables").attachEvent("onChange", (newValue) => {
			this.$$(newValue).show();
		});
	}
}

