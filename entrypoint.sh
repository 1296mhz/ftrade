#!/bin/bash
export NODE_OPTIONS=--max_old_space_size=1024
if [ ! -f "build.txt" ]; then
    echo "Файл не существует"
else
    echo "Build: "
    cat build.txt
fi