import {JetView, plugins} from "webix-jet";

export default class TopView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const header = {
			type: "header",
			localId: "nameOfPage",
			template: "#nameOfActiveWindow#",
			css: "webix_header app_header"
		};

		const menu = {
			view: "menu",
			id: "top:menu",
			css: "app_menu",
			width: 180,
			layout: "y",
			select: true,
			template: "<span class='webix_icon mdi mdi-#icon#'></span> #value#",
			data: [
				{value: _("Contacts"), id: "contacts", icon: "account-group"},
				{value: _("Activities"), id: "activities", icon: "calendar"},
				{value: _("Settings"), id: "settings", icon: "cogs"}
			]
		};

		const ui = {
			type: "clean",
			paddingX: 5,
			css: "app_layout",
			rows: [
				header,
				{
					cols: [
						{
							paddingY: 2,
							rows: [menu]
						},
						{
							paddingY: 2,
							paddingX: 2,
							rows: [
								{$subview: true}
							]
						}
					]
				}
			]
		};

		return ui;
	}

	init() {
		this.use(plugins.Menu, "top:menu");
		this.nameOfPageComponent = this.$$("nameOfPage");
		this.menuComponent = this.$$("top:menu");
		this.menuComponent.attachEvent("onAfterSelect", (id) => {
			if (id) {
				let nameOfActiveWindow = this.menuComponent.getItem(id).value;
				this.nameOfPageComponent.setValues({nameOfActiveWindow});
			}
		});
	}
}
