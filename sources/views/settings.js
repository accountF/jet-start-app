import {JetView} from "webix-jet";
import {dataStatuses} from "../models/statuses";
import {dataActivityType} from "../models/activityType";
import Table from "./settings/tableConstructor";

export default class Settings extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		return {
			rows: [
				{
					view: "segmented",
					localId: "language",
					inputWidth: 250,
					align: "center",
					value: this.app.getService("locale").getLang(),
					options: [
						{id: "en", value: _("English")},
						{id: "ru", value: _("Russian")}
					],
					click: () => {
						this.toggleLanguage();
					}
				},
				{
					rows: [
						{
							view: "segmented",
							localId: "segmentForTables",
							value: "Activities",
							options: [
								{value: _("Activities"), id: "Activities"},
								{value: _("Statuses"), id: "Statuses"}
							]
						},
						{
							cells: [
								{
									localId: "Activities",
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

	toggleLanguage() {
		const langs = this.app.getService("locale");
		const value = this.$$("language").getValue();
		langs.setLang(value);
	}
}

