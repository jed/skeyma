skeyma
======

[![Build Status](https://travis-ci.org/jed/skeyma.svg?branch=master)](https://travis-ci.org/jed/skeyma)

skeyma is a JavaScript parser & serializer for `{key, value}` objects & streams. It's useful for storing and retreiving [levelup][] object streams.

Installation
------------

    npm install skeyma

Examples
--------

### Using skeyma for objects

```javascript
import skeyma from "skeyma"

const template = "${forumId}/${postId}/${commentId}"
const {parse, serialize} = skeyma(template)
const object = {text: "Hello.", forumId: "1", postId: "2", commentId: "3"}

console.log(object)
// { text: 'Hello.', forumId: '1', postId: '2', commentId: '3' }

console.log(serialize(object))
// { key: '1/2/3', value: { text: 'Hello.' } }

console.log(parse(serialize(object)))
// { text: 'Hello.', forumId: '1', postId: '2', commentId: '3' }
```

### Using skeyma for object streams

```javascript
import skeyma from "skeyma"
import {Readable} from "stream"
import {deepEqual} from "assert"

const template = "${forumId}/${postId}/${commentId}"
const {parse, serialize} = skeyma(template)
const object = {text: "Hello.", forumId: "1", postId: "2", commentId: "3"}
const objects = Readable({objectMode: true})

objects.push(object)
objects.push(null)

objects              .on("data", console.log)
  .pipe(serialize()) .on("data", console.log)
  .pipe(parse())     .on("data", console.log)

// { text: 'Hello.', forumId: '1', postId: '2', commentId: '3' }
// { key: '1/2/3', value: { text: 'Hello.' } }
// { text: 'Hello.', forumId: '1', postId: '2', commentId: '3' }
```

API
---

### let {parse, serialize} = skeyma(template)

Returns a parser/serializer instance based on the `template` string, in which object keys are delimited by `${...}`, similar to [ES6 template strings][].

### let kv = serialize([obj])

Returns a new `{key, value}` object from the original object. The `key` is rendered from the schema template, and the value is a copy of the original object, with the key fields removed. If no object is provided, a serialize [transform][] is returned.

### let obj = parse([kv])

Returns a new object from the original `{key, value}`. The object is a copy of the original `value`, with additional fields extracted from the `key` according to the template. If no object is provided, a parse [transform][] is returned.

[ES6 template strings]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/template_strings
[transform]: https://iojs.org/api/stream.html#stream_class_stream_transform_1
[levelup]: https://github.com/rvagg/node-levelup
