#!/bin/bash

if [ -f ios/Podfile ]; then
  echo "Updating Podfile..."
  sed -i '' 's/pod '"'"'GoogleUtilities'"'"'/pod '"'"'GoogleUtilities'"'"', :modular_headers => true/g' ios/Podfile
  echo "Podfile updated."
else
  echo "Podfile not found."
fi