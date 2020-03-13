import {JetView, plugins} from "webix-jet";

export default class TopView extends JetView {
	config() {
		const header = {
			type: "header",
			localId: "nameOfPage",
			template: "#name#",
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
				{value: "Contacts", id: "contacts", icon: "account-group"},
				{value: "Activities", id: "activities", icon: "calendar"},
				{value: "Settings", id: "settings", icon: "cogs"}
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
	}

	urlChange(view, url) {
		this.nameOfPageComponent = this.$$("nameOfPage");
		const nameOfPageFromUrl = url[1].page;
		const nameOfPageForHeader = `${nameOfPageFromUrl[0].toUpperCase()}${nameOfPageFromUrl.slice(1)}`;
		const names = {
			name: nameOfPageForHeader
		};
		this.nameOfPageComponent.parse(names);
	}
}
