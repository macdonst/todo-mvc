/* globals customElements */
import CustomElement from '@enhance-labs/custom-element'

export default class TodoList extends CustomElement {
  render({ html, state }) {
    const { store } = state
    const { todos } = store

    const display = todos.length ? 'block' : 'none'

    const listItems = todos.map(todo => `<li class="todo" key="${todo.key}"><div class="view"><input type="checkbox" class="toggle" ${todo.completed ? 'checked' : ''}> <label>${todo.task}</label> <button class="destroy"></button></div> <input type="text" class="edit"></li>`).join('')

    return html`
  <section class="main" style="display: ${display};">
    <input id="toggle-all" type="checkbox" class="toggle-all">
    <label for="toggle-all">Mark all as complete</label>
    <ul class="todo-list">
      ${listItems}
    </ul>
  </section>

    `
  }
}

customElements.define('todo-list', TodoList)
