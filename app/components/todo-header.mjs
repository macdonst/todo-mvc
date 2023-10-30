/* globals customElements */
import CustomElement from '@enhance-labs/custom-element'

export default class TodoHeader extends CustomElement {
  render({ html }) {
    return html`
  <header class="header">
    <h1>todos</h1>
    <form action="/todos" method="POST">
      <input autofocus="autofocus" autocomplete="off" placeholder="What needs to be done?" name="task" class="new-todo">
    </form>
  </header>
    `
  }
}

customElements.define('todo-header', TodoHeader)
