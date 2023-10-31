/* globals customElements */
import CustomElement from '@enhance-labs/custom-element'

export default class TodoItem extends CustomElement {
  render({ html, state }) {
    const { attrs } = state
    const { key, task } = attrs
    const checked = Object.keys(attrs).includes('completed')
      ? true
      : false

    return html`
        <li class="todo" id="${key}">
            <div class="view">
                <input name="completed" type="checkbox" class="toggle" ${checked ? 'checked' : ''}/>
                <label>${task}</label>
                <form action="/todos/${key}/delete" method="POST">
                    <button class="destroy"></button>
                </form>
            </div>
            <input name="task" type="text" class="edit" value="${task}"/>
        </li>
    `
  }
}

customElements.define('todo-item', TodoItem)
