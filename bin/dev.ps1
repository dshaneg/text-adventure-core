docker run `
  --rm `
  -it `
  -w=/src/text-adventure-core `
  --name adv-core-dev `
  --mount type=bind,source="F:\src",target=/src `
  --mount type=volume,source="yarn-adventure",target="/usr/local/share/.config/yarn" `
  dshaneg/nodejs:8-alpine `
  /bin/bash
