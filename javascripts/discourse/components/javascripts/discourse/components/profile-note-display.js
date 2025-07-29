import Component from "@glimmer/component";

export default class ProfileNoteDisplay extends Component {
  get profileNote() {
    return this.args.user?.user_fields?.["5"];
  }
}
