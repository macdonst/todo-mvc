/* globals customElements */
import CustomElement from '@enhance/custom-element'

export default class TodoAppFooter extends CustomElement {
  render({ html }) {
    return html`
        <footer class="info">
            <p>Double-click to edit a todo</p>
            <p>Written by the <a href="https://enhance.dev">Enhance Team</a></p>
            <p>Part of <a href="https://todomvc.com">TodoMVC</a></p>
        </footer>
    `
  }
}

customElements.define('todo-app-footer', TodoAppFooter)
