import { ZodError } from 'zod'

export function useFormValidation() {
  const errors = ref<Record<string, string>>({})
  
  const validateWithSchema = <T>(data: T, schema: any): boolean => {
    try {
      schema.parse(data)
      errors.value = {}
      return true
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Record<string, string> = {}
        error.issues.forEach(issue => {
          const path = issue.path.join('.')
          newErrors[path] = issue.message
        })
        errors.value = newErrors
      }
      return false
    }
  }

  const clearErrors = () => {
    errors.value = {}
  }

  const getFieldError = (field: string): string => {
    return errors.value[field] || ''
  }

  const hasFieldError = (field: string): boolean => {
    return !!errors.value[field]
  }

  const hasAnyError = computed(() => {
    return Object.keys(errors.value).length > 0
  })

  return {
    errors: readonly(errors),
    validateWithSchema,
    clearErrors,
    getFieldError,
    hasFieldError,
    hasAnyError
  }
}
