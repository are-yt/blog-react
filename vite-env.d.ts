declare module 'nprogress'

declare module 'styled-components'

declare module '*.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.svg' {
  const image: any
  export default image
}

declare module '*.json' {
  const obj: any
  export default obj
}


/// <reference types="vite/client" />
