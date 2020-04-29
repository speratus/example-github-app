function returnOrCreateObject(baseObject, key) {
  if (baseObject)
    return baseObject[key]
  else
    return baseObject[key] = {}
}


function processPush(data, context) {
  let time = Date.now()
}

exports.process = processPush