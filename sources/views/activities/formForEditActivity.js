import formForAddActivity from "./formForAddActivity";

export default class formForEditActivity extends formForAddActivity {
	init(view) {
		view.getHead().setHTML("Edit Activity");
		view.queryView({view: "button"}).config.value = "Save";
	}
}
