interface env {
  baseURL: string
}

interface mode {
  development: env
  beta: env
  release: env
}

const config: mode = {
  development: {
    baseURL: '/api'
  },
  beta: {
    baseURL: 'http://backend-api-02.newbee.ltd/manage-api/v1'
  },
  release: {
    baseURL: 'http://backend-api-02.newbee.ltd/manage-api/v1'
  }
}

export default config
