import { apiInitializer } from "discourse/lib/api";
import { ajax } from "discourse/lib/ajax";
import { tracked } from "@glimmer/tracking";

export default apiInitializer("0.11.1", api => {
  api.modifyClass("component:connector-above-user-summary-stats-profile-note", {
    editMode: false,
    @tracked newValue: "",
    @tracked currentValue: null,

    didReceiveAttrs() {
      // Get the value for your custom field
      this.currentValue =
        this.model.custom_fields && this.model.custom_fields.user_field_5; // Use your field id!
      if (!this.editMode) {
        this.newValue = this.currentValue || "";
      }
    },

    edit() {
      this.editMode = true;
      this.newValue = this.currentValue || "";
    },

    handleInput(e) {
      this.newValue = e.target.value;
    },

    save() {
      ajax(`/u/${this.model.username_lower}/preferences`, {
        type: "PUT",
        data: { user_fields: { "5": this.newValue } }, // Update "5" if your field id differs
      }).then(() => {
        this.currentValue = this.newValue;
        this.model.set("custom_fields.user_field_5", this.newValue);
        this.editMode = false;
      });
    },

    cancel() {
      this.editMode = false;
      this.newValue = this.currentValue || "";
    }
  });
});
