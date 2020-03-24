import {JetView} from "webix-jet";
import {icons} from "../../models/icons";

export default class Table extends JetView {
	constructor(app, name, data) {
		super(app, name);
		this._tableData = data;
	}

	config() {
		const _ = this.app.getService("locale")._;
		const popup = {
			view: "suggest",
			body: {
				template: "<span class='mdi mdi-#value#'></span> #value#"
			}
		};

		return {
			rows: [
				{
					view: "datatable",
					localId: "table",
					editable: true,
					select: true,
					columns: [
						{id: "Value", header: _("Value"), fillspace: true, editor: "text"},
						{
							id: "Icon",
							header: _("Icon"),
							template: obj => `<span class="mdi mdi-${obj.Icon}"></span> ${obj.Icon}`,
							editor: "richselect",
							collection: icons,
							popup
						}
					]
				},
				{
					cols: [
						{view: "button", value: _("Add"), click: () => this.addItem()},
						{view: "button", value: _("Delete"), click: () => this.deletedItem()}
					]
				}
			]
		};
	}

	init() {
		this._ = this.app.getService("locale")._;
		this.tableComponent = this.$$("table");
		this._tableData.waitData.then(() => {
			this.tableComponent.parse(this._tableData);
		});
	}

	addItem() {
		this._tableData.waitSave(() => {
			this._tableData.add({Value: "new"}, 0);
		}).then((res) => {
			this.tableComponent.select(res.id);
		});
	}

	deletedItem() {
		const id = this.tableComponent.getSelectedId();
		if (id) {
			webix.confirm(this._("Are you sure?")).then(() => {
				this._tableData.remove(id);
			});
		} else {
			webix.message(this._("Element is not chosen"));
		}
	}
}
