export default class PromiseQueue {
  queue = Promise.resolve(true)

  add(operation) {
    return new Promise((resolve, reject) => {
      this.queue = this.queue
        .then(operation)
        .then(resolve)
        .catch(reject)
    })
  }
}