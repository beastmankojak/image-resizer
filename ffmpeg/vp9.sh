#!/bin/bash
ls *.mp4 \
  | sed -e 's/\.mp4//' \
  | xargs -d $'\n' sh -c \
    'for arg do \
     ffmpeg -y -i "$arg".mp4 -c:v libvpx-vp9 -b:v 96k -pass 1 -vf scale=320:-1 -map 0:v -f null /dev/null && \
     ffmpeg -y -i "$arg".mp4 -c:v libvpx-vp9 -b:v 96k -pass 2 -vf scale=320:-1 -map 0:v "$arg"/320.vp9.webm; done' _