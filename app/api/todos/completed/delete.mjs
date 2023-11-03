/* globals Promise */
import { deleteTodo, getTodos } from '../../../models/todos.mjs'

/**
 * @type {import('@enhance/types').EnhanceApiFn}
 */
export async function post (req) {

  const session = req.session
  // eslint-disable-next-line no-unused-vars
  let { problems: removedProblems, ...newSession } = session
  const todos = await getTodos()
  const completed = todos.filter(todo=>todo.completed)
  try {
    await Promise.all(completed.map(todo=>deleteTodo(todo.key)))
    return {
      session: newSession,
      location: '/todos'
    }
  }
  catch (err) {
    return {
      session: { ...newSession, error: err.message },
      json: { error: err.message },
      location: '/todos'
    }
  }
}
