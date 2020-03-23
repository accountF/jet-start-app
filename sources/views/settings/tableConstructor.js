import {JetView} from "webix-jet";

export default class Table extends JetView {
	constructor(app, name, data) {
		super(app, name);
		this._tableData = data;
	}

	config() {
		return {
			rows: [
				{
					view: "datatable",
					localId: "table",
					editable: true,
					select: true,
					columns: [
						{id: "Value", header: "Value", fillspace: true, editor: "text"},
						{id: "Icon", header: "Icon", editor: "text", template: obj => `<span class='mdi mdi-${obj.Icon}'></span>`}
					]
				},
				{
					cols: [
						{view: "button", value: "Add", click: () => this.addItem()},
						{view: "button", value: "Delete", click: () => this.deletedItem()}
					]
				}
			]
		};
	}

	init() {
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
			this._tableData.remove(id);
		}
		else {
			webix.message("Element is not chosen");
		}
	}
}
