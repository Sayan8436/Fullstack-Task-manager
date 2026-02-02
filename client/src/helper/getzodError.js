export const getZodError = (errors) => {
  const newError = {}

  if (!Array.isArray(errors)) {
    return newError
  }

  errors.forEach(err => {
    if (err?.path?.length > 0) {
      newError[err.path[0]] = err.message
    }
  })

  return newError
}

