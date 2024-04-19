#!/bin/bash
ls *.mp4 \
  | sed -e 's/\.mp4//' \
  | xargs -I % ffmpeg -i %.mp4 -vf "select=eq(n\,0)" -vframes 1 %/1920.png