'use client'

import { useState } from 'react'
import { Checkbox, IconButton, Spinner } from '@material-tailwind/react'
import { useMutation } from '@tanstack/react-query'
import { deleteTodo, updateTodo } from 'actions/todo-action'
import { queryClient } from 'config/ReactQueryClientProvider'
import dayjs from 'node_modules/dayjs'

export default function Todo({ todo }) {
  const [completed, setCompleted] = useState(todo.completed)
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(todo.title)

  const updateTodoMutation = useMutation({
    mutationFn: () => updateTodo({ id: todo.id, title, completed }),
    onSuccess: () => {
      setIsEditing(false)
      queryClient.invalidateQueries({
        queryKey: ['todos'],
      })
    },
    onError: () => {},
  })

  const deleteTodoMutation = useMutation({
    mutationFn: () => deleteTodo(todo.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['todos'],
      })
    },
  })

  return (
    <div className='w-full flex items-center gap-1'>
      <Checkbox
        checked={completed}
        onChange={async (e) => {
          await setCompleted(e.target.checked)
          await updateTodoMutation.mutate()
        }}
      />
      {isEditing ? (
        <input
          className='flex-1 border-b-black border-b pb-1'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      ) : (
        <p className={`flex-1 ${completed && 'line-through'}`}>{title}</p>
      )}
      <div className='flex flex-col items-start justify-center mx-3'>
        <span className='text-xs text-gray-500'>
          생성일 : {dayjs(todo.created_at).format('YYYY.MM.DD HH:mm:ss')}
        </span>
        {completed && todo.completed_at && (
          <span className='text-xs text-gray-500'>
            완료일 : {dayjs(todo.created_at).format('YYYY.MM.DD HH:mm:ss')}
          </span>
        )}
      </div>
      {isEditing ? (
        <IconButton
          onClick={async () => {
            await updateTodoMutation.mutate()
          }}>
          {updateTodoMutation.isPending ? (
            <Spinner />
          ) : (
            <i className='fas fa-check' />
          )}
        </IconButton>
      ) : (
        <IconButton onClick={() => setIsEditing(true)}>
          <i className='fas fa-pen' />
        </IconButton>
      )}
      <IconButton onClick={() => deleteTodoMutation.mutate()}>
        {deleteTodoMutation.isPending ? (
          <Spinner />
        ) : (
          <i className='fas fa-trash' />
        )}
      </IconButton>
    </div>
  )
}
