#!/bin/bash

trap killgroup SIGINT ERR EXIT

killgroup () {
  echo
  echo killing...
  kill 0
}

./node_modules/.bin/superstatic public &
node compiler --dev &
./node_modules/.bin/webpack --env.BROWSERS=module --mode=development --watch
