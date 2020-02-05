import axios from 'axios'

export function getData() {
  return axios.get('http://www.dell-lee.com/react/api/demo.json')
}
