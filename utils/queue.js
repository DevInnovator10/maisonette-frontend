import isPromise from './isPromise';

class Queue {
  constructor() {
    this.queue = [];
    this.pending = false;
  }

  enqueue(promise) {
    return new Promise((resolve, reject) => {
      this.queue.push({ promise, resolve, reject });
      this.dequeue();
    });
  }

  dequeue() {
    if (this.pending) return false;

    const item = this.queue.shift();

    if (!item) return false;

    // pass data along if not a promise
    if (!isPromise(item.promise)) {
      this.pending = false;
      const value = item.promise();
      item.resolve(value);
    }

    try {
      this.pending = true;

      item.promise(this)
        .then((value) => {
          this.pending = false;
          item.resolve(value);
        })
        .catch((e) => {
          this.pending = false;
          item.reject(e);
        })
        .finally(() => {
          this.pending = false;
          this.dequeue();
        });
    } catch (e) {
      this.pending = false;
      item.reject(e);
    }

    return true;
  }
}

export default Queue;
