/* globals customElements */
import CustomElement from '@enhance-labs/custom-element'

export default class TodoApp extends CustomElement {
  render({ html }) {
    return html`
      <section class="todoapp">
        <slot name="header"></slot>
        <slot name="list"></slot>
        <slot name="footer"></slot>
      </section>
    `
  }
}

customElements.define('todo-app', TodoApp)
