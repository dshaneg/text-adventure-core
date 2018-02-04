docker run `
  --rm `
  -it `
  -w=/src/text-adventure-core `
  --name adv-core-dev `
  --mount type=bind,source="F:\src",target=/src `
  --mount type=volume,source="node_modules",target="/usr/local/lib/node_modules" `
  dshaneg/nodejs:8-alpine `
  /bin/bash
