interface User {
  id: number
  email: string
  name: string
  isAdmin: boolean
  createdAt: string
}

interface CreateUserPayload {
  email: string
  password: string
  name: string
  isAdmin?: boolean
}

interface UpdateUserPayload {
  email?: string
  isAdmin?: boolean
  name?: string
}

export const useUsers = () => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string>('')

  const fetchUsers = async () => {
    try {
      loading.value = true
      error.value = ''
      const data = await $fetch<User[]>('/api/users')
      users.value = data
    } catch (err: any) {
      error.value = err?.data?.message || 'Erreur lors du chargement des utilisateurs'
      console.error('Erreur fetch users:', err)
    } finally {
      loading.value = false
    }
  }

  const createUser = async (payload: CreateUserPayload) => {
    try {
      loading.value = true
      error.value = ''
      const newUser = await $fetch<User>('/api/users', {
        method: 'POST',
        body: payload
      })
      users.value.push(newUser)
      return newUser
    } catch (err: any) {
      error.value = err?.data?.message || 'Erreur lors de la création de l\'utilisateur'
      console.error('Erreur create user:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (id: number, payload: UpdateUserPayload) => {
    try {
      loading.value = true
      error.value = ''
      const updatedUser = await $fetch<User>(`/api/users/${id}`, {
        method: 'PUT',
        body: payload
      })
      const index = users.value.findIndex(u => u.id === id)
      if (index !== -1) {
        users.value[index] = updatedUser
      }
      return updatedUser
    } catch (err: any) {
      error.value = err?.data?.message || 'Erreur lors de la mise à jour de l\'utilisateur'
      console.error('Erreur update user:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (id: number) => {
    try {
      loading.value = true
      error.value = ''
      await $fetch(`/api/users/${id}`, {
        method: 'DELETE'
      })
      users.value = users.value.filter(u => u.id !== id)
      return true
    } catch (err: any) {
      error.value = err?.data?.message || 'Erreur lors de la suppression de l\'utilisateur'
      console.error('Erreur delete user:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    users: readonly(users),
    loading: readonly(loading),
    error: readonly(error),
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  }
}
