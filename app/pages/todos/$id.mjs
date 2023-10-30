// View documentation at: https://enhance.dev/docs/learn/starter-project/pages
/**
  * @type {import('@enhance/types').EnhanceElemFn}
  */
export default function Html ({ html, state }) {
  const { store } = state
  const todo = store.todo || {}
  const problems = store.problems || {}

  return html`<enhance-page-container>
  <enhance-form
  action="/todos/${todo.key}"
  method="POST">
  <div class="${problems.form ? 'block' : 'hidden'}">
    <p>Found some problems!</p>
    <ul>${problems.form}</ul>
  </div>
  <enhance-fieldset legend="Todo">
  <enhance-text-input label="Task" type="text" id="task" name="task" value="${todo?.task}" errors="${problems?.task?.errors}"></enhance-text-input>
  <enhance-checkbox label="Completed" type="checkbox" id="completed" name="completed" value="${todo?.completed}" errors="${problems?.completed?.errors}"></enhance-checkbox>
  <enhance-text-input label="Created" type="date" id="created" name="created" value="${todo?.created}" errors="${problems?.created?.errors}"></enhance-text-input>
  <input type="hidden" id="key" name="key" value="${todo?.key}" />
  <enhance-submit-button style="float: right"><span slot="label">Save</span></enhance-submit-button>
  </enhance-fieldset>
</enhance-form>
</enhance-page-container>`
}
