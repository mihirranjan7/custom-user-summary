import Component from "@glimmer/component";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import { inject as service } from "@ember/service";
import { ajax } from "discourse/lib/ajax";
import { userPath } from "discourse/lib/url";

export default class ProfileNote extends Component {
  @service currentUser;

  @tracked editing = false;
  @tracked editValue = "";

  get user() {
    // outletArgs.model is the user instance
    return this.args.outletArgs.model;
  }

  get canEdit() {
    // Only allow editing your own profile
    return this.currentUser && this.user && this.currentUser.id === this.user.id;
  }

  get fieldValue() {
    // user_fields is the camelCase mapping, custom fields are as user_field_5
    return this.user?.user_fields?.["5"];
  }

  @action
  startEdit() {
    this.editing = true;
    this.editValue = this.fieldValue || "";
  }

  @action
  updateEdit(event) {
    this.editValue = event.target.value;
  }

  @action
  async save(event) {
    event.preventDefault();
    // PATCH /u/{username}.json with updated custom field
    await ajax(userPath(`${this.user.username}.json`), {
      type: "PUT",
      data: {
        user_fields: { "5": this.editValue }
      }
    });
    // Reload model for updated field
    this.user.user_fields["5"] = this.editValue;
    this.editing = false;
  }

  @action
  cancelEdit() {
    this.editing = false;
    this.editValue = "";
  }
}
