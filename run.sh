#!/bin/bash

# Bash script should run `npm run build` then `node disr/index.js` in every day-XX folder
# It should track the computation time, print the result and the computation time
# Also it can take a parameter to run only one day

# Run `npm run build` and `node dist/index.js` in every day-XX folder
# Track the computation time, print the result and the computation time
# Can take a parameter to run only one day


runday () {
  echo "Running $d..."
  start=$(perl -MTime::HiRes=time -e 'printf "%.3f\n", time')
  npm run build > /dev/null
  node dist/index.cjs
  end=$(perl -MTime::HiRes=time -e 'printf "%.3f\n", time')
  runtime=$(node -e "console.log((${end} - ${start}).toFixed(3))")
  echo "Done! Computation time: $runtime seconds"
}

echo -e ""

# If parameter is not a number, run all days
if [ -n "$1" ] && [[ "$1" =~ ^[0-9]+$ ]]; then
  dir=day-$1
  if [ -d "$dir" ]; then
    # Run only one day
    cd $dir
    runday $dir
    cd ..
  fi
else
  # Run all days
  for dir in day-*; do
    cd $dir
    runday $dir
    echo -e ""
    cd ..
  done
fi