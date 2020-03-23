class ItemData {
	constructor() {
		this.id = null;
		this.item = null;
	}

	getItem() {
		return this.item;
	}

	getId() {
		return this.id;
	}

	setItem(item) {
		this.item = item;
		return this.item;
	}

	setId(id) {
		this.id = id;
		return this.id;
	}
}

export const ItemDataActivity = new ItemData();
export const ItemDataContact = new ItemData();

