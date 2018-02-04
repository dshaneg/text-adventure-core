docker run `
  --rm `
  -it `
  -w=/app `
  --name adv-core-dev `
  --mount type=bind,source="$pwd",target=/app `
  node:8-alpine `
  /bin/sh
