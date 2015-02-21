import {deepEqual} from "assert"
import {Readable} from "stream"
import skeyma from "../"

const {parse, serialize} = skeyma("${forumId}/${postId}/${commentId}")
const obj = {text: "Hello.", forumId: "1", postId: "2", commentId: "3"}

deepEqual(obj, parse(serialize(obj)))

const readable = Readable({objectMode: true})

readable.push(obj)
readable.push(null)

readable
  .pipe(serialize())
  .pipe(parse())
  .on("data", data => deepEqual(obj, data))
