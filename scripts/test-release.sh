#!/usr/bin/env bash
set -e

# auto-detect current branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)

export CI=true
export CI_COMMIT_BRANCH="$BRANCH"

echo -e "Simulating Release CI Pipeline on branch: $BRANCH\n"

echo -e "\n* Execute Semantic Release in dry run mode\n"

cmd=(pnpm release --dry-run)

for arg in "$@"; do
  cmd+=("$arg")
done

echo -e "Run command: \"${cmd[*]}\"\n"

"${cmd[@]}"
