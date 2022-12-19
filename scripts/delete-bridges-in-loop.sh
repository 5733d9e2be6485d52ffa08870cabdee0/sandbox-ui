#!/bin/bash
for r in 1 2 3 4
do
    echo "Run script #$r:"
    ./scripts/delete-bridges.sh
    if [ $? -eq 0 ]; then
        echo "Clean rutine exits after $r performation(s)"
        exit 0
    else
        sleep 90
    fi
done