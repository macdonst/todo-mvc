/* globals customElements */
import CustomElement from '@enhance-labs/custom-element'
import MorphdomMixin from '@enhance/morphdom-mixin';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

export default class TodoItem extends MorphdomMixin(CustomElement) {
  constructor() {
    super()
    this.input = this.querySelector('input[type=text]')
    this.li = this.querySelector('li')
    this.checkbox = this.querySelector('input[type=checkbox]')
    this.saving = false
  }

  static get observedAttributes() {
    return [ 'task' ]
  }

  connectedCallback() {
    this.input.addEventListener('keyup',this.handleKeyUp)
    this.input.addEventListener('blur',this.handleBlur)
  }

  disconnectedCallback() {
    this.input.removeEventListener('keyup',this.handleKeyUp)
    this.input.removeEventListener('blur',this.handleBlur)
  }

  handleKeyUp = async (event) => {
    if (event.which === ESCAPE_KEY) {
      this.cancelEdit()
    } else if (event.which === ENTER_KEY) {
      this.saving = true
      await this.updateTask(event.target)
    }
  }

  handleBlur = () => {
    if (!this.saving) {
      this.cancelEdit()
    }
    this.saving = false
  }

  cancelEdit() {
    this.li.classList.remove('editing')
    this.input.value = this.getAttribute('task')
  }

  async updateTask(target) {
    this.li.classList.remove('editing')
    let key = this.getAttribute('key')
    let task = target.value
    let completed = this.checkbox.checked ? true : false

    this.setAttribute('task', task)

    let result = await fetch(`/todos/${key}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ key, task, completed })
    })
    let json = await result.json()
    this.saving = false
    return json
  }

  render({ html, state }) {
    const { attrs = {} } = state
    const { key = '', task = '' } = attrs
    const checked = Object.keys(attrs).includes('completed')
      ? true
      : false

    return html`
        <li class="todo ${checked ? 'completed' : ''}">
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
