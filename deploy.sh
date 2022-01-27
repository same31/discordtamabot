#!/bin/bash

STEP=$1

PROJECT=$(echo "${GITHUB_REPOSITORY}" | sed -E 's/^.+\///')
SERVICES=("${PROJECT}")
REPOSITORY="mitm-org/${PROJECT}"
TAG=${GITHUB_SHA::8}
IMAGE=${REPOSITORY}:${TAG}

echo "${STEP}"

case ${STEP} in
build)
  docker build -t "${IMAGE}" .
  ;;

run)
  docker rm -f "${PROJECT}"
  export DISCORD_BOT_TOKEN=${DISCORD_BOT_TOKEN}
  docker run -e DISCORD_BOT_TOKEN --name "${PROJECT}" "${IMAGE}" &
  ;;

clean)
  docker images "$REPOSITORY" | tail +2 | awk '{print $1":"$2}' | xargs -r docker rmi
  rm -rf ./* ./.* 2>/dev/null
  exit 0
  ;;

*)
  echo 'Invalid step. Argument 1 must be one of: build, run or clean.'
  ;;

esac
